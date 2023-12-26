import React, { useState,useEffect } from "react";
import Axios from "axios";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames';
import "./password.scss";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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

// Password Verification Component
const PasswordVerification = ({ onVerified }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem('token');
  console.log("token", token);
  const handleVerifyPassword = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
      const response = await Axios.post(`${API_BASE_URL}/verify-password/`, {
        old_password: oldPassword,
      }, config);

      if (response.data.success) {
        // Password verified successfully
        onVerified(); // Notify the parent component
      } else {
        alert("Old password does not match.");
      }}}
     catch (error) {
      console.error("Error verifying old password:", error);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
      <h1   style={{
            fontSize: "0.9rem",
            
          
          }}>{t("Verify Old Password")}</h1>

       <TextField
              width={"70%"}
              size={"small"}
              text={t("Enter old password")}
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div>
      <button className="butt-pass" onClick={handleVerifyPassword}>{t("Verify Password")}</button></div>
    </div>
  );
};
export default PasswordVerification;