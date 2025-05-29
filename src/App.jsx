import { useState } from 'react';
import './App.css';
import FileUploaderCreate from './components/FileUploaderCreate';
import FileProcessor from './components/FileProcessor';

function App() {
  const [fileProps,setFileProps] = useState({name:null,content:[]});
  const [fileUploaded,setFileUploaded] = useState(false);
  const [fileTwoProps,setFileTwoProps] = useState({name:null,content:[]});
  const [fileTwoUploaded,setFileTwoUploaded] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({code:0,message:"Nothing happening here."}); //codes: 0 is neutral, -1 is bad and 1 is good.
  const [processing, setProcessing] = useState(false);
  const [task, setTask] = useState("create");
  const [removedCards, setRemovedCards] = useState(["None Yet."]);
  const [pageRows,setPageRows] = useState(3);

  function createBtnClick (e) {
    setTask("create");
  }

  function editBtnClick (e) {
    setTask("edit");
  }

  return (
    <>
      <h1 className="text-[50px] p-[20px] mb-[10px]">MTG Printables Generator</h1>
      <div>
        <button className={(task == "create" ? "bg-blue-700" : "bg-gray-700") + " p-[10px] rounded-l-md"} onClick={createBtnClick}>Create Deck</button>
        <button className={(task == "edit" ? "bg-blue-700" : "bg-gray-700") + " p-[10px] rounded-r-md"} onClick={editBtnClick}>Update Deck</button>
      </div>
      {task == "create" ?
      <>
      <FileUploaderCreate headerText="Upload text file:" fileProps={fileProps} setFileProps={setFileProps} fileUploaded={fileUploaded} 
                    setFileUploaded={setFileUploaded} processing={processing} setProcessing={setProcessing}
                    processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
      <FileProcessor fileProps={fileProps} fileUploaded={fileUploaded} processing={processing} 
                    setProcessing={setProcessing} processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} 
                    task={task} pageRows={pageRows} setPageRows={setPageRows}/>
      <h2 className="mt-[30px] mb-[10px] text-[30px]">How to use:</h2>
      <ul className="text-[20px] w-1/2 mb-[30px] [&>li]:m-[10px]">
        <li>1. Have a deck you would like to print built on Archidekt.</li>
        <li>2. Click "Extras" and then "Export Deck"</li>
        <li>3. Set "Export Type" to "Text".</li>
        <li>4. In "Export Options" make sure only "Include set code" and "Include collector number" are checked. All other boxes should be unchecked.</li>
        <li>5. All of the other options are up to you, click "Download" and drag that text file into the drop area. Note that these other options might include unwanted / out of deck cards (e.g. maybeboard)</li>
        <li>6. Once the PDF is downloaded, print it out. When printing, make sure you select the following print options: "Page Size: Letter" and "Scale: Custom: 100%". DO NOT USE DEFAULT PRINT SETTINGS</li>
        <li>7. If your printer does not support borderless printing and the margins are too large, you can change the rows per page from 3 to 2 to make them fit.</li>
      </ul>
      </>
      :
      <>
      <div className="flex flex-row gap-[20px]">
        <FileUploaderCreate headerText="Upload old deck file:" fileProps={fileProps} setFileProps={setFileProps} fileUploaded={fileUploaded} 
                    setFileUploaded={setFileUploaded} processing={processing} setProcessing={setProcessing}
                    processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
        <FileUploaderCreate headerText="Upload new deck file:" fileProps={fileTwoProps} setFileProps={setFileTwoProps} fileUploaded={fileTwoUploaded} 
                    setFileUploaded={setFileTwoUploaded} processing={processing} setProcessing={setProcessing}
                    processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} />
      </div>
      <FileProcessor fileProps={fileProps} fileTwoProps={fileTwoProps} fileUploaded={fileUploaded} fileTwoUploaded={fileTwoUploaded} processing={processing} 
                    setProcessing={setProcessing} processingStatus={processingStatus} setProcessingStatus={setProcessingStatus} task={task} setCardsRemoved={setRemovedCards}
                    pageRows={pageRows} setPageRows={setPageRows} />
      <h2>Cards removed from deck:</h2>
      <ul>
        {removedCards.map((card,index) => {
          return (<li key={index}>
            {card}
          </li>)
        })}
      </ul>
      <h2 className="mt-[30px] mb-[10px] text-[30px]">How to use:</h2>
      <ul className="text-[20px] w-1/2 mb-[30px] [&>li]:m-[10px]">
        <li>1. This tool is to print only the cards you need to update your deck after changes are made.</li>
        <li>2. Have two text files, one for your old / currently printed deck, and one for your new / unprinted deck.</li>
        <li>3. The above is most easily done using "Deck Snapshots", which can be created and loaded by going to "Extras" then "Deck History" then "+ Create Deck Snapshot".  You should create a snapshot before and after your changes. Clicking on "Deck Snapshots" instead of "+ Create Deck Snapshot" will allow you to view them and print their text files.</li>
        <li>4. Click "Create" at the top of this page and read the "How To" section if you don't know how to create deck text files.</li>
        <li>5. Drag the old deck file into the left upload area, and the new deck file into the right upload area.</li>
        <li>6. Once both text files are uploaded and are valid, click "Generate Printables".</li>
        <li>7. Once the PDF is downloaded, print it out. When printing, make sure you select the following print options: "Page Size: Letter" and "Scale: Custom: 100%". DO NOT USE DEFAULT PRINT SETTINGS</li>
        <li>8. If your printer does not support borderless printing and the margins are too large, you can change the rows per page from 3 to 2 to make them fit.</li>
      </ul>
      </>
      }
    </>
  )
}

export default App
