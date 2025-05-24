import { useState } from 'react'
import './App.css'
import FileUploader from './components/FileUploader'
import FileProcessor from './components/FileProcessor';

function App() {
  const [fileProps,setFileProps] = useState({name:null,content:[]});
  const [fileUploaded,setFileUploaded] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({code:0,message:"Nothings happening here."}); //codes: 0 is neutral, -1 is bad and 1 is good.
  const [processing, setProcessing] = useState(false);

  return (
    <>
      <h1 className="text-[50px] p-[20px]">MTG Printables Generator</h1>
      <FileUploader fileProps={fileProps} setFileProps={setFileProps} fileUploaded={fileUploaded} 
                    setFileUploaded={setFileUploaded} processing={processing} setProcessing={setProcessing}
                    processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
      <FileProcessor fileProps={fileProps} fileUploaded={fileUploaded} processing={processing} 
                    setProcessing={setProcessing} processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
    </>
  )
}

export default App
