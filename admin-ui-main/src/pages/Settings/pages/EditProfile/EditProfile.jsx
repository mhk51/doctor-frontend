import React, { useState ,useEffect} from "react";
import "./editprofile.scss";
import SideBar from "../../../../components/Sidebar/SideBar";
import NavBar from "../../../../components/NavBar/NavBar";
import DropDown from "../../../../components/widgets/DropDown/DropDown";
import Clinic from "./components/Clinic";
import Platform from "./components/Platform";
import Appointment from "./components/appointment";
import Gpt from "./components/Gpt";
import PersonalInfo from "./components/Info";
import MainPage from "./components/MainPage";
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

const EditProfile = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [activeComponent, setActiveComponent] = useState("ComponentA");

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="profile">
      <div className="side-profile">
      <SideBar /></div>
      <div className="nav-profile"><NavBar /></div>
      <div className="profile-container">
        

        <div className="box">
          <div className="side-bar">
            <h2>{t('Edit Your Profile')}</h2>
            <ul
              style={{
                listStyle: "none",
                paddingLeft: "0px",
                marginTop: "2rem",
              }}
            >
              <li
                className={
                  activeComponent === "ComponentA"
                    ? "bold-item"
                    : "non-bold-item"
                }
                onClick={() => handleButtonClick("ComponentA")}
              >
                {t("Information")}
              </li>
                <li
                  className={
                    activeComponent === "ComponentB"
                      ? "bold-item"
                      : "non-bold-item"
                  }
                  onClick={() => handleButtonClick("ComponentB")}
                >
                  {t("Clinic Details")}
                </li>
                <li
                  className={
                    activeComponent === "ComponentD"
                      ? "bold-item"
                      : "non-bold-item"
                  }

                  onClick={() => handleButtonClick("ComponentD")}

                >
                  {t("Platform Details")}
                </li>
                <li
                  className={
                    activeComponent === "ComponentE"
                      ? "bold-item"
                      : "non-bold-item"
                  }
                  onClick={() => handleButtonClick("ComponentE")}
                >
                  {t("Appointment Details")}
                </li>
                <li
                  className={
                    activeComponent === "ComponentC"
                      ? "bold-item"
                      : "non-bold-item"
                  }
                  onClick={() => handleButtonClick("ComponentC")}
                >
                  ChatGPT {t("Key")}
                </li>
              
              </ul>
            </div>
            <div className="right-side">
              <div className="content">
                {activeComponent === "ComponentA" && <MainPage />}
                {activeComponent === "ComponentB" && <Clinic />}
                {activeComponent === "ComponentC" && <Gpt />}
                {activeComponent === "ComponentD" && <Platform />}
                {activeComponent === "ComponentE" && <Appointment />}
              </div>

            </div>
          </div>
        </div>
      </div>

  );
};

export default EditProfile;
