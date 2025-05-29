import { useState } from 'react'
import { GET_deckDict, generateStack, createPages, textToImages } from '../util/processing';
import { filterArrs } from '../util/processing';

function FileProcessor ({fileProps, fileTwoProps, fileUploaded, fileTwoUploaded, processingStatus, setProcessingStatus, processing, setProcessing, task, setCardsRemoved, pageRows, setPageRows}) {

    function handleClick () {
        if (task == "create") {
            if (!fileUploaded) {
                setProcessingStatus({code:-1,message:"Valid file required!"});
                return;
            } else if (processing) {
                return;
            } else {
                setProcessing(true);
                setProcessingStatus({code:0,message:"Reading File"});
                textToImages(fileProps.content,setProcessingStatus,pageRows)
                .then((response) => {
                    if (response) {
                        setProcessingStatus({code:1,message:"Generation Completed!"});
                    }
                    setProcessing(false);
                });
            }
        } else {
            if (!fileUploaded || !fileTwoUploaded) {
                setProcessingStatus({code:-1,message:"Valid files required!"});
                return;
            } else if (processing) {
                return;
            } else {
                setProcessing(true);
                setProcessingStatus({code:0,message:"Reading File"});
                const filter = filterArrs(fileProps.content,fileTwoProps.content);
                if (filter.length == 0) {
                    setProcessingStatus({code:-1,message:"No new cards detected"});
                    setProcessing(false);
                    return;
                }
                const cardsRemoved = filterArrs(fileTwoProps.content,fileProps.content);
                textToImages(filter,setProcessingStatus,pageRows)
                .then((response) => {
                    if (response) {
                        setCardsRemoved(cardsRemoved);
                        setProcessingStatus({code:1,message:"Generation Completed!"});
                    }
                    setProcessing(false);
                });
            }
        }
    }

    function plus () {
        if (pageRows < 3 && !processing) {
            const newPageRows = pageRows + 1;
            setPageRows(newPageRows);
        }
    }

    function minus () {
        if (pageRows > 1 && !processing) {
            const newPageRows = pageRows - 1;
            setPageRows(newPageRows);
        }
    }

    return (
        <>
            <div className="flex flex-row justify-spaced items-center">
                Rows per page: <button className="w-[20px] h-[20px] rounded-md bg-gray-700 flex flex-col justify-center items-center m-[5px]" onClick={minus}>-</button> {pageRows} <button className="w-[20px] h-[20px] rounded-md bg-gray-700 flex flex-col justify-center items-center m-[5px]" onClick={plus}>+</button>
            </div>
            <button className="p-[15px] m-[10px] text-[20px] bg-green-500 rounded-md" onClick={handleClick}>Generate Printables</button>
            <div>Status: <span className={processingStatus.code == -1 ? "text-red-500" : (processingStatus.code == 0 ? "text-white" : "text-green-500")}>{processingStatus.message}</span></div>
        </>
    )
}

export default FileProcessor;