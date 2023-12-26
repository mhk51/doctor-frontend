import React, { useState,useEffect } from "react";
import axios from "axios";
import TextBox from "../widgets/TextBox/TextBox";
import DropDown from "../widgets/DropDown/DropDown";
import SaveButton from "../widgets/Buttons/Save/SaveButton";
import PhoneInput from "react-phone-number-input";
import "../new-patient/newpatient.scss";
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
const NewDoctor = ({ isOpen, onClose, updateDoctorList }) => {
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
    email: '',
    phone: '',
    speciality: '',
    sub_speciality:'',};

    const [inputs, setInputs] = useState(initialInputs);
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
    const saveDocotorData = () => {
      console.log("Form Data:", inputs);
      // Make an API request to save the patient data with the inputs state
      const cleanedPhone = inputs.phone !== null ? inputs.phone.replace('+', '') : null;

      // Create a new object with the cleaned phone attribute
      const cleanedInputs = {
        ...inputs,
        phone: cleanedPhone,
      };
      axios
        .post(`${API_BASE_URL}/referraldoctors/`, cleanedInputs)
        .then((response) => {
          console.log("Doctor data saved successfully:", response.data);
          // Close the popup or perform other actions as needed
          updateDoctorList();
          setInputs(initialInputs);
          onClose();
        })
        .catch((error) => {
          console.error("Error saving Doctor data:", error);
        });
    };
    const Close = () => {
      setInputs(initialInputs);
      onClose();
    }
  if (!isOpen) return null;
  
 
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
      <div className="new-patient-pop">
        <div className="contentpa">
          <div className="top">
            <h2>{t("Add a new doctor")}</h2>
           
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
                    label={t("Speciality")}
                    name="speciality"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={inputs.speciality}
                    onChange={handleFieldChange}
                />

                <div className="row-col2">
                <TextField
                    label={t("Sub-Speciality")}
                    name="sub_speciality"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={inputs.sub_speciality}
                    onChange={handleFieldChange}
                />
                </div>
              </div>
            </div>

            <div className="section">
              <h3>{t("Contact Information")}</h3>
              <div className="row">
              <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={inputs.email}
                  onChange={handleFieldChange}
                />
</div>
                <div className="row">
                <PhoneInput
              placeholder={"Phone Number"}
              value={inputs.phone}
              name="phone"
             onChange={handlePhoneChange}
          /></div>
                </div>
              </div>
            </div>
       
        

        <div className="bottompatient">
          <div className="rowpatient">
            <SaveButton onClick={saveDocotorData}/>
            
            <button className="closepatient" onClick={Close}>{t("close")}</button></div>
            </div>
        </div>
      </div>

  );
};

export default NewDoctor;