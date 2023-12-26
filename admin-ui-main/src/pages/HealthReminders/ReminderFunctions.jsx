import axios from 'axios';
import API_BASE_URL from '../../config/config';
export async function fetchRemindersWithTemplateId(templateId) {
    try {

    //   const appointmentResponse = await axios.get(`http://127.0.0.1:8000/appointment/${appointmentId}/`);
    //   const appointmentData = appointmentResponse.data;
  
    //   const typeResponse = await axios.get(`http://127.0.0.1:8000/procedure-instruction/${appointmentData.type}/`);
    //   const typeData = typeResponse.data;
  
      const recurrenceAndTemplateResponse = await axios.get(`${API_BASE_URL}/templatesandrecurrences/`);
      const allRecurrenceData = recurrenceAndTemplateResponse.data.result; // Access the 'result' property
      console.log("all", allRecurrenceData);
  
      // Filter the data locally
      const filteredRecurrenceData = allRecurrenceData.filter(item => {
        console.log('Item properties:', Object.keys(item));
  
        return (
          item.templateID__idTemplates === templateId
        );
      });
  
      console.log("rec", filteredRecurrenceData); // Log the filtered recurrence data
  
      return filteredRecurrenceData; // Return the filtered data if needed
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }


  const saveToDatabase = async (patientId, appointmentId, templateId, date, initialDate) => {
    try {
      const requestBody = {
        patient: patientId,
        appointment: appointmentId,
        templates: templateId,
        date: date,
        status: false,
        initial_date: initialDate
      };
  
      
      const apiUrl = `${API_BASE_URL}/patientreceivetemplates/`; 
  
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          
        },
      });
  
      console.log('Data saved:', response.data);
    } catch (error) {
      console.error('Error sending POST request to save data:', error);
      throw error;
    }
  };      

  
export async function sendScheduledWhatsAppMessages(templateId, date,patients){

        //fetch template by type and subtype

        console.log('got into sendscehdulewhatsappMessage')
        try {
          let recurrenceData;
          if (templateId){
            console.log('fetching reminders')
             recurrenceData = await fetchRemindersWithTemplateId(templateId);
          }
          else{
           console.log('no templateId provided');
           return;
        }

        console.log(patients)
        for (let i = 0; i < patients.length; i++) {
         const patient = patients[i];

          console.log('patient', patient);
          const now = new Date();
      
          let eventTime = new Date(date)
          for (const item of recurrenceData) {
          const sendInterval = parseInt(item.send);
          let scheduledTime;
          let occurrence = parseInt(item.occurrence);
          let initialScheduledTime;
          switch (item.type) {
            case 'custom': {
              if (!isNaN(sendInterval)) {
                let initialTime;
                initialScheduledTime=new Date(eventTime);
                if (item.appointment==='After'){
                  
                  scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 60000);
                  initialTime=scheduledTime;
                }
                else{
                  scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 60000);
                  initialTime=scheduledTime;
                }
                  saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime, eventTime);
                  for (let i = 1; i <= occurrence; i++) {
                    if (item.appointment === 'After') {
                      scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                      initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                    } else {
                      scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                      initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                    }
                    saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  }
              }
              break;
            }
            case 'daily': {
              if (!isNaN(sendInterval)) {
                let initialTime;
                initialScheduledTime=new Date(eventTime);
                if (item.appointment==='After'){
                  scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;}
                  else{
                  scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;}
              
                  saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  for (let i = 1; i <= occurrence; i++) {
                    if (item.appointment === 'After') {
                      scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                    } else {
                      scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                    }
                    saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  }
                }
              break;
            }
            case 'weekly': {
              if (!isNaN(sendInterval)) {
                let initialTime;
                initialScheduledTime=new Date(eventTime);
                if (item.appointment==='After'){
                  scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;}
                else{
                  scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;  
                }
                  saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  for (let i = 1; i <= occurrence; i++) {
                    if (item.appointment === 'After') {
                      scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                    } else {
                      scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                    }
                    saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  }
                }
              break;
            }
            case 'monthly': {
              if (!isNaN(sendInterval)) {
                let initialTime;
                initialScheduledTime=new Date(eventTime);
                if (item.appointment==='After'){
                  scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;}
                else{
                  scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;
                }
                  saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  for (let i = 1; i <= occurrence; i++) {
                    if (item.appointment === 'After') {
                      scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                    } else {
                      scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                    }
                    saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  }
              }
              break;
            }
            case 'annually': {
              if (!isNaN(sendInterval)) {
                let initialTime;
                initialScheduledTime=new Date(eventTime);
                if (item.appointment==='After'){
                  scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;
                }
                else{
                  scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialTime=scheduledTime;
                }
                  saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  for (let i = 1; i <= occurrence; i++) {
                    if (item.appointment === 'After') {
                      scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                    } else {
                      scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                      initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                    }
                    saveToDatabase(patient.id, null, item.templateID__idTemplates, scheduledTime,eventTime);
                  }
              }break;
            }
            default:
              break;
          }


        }
        }
    
    } catch (error) {
          console.error('Error sending scheduled WhatsApp messages:', error);
          throw error;
        }
      

}

