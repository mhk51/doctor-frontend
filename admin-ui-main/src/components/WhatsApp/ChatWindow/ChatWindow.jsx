import React, { useState, useEffect, useRef } from 'react';
 
import Axios from "axios";
 
import Location from '../../Location/Location';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPaperclip, faPaperPlane, faMapMarkerAlt, faFileImage , faTimes, faStop, faMicrophone} from '@fortawesome/free-solid-svg-icons';
import './ChatWindow.scss'
import MicRecorder from 'mic-recorder-to-mp3';
import MessageList from './MessageList';
import API_BASE_URL from '../../../config/config';
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
  'image/webp'
];
// Constants for authentication and API URL
//const authToken = 'EAAFSezp24bEBO41HSmF0OiFr74AsSfEs4JVadg2UUZCwPqAbvAVnqoBkaT8rdBQ3s1Hh4zzMr7NO39mbcoOKe88AwzdXt26tKHlbZACAf5Udg9mH1jtPb3OU0DssnHopKilepmPdBnoML26xNAH3rDqMTmQIeBwjZAfKswosP0zP2AfJKfX8ZB6zLC804QLcR2ofzLuq2tZACx0R3xgbedyNwjyCsQJ1QeM0pzm9bAwW2';
const apiUrl = 'https://graph.facebook.com/v17.0/120586281145678/messages';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });
function ChatWindow({ selectedContact }) {
  console.log("selected", selectedContact);
  const [newMessage, setNewMessage] = useState('');
 
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedMp, setRecordedMp] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isFileInputVisible, setFileInputVisible] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await Axios.get(`${API_BASE_URL}/tokens/`);
        console.log("responsetoken", response);
        if (response.data) {
          const authtoken = response.data[0].token;
          console.log("token", authtoken);
          setAuthToken(authtoken);
        } else {
          console.log('No tokens found');
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };
    // Call the fetchToken function when the component mounts
    fetchToken();
  }, []);
  const token = localStorage.getItem('token');
  console.log("token", token);
  const [user, setUser] = useState(null);
 
 
  const handleMediaClick = () => {
    // Simulate a click on the file input when the media icon is clicked
    console.log('BBBBBBBBBBB')
    fileInputRef.current.click();
    setPopupVisible(false)
  };
  const handleClose = () => {
    // Reset selected file and close the popup
    setSelectedFile(null);
    setShowLocation(false);
    setPopupVisible(false);
  };
 
  const handleDiscardRecording = () => {
    // Set recordedBlob to null to discard the recording
    setRecordedBlob(null);
 
  };
  const handleTogglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
 
  const handleOptionClick = (option) => {
    // Handle the selected option (media or location)
    console.log('Selected option:', option);
 
    if (option === 'media') {
      setFileInputVisible(true);
      console.log('meediaaaaaaaaaaaaaaaa')
    } else {
      setFileInputVisible(false);
    }
    // Close the popup
    setPopupVisible(false);
  };
 
  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
 
        const response = await Axios.get(`${API_BASE_URL}/users/`, config)
 
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
  const [messages, setMessages] = useState([]);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const fetchMessages = async () => {
    try {
      //if (user && selectedContact) {
        if(selectedContact){
        console.log('Fetching messages for contact:', selectedContact.id);
        const response = await Axios.get(`${API_BASE_URL}/whatsmessage/`);
        const allMessages = response.data;
        setFetchedMessages(allMessages);
 
        // Filter messages based on the selected contact and user IDs
       /* const filteredMessages = allMessages.filter((msg) => (
          (msg.user === user.id && msg.patient === selectedContact.id)
        ));*/
        const filteredMessages = allMessages.filter((msg) => (
          (msg.patient === selectedContact.id)
        ));
        console.log('Filtered messages:', filteredMessages);
        setMessages(filteredMessages);
        await checkLastReceivedMessage(allMessages);
      } else {
        console.error('User or selectedContact is null');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      /*if (user && selectedContact) {
        await fetchMessages();
 
      }*/
      if ( selectedContact) {
        await fetchMessages();
 
      }
    };
    fetchData();
  //}, [selectedContact, user]);
}, [selectedContact]);
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    const ws = new WebSocket('wss://doctor1-backend.azurewebsites.net/ws/whatsapp/');
    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };
    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log('WebSocket connection closed cleanly.');
      } else {
        console.error('WebSocket connection closed unexpectedly:', event);
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, [selectedContact]);

 
  useEffect(() => {
    if (socket) {
      socket.onmessage = async (event) => {
        // Handle incoming WebSocket messages here
        console.log('Received WebSocket message:', event.data);
        try {
          const messageData = JSON.parse(event.data);
          //const receivedUser = messageData.user_id; // Extract user ID from the WebSocket message
          const receivedPatient = messageData.patient_id; // Extract patient ID from the WebSocket message
          /*console.log("true or",   selectedContact &&
          receivedUser === user.id &&
          receivedPatient === selectedContact.id)*/
          // Compare received IDs with currently selected user and contact IDs
          /*if (
            selectedContact &&
            receivedUser === user.id &&
            receivedPatient === selectedContact.id
          ) */
          if (
            selectedContact &&
            receivedPatient === selectedContact.id
          ){
            // If the IDs match, trigger fetchMessages
            await fetchMessages();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  //}, [socket, selectedContact, user]);
}, [socket, selectedContact]);
 
  const [showLocation, setShowLocation] = useState(false);
  const [location,setLocation] = useState(null);
  const sendTemplateMessage = async () => {
    //const authToken = 'EAAJ0ZApM92koBOxxnc62YljKyZAcyObxfCZB2bGYhZBSPDNOw2AFxjaqmvpOflyFjrMtdMXvbxUgsI7H7ObtLtErcfz69bNZBBfZBeOYednHq4B602pA9aiRxhm7QaHI7qutRB8AVrxFZBS95igdO7f60ZA2AazkQNUAZB1RwWljGSxdZAEZB1CoDthEiOfeeaIZChfXN7gUMXyLfBZAdwzSOSaZAe3AbWag9ugXPtRK9UEsar1ZCQZD';
   // const apiUrl = `https://graph.facebook.com/v17.0/120586281145678/messages`;
 
    const requestBody = {
      messaging_product: 'whatsapp',
      to: selectedContact.phone,
      type: 'template',
      template: {
        name: 'reply',
        language: { code: 'en' }
      },
    };
 
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      if (response.ok) {
        console.log('Template message sent successfully!');
        await Axios.post(`${API_BASE_URL}/whatsmessage/`, {
          text: "Template",
          //user: user.id,
          patient: selectedContact.id,
          sent_timestamp: new Date(),
          is_sent:true,
        });
        await fetchMessages();
      } else {
        console.error('Error sending template message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending template message:', error);
    }
  };
 
  const sendTextMessage = async () => {
 
   // const authToken = 'EAAJ0ZApM92koBOxxnc62YljKyZAcyObxfCZB2bGYhZBSPDNOw2AFxjaqmvpOflyFjrMtdMXvbxUgsI7H7ObtLtErcfz69bNZBBfZBeOYednHq4B602pA9aiRxhm7QaHI7qutRB8AVrxFZBS95igdO7f60ZA2AazkQNUAZB1RwWljGSxdZAEZB1CoDthEiOfeeaIZChfXN7gUMXyLfBZAdwzSOSaZAe3AbWag9ugXPtRK9UEsar1ZCQZD';
 
    //const apiUrl = `https://graph.facebook.com/v17.0/120586281145678/messages`;
 
    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: selectedContact.phone,
      type: 'text',
      text: {
        preview_url: false,
        body: newMessage,
      },
    };
 
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      if (response.ok) {
        console.log('Text message sent successfully!');
        setNewMessage(''); // Clear the input after sending the message

        await Axios.post(`${API_BASE_URL}/whatsmessage/`, {
          text: newMessage,
          //user: user.id,
          patient: selectedContact.id,
          sent_timestamp: new Date(),
          is_sent:true,
        });
        await fetchMessages();
      } else {
        console.error('Error sending message:', response.statusText);
 
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
 
  const uploadMediaAndGetID = async (file) => {
 
    //const authToken = 'EAAJ0ZApM92koBOxxnc62YljKyZAcyObxfCZB2bGYhZBSPDNOw2AFxjaqmvpOflyFjrMtdMXvbxUgsI7H7ObtLtErcfz69bNZBBfZBeOYednHq4B602pA9aiRxhm7QaHI7qutRB8AVrxFZBS95igdO7f60ZA2AazkQNUAZB1RwWljGSxdZAEZB1CoDthEiOfeeaIZChfXN7gUMXyLfBZAdwzSOSaZAe3AbWag9ugXPtRK9UEsar1ZCQZD';
 
 
    const phoneNumberID = '120586281145678'; 
    const apiUrl = `https://graph.facebook.com/v17.0/${phoneNumberID}/media`;
    if (!supportedTypes.includes(file.type)) {
      console.log("file format", file.type)
      alert('Unsupported file format!');
      return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);
    formData.append('messaging_product', 'whatsapp');
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        const mediaID = responseData.id;
        // Uploading media to your server
        const mediaFormData = new FormData();
        mediaFormData.append('media_id', mediaID);
        mediaFormData.append('media_type', file.type);
        mediaFormData.append('media_data', file);
        try {
          const responseMedia = await Axios.post(`${API_BASE_URL}/media/`, mediaFormData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Ensure proper content type for file uploads
            },
          });
          console.log("response",responseMedia);
          if (responseMedia.status === 201) {
            console.log('File uploaded successfully');
            console.log("responseMedia", responseMedia);
            console.log("media_data", file);
            return { media_id: mediaID, id: responseMedia.data.id };
          } else {
            console.error('File upload failed');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      } else {
        console.error('Error uploading media:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  };

 
  const handleFileInputChange = async  (event) => {
    const file = event.target.files[0];
    console.log('AAAAAAAAAAAAAAaa',file)
      await setSelectedFile(file);
  };
 
const handleSendMedia = async () => {
  if (selectedFile) {
    const result = await uploadMediaAndGetID(selectedFile);
    console.log("result", result);
if (result) {
  const mediaID = result.media_id;
  const mediaMediaID = result.id;
  // Use mediaID and mediaMediaID as needed
 
    const mediaType = selectedFile.type;
    const mediaContent = getMediaContent(mediaType);
    if (mediaID && mediaContent) {
      await sendMediaMessage(mediaContent, { id: mediaID }, mediaMediaID); // Adjust media type for sending
    }}
  }
  else if (recordedMp){
     const mediaID = await uploadMediaAndGetID(recordedMp);
    const mediaType = recordedMp.type;
    const mediaContent = getMediaContent(mediaType);
    if (mediaID && mediaContent) {
      await sendMediaMessage(mediaContent, { id: mediaID }); // Adjust media type for sending
    }
  }
};
 
  const sendMediaMessage = async (mediaType, mediaContent, mediaMediaID) => {
    //const authToken = 'EAAJ0ZApM92koBOxxnc62YljKyZAcyObxfCZB2bGYhZBSPDNOw2AFxjaqmvpOflyFjrMtdMXvbxUgsI7H7ObtLtErcfz69bNZBBfZBeOYednHq4B602pA9aiRxhm7QaHI7qutRB8AVrxFZBS95igdO7f60ZA2AazkQNUAZB1RwWljGSxdZAEZB1CoDthEiOfeeaIZChfXN7gUMXyLfBZAdwzSOSaZAe3AbWag9ugXPtRK9UEsar1ZCQZD';
 
    //const apiUrl = `https://graph.facebook.com/v17.0/120586281145678/messages`;
 
    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: selectedContact.phone,
      type: mediaType,
    [mediaType]: mediaContent,
    };
console.log("request", requestBody);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
 
      if (response.ok) {
        console.log('Media message sent successfully!');
        setSelectedFile(null);
        await Axios.post(`${API_BASE_URL}/whatsmessage/`, {
          media: mediaMediaID,
          //user: user.id,
          patient: selectedContact.id,
          sent_timestamp: new Date(),
          is_sent:true,
        });
        await fetchMessages();
        if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
      } else {
        console.error('Error sending media message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending media message:', error);
    }
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
};
  const handleLocation = () => {
    setShowLocation(true);
    setPopupVisible(false)
  };
 
  const sendLocationMessage = async (location) => {
   // const authToken = 'EAAJ0ZApM92koBOxxnc62YljKyZAcyObxfCZB2bGYhZBSPDNOw2AFxjaqmvpOflyFjrMtdMXvbxUgsI7H7ObtLtErcfz69bNZBBfZBeOYednHq4B602pA9aiRxhm7QaHI7qutRB8AVrxFZBS95igdO7f60ZA2AazkQNUAZB1RwWljGSxdZAEZB1CoDthEiOfeeaIZChfXN7gUMXyLfBZAdwzSOSaZAe3AbWag9ugXPtRK9UEsar1ZCQZD';
   // const apiUrl = `https://graph.facebook.com/v17.0/120586281145678/messages`;
    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: selectedContact.phone,
      type: 'location',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        await Axios.post(`${API_BASE_URL}/whatsmessage/`, {
        //user: user.id,
        patient: selectedContact.id,
        sent_timestamp: new Date(),
        is_sent: true,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      await fetchMessages();
        console.log('Location message sent successfully!');
      } else {
        console.error('Error sending location message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending location message:', error);
    }
  };
  const handleLocationChange = (newLocation) => {
    // Handle the location change, e.g., save the location in the component state
    setLocation(newLocation);
    console.log(newLocation)
  };
 
  const handleSendLocation = async () => {
 
    console.log('Sending location:', location);
    await sendLocationMessage(location);
    setShowLocation(false);
 
  };
 
 
  const handleSendMessage = async () => {
    await sendTextMessage();
  };
 
  useEffect(() => {
    // Reset newMessage when selectedContact changes
    setNewMessage('');
    if (selectedFile) {
    setSelectedFile(null);
  }
  if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedContact]);
// Import the necessary libraries
const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

 
  // Function to start recording
  const startRecording = () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((err) => console.error(err));
    }
  };
 
  // Function to stop recording
  // Function to stop recording and get MP3
const stopRecording = async () => {
  try {
    await Mp3Recorder.stop();
    const [buffer, blob] = await Mp3Recorder.getMp3();
    const blobURL = URL.createObjectURL(blob);
    setRecordedBlob(blob); 
    setBlobURL(blobURL);
    setIsRecording(false);
  } catch (err) {
    console.log(err);
  }
};
 
 
  // Effect to check permission for microphone access
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Permission Granted');
        setIsBlocked(false);
      })
      .catch(() => {
        console.log('Permission Denied');
        setIsBlocked(true);
      });
  }, []);
  /*const ffmpeg = new FFmpeg();
  const convertToOgg = async (inputFile) => {
 
  
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }
    ffmpeg.FS('writeFile', 'input.mp3', await fetchFile(inputFile));
    await ffmpeg.exec('-i', 'input.mp3', 'output.ogg');
    const oggFile = ffmpeg.FS('readFile', 'output.ogg');
    return new Blob([oggFile.buffer], { type: 'audio/ogg' });
  };*/
  const handleRecordButtonClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    }
  };
  const handleSendAudioMessage = async () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'recorded_audio.mp3', { type: 'audio/mpeg' });
      if (file) {
       const result = await uploadMediaAndGetID(file);
    console.log("result", result);
if (result) {
  const mediaID = result.media_id;
  const mediaMediaID = result.id;
  // Use mediaID and mediaMediaID as needed
 
    const mediaType = file.type;
    const mediaContent = getMediaContent(mediaType);
    if (mediaID && mediaContent) {
      await sendMediaMessage(mediaContent, { id: mediaID }, mediaMediaID); // Adjust media type for sending
    }}
 
    setRecordedBlob(null);
      }
    } else {
      console.log('No recorded blob');
    }
  };

 
  // Function to play the recorded audio
  const handlePlayAudio = () => {
    if (blobURL) {
      const audio = new Audio(blobURL);
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };
 
  // Function to download the recorded audio
  const handleDownloadAudio = () => {
    if (blobURL) {
      const downloadLink = document.createElement('a');
      downloadLink.href = blobURL;
      downloadLink.download = 'recorded_audio.mp3';
      downloadLink.click();
    }
  };
  const [canSendTemplate, setCanSendTemplate] = useState(false);
  const checkLastReceivedMessage = async (allMessages) => {
    try {
      console.log("try");
      console.log("s",selectedContact);
      console.log("all",allMessages);
      if (selectedContact) {
        console.log("check");
        // Filter messages based on the selected contact and user IDs
        const filteredMessages = allMessages.filter(
          (msg) => msg.patient === selectedContact.id && !msg.is_sent
        );
        // Sort messages by received time in descending order
        filteredMessages.sort((a, b) => new Date(b.received_time) - new Date(a.received_time));
  console.log("filtered check", filteredMessages);
        if (filteredMessages.length > 0) {
          const latestMessageTime = new Date(filteredMessages[0].received_time);
          const currentTime = new Date();
          const timeDifference = currentTime - latestMessageTime;
          const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          const fiveMinutes = 2 * 60 * 1000;
          if (timeDifference > twentyFourHours) {
            // Render template message button only
            console.log('Last received message was more than 24 hours ago.');
            setCanSendTemplate(true);
          } else {
            // Render all message sending buttons
            console.log('Last received message was within the last 24 hours.');
            setCanSendTemplate(false);
            setTimeout(async () => {
              await fetchMessages(); // Refetch messages after 2 minutes
            }, timeDifference);
          }
        } else {
          // No unsent messages found for the patient
          console.log('No unsent messages found for the patient.');
          setCanSendTemplate(true);
          // Set a state variable to enable rendering all message sending buttons
        }
      }
    } catch (error) {
      console.error('Error checking last received message:', error);
    }
  };
    const AttachmentPopup = ({ onSelectOption }) => {
      return (
<div className="attachment-popup">
<button onClick={() => onSelectOption('media')}>
<FontAwesomeIcon icon={faFileImage} />
            Media
</button>
<button onClick={() => onSelectOption('location')}>
<FontAwesomeIcon icon={faMapMarkerAlt} />
            Location
</button>
</div>
      );
    };
  return(
<div className="chat-container">
<div className="patient-bar">
<p>{selectedContact.first_name} {selectedContact.last_name} </p>
</div>
 
    <MessageList messages={messages} />
  {canSendTemplate ? (
<div className="whatsapp-input-bar">
<button className="send-template-button" onClick={sendTemplateMessage}>Send Template</button>
</div>
  ) : (
<div className="whatsapp-input-bar">
<div className="text-input-container">
<button className="attachment-button" onClick={handleTogglePopup}>
<FontAwesomeIcon icon={faPaperclip} />
</button>
        {recordedBlob ? (
<div className="recording-status">
<div className="recording-status-text">Recording is Ready</div>
<div className="recording-buttons">
<button className="send-button" onClick={handleSendAudioMessage}>
<FontAwesomeIcon icon={faPaperPlane} />
</button>
<button className="discard-button" onClick={handleDiscardRecording}>
<FontAwesomeIcon icon={faTrash} />
</button>
</div>
</div>
        ) : (
<>
<button
              className="attachment-button"
              onClick={isRecording ? stopRecording : startRecording}
>
<FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
</button>
 
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
<button className="send-button" onClick={handleSendMessage}>
<FontAwesomeIcon icon={faPaperPlane} />
</button>
</>
        )}
</div>
 
      {isPopupVisible && (
<div className="attachment-popup">
<button onClick={handleMediaClick}>
<FontAwesomeIcon icon={faFileImage} />
            Media
</button>
<button onClick={handleLocation}>
<FontAwesomeIcon icon={faMapMarkerAlt} />
            Location
</button>
</div>
      )}
      {selectedFile && (
<div className='media-popup'>
<p>{selectedFile.name}</p>
<button className="send-icon" onClick={handleSendMedia}>
<FontAwesomeIcon icon={faPaperPlane} />
</button>
<button className="close-icon" onClick={handleClose}>
<FontAwesomeIcon icon={faTimes} />
</button>
</div>
      )}
 
      {showLocation && (
<div className="location-popup">
<Location onLocationChange={handleLocationChange} onClose={handleClose} />
<div className="location-actions">
<button className="send-icon" onClick={handleSendLocation}>
<FontAwesomeIcon icon={faPaperPlane} />
</button>
<button className="close-icon" onClick={handleClose}>
<FontAwesomeIcon icon={faTimes} />
</button>
</div>
</div>
      )}
</div>
  )}
 
  <input
    type="file"
    onChange={handleFileInputChange}
    ref={fileInputRef}
    style={{ display: 'none' }}
  />
</div>
)}
 
export default ChatWindow;