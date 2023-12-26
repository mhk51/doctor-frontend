
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import "./Allergies.scss";
import { TextField } from '@mui/material';
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

const Allergies = ({ selectedPatientId, isOpen, onClose, fetchData, preFilledData }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  
  const initialProDetails ={
  patient: selectedPatientId,
   type: "",
   level: "",
   
   
  };
  const [allergieDetails, setallergieDetails] = useState([]);
  useEffect(() => {
    if (preFilledData && preFilledData.id) {
      // If there is pre-filled data, set it in the state
      setallergieDetails(preFilledData);
    } else {
      // Otherwise, reset the state to initial values
      setallergieDetails(initialProDetails);
    }
  }, [preFilledData]);
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setallergieDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const saveallergie = () => {
    console.log("data", allergieDetails);
    if (preFilledData && preFilledData.id) {
      // Perform a PUT request to update the existing data
      Axios.put(`${API_BASE_URL}/allergies/${preFilledData.id}/`, allergieDetails)
        .then((response) => {
          console.log("Allergy data updated successfully:", response.data);
          onClose();
          fetchData();
          setallergieDetails(initialProDetails);
        })
        .catch((error) => {
          console.error("Error updating invoice data:", error);
        });
    } else{
    Axios.post(`${API_BASE_URL}/allergies/`, allergieDetails)
      .then((response) => {
        console.log("allergie data saved successfully:", response.data);
        onClose();
        fetchData();
        setallergieDetails(initialProDetails);
        // Close the popup or perform other actions as needed
      })
      .catch((error) => {
        console.error("Error saving allergie data:", error);
      });}
  };
  const Close = () => {
    setallergieDetails(initialProDetails);
    onClose();
  }

  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="aller">
      <div className="contentall">
        <div className="top">
     
          <h2 >{preFilledData.id ? "Edit Allergy" : t("Add new Allergy")}</h2>
        </div>

        <div className="center">
  <div className="choose-speciality">
    <h2>{t('Type')}</h2>&nbsp;
    <TextField
            label={t("Allergy")}
            name="type"
            fullWidth
            variant="outlined"
            size="small"
            value={allergieDetails.type}
            onChange={handleFieldChange}
            className='text'
          />
  </div>
  <br/>
  <br/>
  <div className="choose-subspeciality">
    <h2>{t('Level')}</h2>
    &nbsp;
    <div className="field">
          
           
            <div>
              <input
                type="radio"
                id="Low"
                name="level"
                value="Low"
                checked={allergieDetails.level === "Low"}
               
            
                onChange={(e) =>
                  setallergieDetails({ ...allergieDetails, level: e.target.value })
                }
              />
              <label htmlFor="Low">{t('Low')}</label>
            </div>
            <div>
              <input
                type="radio"
                id="Moderate"
                name="level"
                value="Moderate"
                checked={allergieDetails.level === "Moderate"}
                onChange={(e) =>
                  setallergieDetails({ ...allergieDetails, level: e.target.value })
                }
              />
              <label htmlFor="Moderate">{t('Moderate')}</label>
            </div>
            <div>
              <input
                type="radio"
                id="High"
                name="level"
                value="High"
                checked={allergieDetails.level === "High"}
                onChange={(e) =>
                  setallergieDetails({ ...allergieDetails, level: e.target.value })
                }
              />
              <label htmlFor="High">{t('High')}</label>
            </div>
          </div>
  </div>
  <br/>
  <br/>
  

</div>

        
        
       

        <div className="bottom">
        <div className="row">

        


         <button className="closealle" onClick={saveallergie}>

         {preFilledData.id ? t('Edit'):t('Save')}

            </button>


            <button className="closealle" onClick={Close}>{t('close')}</button>

            </div>
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default Allergies;
