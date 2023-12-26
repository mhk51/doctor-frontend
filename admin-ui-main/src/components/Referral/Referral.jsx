import { X } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import "./referral.scss";
 
import API_BASE_URL from "../../config/config";
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
 
const Referral = ({ selectedPatientId, isOpen, onClose, fetchReferrals }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  console.log("pateit", selectedPatientId);
  const currentDate = new Date();
 
  const [newReferral, setNewReferral] = useState({
    reason: "",
    patient: selectedPatientId,
    date: currentDate.toISOString(),
   
  });
 
  const [ReferralSpeciality, setReferralSpeciality] = useState([]);
  const [ReferralSubSpeciality, setReferralSubSpeciality] = useState([]);
 
  // Ref to keep track of whether referral data has been fetched
  const ReferralDataFetched = useRef(false);
 
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedSubSpeciality, setSelectedSubSpeciality] = useState("");
 
  const findSelectedReferral = (selectedName) => {
    const [selectedFirstName, selectedMiddleName, selectedLastName] = selectedName.split(' ');
    // Find the selected referral object based on first_name and last_name
    return referralData.find((referral) => {
      return (
        referral.first_name === selectedFirstName &&
        referral.middle_name === selectedMiddleName &&
        referral.last_name === selectedLastName
      );
    });
  };
 
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
 
    if (name === "speciality") {
      // Update the selected speciality
      setSelectedSpeciality(value);
      console.log('spec', value);
    } else if (name === "sub_speciality") {
      // Update the selected sub-speciality
      setSelectedSubSpeciality(value);
      console.log('sub', value);
    } else if (name === "name") {
      console.log('name', value);
  
      // Set the selected doctor's ID directly
      if (!value) {
        // Set the referral_doctor to an empty string when cleared
        setNewReferral((prevState) => ({
          ...prevState,
          referral_doctor: "",
        }));
      } else if (value.idreferral_doctors) {
        // Set the selected doctor's ID directly
        setNewReferral((prevState) => ({
          ...prevState,
          referral_doctor: value.idreferral_doctors,
        }));
      } else {
        // Handle the case where value or its idreferral_doctors property is null
        console.error('Invalid value for referral doctor:', value);
      }
    } else if (name === "reason") {
      // Update the reason field
      setNewReferral((prevState) => ({
        ...prevState,
        reason: value,
      }));
    }
  };
    
 
  const saveReferral = () => {
    // Make an API request to save the referral data with the inputs state
    console.log("data", newReferral)
    newReferral.patient=selectedPatientId;
    console.log("data2", newReferral)
    Axios.post(`${API_BASE_URL}/patienthasreferraldoctors/`, newReferral)
      .then((response) => {
        console.log("Referral data saved successfully:", response.data);
        // Close the popup or perform other actions as needed
        fetchReferrals();
        onClose();
        setNewReferral({
          reason: "",
          patient: selectedPatientId,
          date: currentDate.toISOString(),
        });
        setSelectedSpeciality("");
        setSelectedSubSpeciality("");
      })
      .catch((error) => {
        console.error("Error saving referral data:", error);
      });
  };
 
  const [referralData, setReferralData] = useState([]);
 
  const fetchReferralData = () => {
    if (!ReferralDataFetched.current) {
      Axios.get(`${API_BASE_URL}/referraldoctors/`)
        .then((response) => {
          // Store the referral data in state
          setReferralData(response.data);
 
          // Extract unique specialities and subspecialities
          const specialitiesSet = new Set();
          const subspecialitiesSet = new Set();
         
          response.data.forEach((referral) => {                                                                                                    
            if (referral.speciality) {
              specialitiesSet.add(referral.speciality);
            }
            if (referral.sub_speciality) {
              subspecialitiesSet.add(referral.sub_speciality);
            }
          });
 
          // Convert sets to arrays
          const specialitiesArray = [...specialitiesSet];
          const subspecialitiesArray = [...subspecialitiesSet];
 
          // Set specialities and subspecialities
          setReferralSpeciality(specialitiesArray);
          setReferralSubSpeciality(subspecialitiesArray);
 
          ReferralDataFetched.current = true;
        })
        .catch((error) => {
          console.error("Error fetching referral data:", error);
        });
    }
  };
 
  useEffect(() => {
    fetchReferralData();
  }, []);
 
  // Filter doctors based on selected speciality and sub-speciality
  const filteredDoctors = referralData.filter((referral) => {
    const matchesSpeciality = !selectedSpeciality || referral.speciality === selectedSpeciality;
    const matchesSubSpeciality = !selectedSubSpeciality || referral.sub_speciality === selectedSubSpeciality;
 
    // Combine all conditions to filter the doctors
    return matchesSpeciality && matchesSubSpeciality;
  });
  const Close = () => {
    // Clear the form fields and close the popup
    setNewReferral({
      reason: "",
      patient: selectedPatientId,
      date: currentDate.toISOString(),
    });
    setSelectedSpeciality("");
    setSelectedSubSpeciality("");
    onClose();
  };
  // Extract doctor names from the filtered list
  console.log("filteredDoctors:", filteredDoctors);
  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="referrals">
      <div className="contentref">
        <div >

          <h2>{t("Refer to other doctor")}</h2>
          &nbsp;

        </div>
        
        <div className="center">
        
  <div className="choose-speciality">

    <h3>{t("Choose Speciality")}</h3>

    <Autocomplete
  id="speciality"
  options={ReferralSpeciality}
  value={selectedSpeciality}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "speciality", value: newValue } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Choose Speciality")} variant="outlined" />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  size='small'
/>&nbsp;
  </div>
  
  
  <div className="choose-subspeciality">

    <h3>{t("Choose Sub-Speciality")}</h3>
    

    <Autocomplete
  id="sub_speciality"
  options={ReferralSubSpeciality}
  value={selectedSubSpeciality}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "sub_speciality", value: newValue } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Choose Sub-Speciality")} variant="outlined" />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  size='small'
/>&nbsp;
  </div>
 
  

  
    <h3>{t("Choose Doctor")}</h3>

    <div className="choose-doctor">
    <Autocomplete
  id="name"
  options={filteredDoctors}
  value={newReferral.referral_doctor}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "name", value: newValue || ""  } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Choose Doctor")} variant="outlined" />}
  getOptionLabel={(doctor) => `${doctor.first_name} ${doctor.middle_name} ${doctor.last_name}`}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.first_name.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  size='small'
/>&nbsp;

    </div>
    
    <div className="reason-textarea">
  <h3>{t("Reason:")}</h3>
  <textarea
    name="reason"
    onChange={handleFieldChange}
    value={newReferral.reason}
    className="custom-textarea"
    rows="4"
    placeholder={t("Reason")}
  ></textarea>&nbsp;

  </div>
</div>
 
       
       
       
 
        <div>
        <div className="refsend">

          <button  className="closereff"onClick={saveReferral}>{t("Send")}</button>
          <button className="closereff" onClick={Close}>
          {t("close")} 

            </button>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};
 
export default Referral;