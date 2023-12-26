import React, { useState,useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import TextBox from "../widgets/TextBox/TextBox";
import SaveButton from "../widgets/Buttons/Save/SaveButton";
import DatePickerField from "../widgets/DatePicker/DatePicker";
import "./newpatient.scss";
import { TextField, MenuItem } from "@mui/material";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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
const NewPatient = ({ isOpen, onClose, updatePatientList }) => {
  // State for managing the form data
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
    const initialInputs = {
    first_name: '',
    last_name: '',
    middle_name:'',
    address: '',
    gender: '',
    dob: null,
    weight: '',
    height: '',
    blood_type: '',
    ssn: '',
    email: '',
    phone: '',
    first_name_emergency: '',
    last_name_emergency: '',
    relation_emergency: '',
    phone_emergency: '',
  };
  const [inputs, setInputs] = useState(initialInputs);
  // Function to handle changes in form fields
  const handleFieldChange = (e) => {
    
    const { name, value } = e.target;
    
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handlePhoneChange = (value) => {
    if (value){
   
  
    // Update the state for the phone input
    setInputs((prevState) => ({
      ...prevState,
      phone: value,
    }));}
  };
  const handlePhoneEmergencyChange= (value) => {
    if (value){
   
  
    // Update the state for the phone input
    setInputs((prevState) => ({
      ...prevState,
      phone_emergency: value,
    }));}
  };
  const Close = () => {
    setInputs(initialInputs);
    onClose();
  }
  // Function to save patient data
  const savePatientData = () => {
    console.log("Form Data:", inputs);
    // Make an API request to save the patient data with the inputs state
     // Check if the phone attribute is not null and remove the '+' sign
  const cleanedPhone = inputs.phone !== null ? inputs.phone.replace('+', '') : null;
  const cleanedPhoneEmergency = inputs.phone_emergency !== null ? inputs.phone_emergency.replace('+', '') : null;
  // Create a new object with the cleaned phone attribute
  const cleanedInputs = {
    ...inputs,
    phone: cleanedPhone,
    phone_emergency:cleanedPhoneEmergency,
  };
    axios
      .post(`${API_BASE_URL}/patients/`, cleanedInputs)
      .then((response) => {
        console.log("Patient data saved successfully:", response.data);
        // Close the popup or perform other actions as needed
        updatePatientList();
        setInputs(initialInputs);
        onClose();
      })
      .catch((error) => {
        console.error("Error saving patient data:", error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
      <div className="new-patient-pop">
        <div className="contentpa">
          <div className="top">
            <h2>{t("Add a new patient")}</h2>
          </div>

          <div className="center">
            <h3>{t("Personal Information")}</h3>
            <div className="section">
              <div className="row">
                <TextField
                  label={t("First Name")}
                  name="first_name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.first_name}
                  onChange={handleFieldChange}
                />
                <div className="row-col2">
                  <TextField
                  label={t("Middle Name")}
                  name="middle_name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.middle_name}
                  onChange={handleFieldChange}
                /></div>
                <div className="row-col2">
                  <TextField
                    label={t("Last Name")}
                    name="last_name"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={inputs.last_name}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
             
              <div className="row">
                <TextField
                  select
                  label={t("Gender")}
                  name="gender"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.gender}
                  onChange={handleFieldChange}
                >
                  <MenuItem value="Male">{t("Male")}</MenuItem>
                  <MenuItem value="Female">{t("Female")}</MenuItem>
                  
  </TextField>
  <div className="row-col2">
              
                <input
                className="patientdate"
                  type="date"
                  name="dob"
                  value={inputs.dob}
                  onChange={handleFieldChange}
                  
                />


              </div>
              </div>
             
            </div>

            <h3>{t("Contact Information")}</h3>
            <div className="section">
             
              
              
              <div className="row">
                <TextField
                  label={t("Email")}
                  name="email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.email}
                  onChange={handleFieldChange}
                />
                <div className="row-col2">
                <TextField
                  label={t("Address")}
                  name="address"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.address}
                  onChange={handleFieldChange}
                />
                
                </div>
              </div>
              
             
              <div className="row">
              
              <PhoneInput
              placeholder={"Phone Number"}
              value={inputs.phone}
              name="phone"
             onChange={handlePhoneChange}
          />
              </div></div>
            </div>
            <h3>{t("Emergency Contact")}</h3>
            <div className="section">
              <div className="row">
                <TextField
                  label={t("First Name")}
                  name="first_name_emergency"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.first_name_emergency}
                  onChange={handleFieldChange}
                />
                <div className="row-col2">
                  <TextField
                    label={t("Last Name")}
                    name="last_name_emergency"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={inputs.last_name_emergency}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
              <div className="row">
                <TextField
                  label={t("Relation")}
                  name="relation_emergency"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.relation_emergency}
                  onChange={handleFieldChange}
                /></div>
                <div className="row">
                <PhoneInput
              placeholder={"Phone Number"}
              value={inputs.phone_emergency}
              name="phone_emergency"
             onChange={handlePhoneEmergencyChange}
          />
                
              </div>
            </div>
          
        

        <div className="bottompatient">
          <div className="rowpatient">
            <SaveButton onClick={savePatientData} />
            <button className="closepatient" onClick={Close}>
             {t("close")} 
            </button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatient;
