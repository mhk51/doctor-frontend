import React,{useEffect} from "react";
import "./settings.scss";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import { useNavigate } from "react-router-dom";
import {
  ArrowsClockwise,
  BellSimple,
  CaretRight,
  Info,
  MagnifyingGlass,
  Translate,
  User,
} from "@phosphor-icons/react";
import { Box, FormControlLabel, Switch } from "@mui/material";
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
export default function Settings() {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const navigate= useNavigate();
  const handlefieldchange = () => {
    navigate("/Configmed");
  }
  const handleProfilechange = () => {
    navigate("/Profile");
  }
  
 

  return (
    <div className="settings">
      <div className="sidee">
      <SideBar /></div>
      <div className="Naveee">
      <NavBar /></div>
      <div className="settings-container">
       
        <div className="settings-content">
          <div className="row-1">
            <h1 style={{ fontSize: "1.5rem" }}>{t("Settings")}</h1>
          </div>
          

          <div className="settings-bottom">
          <div >
            <div className="bottom-row-1">
              <div className="col1">
              <User  size={20}/>
               <p style={{marginTop:"3px"}}>{t('Profile Information')}</p>

                </div>
               
                <CaretRight size={20}  onClick={handleProfilechange}/>
                </div>
            </div>
            <hr
              style={{
                marginTop: "1rem",
                border: "0.5px solid #EDEDED",
                marginBottom: "1rem",
              }}
            />
            
            <div >
            <div className="bottom-row-1">
              <div className="col1">
              <MedicalInformationOutlinedIcon  size={20}/>
               <p style={{marginTop:"3px"}}>{t("Configure Medical Information")}</p>

                </div>
               
                <CaretRight size={20}  onClick={handlefieldchange}/>
                </div>
            </div>
            <hr
              style={{
                marginTop: "1rem",
                border: "0.5px solid #EDEDED",
                marginBottom: "1rem",
              }}
            />
            
          
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
