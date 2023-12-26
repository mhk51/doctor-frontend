
import "../../EditProfile/editprofile.scss";
import TextBox from "../../../../../components/widgets/TextBox/TextBox";
import { Dropdown } from "bootstrap";
import DropDown from "../../../../../components/widgets/DropDown/DropDown";
import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Cookies from 'js-cookie';
import cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, IconButton } from "@mui/material";
import API_BASE_URL from "../../../../../config/config";
import "./gpt.scss";
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
const Information = () => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",  
    email: "",
    password: "",
    phone: "",
    pin:"",
    key:"",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (profileData.password && profileData.password !== confirmPassword)  {
      alert("Passwords do not match");
      return;
    }
    try {

      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
console.log("profiledata",profileData);
        const response = await Axios.put(
          `${API_BASE_URL}/profile/update/${profileData.id}/`,
          profileData, // Send the updated profileData
          config,
        );

        const updatedUserData = response.data;
        console.log("Updated user data", updatedUserData);
        setProfileData(updatedUserData);
        try {
          // Remove the token from local storage (client-side)
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          Cookies.remove("staySignedIn");
          Cookies.remove('tokenExpiration');
          // Send a request to the server to handle server-side logout
          const response = await Axios.post(
            `${API_BASE_URL}/logout/`,  // server-side logout URL
            
          );
      
          // Handle the response as usual
          if (response.status === 200) {
            navigate("/login");
          }
        } catch (error) {
          // Handle errors here
          console.error("Logout error:", error);
        }
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
           {t(" Personal Information")}
          </h3>
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
            {t("First Name")}
          </h3>
          <TextField
          name="first_name"
          size={"small"} 
          text={"Edit first name"}  
          value={profileData.first_name}
          onChange={handleInputChange}/>
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
           {t("Last Name")} 
          </h3>
          <TextField 
          name="last_name"
          size={"small"} 
          text={"Edit last name"} 
          value={profileData.last_name}
          onChange={handleInputChange}
          />
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
            {t("Phone Number")}
          </h3>
          <TextField 
          name="phone"
          size={"small"} 
          text={"Edit phone number"} 
          type={"number"}
          value={profileData.phone}
          onChange={handleInputChange}
          />
        </div>
        
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.9rem",
            }}
          >
           {t("Account Information")}
          </h3>
        </div>

        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
           {t("Email Address")} 
          </h3>
          <TextField 
          name="email"
          size={"small"} 
          text={"Edit email address"}
          value={profileData.email}
          onChange={handleInputChange}
          />
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
            {t("Password")}
          </h3>
          
           <TextField
              width={"70%"}
              size={"small"}
              text={"Edit password"}
              name={"password"}
              type={showPassword ? "text" : "password"}
              value={profileData.password}
              onChange={handleInputChange}
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
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
           {t("Confirm Password")} 
          </h3>
      
                    <TextField
              width={"70%"}
              size={"small"}
              text={"Confirm password"}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.9rem",
            }}
          >
           Password Recovery Keys
          </h3>
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
           {t("PIN")} 
          </h3>
          <TextField 
          name="pin"
          size={"small"} 
          text={t("PIN")} 
          
          value={profileData.pin}
          onChange={handleInputChange}
          />
        </div>
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
          <h3
            style={{
              fontSize: "0.8rem",
              fontWeight: "normal",
              marginBottom: ".5rem",
            }}
          >
           {t("Secret Key")} 
          </h3>
          <TextField 
          name="key"
          size={"small"} 
          text={t("Secret Key")} 
          
          value={profileData.key}
          onChange={handleInputChange}
          />
        </div>
        
        <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem', display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
        <button className="update-button" onClick={handleUpdate}>{t("Update")}</button>
        <button className="cancel-button" onClick={handleCancel}>{t("Cancel")}</button>
      </div>
      </div>
    );
  
}

export default Information;
