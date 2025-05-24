import { useState } from 'react'
import { validateArchidekt } from '../util/processing';

function FileUploader({fileProps, setFileProps, fileUploaded, setFileUploaded, processingStatus, setProcessingStatus, processing, setProcessing}) {
    function handleFileUpload (e) {
        const file = e.target.files[0];
        if (!file) {
            setFileProps({name:null,content:[]});
            setFileUploaded(false);
            setProcessingStatus({code:0,message:"Nothing happening here."});
            return;
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
                let valid = validateArchidekt(lines);
                if (valid) {
                    setFileUploaded(true);
                    setProcessingStatus({code:1,message:"File uploaded."});
                } else {
                    setFileUploaded(false);
                    setProcessingStatus({code:-1,message:"File does not match expected format for Archidekt text file!"})
                }
                setFileProps({name:file.name,content:lines})
            }
            reader.readAsText(file);       
        }
        e.target.value = "";
    }

    return (
        <>
            <h2 className="text-[30px] p-[10px]">Upload your text file:</h2>
            <label htmlFor="fileUpload" className="relative flex flex-col justify-center items-center w-[300px] h-[150px] bg-white text-black rounded-md">
                <p>Drag and Drop</p>
                <p>(Click to select file)</p>
                <input id="fileUpload" name="fileUpload" className="absolute opacity-0 w-full h-full" type="file" accept=".txt" onChange={handleFileUpload}/>
            </label>
            {fileUploaded 
            ? 
            <h3 className="p-[5px]">File uploaded: {fileProps.name}</h3>
            : 
            <h3 className="p-[5px]">No file detected</h3>
            }
        </>
    )
}


export default FileUploader;