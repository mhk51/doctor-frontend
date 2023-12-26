import React, {useState, useEffect} from "react";
import axios from "axios";  // Import Axios
import "./sidebar.scss";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import {
  CalendarBlank,
  ChartPieSlice,
  ChatCircle,
  CreditCard,
  DiscordLogo,
  Gear,
  House,
  Megaphone,
  Users,
  WhatsappLogo,
  Pulse,
} from "@phosphor-icons/react";
import { FileText,Bell } from "react-feather";
import {
  analytics,
  billing,
  chat_gpt,
  contact,
  home,
  marketing,
  messages,
  name_title,
  patient_updates,
  schedule,
  settings,
} from "../../config/constants";
import API_BASE_URL from "../../config/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
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
const SideBar = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const token = localStorage.getItem('token');
  console.log("token", token);
  const [user, setUser] = useState(null);
  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await axios.get(`${API_BASE_URL}/users/`, config)

        const userData = response.data;
        console.log("userdata", userData);
        setUser(userData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []); // The empty dependency array ensures this runs only once when the component is mounted.

  const sideBarItems = [
    
    {

     
      icon: <House size={28} className="iconnn" />,
      name:t('Home'),
      path: "/"
    },
    {
      icon: <CalendarBlank size={28} className="iconnn" />,
      name:t('Schedule') ,
      path: "/schedule"
    },
    {
      icon: <Users size={28} className="iconnn" />,
      name:t('Contacts') ,
      path:"/contactspatients"
    },
    {
      icon: <WhatsappLogo size={28} className="iconnn" />,
      name: t('WhatsApp'),
      path: "/chatApp",
    },
    {
      icon: <ChatCircle size={28} className="iconnn" />,
      name: t('Messages'),
     path:"/message"
    },

 
    {
      icon: <FileText size={28} className="iconnn" />,
      name: t('Patient Updates'),
      path:"/patientUpdates",
    },
    {
      icon: <Bell size={28} className="iconnn" />,
      name: t('Health Reminders'),
      path:"/healthReminders",
    },
    {
      icon: <DiscordLogo size={28} className="iconnn" />,
      name: chat_gpt,
      path:"/ChatGPT"
    },
    {
      icon: <CreditCard size={28} className="iconnn" />,
      name: t('Billing'),
      path:"/billing"
    },
    {
      icon: <Pulse size={28} className="iconnn" />,
      name: 'Remote Monitoring',
    },
    {
      icon: <ChartPieSlice size={28} className="iconnn" />,
      name: t('Analytics'),
    },
    {
      icon: <Megaphone size={28} className="iconnn" />,
      name:t('Marketing'),

    },
   
    {

      icon: <Gear size={28} className="iconnn" />,
      name: t('Settings'),

      path:"/settings"
    },
  ];
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">
        {user ? `${user.first_name} ${user.last_name}` : name_title}</span>
      </div>

      <div className="center">
      <ul>
          {sideBarItems.map((item, index) => (
            <li key={index}>
              {item.path ? (
                <Link to={item.path} className="sidebar-link">
                  <div className="icon-side">{item.icon}</div>
                  <span className="icon-name">{item.name}</span>
                </Link>
              ) : (
                <div className="disabled-link">
                  <div className="icon-side">{item.icon}</div>
                  <span className="icon-name">{item.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
     
    </div>
  );
};

export default SideBar;