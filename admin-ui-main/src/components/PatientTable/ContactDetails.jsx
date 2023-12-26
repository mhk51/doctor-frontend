import React, { useEffect, useState } from "react";
import axios from "axios";
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNotesMedical, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import EMR from "../EMR/EMR";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HeightIcon from '@mui/icons-material/Height';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PhoneInput from "react-phone-number-input";
import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import SocialMediaIcon from '@mui/icons-material/Instagram';
import API_BASE_URL from "../../config/config";
import EmailIcon from '@mui/icons-material/Email';
import WcIcon from '@mui/icons-material/Wc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from "@mui/icons-material/Delete"; 
import'./Contactdetails.scss';
import People from "@mui/icons-material/People";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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
const ContactDetails = ({ selectedPatientId, updatePatientList, editPatientList}) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [patientDetails, setPatientDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isEditMode, setIsEditMode] = useState(false);
  const [socialMediaAccounts, setSocialMediaAccounts] = useState([]);
 
  const initialsocial={
    social: "", 
    username: "",
  }
  const [newSocialMediaAccount, setNewSocialMediaAccount] = useState(initialsocial);
  const [socialMediaPlatforms, setSocialMediaPlatforms] = useState([]);
  const [editedSocialMediaAccount, setEditedSocialMediaAccount] = useState(null);
  const [isAddingSocialMediaAccount, setIsAddingSocialMediaAccount] = useState(false);
  const userRole = localStorage.getItem('role');
  console.log("roleemr", userRole);
  useEffect(() => {
    if (selectedPatientId) {
      // Fetch patient details
      axios
        .get(`${API_BASE_URL}/patients/${selectedPatientId}/`)
        .then((response) => {
          setPatientDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching patient details:", error);
          setPatientDetails(null);
        });

      // Fetch social media accounts for the patient
      axios
        .get(`${API_BASE_URL}/socialmediaaccount/?patient=${selectedPatientId}`)
        .then((response) => {
          setSocialMediaAccounts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching social media accounts:", error);
          setSocialMediaAccounts([]);
        });

      // Fetch the list of social media platforms
      axios
        .get(`${API_BASE_URL}/socialmedia/`)
        .then((response) => {
          setSocialMediaPlatforms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching social media platforms:", error);
          setSocialMediaPlatforms([]);
        });
        setActiveTab("personalInfo");
        setIsEditMode(false);
    } else {
      setPatientDetails(null);
      setActiveTab("personalInfo");
      setSocialMediaAccounts([]);
    }
  }, [selectedPatientId]);

  const handleSaveClick = () => {
    // Rest of your code to update patient details
    const selectedGender = patientDetails && (patientDetails.gender === "Male" || patientDetails.gender === "Female") ?
      patientDetails.gender : null;

    const updatedPatientData = {
      first_name:patientDetails.first_name,
      last_name:patientDetails.last_name,
      middle_name:patientDetails.middle_name,
      ssn: patientDetails.ssn,
      mrn: patientDetails.mrn,
      gender: selectedGender,
      dob: patientDetails.dob,
      email: patientDetails.email,
      phone:patientDetails.phone && (patientDetails.phone = patientDetails.phone.replace('+', '')),
      address: patientDetails.address,
      weight: patientDetails.weight,
      height: patientDetails.height,
      blood_type: patientDetails.blood_type,
      first_name_emergency: patientDetails.first_name_emergency,
      last_name_emergency: patientDetails.last_name_emergency,
      phone_emergency: patientDetails.phone_emergency && (patientDetails.phone_emergency = patientDetails.phone_emergency.replace('+', '')),
     
      
      relation_emergency: patientDetails.relation_emergency,
    };

    axios
      .put(`${API_BASE_URL}/patients/${selectedPatientId}/`, updatedPatientData)
      .then((response) => {
        setIsEditMode(false);
        setPatientDetails(response.data);
        editPatientList();
      })
      .catch((error) => {
        console.error("Error updating patient data:", error);
      });
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    if ( patientDetails.phone && !patientDetails.phone.startsWith('+')) {
      // Add '+' before the phone number
      setPatientDetails({
        ...patientDetails,
        phone: `+${patientDetails.phone}`,
      });
    }
    if ( patientDetails.phone_emergency && !patientDetails.phone_emergency.startsWith('+')) {
      // Add '+' before the phone number
      setPatientDetails({
        ...patientDetails,
        phone_emergency: `+${patientDetails.phone_emergency}`,
      });
    }
  };

  const handleEditSocialMediaAccount = (account) => {
    // Set the edited social media account for editing
    setEditedSocialMediaAccount(account);
  };
  const handleCancelSocialMediaAccountEdit = () => {
    setEditedSocialMediaAccount(null);
  };
  const handleCancelSocialMediaAccountAdd= () => {
    setIsAddingSocialMediaAccount(false);
    setNewSocialMediaAccount(initialsocial);
  }
  const handleSaveSocialMediaAccount = () => {
    if (editedSocialMediaAccount) {
      // PUT request to update the edited social media account
      axios
        .put(`${API_BASE_URL}/socialmediaaccount/${editedSocialMediaAccount.id}/`, editedSocialMediaAccount)
        .then((response) => {
          // Successfully updated the social media account
          console.log("Social media account updated successfully:", response.data);
          setEditedSocialMediaAccount(null); // Clear the edited account
          // Update the local state with the updated data
          const updatedAccounts = socialMediaAccounts.map((account) =>
            account.id === response.data.id ? response.data : account
          );
          setSocialMediaAccounts(updatedAccounts);
        })
        .catch((error) => {
          console.error("Error updating social media account:", error);
        });
    }
  };
  const handleRemoveSocialMediaAccount = (index) => {
    const accountToRemove = socialMediaAccounts[index];

    // DELETE request to remove a social media account
    axios
      .delete(`${API_BASE_URL}/socialmediaaccount/${accountToRemove.id}/`)
      .then(() => {
        const updatedAccounts = [...socialMediaAccounts];
        updatedAccounts.splice(index, 1);
        setSocialMediaAccounts(updatedAccounts);
        
      })
      .catch((error) => {
        console.error("Error removing social media account:", error);
      });
  };
  const handleAddSocialMediaAccount = () => {
    // Show the dropdown and input fields
    setIsAddingSocialMediaAccount(true);
    // Initialize the newSocialMediaAccount state with an empty string for 'social'
    setNewSocialMediaAccount({ social: "", username: "" });
  };
  
  const handleSaveAddSocialMediaAccount = () => {
    if (newSocialMediaAccount.social && newSocialMediaAccount.username) {
      // Find the selected platform object based on the name
      const selectedPlatform = socialMediaPlatforms.find(
        (platform) => platform.platform === newSocialMediaAccount.social
      );
      console.log("Selected Social Media Name:", newSocialMediaAccount.social); // Debug log
      console.log("Selected Platform:", selectedPlatform); // Debug log
  
      if (selectedPlatform) {
        const socialId = selectedPlatform.id_social;
        console.log("Selected Social Media ID:", socialId); // Debug log
        const newAccount = {
          social: socialId,
          username: newSocialMediaAccount.username,
          patient: selectedPatientId,
        };
  
        axios
          .post(`${API_BASE_URL}/socialmediaaccount/`, newAccount)
          .then((response) => {
            // Successfully added the social media account
            console.log("Social media account added successfully:", response.data);
            // Add the new account to the state
            setSocialMediaAccounts([...socialMediaAccounts, response.data]);
            // Reset the input fields and hide the dropdown
            setNewSocialMediaAccount({ social: "", username: "" });
            setIsAddingSocialMediaAccount(false);
          })
          .catch((error) => {
            console.error("Error adding social media account:", error);
          });
      } else {
        console.error("Invalid social media platform selected.");
      }
    } else {
      console.error("Please select a social media platform and provide a username.");
    }
  };
  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };
  
  const handleCancelClick = () => {
    // Revert changes or exit edit mode
    if (editedSocialMediaAccount) {
      setEditedSocialMediaAccount(null);
    }
    setIsEditMode(false);
    if ( patientDetails.phone && patientDetails.phone.startsWith('+')) {
      // Add '+' before the phone number
      setPatientDetails({
        ...patientDetails,
        phone: patientDetails.phone.replace('+', ''),
      });
    }
    if ( patientDetails.phone_emergency && patientDetails.phone_emergency.startsWith('+')) {
      // Add '+' before the phone number
      setPatientDetails({
        ...patientDetails,
        phone_emergency: patientDetails.phone_emergency.replace('+', ''),
      });
    }
  };
  
  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials;
  };
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const handleOpenDeleteDialog = (patientId) => {
    setPatientToDelete(patientId);
    setDeleteConfirmationOpen(true);
  };
  
  const handleCancelDelete = () => {
    setPatientToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  const navigate = useNavigate();
  const handleConfirmDelete = () => {
    if (patientToDelete) {
      // Send a DELETE request to delete the patient
      
      axios
        .delete(`${API_BASE_URL}/patients/${patientToDelete}/`)
        .then(() => {
          // Patient deleted successfully
          setPatientToDelete(null);
          setDeleteConfirmationOpen(false);
          updatePatientList();
          navigate(`/contactspatients`);
          
        })
        .catch((error) => {
          console.error("Error deleting patient:", error);
          // Handle the error appropriately (e.g., show an error message)
          setPatientToDelete(null);
          setDeleteConfirmationOpen(false);
        });
    }
  };
  function getPlatformIcon(platform) {
    switch (platform) {
      case 'Facebook':
      return <Facebook className="icon"/>;
    case 'Twitter':
      return <Twitter className="icon"/>;
    case 'Instagram':
      return <SocialMediaIcon className="icon"/>;
    case 'LinkedIn':
      return <LinkedIn className="icon"/>;
    default:
      return null;
    }
  }
  const handlePhoneChange = (value) => {
    if (value){
   
  
    // Update the state for the phone input
    setPatientDetails({

    ...patientDetails,
      phone: value,
    });}
  };
  const handlePhoneEmergencyChange = (value) => {
    if (value){
   
  
    // Update the state for the phone input
    setPatientDetails({

    ...patientDetails,
      phone_emergency: value,
    });}
  };

  return (
    <div className="contact-Details-container">
      <div className="header">
        {patientDetails ? (
          <>
            <div className="details-avatar">
              <div className="initials-Details">
                {getInitials(
                  `${patientDetails.first_name} ${patientDetails.last_name}`
                )}
              </div>
            </div>
            <div className="details">
              <div className="contact-initial">
                {`${patientDetails.first_name} ${patientDetails.middle_name} ${patientDetails.last_name}`}
              </div>
              <div className="header-icons">
                <FontAwesomeIcon
                  icon={faUser}
                  className={`icon ${activeTab === "personalInfo" ? "active" : ""}`}
                   style={{ cursor: "pointer", 
                               
                    }}
                  onClick={() => handleTabClick("personalInfo")}
                />
                {userRole !== "Secretary" && ( // Check if the user is not a secretary
                <FontAwesomeIcon
                  icon={faNotesMedical}
                   style={{ cursor: "pointer", 
                               
                    }}
                  className={`icon ${activeTab === "EMR" ? "active" : ""}`}
                  onClick={() => handleTabClick("EMR")}
                />)}

<SocialMediaIcon
          className={`icon ${activeTab==="socialMediaAccounts" ? "active" : ""}`}
          style={{ cursor: "pointer" }}
          onClick={() => handleTabClick("socialMediaAccounts")}
        />
                 <DeleteIcon
                      
                      className={"icondelete"}
                      style={{ cursor: "pointer", 
                               
                    }}
                     onClick={() => handleOpenDeleteDialog(selectedPatientId)}
                    />
              </div>
            </div>
          </>
        ) : (
          <div className="no-patient-selected">
           {t('Select a patient to view details')}.
          </div>
        )}
      </div>

      <div className="patient-details">
        {patientDetails ? (
          <>
            {activeTab === "personalInfo" && (
              <div className="personal-info-tab">
                <div className="tab-container">
                  <div className="tab">{t("Personal Information")}</div>
                </div>
                {!isEditMode && (
                  <>
                    <div className="container1">
                    {window.innerWidth > 850 ? (
                    <table>
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t('Emergency Contact')}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t('Medical Information')}:</h2></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div className="field">
            <CreditCardIcon className="iconf" />
            <p><strong>SSN:</strong> {patientDetails.ssn}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <HomeIcon className="iconf" />
            <p><strong>{t('Address')}:</strong> {patientDetails.address}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <ContactEmergencyIcon className="iconf" />
            <p><strong>{t('NAME')}:</strong> {patientDetails.first_name_emergency} {patientDetails.last_name_emergency}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <BloodtypeIcon className="iconf" />
            <p><strong>{t('Blood Type')}:</strong> {patientDetails.blood_type}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div className="field">
            <CalendarMonthIcon className="icon" />
            <p><strong>DOB:</strong> {patientDetails.dob}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <LocalPhoneIcon className="iconf" />
            <p><strong>{t('Phone')}:</strong> {patientDetails.phone}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <LocalPhoneIcon className="iconf" />
            <p><strong>{t('Phone')}:</strong> {patientDetails.phone_emergency}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <MonitorWeightIcon className="iconf" />
            <p><strong>{t('Weight')}:</strong> {patientDetails.weight}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div className="field">
            <WcIcon className="iconf" />
            <p><strong>{t('Gender')}:</strong> {patientDetails.gender}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <EmailIcon className="iconf" />
            <p><strong>{t('Email')}:</strong> {patientDetails.email}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <PeopleIcon className="iconf" />
            <p><strong>{t('Relation')}:</strong> {patientDetails.relation_emergency}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <HeightIcon className="iconf" />
            <p><strong>{t('Height')}:</strong> {patientDetails.height}</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
                  ) : (
                <div>
                    <table>
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
        
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div className="field">
            <CreditCardIcon className="iconf" />
            <p><strong>SSN:</strong> {patientDetails.ssn}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <HomeIcon className="iconf" />
            <p><strong>{t('Address')}:</strong> {patientDetails.address}</p>
          </div>
        </td>
        
      </tr>
      <tr>
        <td>
          <div className="field">
            <CalendarMonthIcon className="icon" />
            <p><strong>DOB:</strong> {patientDetails.dob}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <LocalPhoneIcon className="iconf" />
            <p><strong>{t('Phone')}:</strong> {patientDetails.phone}</p>
          </div>
        </td>
        
      </tr>
      <tr>
        <td>
          <div className="field">
            <WcIcon className="iconf" />
            <p><strong>{t('Gender')}:</strong> {patientDetails.gender}</p>
          </div>
        </td>
        <td>
          <div className="field">
            <EmailIcon className="iconf" />
            <p><strong>{t('Email')}:</strong> {patientDetails.email}</p>
          </div>
        </td>
        
      </tr>
    </tbody>
  </table> 
  
  <table>
  <thead>
    <tr>
      
      <th style={{ textAlign: 'left' }}><h2 className="title">{t('Emergency Contact')}:</h2></th>
      <th style={{ textAlign: 'left' }}><h2 className="title">{t('Medical Information')}:</h2></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      
      <td>
        <div className="field">
          <ContactEmergencyIcon className="iconf" />
          <p><strong>{t('NAME')}:</strong> {patientDetails.first_name_emergency} {patientDetails.last_name_emergency}</p>
        </div>
      </td>
      <td>
        <div className="field">
          <BloodtypeIcon className="iconf" />
          <p><strong>{t('Blood Type')}:</strong> {patientDetails.blood_type}</p>
        </div>
      </td>
    </tr>
    <tr>
      
      <td>
        <div className="field">
          <LocalPhoneIcon className="iconf" />
          <p><strong>{t('Phone')}:</strong> {patientDetails.phone_emergency}</p>
        </div>
      </td>
      <td>
        <div className="field">
          <MonitorWeightIcon className="iconf" />
          <p><strong>{t('Weight')}:</strong> {patientDetails.weight}</p>
        </div>
      </td>
    </tr>
    <tr>
      
      <td>
        <div className="field">
          <PeopleIcon className="iconf" />
          <p><strong>{t('Relation')}:</strong> {patientDetails.relation_emergency}</p>
        </div>
      </td>
      <td>
        <div className="field">
          <HeightIcon className="iconf" />
          <p><strong>{t('Height')}:</strong> {patientDetails.height}</p>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</div>
  )}
</div>
                  </>
                )}
                {isEditMode && (
                  <>
                   <div className="container1">
                   {window.innerWidth > 850 ? (
  <table>
    <thead>
      <tr>
      <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Emergency Contact")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Medical Information")}:</h2></th>
      </tr>
    </thead>
    <tbody>
          <tr>
            <td>
              <div className="field">
                <CreditCardIcon className="iconf"/>
                <p><strong>SSN:</strong></p>
                <input
                  type="text"
                  id="ssn"
                  value={patientDetails.ssn}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, ssn: e.target.value })
                  }
                />
              </div>
            </td>
            <td>
              <div className="field">
                <HomeIcon className="iconf"/>
                <label>{t("Address")}:</label>
                <input
                  type="text"
                  id="address"
                  value={patientDetails.address}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, address: e.target.value })
                  }
                />
              </div>
            </td>
            <td>
              <div className="field">
                <ContactEmergencyIcon className="iconf"/>
                <label>{t('First Name')}:</label>
                <input
                  type="text"
                  id="first_name_emergency"
                  value={patientDetails.first_name_emergency}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, first_name_emergency: e.target.value })
                  }
                />
                <label> {t("Last Name")}:</label>
                <input
                  type="text"
                  id="last_name_emergency"
                  value={patientDetails.last_name_emergency}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, last_name_emergency: e.target.value })
                  }
                />
              </div>
            </td>
            <td>
              <div className="field">
                <BloodtypeIcon className="iconf"/>
                <label>{t("Blood Type")}:</label>
                <input
                  type="text"
                  id="blood_type"
                  value={patientDetails.blood_type}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, blood_type: e.target.value })
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td> <div className="field">
                <CalendarMonthIcon className="iconf"/>
                <label>DOB:</label>
                <input
                  type="date"
                  id="dob"
                  value={patientDetails.dob}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, dob: e.target.value })
                  }
                />
              </div></td>
            <td>
              <div className="field">
                <LocalPhoneIcon className="iconf"/>
                <label>{t("Phone")}:</label>
                <div className="phonepat">
                <PhoneInput
              placeholder={"Phone Number"}
              value={patientDetails.phone}
              name="phone"
             onChange={handlePhoneChange}
          /></div>
              </div>
            </td>
            <td><div className="field">
                <LocalPhoneIcon className="iconf"/>
                <label> {t("Phone")}:</label>
                <div className="phonepat">
                <PhoneInput
              placeholder={"Phone Number"}
              value={patientDetails.phone_emergency}
              name="phone_emergency"
             onChange={handlePhoneEmergencyChange}
          /></div>
              </div></td>
            <td>
              <div className="field">
                <MonitorWeightIcon className="iconf"/>
                <label>{t("Weight")}:</label>
                <input
                  type="text"
                  id="weight"
                  value={patientDetails.weight}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, weight: e.target.value })
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="field">
                <WcIcon className="iconf"/>
                <label>{t("Gender")}:</label>
                <div>
                  <label>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    checked={patientDetails.gender === "Male"}
                    onChange={(e) =>
                      setPatientDetails({ ...patientDetails, gender: e.target.value })
                    }
                  />
                  {t('Male')}</label>
                </div>
                <div>
                <label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    checked={patientDetails.gender === "Female"}
                    onChange={(e) =>
                      setPatientDetails({ ...patientDetails, gender: e.target.value })
                    }
                  />
                 {t('Female')}</label>
                </div>
              </div>
            </td>
            <td>
              <div className="field">
                <EmailIcon className="iconf"/>
                <label>{t('Email')}:</label>
                <input
                  type="email"
                  id="email"
                  value={patientDetails.email}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, email: e.target.value })
                  }
                />
              </div>
            </td>
            <td>
              <div className="field">
                <PeopleIcon className="iconf"/>
                <label>{t("Relation")}:</label>
                <input
                  type="text"
                  id="relation_emergency"
                  value={patientDetails.relation_emergency}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, relation_emergency: e.target.value })
                  }
                />
              </div>
            </td>
            <td>
              <div className="field">
                <HeightIcon className="iconf"/>
                <label>{t("Height")}:</label>
                <input
                  type="text"
                  id="height"
                  value={patientDetails.height}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, height: e.target.value })
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
            <div className="field">
               <ContactEmergencyIcon className="iconf"/>
               <label>{t('First Name')}:</label>
               <input
                 type="text"
                 id="first_name"
                 value={patientDetails.first_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, first_name: e.target.value })
                 }
               />
               <label>{t('Middle Name')}:</label>
               <input
                 type="text"
                 id="middle_name"
                 value={patientDetails.middle_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, middle_name: e.target.value })
                 }
               />
               <label> {t("Last Name")}:</label>
               <input
                 type="text"
                 id="last_name"
                 value={patientDetails.last_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, last_name: e.target.value })
                 }
               />
             </div></td>
             <td></td><td></td><td></td>
          </tr>
         
       
        </tbody>
  </table>
                   ):(
                    <div>
<table>
    <thead>
      <tr>
      <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        
       
      </tr>
    </thead>
    <tbody>
          <tr>
            <td>
              <div className="field">
                <CreditCardIcon className="iconf"/>
                <p><strong>SSN:</strong></p>
                <input
                  type="text"
                  id="ssn"
                  value={patientDetails.ssn}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, ssn: e.target.value })
                  }
                />
              </div>
            </td>
            
           
          </tr>
          <tr>
            <td> <div className="field">
                <CalendarMonthIcon className="iconf"/>
                <label>DOB:</label>
                <input
                  type="date"
                  id="dob"
                  value={patientDetails.dob}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, dob: e.target.value })
                  }
                />
              </div></td>
           
           
          </tr>
          <tr>
            <td>
              <div className="field">
                <WcIcon className="iconf"/>
                <label>{t("Gender")}:</label>
                <div>
                  <label>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    checked={patientDetails.gender === "Male"}
                    onChange={(e) =>
                      setPatientDetails({ ...patientDetails, gender: e.target.value })
                    }
                  />
                  {t('Male')}</label>
                </div>
                <div>
                <label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    checked={patientDetails.gender === "Female"}
                    onChange={(e) =>
                      setPatientDetails({ ...patientDetails, gender: e.target.value })
                    }
                  />
                 {t('Female')}</label>
                </div>
              </div>
            </td>
           
           
          </tr>
          <tr>
            <td>
            <div className="field">
               <ContactEmergencyIcon className="iconf"/>
               <label>{t('First Name')}:</label>
               <input
                 type="text"
                 id="first_name"
                 value={patientDetails.first_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, first_name: e.target.value })
                 }
               />
               <label>{t('Middle Name')}:</label>
               <input
                 type="text"
                 id="middle_name"
                 value={patientDetails.middle_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, middle_name: e.target.value })
                 }
               />
               <label> {t("Last Name")}:</label>
               <input
                 type="text"
                 id="last_name"
                 value={patientDetails.last_name}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, last_name: e.target.value })
                 }
               />
             </div>
            </td>
          </tr>
         
       
        </tbody>
  </table>
  <table>
    <thead>
      <tr>
      
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
       
      </tr>
    </thead>
    <tbody>
          <tr>
            
            <td>
              <div className="field">
                <HomeIcon className="iconf"/>
                <label>{t("Address")}:</label>
                <input
                  type="text"
                  id="address"
                  value={patientDetails.address}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, address: e.target.value })
                  }
                />
              </div>
            </td>
           
          </tr>
          <tr>
            
            <td>
              <div className="field">
                <LocalPhoneIcon className="iconf"/>
                <label>{t("Phone")}:</label>
                <PhoneInput
              placeholder={"Phone Number"}
              value={patientDetails.phone}
              name="phone"
             onChange={handlePhoneChange}
          />
              </div>
            </td>
           
          </tr>
          <tr>
            
            <td>
              <div className="field">
                <EmailIcon className="iconf"/>
                <label>{t('Email')}:</label>
                <input
                  type="email"
                  id="email"
                  value={patientDetails.email}
                  onChange={(e) =>
                    setPatientDetails({ ...patientDetails, email: e.target.value })
                  }
                />
              </div>
            </td>
           
          </tr>
          
         
       
        </tbody>
  </table>
   <table>
   <thead>
     <tr>
     
       <th style={{ textAlign: 'left' }}><h2 className="title">{t("Emergency Contact")}:</h2></th>
       
     </tr>
   </thead>
   <tbody>
         <tr>
         
           <td>
             <div className="field">
               <ContactEmergencyIcon className="iconf"/>
               <label>{t('First Name')}:</label>
               <input
                 type="text"
                 id="first_name_emergency"
                 value={patientDetails.first_name_emergency}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, first_name_emergency: e.target.value })
                 }
               />
               <label> {t("Last Name")}:</label>
               <input
                 type="text"
                 id="last_name_emergency"
                 value={patientDetails.last_name_emergency}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, last_name_emergency: e.target.value })
                 }
               />
             </div>
           </td>
           
         </tr>
         <tr>
          
           <td><div className="field">
               <LocalPhoneIcon className="iconf"/>
               <label> {t("Phone")}:</label>
             
               <PhoneInput
              placeholder={"Phone Number"}
              value={patientDetails.phone_emergency}
              name="phone_emergency"
             onChange={handlePhoneEmergencyChange}
          />
             </div></td>
          
         </tr>
         <tr>
          
           <td>
             <div className="field">
               <PeopleIcon className="iconf"/>
               <label>{t("Relation")}:</label>
               <input
                 type="text"
                 id="relation_emergency"
                 value={patientDetails.relation_emergency}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, relation_emergency: e.target.value })
                 }
               />
             </div>
           </td>
          
         </tr>
         
        
      
       </tbody>
 </table>
 <table>
   <thead>
     <tr>
     
       
       <th style={{ textAlign: 'left' }}><h2 className="title">{t("Medical Information")}:</h2></th>
     </tr>
   </thead>
   <tbody>
         <tr>
         
           <td>
             <div className="field">
               <BloodtypeIcon className="iconf"/>
               <label>{t("Blood Type")}:</label>
               <input
                 type="text"
                 id="blood_type"
                 value={patientDetails.blood_type}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, blood_type: e.target.value })
                 }
               />
             </div>
           </td>
         </tr>
         <tr>
          
           <td>
             <div className="field">
               <MonitorWeightIcon className="iconf"/>
               <label>{t("Weight")}:</label>
               <input
                 type="text"
                 id="weight"
                 value={patientDetails.weight}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, weight: e.target.value })
                 }
               />
             </div>
           </td>
         </tr>
         <tr>
          
           
           <td>
             <div className="field">
               <HeightIcon className="iconf"/>
               <label>{t("Height")}:</label>
               <input
                 type="text"
                 id="height"
                 value={patientDetails.height}
                 onChange={(e) =>
                   setPatientDetails({ ...patientDetails, height: e.target.value })
                 }
               />
             </div>
           </td>
         </tr>
         
        
      
       </tbody>
 </table></div>
                   )}
              
