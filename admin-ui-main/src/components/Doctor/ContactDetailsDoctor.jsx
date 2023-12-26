import React, { useEffect, useState } from "react";
import axios from "axios";
import "./contactdoctor.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import DeleteIcon from "@mui/icons-material/Delete"; 
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate, useParams } from "react-router-dom";
import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import PhoneInput from "react-phone-number-input";
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
const ContactDetailsDoctor = ({ selecteddoctorId , updateDoctorList, editDoctorList}) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const [patientList, setpatientList] = useState([]);
  
  const handleCancelClick = () => {
    
    setIsEditMode(false);
    if ( doctorDetails.phone && doctorDetails.phone.startsWith('+')) {
      // Add '+' before the phone number
      setDoctorDetails({
        ...doctorDetails,
        phone: doctorDetails.phone.replace('+', ''),
      });
    }
  };

  useEffect(() => {
    if (selecteddoctorId) {
      // Fetch doctor details
      axios
        .get(`${API_BASE_URL}/referraldoctors/${selecteddoctorId}/`)
        .then((response) => {
          setDoctorDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching doctor details:", error);
          setDoctorDetails(null);
        });
    }
  }, [selecteddoctorId]);

  const handleSaveClick = () => {
    // Rest of your code to update patient details
   
      const updateddoctorData = {
        first_name:doctorDetails.first_name,
        middle_name :doctorDetails.middle_name,
        last_name :doctorDetails.last_name,
        speciality:doctorDetails.speciality,
      email: doctorDetails.email,
    
      phone:doctorDetails.phone && (doctorDetails.phone = doctorDetails.phone.replace('+', '')),
      sub_speciality: doctorDetails.sub_speciality,
       
      };
  
    axios
      .put(`${API_BASE_URL}/referraldoctors/${selecteddoctorId}/`, updateddoctorData)
      .then((response) => {
        setIsEditMode(false);
        setDoctorDetails(response.data);
        editDoctorList();
      })
      .catch((error) => {
        console.error("Error updating doctor data:", error);
      });
  };

  

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    if ( doctorDetails.phone && !doctorDetails.phone.startsWith('+')) {
      // Add '+' before the phone number
      setDoctorDetails({
        ...doctorDetails,
        phone: `+${doctorDetails.phone}`,
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
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const handleOpenDeleteDialog = (doctorId) => {
    setDoctorToDelete(doctorId);
    setDeleteConfirmationOpen(true);
  };
  
  const handleCancelDelete = () => {
    setDoctorToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  const handlePhoneChange = (value) => {
    if (value){
   
  
    // Update the state for the phone input
    setDoctorDetails({

    ...doctorDetails,
      phone: value,
    });}
  };
  
  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      // Send a DELETE request to delete the patient
      
      axios
        .delete(`${API_BASE_URL}/referraldoctors/${doctorToDelete}/`)
        .then(() => {
          // Patient deleted successfully
          setDoctorToDelete(null);
          setDoctorDetails(null);
          setDeleteConfirmationOpen(false);
          updateDoctorList();
          navigate(`/contactsdoctors`);
          
        })
        .catch((error) => {
          console.error("Error deleting doctor:", error);
          // Handle the error appropriately (e.g., show an error message)
          setDoctorToDelete(null);
          setDeleteConfirmationOpen(false);
        });
    }
  };
  return (
    <div className="contact-Details-container">
  
      <div className="header">
        {doctorDetails ? (
          <>
            <div className="details-avatar">
              <div className="initials-Details">
                {getInitials(
                  `${doctorDetails.first_name} ${doctorDetails.last_name}`
                )}
              </div>
            </div>
            <div className="details">
              <div className="contact-initial">
                {`${doctorDetails.first_name} ${doctorDetails.last_name}`}
              </div>
              <div className="header-icons">
                
                 <DeleteIcon
                      
                      className={`icon`}
                      style={{ cursor: "pointer", 
                               
                    }}
                     onClick={() => handleOpenDeleteDialog(selecteddoctorId)}
                    />
              </div>
            </div>
          </>
        ) : (
          <div className="no-patient-selected">
            {t("Select a Doctor to view details")}.
          </div>
        )}
      </div>

      <div className="patient-details">
        {doctorDetails ? (
          <>
            {activeTab === "personalInfo" && (
              <div className="personal-info-tab">
                <div className="tab-container">
                  <div className="tab">{t("Personal Information")}</div>
                </div>
                
                {!isEditMode && (
                  <div className="container1">
                    {window.innerWidth > 850 ? (
                     <table>
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t('Speciality Information')}:</h2></th>
      </tr>
    </thead>
    <tbody>
    <tr>
        <td>
                    <div className="field">
                      <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t("First Name")}:</strong> {doctorDetails.first_name}</p></div>
                      </td>
                    <td>
                    <div className="field">
                    <LocalPhoneIcon className="iconz"/>
                      <p><strong>{t('Phone')}:</strong> {doctorDetails.phone}</p>
                    </div></td>
                    <td><div className="field">
                    <LocalHospitalOutlinedIcon className="iconz"/>
                      <p><strong>{t('Speciality')}:</strong> {doctorDetails.speciality}</p>
                    </div></td></tr>
                    <tr><td>
                    <div className="field">
                    <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t('Middle Name')}:</strong> {doctorDetails.middle_name}</p>
                    </div></td>
                    <td>
                    <div className="field">
                    <EmailIcon className="iconz"/>
                      <p><strong>{t('Email')}:</strong> {doctorDetails.email}</p>
                    </div></td>
                    <td> <div className="field">
                    <LocalHospitalOutlinedIcon className="iconz"/>
                      <p><strong>{t("Sub speciality")}:</strong> {doctorDetails.sub_speciality}</p>
                    </div></td></tr>
                    <tr><td>
                    <div className="field">
                    <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t("Last Name")}:</strong> {doctorDetails.last_name}</p>
                    </div>
                    </td><td></td><td></td></tr>
                    </tbody>
  </table>
                     ) : (
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
                      <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t("First Name")}:</strong> {doctorDetails.first_name}</p></div>
                      </td>
                    </tr>
                    <tr><td>
                    <div className="field">
                    <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t('Middle Name')}:</strong> {doctorDetails.middle_name}</p>
                    </div></td>
                   </tr>
                    <tr><td>
                    <div className="field">
                    <PortraitOutlinedIcon className="iconz"/>
                      <p><strong>{t("Last Name")}:</strong> {doctorDetails.last_name}</p>
                    </div>
                    </td></tr>
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
                    <LocalPhoneIcon className="iconz"/>
                      <p><strong>{t('Phone')}:</strong> {doctorDetails.phone}</p>
                    </div></td>
                    </tr>
                    <tr>
                    <td>
                    <div className="field">
                    <EmailIcon className="iconz"/>
                      <p><strong>{t('Email')}:</strong> {doctorDetails.email}</p>
                    </div></td>
                  </tr>
                   
                    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        
        <th style={{ textAlign: 'left' }}><h2 className="title">{t('Speciality Information')}:</h2></th>
      </tr>
    </thead>
    <tbody>
    <tr>
   
                    <td><div className="field">
                    <LocalHospitalOutlinedIcon className="iconz"/>
                      <p><strong>{t('Speciality')}:</strong> {doctorDetails.speciality}</p>
                    </div></td></tr>
                    <tr>
                    <td> <div className="field">
                    <LocalHospitalOutlinedIcon className="iconz"/>
                      <p><strong>{t("Sub speciality")}:</strong> {doctorDetails.sub_speciality}</p>
                    </div></td></tr>
                    </tbody>
  </table> 
                  </div>
                  )}
                 </div>
                )}
               
              
  {isEditMode && (
    
    <div className="container1">
       {window.innerWidth > 850 ? (
  <table>
    <thead>
      <tr>
      <th style={{ textAlign: 'left' }}><h2 className="title"> {t("Personal Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Contact Information")}:</h2></th>
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Speciality Information")}:</h2></th>
      </tr>
    </thead>
    <tbody>
          <tr>
            <td>
            <div className="field">
        <PortraitOutlinedIcon className="iconz" />
      
      
        <p><strong>{t("First Name")}:</strong></p>
      
        <input
          type="text"
          id="first_name"
          value={doctorDetails.first_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, first_name: e.target.value })
          }
        />
        </div>
      </td>
      
      
      <td>
      <div className="field">
      <EmailIcon className="iconz" />
        <p><strong>{t('Email')}:</strong></p>
      
        <input
          type="email"
          id="email"
          value={doctorDetails.email}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, email: e.target.value })
          }
        /></div>
      </td>
      <td>
      <div className="field">
      <LocalHospitalOutlinedIcon className="iconz" />
        <p><strong>{t("Speciality")}:</strong></p>
     
      
        <input
          type="text"
          id="Speciality"
          value={doctorDetails.speciality}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, speciality: e.target.value })
          }
        /></div>
      </td>
    </tr>

    <tr>
    
        
      
      <td>
      <div className="field">
      <PortraitOutlinedIcon className="iconz" />
        <p><strong>{t('Middle Name')}:</strong></p>
    
     
        <input
          type="text"
          id="middle_name"
          value={doctorDetails.middle_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, middle_name: e.target.value })
          }
        /></div>
      </td>
     
      <td>
      <div className="field">
      <LocalPhoneIcon className="iconz" />
        <p><strong>{t('Phone')}:</strong></p>
        <PhoneInput
              placeholder={"Phone Number"}
              value={doctorDetails.phone}
              name="phone"
             onChange={handlePhoneChange}
          />
       </div>
      </td>
      
      
      <td>
      <div className="field">
      <LocalHospitalOutlinedIcon className="iconz" />
        <p><strong>{t("Sub speciality")}:</strong></p>
      
        <input
          type="text"
          id="Sub_speciality"
          value={doctorDetails.sub_speciality}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, sub_speciality: e.target.value })
          }
        /></div>
      </td>
    </tr>

    <tr>
      
        
      
      <td> <div className="field">
      <PortraitOutlinedIcon className="iconz" />
        <p><strong>{t("Last Name")}:</strong></p>
     
        <input
          type="text"
          id="last_name"
          value={doctorDetails.last_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, last_name: e.target.value })
          }
        /></div>
      </td>
      <td></td><td></td>
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
        <PortraitOutlinedIcon className="iconz" />
      
      
        <p><strong>{t("First Name")}:</strong></p>
      
        <input
          type="text"
          id="first_name"
          value={doctorDetails.first_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, first_name: e.target.value })
          }
        />
        </div>
      </td>
      
      
      
    </tr>

    <tr>
    
        
      
      <td>
      <div className="field">
      <PortraitOutlinedIcon className="iconz" />
        <p><strong>{t('Middle Name')}:</strong></p>
    
     
        <input
          type="text"
          id="middle_name"
          value={doctorDetails.middle_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, middle_name: e.target.value })
          }
        /></div>
      </td>
     
     
    </tr>

    <tr>
      
        
      
      <td> <div className="field">
      <PortraitOutlinedIcon className="iconz" />
        <p><strong>{t("Last Name")}:</strong></p>
     
        <input
          type="text"
          id="last_name"
          value={doctorDetails.last_name}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, last_name: e.target.value })
          }
        /></div>
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
      <EmailIcon className="iconz" />
        <p><strong>{t('Email')}:</strong></p>
      
        <input
          type="email"
          id="email"
          value={doctorDetails.email}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, email: e.target.value })
          }
        /></div>
      </td>
     
    </tr>

    <tr>
   
     
      <td>
      <div className="field">
      <LocalPhoneIcon className="iconz" />
        <p><strong>{t('Phone')}:</strong></p>
     
        <PhoneInput
              placeholder={"Phone Number"}
              value={doctorDetails.phone}
              name="phone"
             onChange={handlePhoneChange}
          /></div>
      </td>
    
    </tr>

   

    
  </tbody>
