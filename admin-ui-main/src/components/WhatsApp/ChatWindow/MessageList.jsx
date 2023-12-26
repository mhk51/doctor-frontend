import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import Map from '../../Location/Map';
import './MessageList.scss'
import API_BASE_URL from '../../../config/config';
function MessageList({ messages }) {
  const [mediaDetails, setMediaDetails] = useState({});
  const messagesEndRef =useRef(null);

 

  const fetchAllMediaDetails = async () => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/media/`);
      const allMedia = response.data;

      const updatedMediaDetails = {};
      allMedia.forEach((media) => {
        updatedMediaDetails[media.id] = media;
      });

      setMediaDetails(updatedMediaDetails);
    } catch (error) {
      console.error('Error fetching all media details:', error);
    }
  };

  useEffect(() => {
    fetchAllMediaDetails();
  }, []);

  useEffect(() => {
    messages.forEach((message) => {
      if (message.media && !mediaDetails[message.media]) {
        fetchMediaDetails(message.media);
      }
    });
  }, [messages]);

  const fetchMediaDetails = async (mediaId) => {
    try {
      const response = await Axios.get(`${API_BASE_URL}/media/${mediaId}/`);
      const mediaData = response.data;
      setMediaDetails((prevDetails) => ({
        ...prevDetails,
        [mediaId]: mediaData,
      }));
    } catch (error) {
      console.error('Error fetching media details:', error);
    }
  };

  const renderMedia = (mediaId, mediaType, mediaDataUrl, isSent) => {
    console.log("type",mediaType);
    switch (mediaType) {
      case 'image/jpeg':
      case 'image/png':
        return <img src={mediaDataUrl} alt="Image" 
        style={{ width: '250px', height: 'auto', objectFit: 'cover'}}/>;
      case 'audio/aac':
      case 'audio/mp4':
      case 'audio/mpeg':
      case 'audio/amr':
      case 'audio/ogg; codecs=opus':
        return (
          <audio controls className={isSent ? 'audio-sent' : 'audio-received'}>
            <source src={mediaDataUrl} type={mediaType} />
            Your browser does not support the audio tag.
          </audio>
        );
      case 'text/plain':
      case 'application/pdf':
      case 'application/vnd.ms-powerpoint':
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        // Render document component or link to the document based on mediaDataUrl
        return <p>Document: <a href={mediaDataUrl}>View</a></p>;
      case 'video/mp4':
      case 'video/3gp':
        return (
          <video controls>
            <source src={mediaDataUrl} type={mediaType} />
            Your browser does not support the video tag.
          </video>
        );
      case 'image/webp':
        return <img src={mediaDataUrl} alt="Sticker" />;
      default:
        console.warn('Unsupported media type:', mediaType);
        return <p>Unsupported media type</p>;
    }
  };
  
  const renderLocationMap = (latitude, longitude) => {
    console.log ("latitude",latitude);
    return <Map location={{ latitude, longitude }} />;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);


  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const formatDate = (date) => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    if (isSameDay(today, date)) {
      return 'Today';
    } else {
      return date.toLocaleDateString(undefined, options);
    }
  };


  const renderGroupedMessages = () => {
    let currentDate = null;

    return messages.map((message, index) => {
      const messageDate = new Date(message.sent_timestamp);

      // Check if the current message has the same date as the previous one
      const showDate = !currentDate || !isSameDay(currentDate, messageDate);

      // Update the current date for the next iteration
      currentDate = messageDate;

      return (
        <div className='message-list'>
          {showDate && (
            <div className="message-date">
              {formatDate(currentDate)}
            </div>
          )}
          <div key={index} className={message.is_sent ? 'sent-message' : 'received-message'}>
          {message.text && <p>{message.text}</p>}
          {message.media && mediaDetails[message.media] && (
            <div>
              {renderMedia(
                message.media,
                mediaDetails[message.media].media_type,
                mediaDetails[message.media].media_data,
                message.is_sent
              )}
            </div>
          )}
          {message.latitude !== null && message.longitude !== null && (
            <div>
              {renderLocationMap(message.latitude, message.longitude)}
            </div>
          )}
        <div className="message-time">
            {formatTime(messageDate)}
          </div>
          </div>
        </div>
      );
    });
  };

  
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString(undefined, options);
  };
  
  
  return (
    <div style={{paddingBottom:'30px', paddingTop:'60px'}} >
      {renderGroupedMessages()}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;