import { useState } from 'react'
import { GET_deckDict, generateStack, createPages, textToImages } from '../util/processing';

function FileProcessor ({fileProps, fileUploaded, processingStatus, setProcessingStatus, processing, setProcessing}) {

    function handleClick () {
        if (!fileUploaded) {
            setProcessingStatus({code:-1,message:"Valid file required!"});
            return;
        } else if (processing) {
            return;
        } else {
            setProcessing(true);
            setProcessingStatus({code:0,message:"Reading File"});
            textToImages(fileProps.content,setProcessingStatus)
            .then((response) => {
                if (response) {
                    setProcessingStatus({code:1,message:"Generation Completed!"});
                }
                setProcessing(false);
            });
        }
    }

    return (
        <>
            <button className="p-[15px] m-[10px] text-[20px] bg-green-500 rounded-md" onClick={handleClick}>Generate Printables</button>
            <div>Status: <span className={processingStatus.code == -1 ? "text-red-500" : (processingStatus.code == 0 ? "text-white" : "text-green-500")}>{processingStatus.message}</span></div>
        </>
    )
}

export default FileProcessor;