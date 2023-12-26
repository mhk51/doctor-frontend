import React, { useState, useEffect } from "react";
import '../Attachments/attachments.scss'
import DropDown from "../../../../components/widgets/DropDown/DropDown";
import CancelButton from "../../../../components/widgets/Buttons/Cancel/CancelButton";
import { File } from "@phosphor-icons/react";
import SaveButton from "../../../../components/widgets/Buttons/Save/SaveButton";
import axios from "axios";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../../../config/config";
const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    country_code: 'sa',
  },
]
const Attachments = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [isAddingAttach, setIsAddingAttach] = useState(false);
  const [attachmentType, setAttachmentType] = useState(null); // Set a default value if needed
  const [filename, setFilename] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setstatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);



const currentDate = new Date();
let api = `${API_BASE_URL}`;

 const handleAddAttachmentClick = () => {
    setIsAddingAttach(true);
  };

 const handleSaveClick = () => {
    console.log('Button clicked');
    let formData = new FormData();
    console.log("file", filename);
    formData.append("attachment_file", filename); // Append the file with its name.
    formData.append("name", filename.name);
    formData.append("patient", selectedPatientId);
    formData.append("date", currentDate.toISOString());
    formData.append("type", attachmentType);
    let axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    console.log(formData);
    axios.post(api + '/attachment/', formData, axiosConfig)
      .then(response => {
        console.log(response);
        setstatus('File Uploaded Successfully');
        setIsAddingAttach(false);
        setFilename(null);
        getFiles();
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleCancelClick = () => {
    setIsAddingAttach(false);
    setFilename(null);
   
  };

  const viewFile = (file) => {
    setSelectedFile(file); // Set the selected file to be viewed
  };

  const resetSelectedFile = () => {
    setSelectedFile(null); // Clear the selected file viewer
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
  
   
    const formattedDate = `${day}-${month}-${year}`;
  
    return formattedDate;
  };
  const getFiles = () => {
    console.log("pat:", selectedPatientId); 
    axios.get(api + `/attachment/?patient=${selectedPatientId}`).then(
      response => {
        console.log("API response:", response.data); 
        setFiles(response.data);
        console.log("files", files);
      }
    ).catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    getFiles();
  }, []);
    
    return (
      <div className="attachments-page">
        <div className="col1">
          {isAddingAttach ? (
            <div className="new-attachment-section">
              <form>
                  <div className="form-group">
                    <select  className="selectopt"onChange={(e) => setAttachmentType(e.target.value)}>
                      <option value="" disabled selected>{t("Select an option")}</option>
                      <option value="lab">Lab</option>
                      <option value="radiology">Radiology</option>
                      <option value="personal">{t("Personal")}</option>
                      <option value="insurance">Insurance</option>
                      <option value="others">{t("Other")}</option>
                    </select>
                    &nbsp;
                    <input
                      type="file"
                      onChange={(e) => setFilename(e.target.files[0])}
                      className="form-control"
                    />
                    &nbsp;&nbsp;
                   
                    <br />
                    <br />
                    <p>{t('Selected File:')} {filename ? filename.name : 'No file selected'}</p>
                  </div>
                  <br />
                  <br />
                  <table>
                    <tr>
                      <td>
                      <div  style={{
                
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                
              }}>
                        <button
                          type="button"
                          onClick={handleSaveClick}
                          className="custom-button"
                          
                        >
                        {t("Submit")}
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          className="custom-button"
                          
                        >
                        {t("Cancel")}
                        </button>
                        </div>
                      </td>
                    </tr>
                  </table>
                  {status ? <h2>{status}</h2> : null}
                </form>
              </div>
            
          ) : (
            <button className="btn-add" onClick={handleAddAttachmentClick}>
              + {t('Add Attachment')}
            </button>
           )}
           </div>
          
           <div className="col8">
            <div className="table-container">
           <table className="mui-like-table">
               
           <tbody>
                    <tr>
                      <th>{t('File Name')}</th>
                      <th>{t('File Type')}</th>
                      
                      <th> {t('Check File')}</th>
                      <th>{t('Date')}</th>
                    </tr>
                
                  {files
  .filter(file => file.patient == selectedPatientId)
  .map(file => (
                      <tr key={file.id}>
                        <td className="nowrap">
                        {file.name}
                        </td>
                        <td className="nowrap">{file.type}</td>
                        <td>
                          <button className="mui-like-button" onClick={() => viewFile(file)}>{file.name}</button>
                        </td>
                      <td  className="nowrap">{formatDate(file.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              <br/>
              {selectedFile && (
    <div className="selected-file-viewer">
      <h2>{t('Viewing File:')} {selectedFile.name}</h2>
      <a
        href={`${selectedFile.attachment_file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="viewingfile"
      >
       {t("View File")} 
      </a>&nbsp;
      <button className="mui-like-button" onClick={resetSelectedFile}>
        {t("Back to File List")}
      </button>
    </div>
  )}
    </div>  </div>    
    );
  }


export default Attachments;
