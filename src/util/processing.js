import { GET_cardJSON } from "./scryfall";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

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
        const currLine = line.split(" ");
        const code = currLine[currLine.length-2].slice(1,-1);
        const number = currLine[currLine.length-1]

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
        const currLine = line.split(" ");
        const count = Number(currLine[0]);
        const code = currLine[currLine.length-2].slice(1,-1);
        const number = currLine[currLine.length-1];

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


export async function createPages (deckStack,deckDict,setStatus) {
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
        
       /*
        blankPage.width = 2250; // assumes 7.5"x10.5" printer paper at 300 DPI (testing)
        blankPage.height = 3150;
        */
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, blankPage.width, blankPage.height);
        
        let i = 0;
        while (deckStack.length > 0 && i < 9) {
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
                    //ctx.drawImage(img, col * 750, row * 1050, 750, 1050); // this is for 7.5x10.5 (fills space completely)
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

export async function textToImages (fileLinesArr,setStatus) {
    setStatus({code:0,message:"Generating deck dictionary"});
    const deckDict = await GET_deckDict(fileLinesArr,setStatus);
    if (deckDict == false) {
        return false;
    }
    setStatus({code:0,message:"Generating deck stack"});
    const deckStack = generateStack(fileLinesArr,deckDict);
    await createPages(deckStack,deckDict,setStatus);
    return true;
}