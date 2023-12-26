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

const PrescriptionOverview = ({ selectedPatientId, isOpen, onClose, fetchData }) => {
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


const handleFieldChange = (e) => {
    const { name, value } = e.target;
  console.log("e",e)
    if (name === "name") {
      console.log("Selected Name:", value);
      // Find the selected prescription object based on the name
      const selectedPrescription = findSelectedPrescription(value);
      console.log("Selected Prescription:", selectedPrescription);
      console.log(selectedPrescription)
      if (selectedPrescription) {
        
        const prescriptionId = selectedPrescription.idprescription;
        console.log('prescription id', prescriptionId);
        setNewPrescription((prevState) => ({
          ...prevState,
          [name]: value,
          prescription_idprescription: prescriptionId,
        }));
      } else {
        setNewPrescription((prevState) => ({
          ...prevState,
          [name]: value,
          prescription_idprescription: null,
        }));
      }
    } else {
      setNewPrescription((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } 
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
  name: "",
  dose: "",
  strength: "",
  unit: "",
  duration: "",
  reason: "",
  patient:selectedPatientId,
  date: currentDate.toISOString(),
}
const [newPrescription, setNewPrescription] = useState(initialPrescriptionDetails);
const Close = () => {
        setNewPrescription(initialPrescriptionDetails);
        onClose();
      }
      const onSave = () => {
        console.log("Form Data:", newPrescription);
        // Make an API request to save the patient data with the inputs state
        Axios
          .post(`${API_BASE_URL}/patienthasprescription/`, newPrescription)
          .then((response) => {
            console.log("Prescription data saved successfully:", response.data);
            // Close the popup or perform other actions as needed
            fetchData();
            setNewPrescription(initialPrescriptionDetails);
            onClose();
          })
          .catch((error) => {
            console.error("Error saving patient data:", error);
          });
      };
        if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
       <div className="pres">
      <div className="contentpres">
      <h2>Add Prescription</h2>
     
      <div>
      <Autocomplete
  id="name"
  options={prescriptionNames}
  value={newPrescription.name}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "name", value: newValue } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Drug Name")} variant="outlined" InputLabelProps={{ style: { fontSize: '14px' }  }} />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  
  size='small'
/>

      </div>
      <div>
        <TextField
          label={t("Strength")}
          name="strength"
          fullWidth
          variant="outlined"
          size="small"
          value={newPrescription.strength}
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
          value={newPrescription.unit}
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
          value={newPrescription.duration}
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
          value={newPrescription.dose}
          onChange={handleFieldChange}
        />
      </div>
      <div>
        <TextareaAutosize
          name="reason"
          rowsMin={4}
          value={newPrescription.reason}
          onChange={handleFieldChange}
          placeholder={t("Reason")}
          className="custom-textarea"
        />
      </div>
      <div>

        <button onClick={onSave} className='closes'>Add</button>&nbsp;
        <button className="closes" onClick={Close}> {t('close')}</button>
      </div>
      </div></div></div>
  );
};

export default PrescriptionOverview;
