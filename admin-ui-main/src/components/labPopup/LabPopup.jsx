import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "./lab-popup.scss"
import AddButton from '../widgets/Buttons/Add/AddButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from '../../config/config';
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
const LabPopup = ({ selectedPatientId, isOpen, onClose, fetchData, preFilledData   }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const currentDate = new Date();
  const [filename, setFilename] = useState("");
  const initiallabDetails = {
    patient: '',
    date: currentDate.toISOString(),
    value: "",
    receive_type: "",
    medical_test_idmedical_test: "",
    lab_date: '',
 
  };
  
  console.log(currentDate.toISOString())
  console.log("patient", selectedPatientId);
  const [labDetails, setLabDetails] = useState(initiallabDetails);
  console.log("lab", labDetails);
  const [medicalTests, setMedicalTests] = useState([]);
  const [files, setFiles] = useState([]);
  let api = `${API_BASE_URL}`;
  
  const Close = () => {
    setLabDetails(initiallabDetails);
    onClose();
  }
  const [previousAttachment, setPreviousAttachment] = useState(null);

  useEffect(() => {
    if (preFilledData && preFilledData.id) {
      // If there is pre-filled data, set it in the state
      console.log("pre",preFilledData);
      setLabDetails(preFilledData);
       // Fetch previous attachment data based on attachment_file
    Axios.get(`${API_BASE_URL}/attachment/`)
    
    .then((response) => {
   console.log("res",response.data);
      const filteredAttachments = response.data.filter(attachment => attachment.attachment_file === preFilledData.image_url);
console.log("fil", filteredAttachments)
        if (filteredAttachments.length > 0) {
          setPreviousAttachment(filteredAttachments[0]);
          console.log("prev",previousAttachment);
        }
    })
    .catch((error) => {
      console.error("Error fetching previous attachment:", error);
    });
    } else {
      // Otherwise, reset the state to initial values
      setLabDetails(initiallabDetails);
    }
  }, [preFilledData]);
  const [isNewFileSelected, setIsNewFileSelected] = useState(false);
const saveFile = async () => {
  console.log('Button clicked');
  setIsNewFileSelected(true);
  let formData = new FormData();
  console.log("file", filename);
  formData.append("attachment_file", filename);
  formData.append("name", filename.name);
  formData.append("patient", selectedPatientId);
  formData.append("date", currentDate.toISOString());
  formData.append("type", "Lab");
  let axiosConfig = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  // Return the Axios POST request as a promise
  return Axios.post(api + '/attachment/', formData, axiosConfig)
    .then(response => {
      console.log("attach", response);
      setFiles(response.data);
      return response; // Return the response object
    })
    .catch(error => {
      console.error(error);
      throw error; // Throw the error to be caught by the caller
    });
};

const saveLab = () => {
  console.log("data", labDetails);
  if (!filename) {
    console.log('No file selected. Aborting the request.');
    // Create formattedRadDetails here without a file
    const formattedRadDetails = {
      ...labDetails,
      date: currentDate.toISOString(),
      lab_date: labDetails.lab_date === '' ? null : labDetails.lab_date,
      image_url: null, // Set image_url to null when no file is selected
      patient: selectedPatientId,
    };
    if (preFilledData.id) {
      // Perform a PUT request to update the existing data
      formattedRadDetails.image_url = labDetails.image_url;
      Axios.put(`${API_BASE_URL}/result/${preFilledData.id}/`, formattedRadDetails)
        .then((response) => {
          console.log("Lab data updated successfully:", response.data);
          onClose();
          fetchData();
          setLabDetails(initiallabDetails);
          setFilename(null);
          setFiles([]);
        })
        .catch((error) => {
          console.error("Error updating rad data:", error);
        });
    } else{
    // Perform the Axios POST request for radDetails without a file
    Axios.post(`${API_BASE_URL}/result/`, formattedRadDetails)
      .then(response => {
        console.log("Lab data saved successfully:", response.data);
        onClose();
        fetchData();
        setLabDetails(initiallabDetails);
        setFilename(null);
        setFiles([]);
      })
      .catch(error => {
        console.error("Error saving Lab data:", error);
      });}
  } else {
    // Use the saveFile function to upload the file
    saveFile()
      .then(fileResponse => {
        // Create formattedRadDetails with the image_url from the file response
        const formattedRadDetails = {
          ...labDetails,
          date: currentDate.toISOString(),
          lab_date: labDetails.lab_date === '' ? null : labDetails.lab_date,
          image_url: fileResponse.data.attachment_file, // Set image_url to the file response
          patient: selectedPatientId,
        };
        if (preFilledData.id) {
          
          Axios.put(`${API_BASE_URL}/result/${preFilledData.id}/`, formattedRadDetails)
            .then((response) => {
              console.log("Lab data updated successfully:", response.data);
              onClose();
              fetchData();
              setLabDetails(initiallabDetails);
              setFilename(null);
              setFiles([]);
            })
            .catch((error) => {
              console.error("Error updating rad data:", error);
            });
            if (isNewFileSelected && previousAttachment) {
              // Delete the previous attachment if a new file is selected
              Axios.delete(`${API_BASE_URL}/attachment/${previousAttachment.idattachment}/`)
                .then((deleteResponse) => {
                  console.log("Previous attachment deleted successfully:", deleteResponse.data);
                })
                .catch((deleteError) => {
                  console.error("Error deleting previous attachment:", deleteError);
                });
            }
        } else {
        // Perform the Axios POST request for radDetails with the file
        Axios.post(`${API_BASE_URL}/result/`, formattedRadDetails)
          .then(response => {
            console.log("Lab data saved successfully:", response.data);
            onClose();
            fetchData();
            setLabDetails(initiallabDetails);
            setFilename(null);
            setFiles([]);
          })
          .catch(error => {
            console.error("Error saving Lab data:", error);
          });}
      })
      .catch(error => {
        console.error("Error saving file:", error);
      });
  }
};




  useEffect(() => {
    Axios.get(`${API_BASE_URL}/medicaltest/`)
      .then((response) => {
        setMedicalTests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching medical tests:", error);
      });
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setLabDetails((prevState) => ({
      ...prevState,
      [name]: value,
      patient:selectedPatientId,
    }));
  };

  if (!isOpen) return null;
  return (
<div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
  <div className="lab">

    <div className="contentlab">
    
      
    <h2 >{preFilledData.id ?  'Edit Result': t("Add New Result") } </h2>
      <br/>
      <table className="field-table">
        <tbody>
          <tr>
            <td>
              <label className='lablab'>{t('Choose Test')}</label>
            </td>
            <td>
            <Autocomplete
  id="medical_test_idmedical_test"
  options={medicalTests}
  getOptionLabel={(test) => test.test_code}
  value={medicalTests.find((test) => test.idmedical_test === labDetails.medical_test_idmedical_test) || null}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "medical_test_idmedical_test", value: newValue ? newValue.idmedical_test : "" } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Select Test")} />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.test_code.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  size='small'
/>

            </td>
          </tr>
          <tr>
            <td>
              <label className='lablab'>{t('Value')}</label>
            </td>
            <td>
              <input
                type="text"
                name="value"
                value={labDetails.value}
                onChange={handleFieldChange}
                className='borderlab'
              />
            </td>
          </tr>
          <tr>
            <td>
              <label className='lablab'>{t('Receive Type')}:</label>
            </td>
            <td>
              <input
                type="text"
                name="receive_type"
                value={labDetails.receive_type}
                onChange={handleFieldChange}
                className='borderlab'
              />
            </td>
          </tr>
          <tr>
            <td>
              <label className='lablab'>{t("Lab Date")}:</label>
            </td>
            <td>
              <input
                type="date"
                name="lab_date"
                value={labDetails.lab_date}
                onChange={handleFieldChange}
                className='borderlab'
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>{t('Attachment:')}</label>
            </td>
            <td style={{paddingTop:"20px"}}>
              <input
                type="file"
                onChange={(e) => setFilename(e.target.files[0])}
                className="form-control"
              />&nbsp;
              <label htmlFor="exampleFormControlFile1" className="float-left">
                {t( " Browse A File To Upload")}
              </label>
              <br/>
              <p className='lablab'>
              {t('Selected File:')} {filename ? filename.name : preFilledData.image_url || 'No file selected'}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="bottom2">

          <button onClick={saveLab} className='closess'>{preFilledData.id ?'Edit':t('Add')}</button>&nbsp;
          <button className="closess" onClick={Close}>{t('close')}</button>
      
      </div>
    </div>
  </div>
</div>

  );
};

export default LabPopup;
