
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import Axios from "axios";
import { ScheduleComponent, ViewsDirective, ResourcesDirective, ResourceDirective,ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { closest, remove, addClass } from '@syncfusion/ej2-base';
import "./external-drag-drop.scss";
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import * as locales from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent, AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import frLocale from '@syncfusion/ej2-locale/src/fr.json';
import arLocale from '@syncfusion/ej2-locale/src/ar.json';
import enLocale from '@syncfusion/ej2-locale/src/en-US.json';
import { fetchReminders, sendWhatsAppMessages, sendScheduledWhatsAppMessages, updateTemplatesForAppointment } from './AppointmentFunctions';
import  { useState } from 'react';
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";  
import API_BASE_URL from '../../config/config';
import {
 
  Internationalization,
  isNullOrUndefined, 
 
} from "@syncfusion/ej2-base";
import cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import PhoneInput from "react-phone-number-input";
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
const translations = {
  en: {
    Day: 'Day',
    Week: 'Week',
    WorkWeek: 'WorkWeek',
    Month: 'Month',
    Agenda: 'Agenda',
    Today :'Today',
  },
  fr: {
    Day: 'Jour', 
    Week: 'Semaine',
    WorkWeek: 'Semaine de travail',
    Month: 'Mois',
    Agenda: 'Agenda',
    Today :'Aujourdhuit',
  },
  ar: {
    Day: 'يوم',
    Week: 'أسبوع',
    WorkWeek: 'أسبوع العمل',
    Month: 'شهر',
    Agenda: 'جدول أعمال',
    Today :'يوم',
  },
};

const ExternalDragDrop = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  function setLocalization(language) {
    switch (language) {
      case 'fr':
        loadCldr(require('cldr-data/supplemental/numberingSystems.json'));
        loadCldr(require('cldr-data/main/fr/ca-gregorian.json'));
        loadCldr(require('cldr-data/main/fr/numbers.json'));
        loadCldr(require('cldr-data/main/fr/timeZoneNames.json'));
        L10n.load({
          'fr': frLocale 
    });
        locales.setCulture('fr'); 
        updateDisplayNames(getTranslatedNames(language));
        setRtl(false);
        break;
    
      case 'ar':
        loadCldr(require('cldr-data/supplemental/numberingSystems.json'));
        loadCldr(require('cldr-data/main/ar/ca-gregorian.json'));
        loadCldr(require('cldr-data/main/ar/numbers.json'));
        loadCldr(require('cldr-data/main/ar/timeZoneNames.json'));
        L10n.load({
          'ar': arLocale 
        });
        locales.setCulture('ar'); 
        setRtl(true);
        
        updateDisplayNames(getTranslatedNames(language));
        break;
      
  
      case 'en':
        loadCldr(require('cldr-data/supplemental/numberingSystems.json'));
        loadCldr(require('cldr-data/main/en/ca-gregorian.json'));
        loadCldr(require('cldr-data/main/en/numbers.json'));
        loadCldr(require('cldr-data/main/en/timeZoneNames.json'));
        L10n.load({
          'en': enLocale 
        });
        locales.setCulture('en'); 
        setRtl(false);
        updateDisplayNames(getTranslatedNames(language));
        break;
  
  
      
    }
  }
  
  function getTranslatedNames(selectedLanguage) {
    return translations[selectedLanguage];
  }
  

    function updateDisplayNames(names) {
      const views = [
        { option: 'Day', displayName: names['Day'] },
        { option: 'Week', displayName: names['Week'] },
        { option: 'WorkWeek', displayName: names['WorkWeek'] },
        { option: 'Month', displayName: names['Month'] },
        { option: 'Agenda', displayName: names['Agenda'] }
      ];
    
    views.forEach(view => {
      const index = views.findIndex(v => v.option === view);
      if (index !== -1) {
        views[index].displayName = names[view];
      }
    });
    setViews(views);
  }
  const selectedTranslations = translations[selectedLanguage] || {};
const [views, setViews] = useState([
  { option: 'Day', displayName: selectedTranslations['Day'] || 'Default Day' },
    { option: 'Week',displayName: selectedTranslations['Week'] || 'Default week' },
    { option: 'WorkWeek', displayName: selectedTranslations['WorkWeek'] || 'Default woekweekk' },
    { option: 'Month', displayName: selectedTranslations['Month'] || 'Default month' },
    { option: 'Agenda', displayName: selectedTranslations['Agenda'] || 'Default agenda' },
  ]);

  
 
  
  
 
  const currentLanguageCode = cookies.get('i18next') || 'en'
  
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  
  const { t } = useTranslation()
  useEffect(() => {
    
    document.body.dir = currentLanguage.dir || 'ltr'
    setLocalization(currentLanguage.code);
    setSelectedLanguage(currentLanguage.code);
  }, [currentLanguage, t])
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupEvetOpen, setIsPopupEvetOpen] = useState(false);
  const [selectedPatientIDEMR, setSelectedPatientId] = useState(null);
  const [rtl,setRtl]=useState(false);
  const userRole = localStorage.getItem('role');
  console.log("roleemr", userRole);

  const navigate = useNavigate();
  // Function to handle the "Access EMR" button click
  const handleAccessEMR = () => {
    if (selectedPatientIDEMR) {
      navigate(`/contactspatients/${selectedPatientIDEMR}`);
    }
  };

  useEffect(() => {
    // This effect will be triggered when selectedPatientIDEMR changes
    handleAccessEMR();
  }, [selectedPatientIDEMR]);

  const openPopup = () => {
    
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const openEvPopup = () => {
    
    setIsPopupEvetOpen(true);
  };

  const closeEvPopup = () => {
    setIsPopupEvetOpen(false);
  };
  const openEditPopup = (eventDetails) => {
    setSelectedEvent(eventDetails);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setSelectedEvent(null);
    setIsEditPopupOpen(false);
  };

  const openEditEvPopup = (eventDetails) => {
    setSelectedEvent(eventDetails);
    setIsEditEvPopupOpen(true);
  };

  const closeEditEvPopup = () => {
    setSelectedEvent(null);
    setIsEditEvPopupOpen(false);
  };
  const [isWaitingListPopupOpen, setIsWaitingListPopupOpen] = useState(false);

  // Function to open the waiting list popup
  const openWaitingListPopup = () => {
    setIsWaitingListPopupOpen(true);
  };

  // Function to close the waiting list popup
  const closeWaitingListPopup = () => {
    setIsWaitingListPopupOpen(false);
  };
  const saveEditedEvent = async (editedEvent) => {
    try {
      console.log('Edited Event Data:', editedEvent); // Log the editedEvent for debugging
      const mappedEvent = {
        idappointment: editedEvent.Id, // Map Id to idappointment
        type: editedEvent.Type, // Map Type to type
        startdate: editedEvent.StartTime, // Map StartTime to startdate
        end_date: editedEvent.EndTime, // Map EndTime to end_date
        notes: editedEvent.Description, // Map Description to notes
        patient: editedEvent.PatientID,
        clinic: editedEvent.RoomId,
        chief: editedEvent.Chief,
        online: editedEvent.Virtual,  
        title: editedEvent.Title,
        nature: editedEvent.Nature,
      };

      console.log('Mapped Event Data:', mappedEvent);
      // Send a PUT request to update the event on the backend
      const response = await Axios.put(
        `${API_BASE_URL}/appointment/${editedEvent.Id}/`, mappedEvent);
  
      // Handle the response as needed
      console.log('Event updated:', response.data);
      fetchDataAndProcessAppointments();
      if(mappedEvent.type){
      updateTemplatesForAppointment(mappedEvent.idappointment, mappedEvent.startdate, mappedEvent.end_date);}
      // Close the edit popup 
      closeEditPopup();
    } catch (error) {
      console.error('Error updating event:', error);
      // Handle the error as needed
    }
  };
  
  const [modal, setModal] = useState(false);
  let startTimeObj= useRef(null);
  let endTimeObj= useRef(null);
    let scheduleObj = useRef(null);
    let treeObj = useRef(null);
    let isTreeItemDropped = false;
    let eventTypeObj = useRef(null);
    let titleObj = useRef(null);
    let notesObj = useRef(null);
    let cheifObj=useRef(null);
    let natureObj=useRef(null);
    let typeObj=useRef(null); 
    let virtualObj=useRef(null);
    let firstNameObj = useRef(null);
    let lastNameObj = useRef(null);
    let phoneNumberObj = useRef(null);
    let titleEventObj=useRef(null);
    let DescEventObj=useRef(null);
    let isAllDayObj = useRef(null);
    let draggedItemId = '';
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());

    const allowDragAndDrops = true;


    const intl = new Internationalization();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [isEditEvPopupOpen, setIsEditEvPopupOpen] = useState(false);
  
    //newpatient popup
    
    const getHeaderTitle = (data) => {
      return data.elementType === "cell"
        ? t("Registered Patient")
        : "Appointment Details";
    };
  
    const getHeaderDetails = (data) => {
      return (
        intl.formatDate(data.StartTime, { type: "date", skeleton: "full" }) +
        " (" +
        intl.formatDate(data.StartTime, { skeleton: "hm" }) +
        " - " +
        intl.formatDate(data.EndTime, { skeleton: "hm" }) +
        ")"
      );
    };
  
  




    const createAppointment = async (newAppointment) => {
      try {
          const response = await Axios.post(`${API_BASE_URL}/appointment/`, newAppointment); // Replace with your Django API endpoint
          console.log("new appointment", newAppointment);
          fetchTree();
          fetchAppointments();
          fetchDataAndProcessAppointments();
          if (newAppointment.type){
          await sendScheduledWhatsAppMessages(response.data.idappointment)}
          return response.data;
      } catch (error) {
          console.error('Error creating appointment:', error);
          throw error;
      }
  };

 
