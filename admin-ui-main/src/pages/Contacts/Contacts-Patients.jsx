import React, { useEffect, useState } from "react";
import axios from "axios";
import "./contacts.scss";
import PatientList from "../../components/PatientTable/PatientList";
import ContactDetails from "../../components/PatientTable/ContactDetails";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/Sidebar/SideBar";
import NewPatient from "../../components/new-patient/NewPatient";
import { useNavigate, useParams } from "react-router-dom";
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
const ContactsPatients = () => {
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
  const { contactId } = useParams();
  const [patients, setPatients] = useState([]);

  const handlePatientClick = (patient) => {
    setSelectedContact(patient);
    console.log("patient", patient);
    setIsLeftColumnCollapsed(true);
    navigate(`/contactspatients/${patient.id}`);
  };
  useEffect(() => {
    // Check the URL parameter to determine if the left column should be collapsed
    if (contactId) {
      setIsLeftColumnCollapsed(true);
    }
  }, [contactId]);
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
  const updatePatientList = () => {
    axios
      .get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        setPatients(response.data);
        setIsLeftColumnCollapsed(false);
      })
      .catch((error) => {
        console.error("Error fetching updated patient list:", error);
      });
  };
  const editPatientList = () => {
    axios
      .get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        setPatients(response.data);
        setIsLeftColumnCollapsed(true);
      })
      .catch((error) => {
        console.error("Error fetching updated patient list:", error);
      });
  };
  useEffect(() => {
    // Fetch patient data from your Django backend endpoint
    axios
      .get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        setPatients(response.data);
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
              style={{ background: "#004957", color: "white" }}
            >
              <h2>{t("Patients")}</h2>
            </div>
            <div
              className="doctor-box"
              onClick={() => navigate("/contactsdoctors")}
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
                Open Patient List
              </button>
              <ContactDetails
                selectedPatientId={contactId || (selectedContact ? selectedContact.id : null)}
                updatePatientList={updatePatientList}
                editPatientList={editPatientList}
              />
            </div>
          ) : (
            <div className="contact-container">
              <PatientList onPatientClick={handlePatientClick} patients={patients} />
            </div>
          )
        ) : (
          // If the screen width is 850px or greater, display two columns
          <div className={`table ${isLeftColumnCollapsed ? "collapsed" : ""}`}>
            <div className="left-column">
              <PatientList onPatientClick={handlePatientClick} patients={patients} />
            </div>
            <div className="right-column">
              <div className="contact-details-container">
                {isLeftColumnCollapsed && (selectedContact || contactId) && (
                  <button
                    className={`open-button ${isLeftColumnCollapsed ? "hidden" : ""}`}
                    onClick={toggleLeftColumn}
                  >
                    Open Patient List
                  </button>
                )}
                <ContactDetails
                  selectedPatientId={contactId || (selectedContact ? selectedContact.id : null)}
                  updatePatientList={updatePatientList}
                  editPatientList={editPatientList}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <NewPatient isOpen={isPopupOpen} onClose={closePopup} updatePatientList={updatePatientList} />
    </div>
  );
};

export default ContactsPatients;
