
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./contacts.scss";
import DoctorList from "../../components/Doctor/DoctorList";
import ContactDetailsDoctor from "../../components/Doctor/ContactDetailsDoctor";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/Sidebar/SideBar";
import NewDoctor from "../../components/new-doctor/NewDoctor";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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
const ContactsDoctors = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false); // New state variable
  const [doctors, setDoctors] = useState([]);
  const handleDoctorClick = (doctor) => {
    setSelectedContact(doctor);
    setIsLeftColumnCollapsed(true);
  };
  const toggleLeftColumn = () => {
    setIsLeftColumnCollapsed(!isLeftColumnCollapsed);
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const updateDoctorList = () => {
    axios
      .get(`${API_BASE_URL}/referraldoctors/`)
      .then((response) => {
        setDoctors(response.data)
        setIsLeftColumnCollapsed(false);
      })
      .catch((error) => {
        console.error("Error fetching updated doctor list:", error);
      });
  };
  const editDoctorList = () => {
    axios
      .get(`${API_BASE_URL}/referraldoctors/`)
      .then((response) => {
        setDoctors(response.data)
        setIsLeftColumnCollapsed(true);
      })
      .catch((error) => {
        console.error("Error fetching updated doctor list:", error);
      });
  };
  useEffect(() => {
    // Fetch patient data from your Django backend endpoint
    axios
      .get(`${API_BASE_URL}/referraldoctors/`)
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
      });
  }, []);
  return (
    <div className="contacts">
      <div className="side">
        <SideBar />
      </div>
      <div className="nav">
        <NavBar />
      </div>
      <div className="top">
        <div className="row">
          <div className="navigation">
            <div
              className="patient-box"
              
              onClick={() => navigate("/contactspatients")}
            >
              <h2>{t("Patients")}</h2>
            </div>
            <div
              className="doctor-box"
              style={{ background: "#004957", color: "white" }}
            >
              <h2>{t("Doctors")}</h2>
            </div>
          </div>
          <button className="new-contact-btn" onClick={openPopup}>
            + {t("Add New Contact")}
          </button>
        </div>
      </div>
      <div className="table">
      {window.innerWidth < 850 ? (
          // If the screen width is less than 850px, display a single column
          isLeftColumnCollapsed ? (
            <div className="contact-container">
              <button
                className={`open-button ${isLeftColumnCollapsed ? "hidden" : ""}`}
                onClick={toggleLeftColumn}
              >
                Open Doctor List
              </button>
              <ContactDetailsDoctor
              selecteddoctorId={selectedContact ? selectedContact.idreferral_doctors : null}
              updateDoctorList={updateDoctorList} 
              editDoctorList={editDoctorList}
            />
            </div>
          ) : (
            <div className="contact-container">
              <DoctorList onDoctorClick={handleDoctorClick} doctors={doctors} />
            </div>
          )
        ) : (
          // If the screen width is 850px or greater, display two columns
          <div className={`table ${isLeftColumnCollapsed ? "collapsed" : ""}`}>
          <div className="left-column">
            <DoctorList onDoctorClick={handleDoctorClick} doctors={doctors} />
          </div>
          <div className="right-column">
          <div className="contact-details-container">
            {isLeftColumnCollapsed && selectedContact && (
              <button className={`open-button ${isLeftColumnCollapsed ? "hidden" : ""}`} onClick={toggleLeftColumn}>
  Open Doctor List
</button>
            )}
            <ContactDetailsDoctor
              selecteddoctorId={selectedContact ? selectedContact.idreferral_doctors : null}
              updateDoctorList={updateDoctorList} 
              editDoctorList={editDoctorList}
            /> </div>
            </div>
        </div>
          )}
      </div>
      <NewDoctor isOpen={isPopupOpen} onClose={closePopup} updateDoctorList={updateDoctorList}/>
    </div>
  );
};

export default ContactsDoctors;
