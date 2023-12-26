import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/SideBar";
import NavBar from "../../../components/NavBar/NavBar";
import DropDown from "../../../components/widgets/DropDown/DropDown";
import MessageList from "./messagelist";
import MessageTemplate from "../../../components/widgets/MessageTemplate/MessageTemplate";
import axios from 'axios';
import API_BASE_URL from "../../../config/config";
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

const CreateReminder = () => {

  const [state, setState] = useState({
    isMessageTemplateOpen: false,
    templates: [],
    filteredTemplates: [],
    appointmentType: "",
    subtypes: [],
    selectedSubtype: "",
  });

  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])

  const routeMapping = {
    "Procedure Instruction": "procedure-instruction",
    "Patient Education": "patient-education",
    "General Health Reminders": "general-health-reminders",
  };

  const addNewMessageBox = () => {
    const { appointmentType, selectedSubtype } = state;

    if (appointmentType && selectedSubtype) {
      if (!state.isMessageTemplateOpen) {
        setState(prevState => ({
          ...prevState,
          isMessageTemplateOpen: true,
        }));
      }
    } else {
      alert("Please choose both type and subtype before adding a new message.");
    }
  };

  const getTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templatesandrecurrences/`);
      const templates = response.data.result;

      setState(prevState => ({
        ...prevState,
        templates: templates,
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []); // Empty dependency array to run the effect only once on mount

  useEffect(() => {
    // This effect will run whenever templates are updated
    const { selectedSubtype, appointmentType } = state;

    if (selectedSubtype) {
      filterBySubtype(selectedSubtype);
    } else if (appointmentType) {
      getFilteredTemplates(appointmentType);
    }
  }, [state.templates, state.selectedSubtype, state.appointmentType]);

  const getFilteredTemplates = (appointmentType) => {
    try {
      const { templates } = state;
      console.log('All templates:', templates);
      const filteredTemplates = templates.filter(template => template.templateID__type === appointmentType);
      console.log('Filtered templates:', filteredTemplates);

      setState(prevState => ({
        ...prevState,
        filteredTemplates: filteredTemplates,
      }));

      return filteredTemplates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  };

  const filterBySubtype = (selected) => {
    try {

      const filteredTemplates = getFilteredTemplates(state.appointmentType);
      const result = filteredTemplates.filter(template => template.templateID__subType === selected);

      setState(prevState => ({
        ...prevState,
        filteredTemplates: result,
        selectedSubtype: selected,
      }));

    } catch (error) {
      console.error('Error filtering templates by subtype:', error);
    }
  };

  const handleDelete = () => {
    setState(prevState => ({
      ...prevState,
      isMessageTemplateOpen: false,
    }));
  };

  const handleCloseMessageTemplate = () => {
    setState(prevState => ({
      ...prevState,
      isMessageTemplateOpen: false,
    }));
  };

  const handleAppointmentTypeChange = async (selectedType) => {
    const route = routeMapping[selectedType.target.value];

    try {
      const response = await axios.get(`${API_BASE_URL}/${route}/`);
      const subtypes = response.data.map(subtype => subtype.name);

      setState(prevState => ({
        ...prevState,
        subtypes: subtypes,
        selectedSubtype: "",
        appointmentType: selectedType.target.value,
        filteredTemplates: getFilteredTemplates(selectedType.target.value),
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const myOptions = [
    "Procedure Instruction",
    "Patient Education",
    "General Health Reminders",
  ];

  const { isMessageTemplateOpen, appointmentType, selectedSubtype, filteredTemplates } = state;
  console.log("f",state);
  const renderMessageList = state.filteredTemplates.length > 0 && (
   
    <div className="row-7">

      <h2 style={{ marginBottom: '20px' }}>{t("Previous Messages")}</h2>
      <MessageList templates={state.filteredTemplates} getTemplates={getTemplates} />

    </div>
  );

  return (
    <div className="create-reminder">
      <SideBar />  
      <div className="create-reminder-container">
      <NavBar />
        <div className="message-box">
          <div className="row-1">

            <h2>{t("Create New Reminder")}</h2>
          </div>
          <div className="row-2">
            <p>
              {t("Set up and configure personalized reminder profiles that will besent to patients upon booking of appointments")}

            </p>
          </div>
          <div className="row-3">
            <div className="first" style={{display: 'flex',width:'100%',gap:'20px'}}>
              <div className="col1">
                <p>Nature of Reminder</p>
              </div>
              <div className="col2" >
                <DropDown
                  width={"100%"}
                  text={"Select type here"}
                  size={"small"}
                  options={myOptions}
                  onChange={handleAppointmentTypeChange}
                ></DropDown>
              
              <DropDown
                width={"80%"}
                text={"Select subtype here"}
                size={"small"}
                options={state.subtypes}
                onChange={selected => filterBySubtype(selected.target.value)}
              ></DropDown>
            </div> </div>
          </div>
          <div className="row-4" style={{ marginTop: '20px' }}>

            <h2>{t("Messages")}</h2>

          </div>
          {isMessageTemplateOpen && (
            <div style={{ marginTop: "1rem" }}>
              <MessageTemplate
                onDelete={handleDelete}
                onClose={handleCloseMessageTemplate}
                type={appointmentType}
                subtype={selectedSubtype}
                getTemplates={getTemplates}
              />
            </div>
          )}
          <div className="row-6" onClick={addNewMessageBox} style={{ marginTop: '20px' }}>
            {isMessageTemplateOpen ? "" :
              <button className="btntasks">
                +{t("Add new")} 
              </button>
            }
          </div>
          <div className="row-7" style={{ marginTop: '20px' }} >
            {renderMessageList}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default CreateReminder;