</table>
<table>
    <thead>
      <tr>
     
        <th style={{ textAlign: 'left' }}><h2 className="title">{t("Speciality Information")}:</h2></th>
      </tr>
    </thead>
    <tbody>
          <tr>
          
      <td>
      <div className="field">
      <LocalHospitalOutlinedIcon className="iconz" />
        <p><strong>{t("Speciality")}:</strong></p>
     
      
        <input
          type="text"
          id="Speciality"
          value={doctorDetails.speciality}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, speciality: e.target.value })
          }
        /></div>
      </td>
    </tr>

    <tr>
    
        
      
     
      
      
      <td>
      <div className="field">
      <LocalHospitalOutlinedIcon className="iconz" />
        <p><strong>{t("Sub speciality")}:</strong></p>
      
        <input
          type="text"
          id="Sub_speciality"
          value={doctorDetails.sub_speciality}
          onChange={(e) =>
            setDoctorDetails({ ...doctorDetails, sub_speciality: e.target.value })
          }
        /></div>
      </td>
    </tr>

    
  </tbody>
</table>
    </div>
  )}
</div>
                   )}
<br/><br/>
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
  <DialogTitle id="alert-dialog-title">Delete doctor?</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to delete this doctor?
    </DialogContentText>
    {doctorToDelete}
  </DialogContent>
  <DialogActions>
    <button onClick={handleCancelDelete}>{t("Cancel")}</button>
    <button onClick={handleConfirmDelete} color="error">
      {t("Delete")}
    </button>
  </DialogActions>
</Dialog>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ContactDetailsDoctor;
