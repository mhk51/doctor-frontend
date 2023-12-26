import React, { useState,useEffect } from "react";
import Axios from "axios";
import './problem.scss'; 
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
const Problem = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [showTextField, setShowTextField] = useState(false);
 
    const intialtestinfo= {
    icd: "",
    problem_desc: "",
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
  
    Axios.get(`${API_BASE_URL}/problem/`)
      .then((response) => {
        console.log(" Data:", response.data);
      })
};
  const handleSaveClick = async () => {
    setShowTextField(false);
    try {
      await Axios.post(`${API_BASE_URL}/problem/`, {
        icd: testInfo.icd,
        problem_desc: testInfo.problem_desc,
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
    console.error("Error saving  test:", error);
  }
};

  return (
    <div className="custom-prob">
      <div className="radiology-tests">
      <p style={{
           marginLeft: "1rem",
           marginTop: "1rem",
           fontSize: "0.9rem",
           fontWeight: "bold",
        }}>{t("Problem")}</p>
        <div className="colll1">
        
            <div className="new-test-section">
              <TextField
                label={t("ICD NUMBER")}
                name="icd"
                fullWidth
                variant="outlined"
                size="small"
                value={testInfo.icd}
                onChange={handleTestInfoChange}
                className="testtinputs"
              />
              <br/>
              <textarea
    name="problem_desc"
    onChange={handleTestInfoChange}
    value={testInfo.problem_desc}
   
    rows="4"
    placeholder={t("Description")}
    className="note-descr"
  ></textarea>
              <div className="cancel-and-saved">
                <button className="saveeze" onClick={handleSaveClick}>{t("Save")}</button>&nbsp;
                <button className="cancelzl" onClick={handleCancelClick}>{t("Cancel")}</button>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default Problem;
