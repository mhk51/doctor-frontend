import React, { useState,useEffect } from "react";
import Axios from "axios";
import './prescriptionn.scss';
import ExpandableText from "../../../components/widgets/ParagraphText/ExpandableText";
import { TextField } from "@mui/material";
import cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import API_BASE_URL from "../../../config/config";
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
const Prescriptionn = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [showTextField, setShowTextField] = useState(false);
  
  
    const intialtestinfo= {
    name: "",
    instruction:"",
  };
  const [inputs, setInputs] = useState(intialtestinfo)
  const handleCancelClick = () => {
    setShowTextField(false);
    setInputs(intialtestinfo)
  }

    
  const handleAddNoteClick = () => {
    setShowTextField(true);
  };
  const fetchData = () => {
  
    Axios.get(`${API_BASE_URL}/prescription/`)
      .then((response) => {
        console.log(" Data:", response.data);
      })
};

const handleSaveClick = async () => {
  setShowTextField(false);
  try {
    await Axios.post(`${API_BASE_URL}/prescription/`, {
        name: inputs.name,
        instruction: inputs.instruction,
    })
      .then(response => {
        console.log(" data saved successfully:", response.data);
        setShowTextField(false);
        setInputs(intialtestinfo);
        fetchData();

    })
    .catch(error => {
      console.error("Error saving  data:", error);
    });
  } catch (error) {
    console.error("Error saving medical test:", error);
  }
};

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="custom-appointmentss">
      <div className="pres-med">
        <p style={{
          marginLeft: "1rem",
          marginTop: "1rem",
          fontSize: "0.9rem",
          fontWeight: "bold",
        }}>{t("Prescriptions")}</p>
        <div className="colll2">
          
            <div className="new-note-section">
              <TextField
              label={t("NAME")}
              name="name"
              fullWidth
              variant="outlined"
              size="small"
              value={inputs.name}
              onChange={handleFieldChange}
              className="testtinput"
              />
              <div >
               
                 <textarea
    name="instruction"
    onChange={handleFieldChange}
    value={inputs.instruction}
   
    rows="4"
    placeholder={t("Instructions")}
    className="note-desc"
  ></textarea>

              </div>
              <div className="cancel-and-save">
                <button className="savee" onClick={handleSaveClick}>{t("Save")}</button>&nbsp;
                <button className="cancell" onClick={handleCancelClick}>{t("Cancel")}</button>
              </div>
            </div>
        
        </div>
      </div>
    </div>
  );
}

export default Prescriptionn;