const createPatient = async () => {
  try {
    // Create a new patient object with first name, last name, and phone number
    const newPatient = {
      first_name: firstNameObj.current.value,
      last_name: lastNameObj.current.value,
      phone: phoneNumberObj.current.value,
    };
    // Check if the phone starts with '+'
if (newPatient.phone !== null && newPatient.phone.startsWith('+')) {
  // Remove the '+' character
  newPatient.phone = newPatient.phone.slice(1);
}

    // Send a POST request to create the patient
    const response = await Axios.post(`${API_BASE_URL}/patients/`, newPatient);

    // Log the response data for debugging
    console.log("Response from patient creation API:", response.data);

    // Check the response status and data
    if (response.status === 201 && response.data) {
      // Update the patients state with the response data
      setPatients([...patients, response.data]);

     
      // Clear the input fields
      firstNameObj.current.value = '';
      lastNameObj.current.value = '';
      phoneNumberObj.current.value = '';

      // Return the created patient data
      return response.data;
    } else {
      console.error('Invalid response when creating patient:', response);
      return null; // You can return null or handle the error as needed
    }
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

const [patients, setPatients] = useState([]);
const [clinics, setClinics] = useState([]);
const [virtualmeet, setVirtualMeet] = useState([]);
const [procedure, setProcedure] = useState([]);
const [appoint, setAppoint] = useState([]);
const fetchPatients = async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/patients/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

const fetchClinics = async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/clinic/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

const fetchVirtualMeet = async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/virtualmeet/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching virtual meets:', error);
    throw error;
  }
};

