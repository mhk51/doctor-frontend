import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './patientinfo.scss';
import { current } from '../../../../config/constants';
import Referral from"../../../../components/Referral/Referral";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from '../../../../config/config';
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
const PatientInfo = ({ appointmentTime }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isPopupOpenreff, setIsPopupOpenreff] = useState(false);
  const openPopupref = () => {
    setIsPopupOpenreff(true);
  };

  const closePopupref = () => {
    setIsPopupOpenreff(false);
  };
  const [selectedPatientIDEMR, setSelectedPatientId] = useState(null);

  const navigate = useNavigate();
  // Function to handle the "Access EMR" button click
  const handleAccessEMR = (patient) => {
    if (patient) {
      navigate(`/contactspatients/${patient}`);
    }
  };
  const handlereferral = (patient) => {
    if (patient) {
      setSelectedPatientId(patient);
      openPopupref();
    }
  };
  const [clinics, setClinics] = useState([]); // State to store clinics data
  const [platforms, setPlatform] = useState([]);
  const [procedure, setProcedure]=useState([]);
  useEffect(() => {
    // Fetch procedure data to map procedure IDs to procedure names
    axios
      .get(`${API_BASE_URL}/procedure-instruction/`) 
      .then((response) => {
        const procedureData = response.data;
        setProcedure(procedureData);
      })
      .catch((error) => {
        console.error("Error fetching procedure data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch clinics data to map clinic IDs to clinic names
    axios
      .get(`${API_BASE_URL}/clinic/`) 
      .then((response) => {
        const clinicsData = response.data;
        setClinics(clinicsData);
      })
      .catch((error) => {
        console.error("Error fetching clinics data:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch clinics data to map clinic IDs to clinic names
    axios
      .get(`${API_BASE_URL}/virtualmeet/`) 
      .then((response) => {
        const platformData = response.data;
        setPlatform(platformData);
      })
      .catch((error) => {
        console.error("Error fetching platforms data:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        setPatients(response.data);
      
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
      });
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
    axios.get(`${API_BASE_URL}/appointment/`)
      .then((response) => {
        const today = new Date().toISOString();
        console.log("today",today);
        const filteredAppointments = response.data.filter((appointment) => {
          const start_date = appointment.startdate;
          const end_date = appointment.end_date ;
console.log("start",start_date);
console.log("end",end_date);
         console.log("start",start_date >= today );
         console.log("end", end_date  <= today)
         return today>=appointment .startdate && today<=appointment.end_date;

        });
        console.log("Filtered Appointmentsbb:", filteredAppointments); 
        setAppointments(filteredAppointments);
        
       
      })
      .catch((error) => {
        console.error("Error fetching appointment data:", error);
      });
    };
  
    // Fetch appointments immediately when the component mounts
    fetchAppointments();
  
    // Set up an interval to fetch appointments every 5 minutes
    const appointmentsTimer = setInterval(fetchAppointments, 300000); // 5 minutes in milliseconds
  
    // Clear the timer when the component unmounts
    return () => {
      clearInterval(appointmentsTimer);
    };
  }, [appointmentTime]);
  

   
 

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const formattedTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

   const fetchReferrals= async() =>{
      
        const response = await axios.get(
          `${API_BASE_URL}/patienthasreferraldoctors/?patient=${selectedPatientIDEMR}`
        )
        
    }

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials;
  };
 
  return (
    <div className="patient-info">
    <div className="top">
      <p className="titlecurrent">{t('Current Patient Info')}</p>
    </div>
    <div className="todaysappoitss">
      <ul className="list-of-patientss">
        {appointments.map((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patient);
          const clinicData = clinics.find((clinic) => clinic.id === appointment.clinic);
          const clinicName = clinicData ? clinicData.name : "Unknown";
          const platformData = platforms.find((platform) => platform.id === appointment.online);
          const platformName = platformData ? platformData.platform : "Unknown";
          const procedureData=procedure.find((procedure)=> procedure.id === appointment.type)
          const procedureName = procedureData ? procedureData.name : "Unknown";
          // Check if the patient is not null before rendering the appointment details
          if (patient) {
            return (
              <li className='list' key={appointment.idappointment}>
                <div  style={{
                
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                marginBottom:"1rem",

              }}>
                 <div className="patientnames">
                 <div className="init">
                  {getInitials(`${patient.first_name} ${patient.last_name}`)}
                </div>
                
                  <div className="ptient">{`${patient.first_name} ${patient.last_name}`}</div>
                  </div>
                   <div className="prof"> <button className='btnrefereds' onClick={() => handleAccessEMR(appointment.patient)}> Check Profile</button>
                   </div>
                   </div>
                <div className="info">
                  <div className="info-item">

                    <strong className="info-label">{t('Cheif Complaint')}</strong><div className="det">{` ${appointment.chief}`}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Procedure Type')}</strong><div className="det">{` ${procedureName}`}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Gender')}</strong><div className="det"> {patient.gender}
                  </div></div>

             
                  <div className="info-item">
                    <strong className="info-label">DOB</strong><div className="det">{patient.dob}
                  </div></div>
                  <div className="info-item">

                    <strong className="info-label">{t('Weight')}</strong><div className="det">{patient.weight}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Height')}</strong><div className="det">{patient.height}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Clinic')}</strong><div className="det">{`  ${clinicName}`}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Platform')}</strong><div className="det">{`  ${platformName}`}
                  </div></div>
                  <div className="info-item">
                    <strong className="info-label">{t('Contact Number')}</strong><div className="det">{patient.phone}
                  </div></div>

                </div>
                
                <div className='btnreffs'>
                  <button className='btnrefered' onClick={() => handlereferral(appointment.patient)}>{t('Refer To Another Doctor')} </button>
                </div>
                
              </li>
            );
          }
          // Return null for appointments with null patients
          return null;
        })}
      </ul>
      <Referral isOpen={isPopupOpenreff} onClose={closePopupref} selectedPatientId={selectedPatientIDEMR} fetchReferrals={fetchReferrals}/>
    </div>
  </div>
);
};

export default PatientInfo;