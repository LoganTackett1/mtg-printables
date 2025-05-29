import { split } from "postcss/lib/list";
import { GET_cardJSON } from "./scryfall";
import jsPDF from "jspdf";

function extractName (line) {
    const splitLine = line.split(" ");
    let result = "";
    for (let i = 1; i < splitLine.length - 2; i++) {
        result += splitLine[i] + " ";
    }
    return result;
}

//arr1 is old, arr2 is new
export function filterArrs (arr1, arr2) {
    const result = [];
    
    const cardNames = {};
    const oldCardCounts = {};
    const newCardCounts = {};

    for (let el of arr1) {
        let count, code, number;
        [count,code,number] = parseCardInfo(el);
        let name = extractName(el);
        const key = `${code},${number}`;
        cardNames[key] = name;
        oldCardCounts[key] = Number(count);
    }

    for (let el of arr2) {
        let count, code, number;
        [count,code,number] = parseCardInfo(el);
        let name = extractName(el);
        const key = `${code},${number}`;
        cardNames[key] = name;
        newCardCounts[key] = Number(count);
    }

    for (let el of Object.keys(cardNames)) {
        let code, number;
        [code,number] = el.split(",");

        if (el in newCardCounts && !(el in oldCardCounts)) {
            result.push(`${newCardCounts[el]} ${cardNames[el]}(${code}) ${number}`);
        } else if (el in newCardCounts && el in oldCardCounts) {
            const countInOld = oldCardCounts[el];
            const countInNew = newCardCounts[el];

            if (countInNew > countInOld) {
                result.push(`${countInNew-countInOld} ${cardNames[el]}(${code}) ${number}`);
            }
        }
    }

    return result;
}

function parseCardInfo (line) {
    const currLine = line.split(" ");
    const count = Number(currLine[0]);
    const code = currLine[currLine.length-2].slice(1,-1);
    const number = currLine[currLine.length-1];

    return [count,code,number];
}

//fileLinesArr is the archidect text file
export function validateArchidekt (fileLinesArr) {
    for (let line of fileLinesArr) {
        const currLine = line.split(" ");
        const code = currLine[currLine.length-2];
        const number = currLine[currLine.length-1]
        const count = currLine[0];

        if (!/^\([^\s()]+\)$/.test(code)) {
            console.log("failed on code");
            return false;
        }
        if (!/^[^\s()]+$/.test(number)) {
            console.log("failed on number");
            return false;
        }
        if (!/^[1-9][0-9]*$/.test(count)) {
            console.log("failed on count");
            return false;
        }
    }
    return true;
}

export async function GET_deckDict (fileLinesArr,setStatus) {
    const deckDict = {};
    let lineCount = 1;
    for (let line of fileLinesArr) {
        setStatus({code:0,message:`Generating deck dictionary: line ${lineCount}`});
        let code, number, count;
        [count, code, number] = parseCardInfo(line);

        const cardJSON = await GET_cardJSON(code,number,setStatus);
        if (cardJSON == false) {
            setStatus({code:-1,message:`Could not pull json data for following card: ${line}`});
            return false;
        }
        deckDict[`${code},${number}`] = cardJSON;
        lineCount++;
    }
    return deckDict;
}

export function generateStack (fileLinesArr,deckDict) {
    const stack = [];
    for (let line of fileLinesArr) {
        let code, number, count;
        [count, code, number] = parseCardInfo(line);

        let cardJSON = deckDict[`${code},${number}`];
        if (cardJSON.twoSided) {
            stack.push({count:count,code:code,number:number,front:true});
            stack.push({count:count,code:code,number:number,front:false});
        } else {
            stack.push({count:count,code:code,number:number,front:true});
        }
    }
    return stack;
}


export async function createPages (deckStack,deckDict,setStatus,pageRows) {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11],
    });

    let pageCount = 0;
    let cardCount = 0;

    while (deckStack.length > 0) {
        const blankPage = document.createElement('canvas');
        const ctx = blankPage.getContext("2d");
        
        blankPage.width = 2550; // assumes 8.5"x11" printer paper at 300 DPI
        blankPage.height = 3300;
        
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, blankPage.width, blankPage.height);
        
        let i = 0;
        while (deckStack.length > 0 && i < 3*pageRows) {
            setStatus({code:0,message:`Drawing page ${pageCount + 1}, card ${cardCount + 1}`});
            const currCard = deckStack[deckStack.length-1];
            const currJSON = deckDict[`${currCard.code},${currCard.number}`];

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = (currCard.front ? currJSON.imageURIs[0] : currJSON.imageURIs[1]);
            await new Promise((resolve) => {
                img.onload = () => {
                    const row = Math.floor(i/3);
                    const col = i % 3;
                    ctx.drawImage(img, col * 750 + 150, row * 1050 + 75, 750, 1050); // this is for 8.5x11 with centering
                    resolve();
                };
                img.onerror = () => {
                    console.warn("Failed to load image: ", img.src);
                    resolve();
                }
            });
            currCard.count -= 1;
            if (currCard.count == 0) {
                deckStack.pop();
            }
            i++;
            cardCount++;
        }
        const imgData = blankPage.toDataURL("image/jpeg", 1.0);
        if (pageCount != 0) {
            pdf.addPage();
        }
        pdf.addImage(imgData, "JPEG", 0, 0, 8.5, 11);
        pageCount++;
    }
    pdf.save("deck-pages.pdf");
}

export async function textToImages (fileLinesArr,setStatus,pageRows) {
    setStatus({code:0,message:"Generating deck dictionary"});
    const deckDict = await GET_deckDict(fileLinesArr,setStatus);
    if (deckDict == false) {
        return false;
    }
    setStatus({code:0,message:"Generating deck stack"});
    const deckStack = generateStack(fileLinesArr,deckDict);
    await createPages(deckStack,deckDict,setStatus,pageRows);
    return true;
}