const fetchAppointments = async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/appointment/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};
const fetchProcedure= async () => {
  try {
    const response = await Axios.get(`${API_BASE_URL}/procedure-instruction/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};
const getPatientNameById = async (patientId, patients, appointment, title) => {
  try {
    console.log('Searching for patient with ID:', patientId);

    if (!patients || patients.length === 0 ) {
      console.log('Patients data is empty or undefined.');
      return title;
    }

    const patient = patients.find((p) => p.id === patientId);

    if (!patient ) {
      console.log('Patient not found for ID:', patientId);
      return title;
    } 
    if (!patients || patients.length === 0 || appointment.length===0){
      return 'unknown';
    }
    console.log('Found patient:', patient);
    return patient.full_name_phone;
  } catch (error) {
    console.error('Error in getPatientNameById:', error);
    throw error;
  }
};


// ...

const fetchDataAndProcessAppointments = async () => {
  try {
    // Fetch all required data concurrently
    const [patientData, clinicData, virtualMeetData, procedureData, appointmentData] = await Promise.all([
      fetchPatients(),
      fetchClinics(),
      fetchVirtualMeet(),
      fetchProcedure(),
      fetchAppointments(),
    ]);

    // Set the patient data
    setPatients(patientData);
    setClinics(clinicData);
    setVirtualMeet(virtualMeetData);
    setProcedure(procedureData);
    // Process appointments using the fetched data
    const newAppointments = appointmentData.map(async (appointment) => {
      const patientName = await getPatientNameById(appointment.patient, patientData, appointmentData, appointment.title);
      return {
        Subject: patientName,
        Id: appointment.idappointment,
        StartTime: new Date(appointment.startdate),
        EndTime: new Date(appointment.end_date),
        Description: appointment.notes,
        RoomId: appointment.clinic,
        Chief: appointment.chief,
        Type: appointment.type,
        Virtual: appointment.online,
        PatientID: appointment.patient,
        Title: appointment.title,
        Nature: appointment.nature,
        // Other appointment fields...
      };
    });

    // Wait for all appointmentPromises to resolve
    Promise.all(newAppointments).then((resolvedAppointments) => {
      setAppoint(resolvedAppointments);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

useEffect(() => {
  fetchDataAndProcessAppointments();
}, []); // Empty dependency array to fetch data only once

// Call fetchDataAndProcessAppointments whenever you need to update the data




const onDeleteAppointment = async (appointmentId) => {
  try {
    console.log("Deleted appointment with ID:", appointmentId);
    const response = await Axios.delete(`${API_BASE_URL}/appointment/${appointmentId}/`);
    console.log("respo:", response);
    fetchDataAndProcessAppointments();
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};


// Function to handle drag start
const onDragStart = (args) => {
  // No need to capture initial start and end times here
};

// Function to handle resize start
const onResizeStart = (args) => {
  // No need to capture initial start and end times here
};


// Function to handle drag end
const onDragEnd = async (args) => {
  try {
    const { data, element } = args;
    const editedEvent = scheduleObj.current.getEventDetails(element);
    console.log("data.StartTime", data);
    
    // Use the provided StartTime and EndTime directly
    editedEvent.StartTime = data.StartTime;
    editedEvent.EndTime = data.EndTime;

    console.log("start", editedEvent.StartTime);
    console.log("end", editedEvent.EndTime);
    updateEventInState(editedEvent);
    // Now, you can proceed to save the edited event
    await saveEditedEvent(editedEvent);
  } catch (error) {
    console.error('Error handling drag-and-drop:', error);
  }
};

// Function to handle resize end
const onResizeEnd = async (args) => {
  try {
    const { data, element } = args;
    const editedEvent = scheduleObj.current.getEventDetails(element);

    // Update the editedEvent with the new start and end times from 'data'
      editedEvent.StartTime = data.StartTime;
    editedEvent.EndTime = data.EndTime;

    console.log("start", editedEvent.StartTime);
    console.log("end", editedEvent.EndTime);
    updateEventInState(editedEvent);

    await saveEditedEvent(editedEvent);
    
  } catch (error) {
    console.error('Error handling resize:', error);
  }
};
const updateEventInState = (editedEvent) => {
  setAppoint((prevAppointments) =>
    prevAppointments.map((appointment) =>
      appointment.Id === editedEvent.Id ? editedEvent : appointment
    )
  );
};


const [selectedDate, setSelectedDate] = useState(new Date());

const [isNewButtonClicked, setIsNewButtonClicked] = useState(false);

    const buttonClickActions = (e) => {
      const quickPopup = closest(e.target, ".e-quick-popup-wrapper");
      const getSlotData = () => {
        const addObj = {};
        addObj.Id = scheduleObj.current.getEventMaxID();
       //title patient name
       if (titleObj.current){
        addObj.Subject = titleObj.current.value;}
else if (titleEventObj.current){
  addObj.Subject = titleEventObj.current.value;
}

if (isAllDayObj.current){
  console.log("isadd", isAllDayObj.current.checked);
if(isAllDayObj.current.checked){

  addObj.StartTime= new Date(scheduleObj.current.activeCellsData.startTime.setHours(0, 0, 0, 0));
  addObj.EndTime= new Date(scheduleObj.current.activeCellsData.endTime.setHours(23, 59, 59, 999));
}
else {if (startTimeObj.current && endTimeObj.current) {
  // Use the values from the date pickers when available
  addObj.StartTime = startTimeObj.current.value;
  addObj.EndTime = endTimeObj.current.value;
} else if (scheduleObj.current.activeCellsData) {
  // Use the default slot values when pickers are not available
  addObj.StartTime = new Date(scheduleObj.current.activeCellsData.startTime);
  addObj.EndTime = new Date(scheduleObj.current.activeCellsData.endTime);
  addObj.IsAllDay = scheduleObj.current.activeCellsData.isAllDay;
}
else {
          // Handle the case when activeCellsData is not valid or defined
          console.error("Invalid or undefined activeCellsData:", scheduleObj.current.activeCellsData);
          // You may want to provide default values or take appropriate action.
        }}
}
 else if (startTimeObj.current && endTimeObj.current) {
  // Use the values from the date pickers when available
  addObj.StartTime = startTimeObj.current.value;
  addObj.EndTime = endTimeObj.current.value;
} else if (scheduleObj.current.activeCellsData) {
  // Use the default slot values when pickers are not available
  addObj.StartTime = new Date(scheduleObj.current.activeCellsData.startTime);
  addObj.EndTime = new Date(scheduleObj.current.activeCellsData.endTime);
  addObj.IsAllDay = scheduleObj.current.activeCellsData.isAllDay;
}
else {
          // Handle the case when activeCellsData is not valid or defined
          console.error("Invalid or undefined activeCellsData:", scheduleObj.current.activeCellsData);
          // You may want to provide default values or take appropriate action.
        }
      
        //notes
        if(notesObj.current){
        addObj.Description = notesObj.current.value;}
        else if (DescEventObj.current){
          addObj.Description = DescEventObj.current.value;
        }
        else{
          addObj.Description = "Add Notes";
        }
        if (natureObj.current){
          addObj.Nature=natureObj.current.value;
         }
        else
        {addObj.Nature = "null";}
        //clinic id
          if(eventTypeObj.current){
        addObj.RoomId = eventTypeObj.current.value;}
        else{addObj.RoomId = "null";}
        if (cheifObj.current){
        addObj.Chief=cheifObj.current.value;}
        else{
          addObj.Chief = "null";
        }
        if(typeObj.current){
        addObj.Type=typeObj.current.value;}
        else{
          addObj.Type = "null";
        }
        if (virtualObj.current){
        addObj.Virtual=virtualObj.current.value;}
        else{
          addObj.Virtual = "null";
        }
       
        return addObj;
      };
  
      if (e.target.id === "add") {
  const addObj = getSlotData();
  const selectedPatient = patients.find((patient) => patient.full_name_phone === addObj.Subject);

  let patientId = null; // Initialize with null, update if patient is found
  if (selectedPatient) {
    // Update the Subject with full_name_phone if the patient is found
    addObj.Subject = selectedPatient.full_name_phone;
    patientId = selectedPatient.id;
    addObj.PatientID=patientId;
  }

  const newAppointment = {
    idappointment: addObj.Id,
    patient: patientId, // Send the patient ID to the backend
    startdate: addObj.StartTime,
    end_date: addObj.EndTime,
    notes: addObj.Description,
    clinic: addObj.RoomId,
    chief: addObj.Chief,
    type: addObj.Type,
    online: addObj.Virtual,
    nature: addObj.Nature,
    // Other appointment fields...
  };

  createAppointment(newAppointment).then((createdAppointment) => {
    setSelectedDate(new Date(createdAppointment.startdate));
    // Add the new appointment to the schedule
    scheduleObj.current.addEvent(addObj);
    fetchAppointments();
    fetchDataAndProcessAppointments();
  });
}
else if (e.target.id === "addevent"){
  const addObj = getSlotData();
  const newAppointment = {
    idappointment: addObj.Id,
    title: addObj.Subject,
    patient:null , // Send the patient ID to the backend
    startdate: addObj.StartTime,
    end_date: addObj.EndTime,
    notes: addObj.Description,
    clinic: null,
    chief: null,
    type: null,
    online: null,
    nature: null,
    // Other appointment fields...
  };
  createAppointment(newAppointment).then((createdAppointment) => {
    // Add the new appointment to the schedule
    scheduleObj.current.addEvent(addObj);
    closeEvPopup();
    fetchAppointments();
    fetchDataAndProcessAppointments();
  });
}
else if (e.target.id === "addwait") {
  const addObj = getSlotData();
  const selectedPatient = patients.find((patient) => patient.full_name_phone === addObj.Subject);

  let patientId = null; // Initialize with null, update if patient is found
  if (selectedPatient) {
    // Update the Subject with full_name_phone if the patient is found
    addObj.Subject = selectedPatient.full_name_phone;
    patientId = selectedPatient.id;
  }

  const newAppointment = {
    idappointment: addObj.Id,
    patient: patientId, // Send the patient ID to the backend
    startdate: null, // Set start date to null for waiting list
    end_date: null, // Set end date to null for waiting list
    notes: addObj.Description,
    clinic: addObj.RoomId,
    chief: addObj.Chief,
    type: addObj.Type,
    online: addObj.Virtual,
    nature: addObj.Nature,
    // Other appointment fields...
  };
  newAppointment.startdate = null;
  newAppointment.end_date = null;
  console.log("new",newAppointment);
 
  createAppointment(newAppointment).then((createdAppointment) => {
    
    fetchTree();
    closeWaitingListPopup();
    fetchAppointments();
    fetchDataAndProcessAppointments();
  });
  
}
else if (e.target.id === "delete") {
  const eventDetails = scheduleObj.current.activeEventData.event;
  let currentAction = "Delete";
  if (eventDetails.RecurrenceRule) {
    currentAction = "DeleteOccurrence";
  }

  // Call onDeleteAppointment function to delete the appointment from the backend
  onDeleteAppointment(eventDetails.Id).then(() => {
    // Remove the appointment from the frontend after successful deletion
    scheduleObj.current.deleteEvent(eventDetails, currentAction);
  });
      } 
      else if (e.target.id === "event" ) {
        console.log("Event button clicked");
        const addObj = getSlotData();
        console.log("adoj", addObj);
        console.log("addday",isAllDayObj.current);
        
        setSelectedStartTime(addObj.StartTime);
        setSelectedEndTime(addObj.EndTime);
        openEvPopup();
  }
      else if (e.target.id === "new" ) {
        console.log("New button clicked");
        const addObj = getSlotData();
        setSelectedStartTime(addObj.StartTime);
        setSelectedEndTime(addObj.EndTime);
        openPopup();
      
        // Set the isNewButtonClicked flag to true to prevent further execution
      }
else if (e.target.id === "addnew") {
  console.log("addnew button clicked");
  
  const addObj = getSlotData();
  console.log("Slot data:", addObj);

  // Create a new patient first
  const newPatient = {
    first_name: firstNameObj.current.value,
    last_name: lastNameObj.current.value,
    phone: phoneNumberObj.current.value,
  };

  console.log("New patient data:", newPatient);

  createPatient(newPatient)
    .then((createdPatient) => {
      console.log("Created patient:", createdPatient);

      // Set the titleObj ref to the full_name_phone of the created patient
      

      // Update addObj.Subject with full_name_phone
      addObj.Subject = createdPatient.full_name_phone;
      addObj.PatientID=createdPatient.id;
      // Clear the input fields
      firstNameObj.current.value = '';
      lastNameObj.current.value = '';
      phoneNumberObj.current.value = '';

      // Now, create an appointment for the created patient
      const newAppointment = {
        idappointment: addObj.Id,
        patient: createdPatient.id, // Use the ID of the created patient
        startdate: addObj.StartTime,
        end_date: addObj.EndTime,
        notes: addObj.Description,
        clinic: addObj.RoomId,
        chief: addObj.Chief,
        type: addObj.Type,
        online: addObj.Virtual,
        nature: addObj.Nature,
        // Other appointment fields...
      };

      console.log("New appointment data:", newAppointment);

      return createAppointment(newAppointment);
    })
    .then((createdAppointment) => {
      console.log("Created appointment:", createdAppointment);
      closePopup();
      // Add the new appointment to the schedule
      scheduleObj.current.addEvent(addObj);
fetchAppointments();
fetchDataAndProcessAppointments();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

  else if(e.target.id === "more") {
    const eventDetails = scheduleObj.current.activeEventData.event;
    if (eventDetails.PatientID) {
      // If the event has a patient ID, open the first popup (EditEvent)
      setSelectedEvent(eventDetails);
      setIsEditPopupOpen(true);
    } else {
      // If the event does not have a patient ID, open the second popup (Edit)
      setSelectedEvent(eventDetails);
      setIsEditEvPopupOpen(true);
    }
    
  }    
  else if(e.target.id === "EMR") {
    const eventDetails = scheduleObj.current.activeEventData.event;
    console.log("eventdetails", eventDetails);
    setSelectedPatientId(eventDetails.PatientID)
    console.log("selected", selectedPatientIDEMR);
    handleAccessEMR();
  }    

  scheduleObj.current.closeQuickInfoPopup();

      
    };
  
    const onPopupOpen = (args) => {
      if(args.type === 'Editor'){
        args.cancel=true;
      }
      if (
        args.target &&
        !args.target.classList.contains("e-appointment") &&
        !isNullOrUndefined(titleObj) &&
        !isNullOrUndefined(titleObj.current)
      ) {
        titleObj.current.focusIn();
      }
    };





    
    //register
    const headerTemplate = (props) => {
      
      return (
        <div className="quick-info-header">
          <div
            className="quick-info-header-content"
           
          >
            <div className="quick-info-title">{getHeaderTitle(props)}</div>
            <div className="duration-text">{getHeaderDetails(props)}</div>
          </div>
        </div>
      );
    };
    
   
   
    const [filterOptionss, setFilterOptionss] = useState(patients);
    const dataloads = useRef(null);
    
    const contentTemplate = (props) => {
     
      
    
     
      let SelectedNature = null;
      return (
        <div className="quick-info-content">
          {props.elementType === "cell" ? (
            <div className="e-cell-content">
              <div className="content-area">
              <AutoCompleteComponent
              id="title"
              ref={titleEventObj}
              dataSource={patients}
              fields={{ value: "full_name_phone"}}
              placeholder="Choose patient"

          />
              </div>
  
              <div className="content-area">
                <TextBoxComponent
                  id="chief"
                  ref={cheifObj}
                  placeholder={t("Chief Complaint")}
                  style={{marginTop:"2px"}}
                />
  
  
                <DateTimePickerComponent
                  id="StartTime"
                  ref={startTimeObj}
                  data-name="StartTime"
                  value={new Date(props.StartTime || new Date())
              }
                
                />
                
                <DateTimePickerComponent
                  id="EndTime"
                  ref={endTimeObj}
                  data-name="EndTime"
                  value={new Date(props.EndTime || new Date())}
                />
                
                <DropDownListComponent
                      id="Nature"
                      ref={natureObj}
                      dataSource={[
                        { text: "Clinic", value: "Clinic" },
                        { text: "Virtual", value: "Virtual" }
                       
                      ]}
                      fields={{ text: "text", value: "value" }}
                      placeholder={t("Nature of appointment")}
                      style={{ marginTop: "2px" }}
                      popupHeight="200px"
                      change={(args) => {
                        const selectedValue = args.value;

                        if (selectedValue === 'Clinic') {
                          eventTypeObj.current.enabled = true;
                          virtualObj.current.enabled = false;
                        } else if (selectedValue === 'Virtual') {
                          eventTypeObj.current.enabled = false;
                          virtualObj.current.enabled = true;
                        } else {
                          eventTypeObj.current.enabled = false;
                          virtualObj.current.enabled = false;
                        }}}
                        
                      
                    />
                <DropDownListComponent
                  id="eventType"
                  ref={eventTypeObj}
                  dataSource={clinics}
                  fields={{ text: "name", value: "id" }}
                  placeholder={t("Assigned Clinic")}
                  style={{marginTop:"2px"}}
                  popupHeight="200px"
                  enabled={false}
                  
                /> 
               

                <DropDownListComponent
                  id="online"
                  ref={virtualObj}
                  dataSource={virtualmeet}
                  fields={{ text: "platform", value: "id" }}
                  placeholder={t("Platform")}
                  style={{ marginTop: "2px" }}
                  popupHeight="200px"
                  enabled={false}
                />
                <DropDownListComponent
                      id="Type"
                      ref={typeObj}
                      dataSource={procedure}
                       
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Procedure Type")}
                      style={{ marginTop: "2px" }}
                      popupHeight="200px"
                    />
              </div>
              
                
                <TextBoxComponent
                  id="notes"
                  ref={notesObj}
                  placeholder={t("Additional Notes")}
                  style={{ marginTop: "2px" }}
                />
              </div>
            
          ) : (
            <div className="event-content">
              <div className="meeting-type-wrap">
                <label>{t("Title")}</label>:<span>{props.Subject}</span>
              </div>
              
              <div className="notes-wrap">
                <label>{t("Additional Notes")}</label>:<span>{props.Description}</span>
              </div>
              
            </div>
          )}
        </div>
      );
    };
 

    const footerTemplate = (props) => {
      return (
        <div className="quick-info-footer">
          {props.elementType === "cell" ? (
            <div className="cell-footer">
              <ButtonComponent
                id="event"
                cssClass="e-flat"
                content={t("Add Event")}
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
              <ButtonComponent
                id="new"
                cssClass="e-flat"
                content={t("New Patients")}
                onClick={buttonClickActions.bind(this)}
              />
              <ButtonComponent
                id="add"
                cssClass="e-flat"
                content={t("Book")}
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
              
            </div>
          ) : (
            <center>
            <div className="event-footer">
            {userRole !== "Secretary" && ( 
             <ButtonComponent
                id="EMR"
                cssClass="e-flat"
                content={t("Access EMR")}
                onClick={buttonClickActions.bind(this)}
              />)}
              <ButtonComponent
                id="more"
                cssClass="e-flat"
                content={t("Edit")}
                isPrimary={true}
                onClick={buttonClickActions.bind(this)}
              />
              <ButtonComponent
                id="delete"
                cssClass="e-flat"
                content={t("Delete")}
                onClick={buttonClickActions.bind(this)}
              />
  
              
               
            </div></center>
          )}
        </div>
      );
    };
    
      //NEW PATIENT POPUP
      const NewEvent = ({ isOpen, onClose }) => {
        // State for managing the form data
         
        // Function to handle changes in form fields
      
        if (!isOpen) return null;
      
        return (
      <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
      <div className="new-patients">
      <div >
      <div>
      <h2>{t("Add a new event")}</h2>
      
      
         
              <div className="quick-info-content">
               
                  <div className="e-cell-content">
                    <div className="content-area">
                      <TextBoxComponent
                        id="title"
                        ref={titleObj}
                        placeholder={t("Title")}
                        style={{ marginTop: "15px" }}
                      />
      
                     
                      <h3 style={{ marginTop: "0.5rem" , fontSize:"12px",color:"black"}}>{t("Appointment Details")}</h3>
                      <br/>
                      
                      <input
                    type="checkbox"
                    id="isAllDayCheckbox"
                    ref={isAllDayObj}
                   
                
                    
                  />
                  <label className='alldayy' >{t("All Day")}</label>
                      
                      <h4 style={{ marginTop: "0.8rem",fontSize:"12px",color:"black"}}>Date &nbsp;:</h4>
                      <DateTimePickerComponent
                        id="StartTime"
                        data-name="StartTime"
                        ref={startTimeObj}
                        value={selectedStartTime || new Date()}
                      
                
                      />
                     
                      <DateTimePickerComponent
                        id="EndTime"
                        data-name="EndTime"
                        ref={endTimeObj}
                        value={selectedEndTime || new Date()}
                      />
              
                    </div>
                    <div className="content-area">
                      <h3 style={{ marginTop: "0.5rem" , fontSize:"12px",color:"black"}}>{t("Event Details")}</h3>
                     
                      <TextBoxComponent
                        id="notes"
                        ref={DescEventObj}
                        placeholder={t("Additional Notes")}
                        style={{ marginTop: "15px" }}
                      />
                    </div></div>
                 
                  </div>
                <div className="bookcancel">
                  <ButtonComponent
                      id="addevent"
                      cssClass="e-flat"
                      content={t("Book")}
                      isPrimary={true}
                      onClick={buttonClickActions.bind(this)}
                    />
                <button className="closeddds" onClick={onClose}>
                {t("close")}
      </button>
       </div>
      
      
      </div></div>
      </div>
          </div>
        );
      };


    //NEW PATIENT POPUP
    const NewPatient = ({ isOpen, onClose, props }) => {
      // State for managing the form data
      const [selectedNature, setSelectedNature] = useState(null);
      // Function to handle changes in form fields
     // State for managing the visibility of other dropdowns
 
      if (!isOpen) return null;
    
      return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="new-patientssss">
    <div >
    <div >
    <h2>{t("Add a new patient")}</h2>
    
    
       
            <div className="quick-info-content">
             
                <div className="e-cell-content">
                  <div className="content-area">
                    <TextBoxComponent
                      id="first"
                      ref={firstNameObj}
                      placeholder={t("First Name")}
                      style={{ marginTop: "5px" }}
                    />
    
                    <TextBoxComponent
                      id="last"
                      ref={lastNameObj}
                      placeholder={t("Last Name")}
                      style={{ marginTop: "2px" }}
                    />
    
                    <TextBoxComponent
                      id="phone"
                      ref={phoneNumberObj}
                      placeholder={t("Phone Number: code+number (ex: 96170717171)")}
                      style={{ marginTop: "2px" }}
                    />
            
               
         
                  </div>
      
                  <div className="content-area">
                    <TextBoxComponent
                      id="chief"
                      ref={cheifObj}
                      placeholder={t("Chief Complaint")}
                      style={{marginTop:"2px"}}
                    />
      
                    <h3 style={{ marginTop: "0.5rem" , fontSize:"12px",color:"black"}}>{t("Appointment Details")}</h3>
                    <h4 style={{ marginTop: "0.5",fontSize:"10px",color:"black"}}>{t("Date ")}&nbsp;:</h4>
                    <DateTimePickerComponent
                      id="StartTime"
                      data-name="StartTime"
                      ref={startTimeObj}
                      value={selectedStartTime || new Date()}
                    
              
                    />
                    
                    <DateTimePickerComponent
                      id="EndTime"
                      data-name="EndTime"
                      ref={endTimeObj}
                      value={selectedEndTime || new Date()}
                    />
                    <DropDownListComponent
                      id="Nature"
                      ref={natureObj}
                      dataSource={[
                        { text: "Clinic", value: "Clinic" },
                        { text: "Virtual", value: "Virtual" }
                       
                      ]}
                      fields={{ text: "text", value: "value" }}
                      placeholder={t("Nature of appointment")}
                      style={{ marginTop: "2px" }}
                      popupHeight="200px"
                      change={(args) => {
                        setSelectedNature(args.value);
                      }}
                      
                    />
                    
                    <DropDownListComponent
                      id="eventType"
                      ref={eventTypeObj}
                      dataSource={clinics}
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Assigned Clinic")}
                      style={{marginTop:"2px"}}
                      popupHeight="200px"
                      enabled={selectedNature === 'Clinic'}
                    />
                    
                    <DropDownListComponent
                      id="online"
                      ref={virtualObj}
                      dataSource={virtualmeet}
                      fields={{ text: "platform", value: "id" }}
                      placeholder={t("Platform")}
                      style={{ marginTop: "2px" }}
                      popupHeight="200px"
                      enabled={selectedNature === 'Virtual'}
                    />
                   <DropDownListComponent
                      id="Type"
                      ref={typeObj}
                      dataSource={procedure}
                       
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Procedure Type")}
                      style={{ marginTop: "2px" }}
                      popupHeight="200px"
                    />
                  </div>
                  <div className="content-area">
                    <br/>
                   
                    
                    <TextBoxComponent
                      id="notes"
                      ref={notesObj}
                      placeholder={t("Additional Notes")}
                      style={{ marginTop: "2px" }}
                    />
                  </div></div>
               
                </div>
              <div className="bookcancel">
                <ButtonComponent
                    id="addnew"
                    cssClass="e-flat"
                    content={t("Book")}
                    isPrimary={true}
                    onClick={buttonClickActions.bind(this)}
                  />
              <button  className="closeddds"onClick={onClose}>
              {t("close")}
    </button>
     </div>
    
    </div></div>
    </div>
        </div>
      );
    };
    
const Edit= ({ isOpen, onClose, eventDetails, onSave, scheduleRef }) => {
  const [editedEvent, setEditedEvent] = useState({});

  useEffect(() => {
    setEditedEvent(eventDetails || {});
  }, [eventDetails]);
  console.log("details", eventDetails);   
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent({ ...editedEvent, [name]: value });
  };

  const handleSave = () => {
 
    onSave(editedEvent);
    console.log("event",editedEvent);
    
      updateEventInState(editedEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`popup-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="new-patientss">
        <div >
          <div >
            <h2>{t("Edit Event")}</h2>
            <div className="quick-info-content">
              <div className="e-cell-content">
                <div className="content-area">
                  <TextBoxComponent
                    id="title"
                    ref={titleEventObj}
                    placeholder={t("Title")}
                    style={{ marginTop: "10px" }}
                    name="Title"
                    value={editedEvent.Subject || ''}
                    onChange={handleInputChange}
                  />

                  <h3 style={{ marginTop: "0.5rem", fontSize: "16px", color: "black" }}>{t("Appointment Details")}</h3>
                  <h4 style={{ marginTop: "0.8rem", fontSize: "15px", color: "black" }}>{t("Date")}&nbsp;:</h4>
                  <DateTimePickerComponent
                    id="StartTime"
                    data-name="StartTime"
                    value={editedEvent.StartTime || new Date()}
                    name="StartTime"
                    onChange={handleInputChange}
                  />
                     <DateTimePickerComponent
                    id="EndTime"
                    data-name="EndTime"
                    value={editedEvent.EndTime || new Date()}
                    name="EndTime"
                    onChange={handleInputChange}
                  />
                 
                  
                  <TextBoxComponent
                    id="notes"
                    ref={DescEventObj}
                    placeholder={t("Additional Notes")}
                    style={{ marginTop: "15px" }}
                    name="Description"
                    value={editedEvent.Description || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="bookcancel">
            <ButtonComponent
              id="save"
              cssClass="e-flat"
              content={t("Save")}
              isPrimary={true}
              onClick={handleSave}
            />
            <button className="closeddds" onClick={onClose}>
              {t("close")}
            </button>
          </div>
        </div></div>
      </div>
    </div>
  );
};

//edit evets
const EditEvent = ({ isOpen, onClose, eventDetails, onSave, scheduleRef }) => {
  const [editedEvent, setEditedEvent] = useState({});

  useEffect(() => {
    setEditedEvent(eventDetails || {});
  }, [eventDetails]);
  console.log("details", eventDetails);   
  const handleInputChange = (e) => {
    console.log("e",e);
  const { name, value } = e.target;

  // Check if the name is "Nature"
  if (name === "Nature") {
    if (value === "Clinic") {
      console.log("Nature changed to Clinic");
      // If "Clinic" is selected, clear the "Virtual" value and set "Nature" to "Clinic"
      setEditedEvent({ ...editedEvent, Nature: "Clinic", Virtual: null });
    } else if (value === "Virtual") {
      console.log("Nature changed to Virtual");
      // If "Virtual" is selected, clear the "Clinic" value and set "Nature" to "Virtual"
      setEditedEvent({ ...editedEvent, Nature: "Virtual", RoomId: null });
    } else {
      setEditedEvent({ ...editedEvent, [name]: value });
    }
  } else {
    setEditedEvent({ ...editedEvent, [name]: value });
  }
};



  const handleSave = () => {
 
    onSave(editedEvent);
    console.log("event",editedEvent);
    
      updateEventInState(editedEvent);
    onClose();
  };

  if (!isOpen) return null;
  
  
  return (
    <div className={`popup-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="new-patient">
        <div >
          <div className='edittt'>
            <h2>{t("Edit Appointment")}</h2>
            <div className="quick-info-content">
              <div className="e-cell-content">
                <div className="content-area">
                  <TextBoxComponent
                    id="chief"
                    ref={cheifObj}
                    placeholder={t("Chief Complaint")}
                    style={{ marginTop: "10px", width:"auto" }}
                    name="Chief"
                    value={editedEvent.Chief || ''}
                    onChange={handleInputChange}
                    className='cal'
                  />

                  <h3 style={{ marginTop: "0.5rem", fontSize: "14px", color: "black" }}>{t("Appointment Details")}</h3>
                  <h3 style={{ marginTop: "0.8rem", fontSize: "13px", color: "black" }}>{t("Date")} &nbsp;:</h3>
                  <DateTimePickerComponent
                    id="StartTime"
                    data-name="StartTime"
                    value={editedEvent.StartTime || new Date()}
                    name="StartTime"
                    onChange={handleInputChange}
                  />
                     <DateTimePickerComponent
                    id="EndTime"
                    data-name="EndTime"
                    value={editedEvent.EndTime || new Date()}
                    name="EndTime"
                    onChange={handleInputChange}
                  />
                  {/* Add other input components here */}
                  <DropDownListComponent
                      id="Type"
                      ref={typeObj}
                      dataSource={procedure}
                       
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Procedure Type")}
                      style={{ marginTop: "10px" }}
                      popupHeight="200px"
                      name="Type"
                    value={editedEvent.Type || ''}
                    onChange={handleInputChange}
                    />
                    <DropDownListComponent
                      id="Nature"
                      ref={natureObj}
                      dataSource={[
                        { text: "Clinic", value: "Clinic" },
                        { text: "Virtual", value: "Virtual" }
                       
                      ]}
                      fields={{ text: "text", value: "value" }}
                      placeholder={t("Nature of appointment")}
                      style={{ marginTop: "10px" }}
                      popupHeight="200px"
                      name="Nature"
                    value={editedEvent.Nature || ''}
                    onChange={handleInputChange}
                    />
                  <DropDownListComponent
                      id="eventType"
                      ref={eventTypeObj}
                      dataSource={clinics}
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Assigned Clinic")}
                      style={{marginTop:"10px"}}
                      popupHeight="200px"
                      name="RoomId"
                      value={editedEvent.RoomId || ''}
                      onChange={handleInputChange}
                      enabled={editedEvent.Nature === "Clinic"}
                    />
                  <DropDownListComponent
                    id="online"
                    ref={virtualObj}
                    dataSource={virtualmeet}
                    fields={{ text: "platform", value: "id" }}
                    placeholder={t("Platform")}
                    style={{ marginTop: "10px" }}
                    popupHeight="200px"
                    name="Virtual"
                    value={editedEvent.Virtual || ''}
                    onChange={handleInputChange}
                    enabled={editedEvent.Nature === "Virtual"}
                  />
                  <TextBoxComponent
                    id="notes"
                    ref={notesObj}
                    placeholder={t("Additional Notes")}
                    style={{ marginTop: "15px" }}
                    name="Description"
                    value={editedEvent.Description || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="closeecancelll">
            <ButtonComponent
              id="save"
              cssClass="e-flat"
              content={t("Save")}
              isPrimary={true}
              onClick={handleSave}
            />
            <button className="closeddds" onClick={onClose}>
              {t("close")}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 


  //WAITING LIST
  const WaitingListPopup = ({ isOpen, onClose }) => {
    const [filterOptions, setFilterOptions] = React.useState(patients);
    const dataload = useRef(null);
    const [selectedNature, setSelectedNature] = useState(null);
  
    useEffect(() => {
      console.log("patients:", patients);
      setFilterOptions(patients);
      console.log("filterOptions:", filterOptions);
    }, [patients])
    if (!isOpen) return null;
  
    return (
      <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
        <div className="waiting-list-popup">
          <div className="waitinglistp">
            <h2>{t("Add to Waiting List")}</h2>
            <br/>
            <AutoCompleteComponent
              id="title"
              ref={titleEventObj}
              dataSource={patients}
              fields={{ value: "full_name_phone"}}
              placeholder="Choose patient"

          />


            <TextBoxComponent
              id="chief"
              ref={cheifObj}
              placeholder={t("Chief Complaint")}
              style={{ marginTop: "10px" }}
              // Add the necessary event handlers and value bindings here
            /><DropDownListComponent
                      id="Nature"
                      ref={natureObj}
                      dataSource={[
                        { text: "Clinic", value: "Clinic" },
                        { text: "Virtual", value: "Virtual" }
                       
                      ]}
                      fields={{ text: "text", value: "value" }}
                      placeholder={t("Nature of appointment")}
                      style={{ marginTop: "10px" }}
                      popupHeight="200px"
                      change={(args) => {
                        setSelectedNature(args.value);
                      }}
                      
                    />
                    
                    <DropDownListComponent
                      id="eventType"
                      ref={eventTypeObj}
                      dataSource={clinics}
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Assigned Clinic")}
                      style={{marginTop:"10px"}}
                      popupHeight="200px"
                      enabled={selectedNature === 'Clinic'}
                    />
                    
                    <DropDownListComponent
                      id="online"
                      ref={virtualObj}
                      dataSource={virtualmeet}
                      fields={{ text: "platform", value: "id" }}
                      placeholder={t("Platform")}
                      style={{ marginTop: "10px" }}
                      popupHeight="200px"
                      enabled={selectedNature === 'Virtual'}
                    />
                   <DropDownListComponent
                      id="Type"
                      ref={typeObj}
                      dataSource={procedure}
                       
                      fields={{ text: "name", value: "id" }}
                      placeholder={t("Procedure Type")}
                      style={{ marginTop: "10px" }}
                      popupHeight="200px"
                    />
          
                  
                 
                    <TextBoxComponent
                      id="notes"
                      ref={notesObj}
                      placeholder={t("Additional Notes")}
                      style={{ marginTop: "15px" }}
                    />
                  
             
              <div className="bottomwait">
                <ButtonComponent
                    id="addwait"
                    cssClass="e-flat"
                    content={t("Add to List")}
                    isPrimary={true}
                    onClick={buttonClickActions.bind(this)}
                    className='addtolistt'
                   
                  />
              <button className="closeddd" onClick={onClose}>
              {t("close")}
    </button></div>
    </div></div>
    </div>
    
    
      );
    };
    
    const [treeData, setTreeData] = useState([]);
    const [platforms, setPlatforms] = useState([]);
const [platformsLoaded, setPlatformsLoaded] = useState(false);

// Create a new useEffect to fetch the "virtualmeet" data

  const fetchPlatforms = async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/virtualmeet/`); // Replace with the actual endpoint
      console.log('Fetched platforms:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      // Handle the error as needed
    }
  };

 
    useEffect(() => {
   
      console.log('Tree Data:', treeData); // Log the treeData to check if full_name_phone and clinic are present
    }, [treeData]);
    const [patientsLoaded, setPatientsLoaded] = useState(false);
const [clinicsLoaded, setClinicsLoaded] = useState(false);
useEffect(() => {
  const fetchData = async () => {
    try {
      const [patientsData, clinicsData, platformData] = await Promise.all([
        fetchPatients(),
        fetchClinics(),
        fetchPlatforms(),
      ]);

      // Set the patient and clinic data in state
      // Also set patientsLoaded and clinicsLoaded to true
      setPatients(patientsData);
      setClinics(clinicsData);
      setPlatforms(platformData);
      setPatientsLoaded(true);
      setClinicsLoaded(true);
      setPlatformsLoaded(true);
    } catch (error) {
      console.error('Error fetching patient and clinic data:', error);
      // Handle the error as needed
    }
  };

  fetchData();
}, []);

    
    const fetchTree = async () => {
      try {
        const response = await Axios.get(`${API_BASE_URL}/appointment/`);
        console.log('Fetched data:', response.data);
    
        // Filter the appointments where startdate is null
        const filteredData = response.data.filter(appointment => appointment.startdate === null);
    
        // Map the data to replace patient and clinic IDs with actual names
        const mappedData = filteredData.map(appointment => {
          const patientInfo = patients.find(patient => patient.id === appointment.patient);
          const clinicInfo = clinics.find(clinic => clinic.id === appointment.clinic);
          const platformInfo = platforms.find(platform => platform.id === appointment.online);
          return {
            ...appointment,
            full_name_phone: patientInfo ? patientInfo.full_name_phone : '',
            platformname: platformInfo ? platformInfo.platform : '', 
            clinicname: clinicInfo ? clinicInfo.name : (platformInfo ? platformInfo.platform : ''),

          };
        });
    
        console.log('Mapped data:', mappedData);
    
        // Update the state with the mapped data
        setTreeData(mappedData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
    };
    
useEffect(() => {
  // Check if both patient and clinic data are loaded before calling fetchTree
  if (patientsLoaded && clinicsLoaded && platformsLoaded) {
    fetchTree();
  }
}, [patientsLoaded, clinicsLoaded, platformsLoaded]);


    const treeTemplate = (props) => {
      console.log("props", props);
        return (<div id="waiting">
        <div id="waitdetails">
          <div id="waitlist">{props.full_name_phone}</div>
          <div id="waitcategory">{props.clinicname}</div>
        </div>
      </div>);
    };
    const onItemSelecting = (args) => {
        args.cancel = true;
    };
    const onTreeDrag = (event) => {
        if (scheduleObj.current.isAdaptive) {
            let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
            if (classElement) {
                classElement.classList.remove('e-device-hover');
            }
            if (event.target.classList.contains('e-work-cells')) {
                addClass([event.target], 'e-device-hover');
            }
        }
    };
    const onActionBegin = (event) => {
        if (event.requestType === 'eventCreate' && isTreeItemDropped) {
            let treeViewData = treeObj.current.fields.dataSource;
            const filteredPeople = treeViewData.filter((item) => item.Id !== parseInt(draggedItemId, 10));
            treeObj.current.fields.dataSource = filteredPeople;
            let elements = document.querySelectorAll('.e-drag-item.treeview-external-drag');
            for (let i = 0; i < elements.length; i++) {
                remove(elements[i]);
            }
        }
    };
    const onTreeDragStop = (event, args) => {
      let treeElement = closest(event.target, '.e-treeview');
      let classElement = scheduleObj.current.element.querySelector('.e-device-hover');
      if (classElement) {
        classElement.classList.remove('e-device-hover');
      }
    
     
  if (!treeElement) {
    event.cancel = true;
    let scheduleElement = closest(event.target, '.e-content-wrap');

    if (scheduleElement) {
      const appointmentId = parseInt(event.draggedNodeData.id, 10);
      const cellData = scheduleObj.current.getCellDetails(event.target);
      const startTime = cellData.startTime;
      const endTime = cellData.endTime;

      // Find the appointment in treeData by id
      const updatedAppointmentIndex = treeData.findIndex(
        (appointment) => appointment.idappointment === appointmentId
      );

      if (updatedAppointmentIndex !== -1) {
        // Create a copy of the appointment data for PUT request
        const appointmentToUpdate = { ...treeData[updatedAppointmentIndex] };

        // Update the startdate and end_date properties in the copy
        appointmentToUpdate.startdate = startTime;
        appointmentToUpdate.end_date = endTime;
        console.log("toupdate", appointmentToUpdate);
      
    
        // Send a PUT request to update the appointment data
        Axios.put(`${API_BASE_URL}/appointment/${appointmentId}/`, appointmentToUpdate)
        .then((response) => {
          // Handle success
          
          console.log('Appointment updated:', response.data);
          const newEvent = {
            Id: appointmentToUpdate.idappointment,
            Subject: appointmentToUpdate.full_name_phone,
            StartTime: startTime,
            EndTime: endTime,
            Description: appointmentToUpdate.notes,
            RoomId: appointmentToUpdate.clinic,
            Chief: appointmentToUpdate.chief,
            Type: appointmentToUpdate.type,
            Virtual: appointmentToUpdate.online,
            PatientID: appointmentToUpdate.patient,
            Nature:appointmentToUpdate.nature,
            // Other properties that match the scheduler's structure
          };
          
          // Use scheduleObj.current.addEvent() to add the new event to the scheduler
          scheduleObj.current.addEvent(newEvent);
          
          fetchTree();
          if(newEvent.Type){
          updateTemplatesForAppointment(newEvent.Id, newEvent.StartTime, newEvent.EndTime);}
        })
        .catch((error) => {
          // Handle error
          console.error('Error updating appointment:', error);
        });
      
      }
    }
  }
  // ...
};
    
    
    const onTreeDragStart = () => {
        document.body.classList.add('e-disble-not-allowed');
    };
    
const ClinicLegend = ({ clinics }) => (
  <div className="clinic-legend">
    {clinics.map((clinic) => (
      <div key={clinic.id} className="clinic-item">
        <div className="color-box" style={{ backgroundColor: clinic.color || 'rgb(103, 80, 164)'}}></div>
        <div className="clinic-name">{clinic.name}</div>
      </div>
    ))}
  </div>
);


    return (
    <div className='schedule-control-section'>
      <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
     
        <div className="control-wrapper drag-sample-wrapper">
          <div className="schedule-container">
          <ClinicLegend clinics={clinics} /> 
          
            <ScheduleComponent 
              ref={scheduleObj}
              
              
              cssClass="schedule-drag-drop"
              width="100%"
              height="475px"
              dragStart={onDragStart}
              dragStop={onDragEnd}
              resizeStart={onResizeStart}
              resizeStop={onResizeEnd}
              selectedDate={selectedDate}
              enableRtl={rtl}
              currentView="Day" 
              timeScale = {{ enable: true, interval: 60, slotCount: 4 }}
              eventSettings={{
                dataSource: appoint,
                fields: {
                  subject: { title: 'Patient Name', name: 'Subject' },
                  startTime: { title: 'From', name: 'StartTime' },
                  endTime: { title: 'To', name: 'EndTime' },
                  description: { title: 'Reason', name: 'Description' },
                },
               
               
              }}
              
              group={{
                enableCompactView: true,
              
              }}
              
              actionBegin={onActionBegin}
           
           
           
              quickInfoTemplates={{ header: headerTemplate.bind(this), 
                content: contentTemplate.bind(this), footer: footerTemplate.bind(this) }} popupOpen={onPopupOpen.bind(this)}
           
           
           
           >
          <ResourcesDirective>
  
    <ResourceDirective
      field='RoomId'
      title='Clinic Name'
      textField='name'
      name="Clinics"
      idField='id'
      colorField='color'
      dataSource= {clinics}
      
    ></ResourceDirective>

</ResourcesDirective>

              <ViewsDirective>
              {views.map(view => (
          <ViewDirective key={view.option} option={view.option} displayName={view.displayName} />
        ))}

            </ViewsDirective>
              <Inject services={[Day, Week, Agenda,Month,WorkWeek, Resize, DragAndDrop]} />
            </ScheduleComponent>
          </div>
          <div className="treeview-container">
            <div className="title-container">
              <h1 className="title-text">{t("Waiting List")}</h1>
              <button onClick={openWaitingListPopup}  className='waiting'>{t("Add to Waiting List")}</button>
            </div>
            <TreeViewComponent
              ref={treeObj}
              cssClass="treeview-external-drag"
              dragArea=".drag-sample-wrapper"
              nodeTemplate={treeTemplate}
              fields={{
                dataSource: treeData, // Set the data source to your treeData
                id: 'idappointment', // Specify the id field from your data
                text: 'full_name_phone', // Specify the text field from your data
              }}
              nodeDragStop={onTreeDragStop}
              nodeSelecting={onItemSelecting}
              nodeDragging={onTreeDrag}
              nodeDragStart={onTreeDragStart}
              allowDragAndDrop={allowDragAndDrops}
            />
          </div>
        </div>
      </div>
      
      
      
      
    </div>
    
    <NewPatient
    isOpen={isPopupOpen}
    onClose={() => setIsPopupOpen(false)}
    selectedStartTime={selectedStartTime}
    selectedEndTime={selectedEndTime}
    
  />
<NewEvent
isOpen={isPopupEvetOpen}
onClose={closeEvPopup}/>
     <EditEvent
  isOpen={isEditPopupOpen}
  onClose={closeEditPopup}
  eventDetails={selectedEvent}
  onSave={saveEditedEvent}
  scheduleRef={scheduleObj}
/>
<Edit
  isOpen={isEditEvPopupOpen}
  onClose={closeEditEvPopup}
  eventDetails={selectedEvent}
  onSave={saveEditedEvent}
  scheduleRef={scheduleObj}
/>
<WaitingListPopup
      isOpen={isWaitingListPopupOpen}
      onClose={closeWaitingListPopup}
      // ... other props
    />
    </div>
  );
};
export default ExternalDragDrop;
