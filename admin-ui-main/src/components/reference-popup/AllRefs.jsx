import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './allrefs.scss';
import API_BASE_URL from '../../config/config';
const AllRefs = ({ isOpen, onClose , onAddNewRefClick}) => {
  const [references, setReferences] = useState([]);
  
  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get(`${API_BASE_URL}/reference/`)
      .then(response => {
        // Assuming the API returns an array of references
        setReferences(response.data);
      })
      .catch(error => {
        console.error('Error fetching references:', error);
      });
  }, []);
  const openUrlInNewTab = (url) => {
    window.open(url, '_blank');
  };
  const addHttpOrHttps = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://${url}`;
  };

  const handleCancelClick = () => {
  
    // Close the popup when canceled
    onClose();
  };
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className='allrefs'>
        <div className="top">
            <h2 draggable>Your Quick References</h2>
            <p className='add-new-btn' onClick={onAddNewRefClick}>+ Add new</p>
        </div>

        <div className="center">
        <ul>
          {references.map(reference => (
            <li key={reference.id}>
              <a
                href={addHttpOrHttps(reference.url_ref)} // Check and add "http://" or "https://"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openUrlInNewTab(addHttpOrHttps(reference.url_ref)); }}
              >
                {reference.title}
              </a>
            </li>
          ))}
        </ul>
        
        <div className="bottom">
        <button onClick={handleCancelClick} >Close</button>
      </div></div>
    </div></div>
  )
}

export default AllRefs