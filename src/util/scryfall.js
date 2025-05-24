export async function GET_cardJSON (code,number,setStatus) {
    let cardJSON = {code:code,number:number,twoSided:false,imageURIs:[]};
    const response = await fetch(`https://api.scryfall.com/cards/${code}/${number}`);
    if (!response.ok) {
        return false; // returns false on error
    }
    const json = await response.json();
    if ("image_uris" in json) {
        cardJSON.imageURIs.push(json["image_uris"]["normal"]);
    } else {
        cardJSON.twoSided = true;
        cardJSON.imageURIs.push(json["card_faces"][0]["image_uris"]["normal"]);
        cardJSON.imageURIs.push(json["card_faces"][1]["image_uris"]["normal"]);
    }
    return cardJSON;
}
