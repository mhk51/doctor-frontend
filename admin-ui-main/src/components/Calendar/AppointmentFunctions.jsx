import axios from 'axios';
import API_BASE_URL from '../../config/config';
export async function fetchReminders(appointmentId) {
  try {
    const appointmentResponse = await axios.get(`${API_BASE_URL}/appointment/${appointmentId}/`);
    const appointmentData = appointmentResponse.data;

    const typeResponse = await axios.get(`${API_BASE_URL}/procedure-instruction/${appointmentData.type}/`);
    const typeData = typeResponse.data;

    const recurrenceAndTemplateResponse = await axios.get(`${API_BASE_URL}/templatesandrecurrences/`);
    const allRecurrenceData = recurrenceAndTemplateResponse.data.result; // Access the 'result' property
    console.log("all", allRecurrenceData);

    // Filter the data locally
    const filteredRecurrenceData = allRecurrenceData.filter(item => {
      console.log('Item properties:', Object.keys(item));

      return (
        item.templateID__type === 'Procedure Instruction' &&
        item.templateID__subType === typeData.name
      );
    });

    console.log("rec", filteredRecurrenceData); // Log the filtered recurrence data

    return filteredRecurrenceData; // Return the filtered data if needed
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}
export async function fetchRemindersWithTemplateId(appointmentId,templateId) {
  try {
    const appointmentResponse = await axios.get(`${API_BASE_URL}/appointment/${appointmentId}/`);
    const appointmentData = appointmentResponse.data;

    const typeResponse = await axios.get(`${API_BASE_URL}/procedure-instruction/${appointmentData.type}/`);
    const typeData = typeResponse.data;

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
export async function sendScheduledWhatsAppMessages(appointmentId,templateID) {
    try {
      let recurrenceData;
      if (templateID){
         recurrenceData = await fetchRemindersWithTemplateId(appointmentId,templateID);
      }
      else{
       recurrenceData = await fetchReminders(appointmentId);}
      const appointmentResponse = await axios.get(`${API_BASE_URL}/appointment/${appointmentId}/`);
      const appointmentData = appointmentResponse.data;
      const patientResponse = await axios.get(`${API_BASE_URL}/patients/${appointmentData.patient}/`);
      const patientData = patientResponse.data;
  
      const now = new Date();
      let appointmentEndTime = new Date(appointmentData.end_date); 
      let appointmentStartTime= new Date (appointmentData.startdate);
      for (const item of recurrenceData) {
      const sendInterval = parseInt(item.send);
      let scheduledTime;
      let occurrence = parseInt(item.occurrence);

            // Keep track of initial start and end times for each case
            let initialStartTime;
            let initialEndTime;
      switch (item.type) {
        case 'custom': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialStartTime = new Date(appointmentStartTime);
            initialEndTime = new Date(appointmentEndTime);
            if (item.appointment==='After'){
              
              scheduledTime = new Date(initialEndTime.getTime() + sendInterval * 60000);
              initialTime=scheduledTime;
            }
            else{
              scheduledTime = new Date(initialStartTime.getTime() - sendInterval * 60000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                  initialEndTime = new Date(initialTime.getTime() + i * sendInterval * 60000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                  initialStartTime = new Date(initialTime.getTime() - i * sendInterval * 60000);
                }
                saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              }
          }
          break;
        }
        case 'daily': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialStartTime = new Date(appointmentStartTime);
            initialEndTime = new Date(appointmentEndTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialEndTime.getTime() + sendInterval * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
              else{
              scheduledTime = new Date(initialStartTime.getTime() - sendInterval * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
          
              saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                  initialEndTime = new Date(initialTime.getTime() + i * sendInterval * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                  initialStartTime = new Date(initialTime.getTime() - i * sendInterval * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              }
            }
          break;
        }
        case 'weekly': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialStartTime = new Date(appointmentStartTime);
            initialEndTime = new Date(appointmentEndTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialEndTime.getTime() + sendInterval * 7 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
            else{
              scheduledTime = new Date(initialStartTime.getTime() - sendInterval * 7 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;  
            }
              saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialEndTime = new Date(initialTime.getTime() + i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                  initialStartTime = new Date(initialTime.getTime() - i * sendInterval * 7 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              }
            }
          break;
        }
        case 'monthly': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialStartTime = new Date(appointmentStartTime);
            initialEndTime = new Date(appointmentEndTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialEndTime.getTime() + sendInterval * 30 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;}
            else{
              scheduledTime = new Date(initialStartTime.getTime() - sendInterval * 30 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialEndTime = new Date(initialTime.getTime() + i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                  initialStartTime = new Date(initialTime.getTime() - i * sendInterval * 30 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              }
          }
          break;
        }
        case 'annually': {
          if (!isNaN(sendInterval)) {
            let initialTime;
            initialStartTime = new Date(appointmentStartTime);
            initialEndTime = new Date(appointmentEndTime);
            if (item.appointment==='After'){
              scheduledTime = new Date(initialEndTime.getTime() + sendInterval * 365 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
            else{
              scheduledTime = new Date(initialStartTime.getTime() - sendInterval * 365 * 24 * 60 * 60 * 1000);
              initialTime=scheduledTime;
            }
              saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              for (let i = 1; i <= occurrence; i++) {
                if (item.appointment === 'After') {
                  scheduledTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialEndTime = new Date(initialTime.getTime() + i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                } else {
                  scheduledTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                  initialStartTime = new Date(initialTime.getTime() - i * sendInterval * 365 * 24 * 60 * 60 * 1000);
                }
                saveToDatabase(patientData.id, appointmentId, item.templateID__idTemplates, scheduledTime);
              }
          }break;
        }
        default:
          break;
      }
    }} catch (error) {
      console.error('Error sending scheduled WhatsApp messages:', error);
      throw error;
    }
  }
  
  const saveToDatabase = async (patientId, appointmentId, templateId, date) => {
    try {
      const requestBody = {
        patient: patientId,
        appointment: appointmentId,
        templates: templateId,
        date: date,
        status: false,
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

  async function fetchPatientReceiveTemplatesForAppointment(appointmentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/patientreceivetemplates/`);
      const filteredTemplates = response.data.filter(template => template.appointment === appointmentId);
      console.log("Filtered templates:", filteredTemplates);
      return filteredTemplates;
    } catch (error) {
      console.error('Error fetching patientReceiveTemplates:', error);
      throw error;
    }
  }
  
  
  export async function updateTemplatesForAppointment(appointmentId, newStartDate, newEndDate) {
    try {
      const patientReceiveTemplates = await fetchPatientReceiveTemplatesForAppointment(appointmentId);
  
      for (const template of patientReceiveTemplates) {
        if (template.status === false) {
          await deleteTemplate(template.id);
        } else {
          console.log(`Template with ID ${template.id} has status true. Skipping deletion.`);
        }
      }
  
      await sendScheduledWhatsAppMessages(appointmentId);
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
    
  

  

  
  /*export async function updateReminders(templateId) {
    try {
      const patientReceiveTemplates = await fetchRemindersTemplate(templateId);
  
      for (const template of patientReceiveTemplates) {
        if (template.status === false) {
          await deleteTemplate(template.id);
          await sendScheduledWhatsAppMessages(template.appointment, template.templates);
        } else {
          console.log(`Template with ID ${template.id} has status true. Skipping deletion.`);
        }
      }
      } catch (error) {
      console.error('Error updating templates for appointment:', error);
      throw error;
    }
  }
  */
  export async function updateReminders(templateId) {
    try {
          const patientReceiveTemplates = await fetchRemindersTemplate(templateId);
      
          // Extract unique appointment IDs from the templates
          const uniqueAppointments = Array.from(new Set(patientReceiveTemplates.map(template => template.appointment)));
      
          // Delete all templates with the same appointment and template ID
          for (const appointment of uniqueAppointments) {
            console.log("app",appointment);
            await deleteTemplatesByAppointmentAndTemplate(appointment, templateId);
          }
      
          // Recreate the templates
          for (const appointment of uniqueAppointments) {
            await sendScheduledWhatsAppMessages(appointment, templateId);
          }
      
        } catch (error) {
          console.error('Error updating templates for appointment:', error);
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
  async function deleteTemplatesByAppointmentAndTemplate(appointmentId, templateId) {
    try {
      // Fetch all patient receive templates
      const response = await axios.get(`${API_BASE_URL}/patientreceivetemplates/`);
      const allTemplates = response.data;
  
      // Filter templates based on appointment and template ID
      const templatesToDelete = allTemplates.filter(template =>
        template.appointment === appointmentId && template.templates === templateId
      );
  
      // Delete each template individually
      for (const templateToDelete of templatesToDelete) {
        await axios.delete(`${API_BASE_URL}/patientreceivetemplates/${templateToDelete.id}/`);
        console.log(`Template with ID ${templateToDelete.id} deleted successfully`);
      }
  
    } catch (error) {
      console.error(`Error deleting templates for appointment ${appointmentId} and template ${templateId}:`, error);
      throw error;
    }
  }
  
  export async function fetchAppointmentsBySubtype(subtype) {
    try {
      // Fetch all appointments
      const appointmentsResponse = await axios.get(`${API_BASE_URL}/appointment/`);
      const allAppointments = appointmentsResponse.data;
  console.log("all", allAppointments);
  console.log("sub", subtype);
      // Filter appointments based on subtype
      const filteredAppointments = allAppointments.filter(appointment => (
        appointment.type === subtype 
      ));
  
      // Log the filtered appointments
      console.log("Appointments with similar subtype:", filteredAppointments);
  
      return filteredAppointments; // Return the filtered data 
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }
  
  // Function to schedule reminders for appointments with a specific template
  export async function scheduleRemindersForAppointments(templateId, subtype) {
    try {
      // Fetch appointments with the same subtype
      const typeResponse = await axios.get(`${API_BASE_URL}/procedure-instruction/`);
      const typeData = typeResponse.data.find(type => type.name === subtype);

      if (typeData) {
        const appointments = await fetchAppointmentsBySubtype(typeData.id);
        console.log('Appointments for type with ID', typeData.id, ':', appointments);
        // Process appointments as needed
        for (const appointment of appointments) {
          // Fetch recurrence data for the template
          
          await sendScheduledWhatsAppMessages(appointment.idappointment, templateId);
    
          console.log(`Reminders scheduled for appointment ${appointment.idappointment}`);
        }
    
        console.log('Reminders scheduled for all appointments with similar subtype');
      } else {
        console.error('No matching type found for the given subtype');
      }
  
      // Iterate through appointments and schedule reminders
     
    } catch (error) {
      console.error('Error scheduling reminders for appointments:', error);
      throw error;
    }
  }
  /*const sendMessage = async (item, patientData) => {
    try {
      const authToken = 'EAAFSezp24bEBOZCalxYs8VRPIX5uDZCqcB9ZCIDRTiNdRaLLgZCoSrH5eiLvRMAVsUsZBfh5IPpy8wpZAZCUaQxR3UztKCe3TlpCAehdFe4j6PZBZCZBP0JdR0RIVkZBz9oUZBDSRHwk2mdZCGplHHoZAKdRtcZC6Mf46aNZA66g6wuJm6HpwUiAQaQIivLcQMGB9yqfBV6ZCCUco5NJp7zMUQxzQtQYr22QyMJZC1ChKiBZB3wuA8VohUZD';
      const phoneNumberID = '189179114270760';
      const apiUrlMedia = `https://graph.facebook.com/v17.0/${phoneNumberID}/media`;
      const apiUrl = `https://graph.facebook.com/v17.0/189179114270760/messages`;
  
      let requestBody = {};
  
      if (item.templateID__body === null) {
        const attachmentResponse = await axios.get(`${API_BASE_URL}/attachment-reminders/`, {
          params: {
            templateID: item.templateID,
          },
        });
        const attachmentData = attachmentResponse.data;
  
        if (attachmentData.length > 0) {
          const attachment = attachmentData[0];
          const fileResponse = await fetch(attachment.attachment_file);
          const fileBlob = await fileResponse.blob();
          const file = new File([fileBlob], attachment.name || 'attachment', { type: attachment.type });
  
          // Check if the attachment type is supported
          if (!isMediaTypeSupported(attachment.type)) {
            console.log(`Unsupported media type: ${attachment.type}`);
            return; // Return if attachment type is not supported
          }
  
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', attachment.type);
          formData.append('messaging_product', 'whatsapp');
  
          const uploadResponse = await fetch(apiUrlMedia, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
          });
  
          const uploadResult = await uploadResponse.json();
          const mediaType = getMediaContent(attachment.type);
  
          if (uploadResult.id && mediaType) {
            requestBody = {
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: patientData.phone,
              type: mediaType,
              [mediaType]: {
                id: uploadResult.id,
              },
            };
  
            const response = await axios.post(apiUrl, requestBody, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            });
  
            console.log('Media message sent:', response.data);
          }
        }
      } else {
        requestBody = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: patientData.phone,
          type: 'text',
          text: {
            preview_url: false,
            body: item.templateID__body,
          },
        };
  
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
  
        console.log('Text message sent:', response.data);
      }
    } catch (error) {
      console.error('Error sending WhatsApp messages:', error);
      throw error;
    }
  };
  
  const isMediaTypeSupported = (mediaType) => {
    const supportedTypes = [
      'audio/aac',
      'audio/mp4',
      'audio/mpeg',
      'audio/amr',
      'audio/ogg',
      'audio/ogg; codecs:opus',
      'text/plain',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'video/mp4',
      'video/3gp',
      'image/webp',
    ];
  
    return supportedTypes.includes(mediaType);
  };
  
  const getMediaContent = (mediaType) => {
    const supportedMediaTypes = {
      'audio': ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg', 'audio/ogg; codecs:opus'],
      'document': [
        'text/plain',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      'image': ['image/jpeg', 'image/png', 'image/webp'],
      'video': ['video/mp4', 'video/3gp'],
    };
  
    for (const contentType of Object.keys(supportedMediaTypes)) {
      if (supportedMediaTypes[contentType].includes(mediaType)) {
        return contentType;
      }
    }
  
    return null; // Unsupported media type
  };*/