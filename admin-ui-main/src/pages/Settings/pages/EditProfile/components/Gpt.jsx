
import React, { useState, useEffect } from "react";
import DropDown from "../../../../../components/widgets/DropDown/DropDown";
import '../../EditProfile/editprofile.scss';
import { Trash } from "react-feather";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Axios from "axios";
import Cookies from 'js-cookie';
import cookies from 'js-cookie';
import "./gpt.scss";
import { useTranslation } from 'react-i18next'
import API_BASE_URL from "../../../../../config/config";
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
const Gpt = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const token = localStorage.getItem('token');
  console.log("token", token);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    gpt: "",
  });

  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await Axios.get(`${API_BASE_URL}/users/`, config)

        const userData = response.data;
        console.log("userdatasaved", userData);
        setProfileData(userData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []); 

  const handleUpdate = async () => {
    
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await Axios.put(
          `${API_BASE_URL}/profile/update/${profileData.id}/`,
          profileData, // Send the updated profileData
          config,
        );

        const updatedUserData = response.data;
        console.log("Updated user data", updatedUserData);
        setProfileData(updatedUserData);
        navigate("/");
      }
    } catch (error) {
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  const handleCancel = () => {
 
    navigate("/");
  };

  return (
    <div className="information">
      <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
        <h3
          style={{
            fontSize: "0.9rem",
          }}
        > 
          OpenAI
        </h3>
      </div>

      {/* Add your steps here */}
      <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
        <h3
          style={{
            fontSize: "0.75rem",
            fontWeight: "normal",
            marginBottom: ".5rem",
          }}
        >
          {t("Steps for Setting Up OpenAI API Key")}:
        </h3>
        <ol>
          <li style={{
            fontSize: "0.75rem",
            fontWeight: "normal",}}>{t("Step 1: Log in to your")} <a href="https://www.openai.com" target="_blank" rel="noopener noreferrer">{t("OpenAI account")}</a> {t("or sign up if you don't have one")}.</li>
          <li style={{
            fontSize: "0.75rem",
            fontWeight: "normal",}}>{t("Step 2: Navigate to the")} <a href="https://www.openai.com/dashboard" target="_blank" rel="noopener noreferrer">API {t("Settings")}</a> {t("in your OpenAI dashboard")}.</li>
          <li style={{
            fontSize: "0.75rem",
            fontWeight: "normal",}}>{t("Step 3: Create a new API key and provide it a name")}.</li>
          <li style={{
            fontSize: "0.75rem",
            fontWeight: "normal",}}>{t("Step 4: Copy the generated API key and use it in the following input field")}.</li>
        </ol>
      </div>

      <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
        <h3
          style={{
            fontSize: "0.75rem",
            fontWeight: "normal",
            marginBottom: ".5rem",
          }}
        >
          API {t("Key")}
        </h3>
        <TextField
          name="gpt"
          size={"small"} 
          text={"Edit ChatGPT Key"}  
          value={profileData.gpt}
          onChange={handleInputChange}
        />
      </div>

      <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem', display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
        <button className="update-button" onClick={handleUpdate} >{t("Update")}</button>
        <button className="cancel-button" onClick={handleCancel} >{t("Cancel")}</button>
      </div>
    </div>
  );
}
export default Gpt;