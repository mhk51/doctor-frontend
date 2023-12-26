import React, { useState,useEffect } from "react";
import Axios from "axios";
import './radiology.scss'; // Assuming the new stylesheet is named "radiology.scss"
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
const Radiology = () => {
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
    imaging_type: "",
    description: "",
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
  
    Axios.get(`${API_BASE_URL}/radiologytest/`)
      .then((response) => {
        console.log(" Data:", response.data);
      })
};
  const handleSaveClick = async () => {
    setShowTextField(false);
    try {
      await Axios.post(`${API_BASE_URL}/radiologytest/`, {
        test_name: testInfo.test_name,
        test_code: testInfo.test_code,
        imaging_type: testInfo.imaging_type,
        description:testInfo.description,
      })  .then(response => {
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
    <div className="custom-radiology">
      <div className="radiology-tests">
      <p style={{
             marginLeft: "1rem",
             marginTop: "1rem",
             fontSize: "0.9rem",
             fontWeight: "bold",
        }}>{t("Radiology")}</p>
        <div className="colll1">
         
            <div className="new-test-section">
              <TextField
                label={t("Test Code")}
                name="test_code"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.test_code}
                onChange={handleTestInfoChange}
                className="testinputs"
              />&nbsp;
              <TextField
                label={t("Test Name")}
                name="test_name"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.test_name}
                onChange={handleTestInfoChange}
                className="testinputs"
              />&nbsp;
              <TextField
                label={t("Image Type")}
                name="imaging_type"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.imaging_type}
                onChange={handleTestInfoChange}
                className="testinputs"
              />&nbsp;
              <textarea
    name="description"
    onChange={handleTestInfoChange}
    value={testInfo.description}
    className="descriptionn"
    rows="4"
    placeholder={t("Description")}
  ></textarea>
              <div className="cancel-and-save">
                <button className="saveee" onClick={handleSaveClick}>{t("Save")}</button>&nbsp;&nbsp;
                <button className="cancel-button-rad" onClick={handleCancelClick}>{t("Cancel")}</button>
              </div>
            </div>
         
        </div>
      </div>
    </div>
  );
}

export default Radiology;
