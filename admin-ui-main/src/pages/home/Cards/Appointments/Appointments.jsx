import React, { useEffect, useState } from "react";
import axios from "axios";
import './appointments.scss';
import { today_app, see_all } from '../../../../config/constants';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../../../config/config";
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
const Appointments = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [visibleAppointments, setVisibleAppointments] = useState([]); // Number of appointments to display
  const [clinics, setClinics] = useState([]); // State to store clinics data

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

  const [platforms, setPlatform] = useState([]);
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
      try {
        const response = await axios.get(`${API_BASE_URL}/appointment/`);
        const today = new Date().toLocaleDateString();
        const filteredAppointments = response.data.filter((appointment) => {
          const start_date = new Date(appointment.startdate).toLocaleDateString();
          return start_date === today;
        });
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
  
    // Fetch appointments immediately when the component mounts
    fetchAppointments();
  
    // Set up an interval to fetch appointments every 5 minutes
    const appointmentsTimer = setInterval(fetchAppointments, 300000); // 5 minutes in milliseconds
  
    // Clear the timer when the component unmounts
    return () => {
      clearInterval(appointmentsTimer);
    };
  }, []);
  

  const sortAppointmentsByStartTime = (appointments) => {
    return appointments.sort((a, b) => {
      const startTimeA = new Date(a.startdate).getTime();
      const startTimeB = new Date(b.startdate).getTime();
      return startTimeA - startTimeB;
    });
  };

  // Call the sorting function before rendering appointments
  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  // Function to extract and format the time from ISO date
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials;
  };

  return (
    <div className="appointments">
      <div className="top1">
        <p className="title">{t('Today Appointments')}</p>
      </div>
      <div className="todaysappoits">
        <ul className="list-of-patients">
          {sortedAppointments.map((appointment) => {
            const patient = patients.find((p) => p.id === appointment.patient);
             // Get the clinic name based on the clinic ID from the clinics data
             const clinicData = clinics.find((clinic) => clinic.id === appointment.clinic);
             const platformData = platforms.find((platform) => platform.id === appointment.online);
            const platformName = platformData ? platformData.platform : "Unknown";
             const clinicName = clinicData ? clinicData.name : platformName ;
             
            return (
              <li key={appointment.idappointment}>
                <div className="initi">
                  {getInitials(patient ? `${patient.first_name} ${patient.last_name}` : " ")}
                </div>
                <div className="patientname">
                  {patient ? `${patient.full_name_phone}` : `${appointment.title}`}
                  <div className="clinic">{`  ${clinicName}`}</div>
                </div>
                <div className="start-time">
                  {`${formatTime(appointment.startdate)} - ${formatTime(appointment.end_date)}`}
                </div>
              </li>
            );
          })}
        </ul>
        
      </div>
    </div>
  );
};

export default Appointments;