import React, { useState, useEffect } from "react";
import Axios from "axios";
import { TextField, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Button } from "@mui/material";
import "./forgot.scss"
import API_BASE_URL from "../../config/config";
const Forgot = ({ isOpen, onClose}) => {
const [confirmPassword, setConfirmPassword] = useState("");
  const [profileData, setProfileData] = useState({
    email: "",
    password: "",
    pin: "",
    key: "",
    verificationMethod: "", // Added verificationMethod to the state
  });

  const [userData, setUserData] = useState([]); // State to hold fetched user data

  const getUserData = async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/all-users/`);
      const userData = response.data;
      console.log("userdatasaved", userData);
      setUserData(userData); // Save user data in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []);

  const handleInputChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRadioChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };
  const handleUpdatePassword = async (foundUser) => {
    if (profileData.password && profileData.password !== confirmPassword)  {
        alert("Passwords do not match");
        return;
      }
    try {
      

      const userToUpdate = {
        ...foundUser,
        password: profileData.password, // Set the new password
      };

      const response = await Axios.put(
        `${API_BASE_URL}/profile/${userToUpdate.email}/`,
        userToUpdate
      );

      console.log("Password updated successfully", response.data);
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    

    const foundUser = userData.find(user => user.email === profileData.email);

    if (!foundUser) {
      console.log("User not found");
      alert("User not found")
      return;
    }

    if (profileData.verificationMethod === "pin") {
      if (foundUser.pin === profileData.pin) {
        // PIN matches, allow password update logic here
        console.log("PIN verified, allow password update");
        handleUpdatePassword(foundUser); 
      } else {
        console.log("Incorrect PIN");
        alert("Incorrect PIN")
      }
    } else if (profileData.verificationMethod === "key") {
      if (foundUser.key === profileData.key) {
        // Key matches, allow password update logic here
        console.log("Key verified, allow password update");
        handleUpdatePassword(foundUser); 
      } else {
        console.log("Incorrect Key");
        alert("Incorrect Key")
      }
    }
  };

  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="forgot-pass-cont">
      <div className="content-forgot">
      
        <TextField
          label="Email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend" >Choose Verification Method</FormLabel>
          <RadioGroup
            aria-label="verificationMethod"
            name="verificationMethod"
            value={profileData.verificationMethod}
            onChange={handleRadioChange}
            row
          >
            <FormControlLabel value="pin" control={<Radio />} label="PIN" style={{fontSize:"0.9rem"}} />
            <FormControlLabel value="key" control={<Radio />} label="Key" style={{fontSize:"0.9rem"}}/>
          </RadioGroup>
        </FormControl>
        {profileData.verificationMethod === "pin" ? (
          <div style={{display:"flex", flexDirection:"column" , gap:"1rem"}}>
          <TextField
            label="PIN"
            name="pin"
            value={profileData.pin}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField 
          name="password"
          size={"small"} 
          label={"New password"} 
          type={"password"} 
          value={profileData.password}
          onChange={handleInputChange}
          />
           <TextField 
          name="confirm_password"
          size={"small"} 
          label={"Confirm password"} 
          type={"password"} 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          /></div>
        ) : profileData.verificationMethod === "key" ? (
          <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
          <TextField
            label="Key"
            name="key"
            value={profileData.key}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField 
          name="password"
          size={"small"} 
          label={"New password"} 
          type={"password"} 
          value={profileData.password}
          onChange={handleInputChange}
          />
           <TextField 
          name="confirm_password"
          size={"small"} 
          label={"Confirm password"} 
          type={"password"} 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          /></div>
        ) : null}
           
          <div className="forgot-bottom">
        <button  className="submit-forgot" onClick={handleSubmit}>
          Submit
        </button>
        <button className="close-forgot" onClick={() => {
            console.log('Close button clicked...');
            onClose();
          }}>
          Close
        </button></div>
      </div></div>
    </div>
  );
};

export default Forgot;