</div>
                    <br/>
                  </>
                )}
                <br/>
                {isEditMode ? (
                   <div className="editbutto">
                   <button className="save-butt" onClick={handleSaveClick}>{t("Save")}</button>&nbsp;&nbsp;
                   <button className="save-butt" onClick={handleCancelClick}>{t("Cancel")}</button>
                 </div>) : (  <button className="edit-button" onClick={handleEditClick}>{t("Edit")}</button>
                )}
              </div>
            )}
             <Dialog
  open={deleteConfirmationOpen}
  onClose={handleCancelDelete}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{t('Delete patient')}?</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to delete this patient?
    </DialogContentText>
    {patientToDelete}
  </DialogContent>
  <DialogActions>
    <button onClick={handleCancelDelete}>{t("Cancel")}</button>
    <button onClick={handleConfirmDelete} color="error">
      {t("Delete")}
    </button>
  </DialogActions>
</Dialog>

            {activeTab === "EMR"&& userRole !== "Secretary" && (
              <div className="emr-tab">
                <div className="tab-container">
                  <div className="tab">{t('Electronic Medical Record')}</div>
                  
                </div>
                <EMR selectedPatientId={selectedPatientId}/>
                
              </div>
            )}
          {activeTab === "socialMediaAccounts" && (
  <div className="social-media-tab">
    <div className="tab-container">
      <div className="tab">{t('Social Media Accounts')}</div>
    </div>
    <div className="container1">
    {socialMediaAccounts
  .filter((account) => account.patient == selectedPatientId)
  .map((account, index) => {
    let platform = socialMediaPlatforms.find((p) => p.id_social === account.social);
    return (
      <div key={index} className="social-media-account">
       <div className="plat">
    {platform ? (
      <span className="icon-container">
        {getPlatformIcon(platform.platform)}
        <span className="username">
          {editedSocialMediaAccount?.id === account.id ? (
            <input
              className="custom-inputss"
              type="text"
              value={editedSocialMediaAccount.username}
              onChange={(e) => {
                setEditedSocialMediaAccount({
                  ...editedSocialMediaAccount,
                  username: e.target.value,
                });
              }}
            />
          ) : (
            account.username
          )}
        </span>
        <span className="icons">
          {editedSocialMediaAccount?.id === account.id ? (
           <div className="button-container">
           <button className="save-butt-soc" onClick={handleSaveSocialMediaAccount}>{t("Save")}</button>
           <button className="save-butt-soc" onClick={handleCancelSocialMediaAccountEdit}>{t("Cancel")}</button>
         </div>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faEdit}
                className="iconedit-icon"
                onClick={() => handleEditSocialMediaAccount(account)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="iconremove-icon"
                onClick={() => handleRemoveSocialMediaAccount(index)}
              />
            </>
          )}
        </span>
      </span>
    ) : (
      'Platform Not Specified'
    )}
  </div>
</div>
    );
  })}
{/* Add New Account fields */}
 
{isAddingSocialMediaAccount && (<div>
  <div className="addsocialdiv">
    <div className="fields">
      <select className="custonfield"
        id="social"
        value={newSocialMediaAccount.social}
        onChange={(e) =>
          setNewSocialMediaAccount({
            ...newSocialMediaAccount,
            social: e.target.value,
          })
        }
      >
        <option value="">Select a platforms</option>
        {socialMediaPlatforms.map((platform) => (
          <option
            key={platform.id_social}
            className="custonfield"
            value={platform.platform}
          >
            {platform.platform}
          </option>
        ))}
      </select>
    </div>
  
    <div className="custom-input">
     
      <input
        type="text"
      placeholder="Username"
        id="username"
        value={newSocialMediaAccount.username}
        onChange={(e) =>
          setNewSocialMediaAccount({
            ...newSocialMediaAccount,
            username: e.target.value,
          })
        }
      />
    </div>
    </div>
     <div className="button-container">
    <button className="save-butt-soc" onClick={handleSaveAddSocialMediaAccount}>{t("Save")}</button>
    <button className="save-butt-soc" onClick={handleCancelSocialMediaAccountAdd}>{t("Cancel")}</button>
  </div></div>
)} <br/>
<br/>
{/* Add Social Media Account button */}
 
{!isAddingSocialMediaAccount && (
  <button className="save-button" onClick={handleAddSocialMediaAccount}>
    {t('Add Social Media Account')}
  </button>
)} 
  </div></div>
)}

          </>
        ) : null}
      </div>
    </div>
  );
};

export default ContactDetails;
