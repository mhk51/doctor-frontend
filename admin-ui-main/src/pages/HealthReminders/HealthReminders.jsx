import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import DropDown from "../../components/widgets/DropDown/DropDown";
import "./HealthReminders.scss";
import MessageList from "./messagelist";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { scheduleReminders } from "./ReminderFunctions";
import { ConstructionOutlined } from "@mui/icons-material";
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

const HealthReminders = () => {

  const [state, setState] = useState({
    isMessageTemplateOpen: false,
    templates: [],
    filteredTemplates: [],
    appointmentType: "Patient Education",
    subtypes: [],
    selectedSubtype: "",
  });

  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]); 
  const [selectedTab, setSelectedTab] = useState("Patient Education");
  const [selectedDateTime, setSelectedDateTime] = useState(null)

  // Fetch the list of patients when the component mounts
  useEffect(() => {
    axios.get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        console.log("patients", response.data);
        setPatients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });

  }, []);

  const handlePatientsSelect = (selectedPatients) => {
    if (!selectedPatients || selectedPatients.length === 0) {
      // Handle the case where no patients are selected (deselected all)
      setSelectedPatients([]); // Set selectedPatients to an empty array or handle as needed
      return;
    }

    const [{ id }] = selectedPatients;
    console.log(id);
    // Handle the selected patients
    if (id ==='all') {
      // If 'All Patients' is selected, set selectedPatients to all patients
      setSelectedPatients(patients);
      console.log(selectedPatients)
    } else {
      // Otherwise, set selectedPatients to the selected patients
      setSelectedPatients(selectedPatients);
    }
    console.log(patients);
  };

  const handleDateTimeChange = (newDateTime) => {
    const formattedDateTime = newDateTime.toISOString();
    setSelectedDateTime(formattedDateTime);
    console.log(selectedDateTime);
    console.log('patients here')
    console.log(selectedPatients[0].id)
    for ( const patient in selectedPatients){

      console.log(patient);
      console.log(patient.id)
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    handleAppointmentTypeChange({ target: { value: newValue } });
  };

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

  const getFilteredTemplates =  (appointmentType) => {
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

  const sendReminder = async () =>{
    // Check if all required parameters are present
  if (
    appointmentType &&
    selectedSubtype &&
    selectedDateTime &&
    selectedPatients &&
    selectedPatients.length > 0
  ) {
    // All required parameters are present, proceed with scheduling reminders
    await scheduleReminders(
      appointmentType,
      selectedSubtype,
      selectedDateTime,
      selectedPatients
    );
    setSelectedDateTime(null);
    setSelectedPatients([]);
  } else {
    // Handle the case where some parameters are missing
    console.error('Missing required parameters for scheduling reminders.');
    // You might want to show a message to the user or handle the error in another way
  }
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

  useEffect(() => {

    handleAppointmentTypeChange({ target: { value: appointmentType } })
  },[]);

  const { isMessageTemplateOpen, appointmentType, selectedSubtype, filteredTemplates } = state;
  console.log("f",state);
  const renderMessageList = state.filteredTemplates.length > 0 && (
   
    <div className="row-7">

      <h2 style={{ marginBottom: '20px' }}>{t("Previous Messages")}</h2>
      <MessageList templates={state.filteredTemplates} getTemplates={getTemplates} />

    </div>
  );
  const allPatientsOption = { id: 'all', full_name_phone: 'All Patients' };
  const optionsWithAll = [allPatientsOption,...patients ];
  
  return (
    <div className="create-reminder">
      <SideBar />
      <div className="create-reminder-container">
        <NavBar />
        <div className="message-box">
          <div className="row-1">

            <h2>{t("Send Health Reminders")}</h2>
          </div>

          <div className="row-2">
          <div style={{ marginLeft: '10px', display: 'flex' }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                textColor="success"
                TabIndicatorProps={{
                  style:
                  {
                    backgroundColor:'#0B6265'
                  }
                }}
              >
                <Tab label="Patient Education" value="Patient Education" />
                <Tab label="General Health Reminders" value="General Health Reminders" />
              </Tabs>
            </div>
          </div>
          <div className="row-3">
            
            <div style={{display: 'flex', gap: '20px',width:'100%'}}>
              <DropDown
                width={"80%"}
                text={"Select subtype here"}
                size={"small"}
                options={state.subtypes}
                onChange={selected => filterBySubtype(selected.target.value)}
              ></DropDown>
            
            <Autocomplete
            multiple
            value={selectedPatients}
            onChange={(e, newValue) => handlePatientsSelect(newValue)}
            options={optionsWithAll}
            getOptionLabel={(patient) => patient.full_name_phone || ''}
            renderInput={(params) => <TextField {...params} label={t("Select patient/s")} />}
            sx={{ paddingTop: '5px',width: "180px", height:'60px', flexGrow: 1,overflowY: 'auto' }} // Use flexGrow to allow the Autocomplete to take available space
            size="medium"
            
            
            
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
              label="Pick Date and Time"
              value={selectedDateTime}
              onChange={handleDateTimeChange}
              />
          </LocalizationProvider>

          <button className="btntasks" onClick={sendReminder}>
                {t("Send Reminder")} 
              </button>

            </div>
          </div>
          
          
          <div className="row-6" style={{ marginTop: '20px',width:'100%', gap:'30px',display:'flex'}}>
          
          
        
              </div>
         
          <div className="row-8" style={{ marginTop: '20px' }} >
            {renderMessageList}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReminders;