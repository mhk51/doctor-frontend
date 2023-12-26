import React, { useState, useEffect } from "react";
import axios from "axios";
import "./messagetemplate.scss";
import TextBox from "../TextBox/TextBox";
import { Edit } from "@mui/icons-material";
import { File, X } from "@phosphor-icons/react";
import DropDown from "../DropDown/DropDown";
import DeleteMessageTemplate from "../Buttons/DeleteMessageTemplate/DeleteMessageTemplate";
import Recurrence from "../../Recurrence/Recurrence";
import { Dropdown } from "bootstrap";
import SaveButton from "../Buttons/Save/SaveButton";
import CancelButton from "../Buttons/Cancel/CancelButton";
import {updateReminders, scheduleRemindersForAppointments} from '../../Calendar/AppointmentFunctions';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../../config/config";
import { scheduleReminders, updateGeneralReminders } from "../../../pages/HealthReminders/ReminderFunctions";
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

const MessageTemplate = (props) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('Message Title');
  const [text, setText] = useState(null);
  const [putAttachmentId, setPutAttachmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedRecurrenceType, setSelectedRecurrenceType] = useState(null);
  const [isRecurrenceOpen, setIsRecurrenceOpen] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [appointmentType, setAppointmentType] = useState(props.type);
  const [subtype, setSubtype] = useState(props.subtype);
  const [recurrenceDetails, setRecurrenceDetails] = useState(null);
  const [expire, setExpire] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      
      console.log('edittedmsgID:',props.editMessageID)
      if (props.editMessageID) {
        await fetchTemplateData(props.editMessageID);
      }
    };

    fetchData();
  }, [props.editMessageID]);

  // Function to fetch template data
  const fetchTemplateData = async (messageID) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/templatesandrecurrences/${messageID}/`);
      const templateData = response.data.result;
      console.log(templateData);
  
      const recurrenceDetailsData = {
        send: templateData.send,
        appointment: templateData.appointment,
        occurrence: templateData.occurrence,
      };
  
      // Clear existing message types
      setSelectedMessageType(null);
  
      if (templateData.templateID.body) {
        setSelectedMessageType("text");
      }
  
      const attachment = await axios.get(`${API_BASE_URL}/attachment-reminders/?templateID=${props.templateId}`);
      if (attachment.data[0]) {
        setSelectedMessageType("attachment");
        setSelectedFile(attachment.data[0]);
        setPutAttachmentId(attachment.data[0].idAttachment);
      }
  
      setMessage(templateData.templateID.name);
      setSelectedRecurrenceType(templateData.type);
      setText(templateData.templateID.body);
      setRecurrenceDetails(recurrenceDetailsData);
      setExpire(templateData.templateID.expire);
    } catch (error) {
      console.error('Error fetching template data:', error);
    }
  };
  
  
  

  // Function to toggle between edit and read-only mode
  const toggleEditMode = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  // Function to handle text changes
  const handleTextChange = (e) => {
    setMessage(e.target.value);
  };

  // Function to handle text box changes
  const handleTextBoxChange = (e) => {
    setText(e.target.value);
  };

  // Function to handle file changes
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle message type changes
  const handleMessageTypeChange = (e) => {
    const { value } = e.target;
    setSelectedMessageType(value);
  };

  // Function to handle recurrence type changes
  const handleRecurrenceTypeChange = (selectedOption) => {
    setSelectedRecurrenceType(selectedOption.target.value);
    setIsRecurrenceOpen(true);
  };

  // Function to close the recurrence section
  const handleRecurrenceClose = () => {
    setIsRecurrenceOpen(false);
    setSelectedRecurrenceType(null);
    setRecurrenceDetails(null);
  };

  // Function to handle delete button click
  const handleDelete = () => {
    
    props.onDelete();
  };

  // Function to save attachment

  const saveAttachment = async (file, templateID, attachmentID) => {
    try {
      if (file && file.attachment_file) {
        // If attachment_file exists in file, avoid making the request
        console.log("att",file.attachment_file);
        console.log('Attachment file exists. Skipping attachment update.');
      } else if (file) {
        console.log("fi",file);
        console.log("att2",file.attachment_file);
        // If no attachment_file exists, proceed with creating or updating the attachment
        let formData = new FormData();
        formData.append("attachment_file", file);
        formData.append("name", file.name);
        formData.append("Date", new Date().toISOString());
        formData.append("templateID", templateID);
        formData.append("type", file.type);
        formData.append("files", null); 
  
        let axiosConfig = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
  
        if (attachmentID) {
          console.log('putting attachment');
          await axios.put(`${API_BASE_URL}/attachment-reminders/${attachmentID}/`, formData, axiosConfig);
        } else {
          console.log('posting attachment');
          await axios.post(`${API_BASE_URL}/attachment-reminders/`, formData, axiosConfig);
        }

      } else {
        // Handle the scenario where no file is attached
        console.log('No file attached. No attachment update needed.');
      }
    }
   catch (error) {
    console.error('Error in saveAttachment:', error);
    throw error;
  }
};


// Function to handle save button click
const handleSave = async () => {
    const { editMessageID, templateId, getTemplates } = props;

    // Check if any field is empty
    if (!message || !appointmentType || !subtype || !selectedRecurrenceType || (!text && !selectedFile)) {
      // Show an alert to the user indicating that all fields must be filled
      alert("Please fill in all fields before saving.");
      return;
    }

    // Define template data
    const templateData = {
      name: message,
      type: appointmentType,
      subType: subtype,
      body: text,
      expire: expire,
    };

    let templateID;
    
    try {
      // If editing, use PUT request to update the existing template
      if (props.editMessageID) {
        const response = await axios.put(`${API_BASE_URL}/templates/${props.templateId}/`, templateData);
        templateID = response.data.idTemplates;
      } else {
        // If not editing, use POST request to create a new template
        const response = await axios.post(`${API_BASE_URL}/templates/`, templateData);
        templateID = response.data.idTemplates;
      }
    } catch (error) {
      console.error('Error saving template:', error);
      // Show an alert if there was an error with the template request
      alert("Error saving template. Please try again.");
      return;
    }
    console.log("rec",recurrenceDetails);
    // Check if recurrence details are provided
    if (recurrenceDetails && recurrenceDetails.send && recurrenceDetails.appointment && (recurrenceDetails.hasOwnProperty('occurrence') || recurrenceDetails.occurrence === 0)) {
      const recurrenceData = {
        send: recurrenceDetails.send,
        appointment: recurrenceDetails.appointment,
        occurrence: recurrenceDetails.occurrence,
        type: selectedRecurrenceType,
        templateID: templateID,
      };

      try {
        // Use PUT request to update the existing recurrence data
        if (props.editMessageID) {
          await axios.put(`${API_BASE_URL}/recurrences/${props.editMessageID}/`, recurrenceData);
          if (templateData.type==='Procedure Instruction'){
          updateReminders(recurrenceData.templateID);}
          else{
            updateGeneralReminders(recurrenceData.templateID)
          }
        } else {
          // Use POST request to create new recurrence data
          await axios.post(`${API_BASE_URL}/recurrences/`, recurrenceData);
          if (templateData.type==='Procedure Instruction'){
          scheduleRemindersForAppointments(recurrenceData.templateID, templateData.subType);}

        // }else{
        //   scheduleReminders(recurrenceData.templateID,templateData.type, templateData.subType )
        // }
      }
      } catch (error) {
        console.error('Error saving recurrence:', error);
        // Show an alert if there was an error with the recurrence request
        alert("Error saving recurrence. Please try again.");
        return;
      }

      if (selectedFile || putAttachmentId) {
        try {
          if (props.editMessageID) {
            await saveAttachment(selectedFile, templateID, putAttachmentId);
          } else {
            await saveAttachment(selectedFile, templateID, null);
          }
        } catch (error) {
          console.error('Error saving attachment:', error);
          // Show an alert if there was an error with the attachment request
          alert("Error saving attachment. Please try again.");
          return;
        }
      
      }
    } else {
      // Show an alert if recurrence details are missing
      alert("Please provide all recurrence details before saving.");
      return;
    }

    props.getTemplates();
    handleDelete();
  };



  // Function to update recurrence details
  const updateRecurrenceDetails = (details) => {
    setRecurrenceDetails(details);
    setIsRecurrenceOpen(false);
  };

  const options = [ 'custom','daily', 'weekly', 'monthly', 'annually'];

  return (
    <div className="container-with-recurrence">
      <div className="msg">
        <div className="col1">
          <div className="row1">
            {isEditing ? (
              <input
                type="text"
                value={message}
                onChange={handleTextChange}
                style={{
                  marginRight: "1rem",
                  border: "1px solid #b3b3b3",
                  borderRadius: "5px",
                  padding: "0.2rem",
                  color: "#b3b3b3",
                }}
              />
            ) : (
              <h2>{message}</h2>
            )}
            <Edit
              fontSize="0.75rem"
              style={{ color: "#004957" }}
              onClick={toggleEditMode}
            />
          </div>

          <div className="row3">

            <h3>{t("Recurrence")}</h3>

      

            {/* Dropdown component */}
            <DropDown
              options={options}
              value={selectedRecurrenceType}
              onChange={handleRecurrenceTypeChange}
              text={`Selected Recurrence Type: ${selectedRecurrenceType || ""}`}
            />

            {/* Conditionally render Recurrence component */}
            <div >
              {selectedRecurrenceType && isRecurrenceOpen && (
                <Recurrence
                  recurrenceType={selectedRecurrenceType}
                  isOpen={isRecurrenceOpen}
                  onClose={handleRecurrenceClose}
                  updateRecurrenceDetails={updateRecurrenceDetails}
                />
              )}
            </div>
          </div>

          {recurrenceDetails && !isRecurrenceOpen && (
            <p style={{ fontSize: '14px', margin: '5px' }}>

              {t("Send ")}{recurrenceDetails.send}{' '}

              {selectedRecurrenceType === 'custom'
                ? 'hour(s)'
                : selectedRecurrenceType === 'daily'
                  ? 'day(s)'
                  : selectedRecurrenceType === 'weekly'
                    ? 'week(s)'
                    : selectedRecurrenceType === 'monthly'
                      ? 'month(s)'
                      : selectedRecurrenceType === 'annually'
                        ? 'year(s)'
                        : ''}{' '}
              {recurrenceDetails.appointment}{' '}  appointment. Occurrences : {recurrenceDetails.occurrence}
            </p>
          )}

          {/* Message Type section */}
          <div className="message-type-section">
          <h3>{t("Message Type:")}</h3>
          <div className="message-type-radio">
            <input
              type="radio"
              value="text"
              checked={selectedMessageType === "text"}
              onChange={handleMessageTypeChange}
              disabled={props.editMessageID && selectedMessageType !== "text"}
            />
            <label htmlFor="text">{t("Text")}</label>
          </div>
          <div className="message-type-radio">
            <input
              type="radio"
              value="attachment"
              checked={selectedMessageType === "attachment"}
              onChange={handleMessageTypeChange}
              disabled={props.editMessageID && selectedMessageType !== "attachment"}
            />
            <label htmlFor="attachment">{t("Attachment")}</label>
          </div>
        </div>
{/* Add the checkbox for expire attribute */}
<div className="row5" style={{ display: 'flex', direction:"row"}}>
          <label>
            Expire: </label>
            <input
              type="checkbox"
              checked={expire}
              onChange={() => setExpire(!expire)}
            />
        
        </div>
          <div className="row4">
            <DeleteMessageTemplate onclick={handleDelete} />
            <SaveButton onClick={handleSave} />
          </div>
        </div>

        {/* Column 2 for Text area or File Attachment */}
        <div className="col2">
          {selectedMessageType === "text" && (
            <div className="text-section">
              <textarea
                value={text}
                onChange={handleTextBoxChange}
                placeholder="Enter your text here..."
              />
            </div>
          )}

          {selectedMessageType === "attachment" && (
            <div className="attachment-section">
              <input type="file" onChange={handleFileChange} />
              <p style={{ fontSize: '15px', margin: '10px' }}>{selectedFile?.name || " "}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageTemplate;