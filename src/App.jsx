import { useState } from 'react'
import './App.css'
import FileUploader from './components/FileUploader'
import FileProcessor from './components/FileProcessor';

function App() {
  const [fileProps,setFileProps] = useState({name:null,content:[]});
  const [fileUploaded,setFileUploaded] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({code:0,message:"Nothing happening here."}); //codes: 0 is neutral, -1 is bad and 1 is good.
  const [processing, setProcessing] = useState(false);

  return (
    <>
      <h1 className="text-[50px] p-[20px]">MTG Printables Generator</h1>
      <FileUploader fileProps={fileProps} setFileProps={setFileProps} fileUploaded={fileUploaded} 
                    setFileUploaded={setFileUploaded} processing={processing} setProcessing={setProcessing}
                    processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
      <FileProcessor fileProps={fileProps} fileUploaded={fileUploaded} processing={processing} 
                    setProcessing={setProcessing} processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
      <h2 className="mt-[30px] mb-[10px] text-[30px]">How to use:</h2>
      <ul className="text-[20px] w-1/2">
        <li>1. Have a deck you would like to print built on Archidekt.</li>
        <li>2. Click "Extras" and then "Export Deck"</li>
        <li>3. Set "Export Type" to "Text".</li>
        <li>4. In "Export Options" make sure only "Include set code" and "Include collector number" are checked. All other boxes should be unchecked.</li>
        <li>5. All of the other options are up to you, click "Download" and drag that text file into the drop area. Note that these other options might include unwanted / out of deck cards (e.g. maybeboard)</li>
      </ul>
    </>
  )
}

export default App
