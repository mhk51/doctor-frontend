import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "./radpopup.scss"
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
const RadPopup = ({ selectedPatientId, isOpen, onClose, fetchData, preFilledData  }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const currentDate = new Date();
  const [filename, setFilename] = useState("");
const initialRadDetails = {
  patient: '',
  date: currentDate.toISOString(),
  result_text: '',
  conclusion: '',
  radiology_test: '',
  rad_date: '',
};
console.log(currentDate.toISOString())
  console.log("patient", selectedPatientId);
  const [radDetails, setRadDetails] = useState([]);
  const [previousAttachment, setPreviousAttachment] = useState(null);

  useEffect(() => {
    if (preFilledData && preFilledData.id) {
      // If there is pre-filled data, set it in the state
      setRadDetails(preFilledData);
       // Fetch previous attachment data based on attachment_file
    Axios.get(`${API_BASE_URL}/attachment/`)
    
    .then((response) => {
      console.log("resatt", response.data);
      const filteredAttachments = response.data.filter(attachment => attachment.attachment_file === preFilledData.image_url);

        if (filteredAttachments.length > 0) {
          setPreviousAttachment(filteredAttachments[0]);
        }
    })
    .catch((error) => {
      console.error("Error fetching previous attachment:", error);
    });
    } else {
      // Otherwise, reset the state to initial values
      setRadDetails(initialRadDetails);
    }
  }, [preFilledData]);
console.log("raed", radDetails);
  const [radiologyTests, setRadiologyTests] = useState([]);

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/radiologytest/`)
      .then((response) => {
        setRadiologyTests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching radiology tests:", error);
      });
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
  console.log("e", e.target);
    setRadDetails((prevState) => ({
      ...prevState,
       [name]: value,
       patient:selectedPatientId,
    }));
  
  };
  const [files, setFiles] = useState([]);
  let api = `${API_BASE_URL}`;
  // ... (previous code)
  const [isNewFileSelected, setIsNewFileSelected] = useState(false);

const saveFile = async() => {
  console.log('Button clicked');
  setIsNewFileSelected(true);
  let formData = new FormData();
  console.log("file", filename);
  formData.append("attachment_file", filename);
  formData.append("name", filename.name);
  formData.append("patient", selectedPatientId);
  formData.append("date", currentDate.toISOString());
  formData.append("type", "radiology");
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

const saveRad = () => {
  console.log("data", radDetails);
  
  if (!filename) {
    console.log('No file selected. Aborting the request.');
    // Create formattedRadDetails here without a file
    const formattedRadDetails = {
      ...radDetails,
      date: currentDate.toISOString(),
      rad_date: radDetails.rad_date === '' ? null : radDetails.rad_date,
      image_url: null, // Set image_url to null when no file is selected
      patient: selectedPatientId,
    };
    if (preFilledData.id) {
      // Perform a PUT request to update the existing data
      formattedRadDetails.image_url = radDetails.image_url;
      Axios.put(`${API_BASE_URL}/radiologyresult/${preFilledData.id}/`, formattedRadDetails)
        .then((response) => {
          console.log("Rad data updated successfully:", response.data);
          onClose();
          fetchData();
          setRadDetails(initialRadDetails);
          setFilename(null);
          setFiles([]);
        })
        .catch((error) => {
          console.error("Error updating rad data:", error);
        });
    } else {
    // Perform the Axios POST request for radDetails without a file
    Axios.post(`${API_BASE_URL}/radiologyresult/`, formattedRadDetails)
      .then(response => {
        console.log("Rad data saved successfully:", response.data);
        onClose();
        fetchData();
        setRadDetails(initialRadDetails);
        setFilename(null);
        setFiles([]);
      })
      .catch(error => {
        console.error("Error saving rad data:", error);
      });}
  } else {
    // Use the saveFile function to upload the file
    saveFile()
      .then(fileResponse => {
        // Create formattedRadDetails with the image_url from the file response
        const formattedRadDetails = {
          ...radDetails,
          date: currentDate.toISOString(),
          rad_date: radDetails.rad_date === '' ? null : radDetails.rad_date,
          image_url: fileResponse.data.attachment_file, // Set image_url to the file response
          patient: selectedPatientId,
        };
        if (preFilledData.id) {
          // Perform a PUT request to update the existing data
          Axios.put(`${API_BASE_URL}/radiologyresult/${preFilledData.id}/`, formattedRadDetails)
            .then((response) => {
              console.log("Rad data updated successfully:", response.data);
              onClose();
              fetchData();
              setRadDetails(initialRadDetails);
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
        Axios.post(`${API_BASE_URL}/radiologyresult/`, formattedRadDetails)
          .then(response => {
            console.log("Rad data saved successfully:", response.data);
            onClose();
            fetchData();
            setRadDetails(initialRadDetails);
            setFilename(null);
            setFiles([]);
          })
          .catch(error => {
            console.error("Error saving rad data:", error);
          });
      }})
      .catch(error => {
        console.error("Error saving file:", error);
      });
  }
};
const Close = () => {
  setRadDetails(initialRadDetails);
  onClose();
}


  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    
    <div className="rad">

      <div className="contentrad">
     
        <h2 >{preFilledData.id ?  'Edit Result': t("Add New Result") } </h2>
        <table className="field-table">
          <tbody>
            <tr>
              <td>
                <label className="labrad">{t('Choose Test')}</label>
              </td>
              <td>
                <Autocomplete
                  id="radiology_test"
                  options={radiologyTests}
                  getOptionLabel={(test) => test.test_code}
                  value={radiologyTests.find((test) => test.idradiology_test === radDetails.radiology_test) || null}
                  onChange={(event, newValue) => {
                    handleFieldChange({ target: { name: "radiology_test", value: newValue ? newValue.idradiology_test : "" } });
                  }}
                  renderInput={(params) => <TextField {...params} label={t('Choose Test')} />}
                  filterOptions={(options, state) => {
                    return options.filter((option) =>
                      option.test_name.toLowerCase().includes(state.inputValue.toLowerCase())
                    );
                  }}
                  size='small'
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="labrad">{t("Result")}</label>
              </td>
              <td>
                <input
                  type="text"
                  name="result_text"
                  value={radDetails.result_text}
                  onChange={handleFieldChange}
                  className='borderrad'
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="labrad">{t("Conclusion")}</label>
              </td>
              <td>
                <input
                  type="text"
                  name="conclusion"
                  value={radDetails.conclusion}
                  onChange={handleFieldChange}
                  className='borderrad'
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="labrad">{t('Radiology Date:')}</label>
              </td>
              <td>
                <input
                  type="date"
                  name="rad_date"
                  value={radDetails.rad_date}
                  onChange={handleFieldChange}
                  className='borderrad'
                />
              </td>
            </tr>
            <tr>
              <td>
                <label className="labrad">{t('Attachment:')}</label>
              </td>
              <td style={{paddingTop:"20px"}}>
                <input
                  type="file"
                  onChange={(e) => setFilename(e.target.files[0])}
                  className="form-control"
                />&nbsp;
                <label htmlFor="exampleFormControlFile1" className="float-left">
                  {t('Browse A File To Upload')}
                </label>
                <br/><br/>
                <p className="labrad">
                  {t('Selected File:')} {filename ? filename.name : preFilledData.image_url || 'No file selected'}</p>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="bottom1">
          <button onClick={saveRad} className='closes'>{preFilledData.id ?'Edit':t('Add')}</button>&nbsp;
          <button className="closes" onClick={Close}> {t('close')}</button>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default RadPopup;
