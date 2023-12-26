import React, { useState,useEffect } from "react";
import Axios from "axios";
import "./medicaltest.scss";
import API_BASE_URL from "../../../config/config";
import { TextField } from "@mui/material";
import cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
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
const MedicalTest = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [showTextField, setShowTextField] = useState(false);
 
  const intialtestinfo= {
    test_name: "",
    test_code: "",
    minimum: "",
    maximum: "",
  };
  const [testInfo, setTestInfo] = useState(intialtestinfo);
  const handleCancelClick = () => {
    setShowTextField(false);
    setTestInfo(intialtestinfo);
  }

  const handleTestInfoChange = (event) => {
    const { name, value } = event.target;
    setTestInfo({
      ...testInfo,
      [name]: value
    });
  };

  const handleAddTestClick = () => {
    setShowTextField(true);
  };

  const fetchData = () => {
  
      Axios.get(`${API_BASE_URL}/medicaltest/`)
        .then((response) => {
          console.log(" Data:", response.data);
        })
  };
  const handleSaveClick = async () => {
    setShowTextField(false);
    try {
      await Axios.post(`${API_BASE_URL}/medicaltest/`, {
        test_name: testInfo.test_name,
        test_code: testInfo.test_code,
        minimum: testInfo.minimum,
        maximum: testInfo.maximum
      })
        .then(response => {
          console.log(" data saved successfully:", response.data);
          setShowTextField(false);
          setTestInfo(intialtestinfo);
          fetchData();

      })
      .catch(error => {
        console.error("Error saving  data:", error);
      });
    } catch (error) {
      console.error("Error saving medical test:", error);
    }
  };

  return (
    <div className="custom-appointments">
      <div className="medical-tests">
        <p style={{
          fontWeight: "800",
          marginLeft: "1rem",
          marginTop: "1rem",
          fontSize: "0.9rem",
        }}>{t("Medical Tests")}</p>
        <div className="colll3">
          
            <div className="new-test-section">
               <TextField
                label={t("Test Code")}
                name="test_code"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.test_code}
                onChange={handleTestInfoChange}
                className="testtinputz"
              />&nbsp;
              <TextField
                label={t("Test Name")}
                name="test_name"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.test_name}
                onChange={handleTestInfoChange}
                className="testtinputz"
              />&nbsp;
              <TextField
                label={t("Minimum Value")}
                name="minimum"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.minimum}
                onChange={handleTestInfoChange}
                className="testtinputz"
              />&nbsp;
              <TextField
                label={t("Maximum Value")}
                name="maximum"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.maximum}
                onChange={handleTestInfoChange}
                className="testtinputz"
              />
              <div className="cancel-and-saves">
                <button className="savees" onClick={handleSaveClick}>{t("Save")}</button>&nbsp;
                <button className="cancell" onClick={handleCancelClick}>{t("Cancel")}</button>
              </div>
            </div>
        
        </div>
      </div>
    </div>
  );
}

export default MedicalTest;
