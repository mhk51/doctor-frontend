import React, { useEffect, useState, useRef } from "react";
import './prescription.scss';
import { TextField, Button, TextareaAutosize } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import Axios from "axios";
import API_BASE_URL from "../../config/config";
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

const PrescriptionPopup = ({ selectedPatientId, isOpen, onClose, fetchData, preFilledData }) => {
    const currentLanguageCode = cookies.get('i18next') || 'en'
    const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
    const { t } = useTranslation()
    useEffect(() => {
      console.log('Setting page stuff')
      document.body.dir = currentLanguage.dir || 'ltr'
    }, [currentLanguage, t])
    const currentDate = new Date();

useEffect(() => {
  fetchPrescriptionNames();
}, []);

useEffect(() => {
  console.log('Popup isOpen:', isOpen);
  // Rest of the useEffect logic...
}, [isOpen]);

console.log('Rendering Popup with isOpen:', isOpen);
    useEffect(() => {
        if (preFilledData && preFilledData.id) {
          // If there is pre-filled data, set it in the state
          setPrescriptionDetails(preFilledData);
        } else {
          // Otherwise, reset the state to initial values
          setPrescriptionDetails(initialPrescriptionDetails);
        }
      }, [preFilledData]);
const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setPrescriptionDetails((prevState) => ({
          ...prevState,
          [name]: value,
          patient:selectedPatientId,
          
        }));
      };
      const findSelectedPrescription = (name) => {
        // Find the selected prescription object based on the name
        return prescriptionID.find((prescription) => prescription.name === name);
      };
      const [prescriptionNames, setPrescriptionNames] = useState([]);

// Ref to keep track of whether prescription names have been fetched
const prescriptionNamesFetched = useRef(false);
      const [prescriptionID, setPrescriptionID] = useState([]);
const fetchPrescriptionNames = () => {
  if (!prescriptionNamesFetched.current) {
    Axios.get(`${API_BASE_URL}/prescription/`)
      .then((response) => {
        // Extract prescription names from the response
        setPrescriptionID(response.data)
        const names = response.data.map((prescription) => prescription.name);
        setPrescriptionNames(names);
        prescriptionNamesFetched.current = true;

      })
      .catch((error) => {
        console.error("Error fetching prescription names:", error);
      });
  }
};
const initialPrescriptionDetails={
  name: prescriptionNames[0] || "",
  dose: "",
  strength: "",
  unit: "",
  duration: "",
  reason: "",
  patient:selectedPatientId,
  date: currentDate.toISOString(),
}
const [prescriptionDetails, setPrescriptionDetails] = useState(initialPrescriptionDetails);   
const Close = () => {
        setPrescriptionDetails(initialPrescriptionDetails);
        onClose();
      }
      const onSave = () => {
        
        if (preFilledData && preFilledData.id) {
          // Perform a PUT request to update the existing data
          console.log("Data to be sent:", prescriptionDetails);
          const selectedPrescription = findSelectedPrescription(prescriptionDetails.name);
          const updatedData = {
            ...prescriptionDetails, // Include existing editedRow data
            patient: selectedPatientId, // Include the patient field
            prescription_idprescription: selectedPrescription.idprescription,
          };
          Axios.put(`${API_BASE_URL}/patienthasprescription/${preFilledData.id}/`, updatedData)
            .then((response) => {
              console.log("Prescription data updated successfully:", response.data);
              onClose();
              fetchData();
              setPrescriptionDetails(initialPrescriptionDetails);
            })
            .catch((error) => {
              console.error("Error updating invoice data:", error);
            });
        }}
        if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
       <div className="pres">
      <div className="contentpres">
      <h2>Edit Prescription</h2>
     
      <div>
      <Autocomplete
  id="name"
  options={prescriptionNames}
  value={prescriptionNames.find(option => option === prescriptionDetails.name) || ''}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "name", value: newValue } });
  }}
  renderInput={(params) => (
    <TextField {...params} label={t("Drug Name")} variant="outlined" />
  )}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  size="small"
/>

      </div>
      <div>
        <TextField
          label={t("Strength")}
          name="strength"
          fullWidth
          variant="outlined"
          size="small"
          value={prescriptionDetails.strength}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <TextField
          label={t("Unit")}
          name="unit"
          fullWidth
          variant="outlined"
          size="small"
          value={prescriptionDetails.unit}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <TextField
          label={t("Duration")}
          name="duration"
          fullWidth
          variant="outlined"
          size="small"
          value={prescriptionDetails.duration}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <TextField
          label={t("Dose")}
          name="dose"
          fullWidth
          variant="outlined"
          size="small"
          value={prescriptionDetails.dose}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <TextareaAutosize
          name="reason"
          rowsMin={4}
          value={prescriptionDetails.reason}
          onChange={handleFieldChange}
          placeholder={t("Reason")}
          className="custom-textarea"
        />
      </div>
      <div>

        <button onClick={onSave} className='closes'>Edit</button>&nbsp;
        <button className="closes" onClick={Close}> {t('close')}</button>
      </div>
      </div></div></div>
  );
};

export default PrescriptionPopup;