export async function fetchTemplatesByTypeandSubtype(type, subtype) {
    try {
      // Fetch all appointments
      const templatesResponse = await axios.get(`${API_BASE_URL}/templates/`);
      const allTemplates = templatesResponse.data;
//   console.log("all", allAppointments);
//   console.log("sub", subtype);
      // Filter appointments based on type
      const filteredTemplatesbyType = allTemplates.filter(template => (
        template.type === type 
      ));
  
      // Log the filtered appointments
      console.log("Templates with similar subtype:", filteredTemplatesbyType);
  
    
      const filteredTemplatesbySubtype = filteredTemplatesbyType.filter(template => (
        template.subType === subtype 
      ));

      return filteredTemplatesbySubtype; // Return the filtered data 
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }


export async function scheduleReminders( type ,subtype, date,patients) {
    try {
      // Fetch appointments with the same subtype
    //   const typeResponse = await axios.get(`http://127.0.0.1:8000/${type}/`);
    //   const typeData = typeResponse.data.find(type => type.name === subtype);

        console.log('we are in scheduleReminders');
        const templates = await fetchTemplatesByTypeandSubtype(type, subtype);
        console.log('Templates with specified type and subtype :', templates );
        // Process appointments as needed
        for (const template of templates) {
                console.log('template ', template.idTemplates)
        //   Fetch recurrence data for the template
          await sendScheduledWhatsAppMessages( template.idTemplates,date, patients);
    
        //   console.log(`Reminders scheduled for appointment ${appointment.idappointment}`);
        }
    
        console.log('scheduling done for all templates ')
        // console.log('Reminders scheduled for all appointments with similar subtype');
     
  
      // Iterate through appointments and schedule reminders
     
    } catch (error) {
      console.error('Error scheduling reminders for appointments:', error);
      throw error;
    }
  }


  
export async function sendScheduledWhatsAppMessagesOnePatient(templateId, date,patientId){

    //fetch template by type and subtype

    console.log('got into sendscehdulewhatsappMessage')
    try {
      let recurrenceData;
      if (templateId){
        console.log('fetching reminders')
         recurrenceData = await fetchRemindersWithTemplateId(templateId);
      }
      else{
       console.log('no templateId provided');
       return;
    }

      const now = new Date();
  
      let eventTime = new Date(date)
      for (const item of recurrenceData) {
      const sendInterval = parseInt(item.send);
      let scheduledTime;
      let occurrence = parseInt(item.occurrence);
      let initialScheduledTime;
      switch (item.type) {
        case 'custom': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialScheduledTime=new Date(eventTime);
            if (item.appointment==='After'){
              
              scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 60000);
              initialTime=scheduledTime;
            }
            else{
              scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 60000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime, eventTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                  initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                  initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                }
                saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              }
          }
          break;
        }
        case 'daily': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialScheduledTime=new Date(eventTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
              else{
              scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
          
              saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              }
            }
          break;
        }
        case 'weekly': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialScheduledTime=new Date(eventTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 7 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
            else{
              scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 7 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;  
            }
              saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              }
            }
          break;
        }
        case 'monthly': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialScheduledTime=new Date(eventTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 30 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
            else{
              scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 30 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              }
          }
          break;
        }
        case 'annually': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialScheduledTime=new Date(eventTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialScheduledTime.getTime() + sendInterval * 365 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
            else{
              scheduledTime = new Date(initialScheduledTime.getTime() - sendInterval * 365 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialScheduledTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientId, null, item.templateID__idTemplates, scheduledTime,eventTime);
              }
          }break;
        }
        default:
          break;
      }


    
    }

} catch (error) {
      console.error('Error sending scheduled WhatsApp messages:', error);
      throw error;
    }
  

}

    async function fetchRemindersTemplate(templateId) {
        try {
        const recurrenceAndTemplateResponse = await axios.get(`${API_BASE_URL}/patientreceivetemplates/`);
        const filteredTemplates = recurrenceAndTemplateResponse.data.filter(template => template.templates === templateId);
        console.log("Filtered templates:", filteredTemplates);
        return filteredTemplates;
    
        } catch (error) {
        console.error('Error fetching template details:', error);
        throw error;
        }
    }
 

    async function fetchRemindersTemplateDistinct(patientReceiveTemplates) {
        try {
          // Use Set to track unique patient IDs
          const uniquePatientIds = new Set();
      
          // Filter the templates array to include only elements with distinct patient_id
          const distinctTemplates = patientReceiveTemplates.filter(template => {
            // Check if patient_id is not in the Set, add it, and return true to include the element
            if (!uniquePatientIds.has(template.patient)) {
              uniquePatientIds.add(template.patient);
              return true;
            }
            // If patient_id is already in the Set, return false to exclude the element
            return false;
          });
      
          console.log("Distinct templates:", distinctTemplates);
          return distinctTemplates;
        } catch (error) {
          console.error('Error fetching distinct template details:', error);
          throw error;
        }
      }
  
  
  export async function updateGeneralReminders(templateId) {
    try {
      const patientReceiveTemplates = await fetchRemindersTemplate(templateId);
      const distinctPatientTemplates = await fetchRemindersTemplateDistinct(patientReceiveTemplates);


      for (const template of distinctPatientTemplates){
        await sendScheduledWhatsAppMessagesOnePatient(templateId,template.initial_date, template.patient )
      }
      //delete all reminders with same templateId 
      for (const template of patientReceiveTemplates) {
        if (template.status === false) {

          await deleteTemplate(template.id);

        } else {
          console.log(`Template with ID ${template.id} has status true. Skipping deletion.`);
        }
      }

    } catch (error) {
      console.error('Error updating templates for appointment:', error);
      throw error;
    }
  }

  async function deleteTemplate(templateId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/patientreceivetemplates/${templateId}/`);
      console.log(`Template with ID ${templateId} deleted successfully`);
      return response.data; 
    } catch (error) {
      console.error(`Error deleting template with ID ${templateId}:`, error);
      throw error;
    }
  }
    