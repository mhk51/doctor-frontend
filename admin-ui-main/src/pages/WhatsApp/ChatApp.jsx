import React, { useState } from 'react';
import ContactsList from '../../components/WhatsApp/WhatsAppContacts/ContactsList';
import ChatWindow from '../../components/WhatsApp/ChatWindow/ChatWindow';
import "./chatapp.scss";
import SideBar from '../../components/Sidebar/SideBar';
import NavBar from '../../components/NavBar/NavBar';
function ChatApp() {
  const [selectedContact, setSelectedContact] = useState(null);

  const handlePatientClick = (patientPhoneNumber) => {
    // Set the selected contact's phone number
    setSelectedContact(patientPhoneNumber);
  };
  /*const handleBackToList = () => {
    // Reset the selected contact to return to the contact list
    setSelectedContact(null);
  };
*/
  return (
    <div className="chat-app">
      <div className="chat-app-container">
        <div className='side-whats'>
          <SideBar/>
        </div>
        <div className='nav-whats'>
          <NavBar/>
        </div>
        {window.innerWidth < 850 ? (
           <div className='table-whats'>
           {selectedContact ? (
            //<div>
         // <button onClick={handleBackToList}>Back to List</button>
             <div className="window">
               <ChatWindow
                 selectedContact={selectedContact}
               />
              
             </div>
             //</div>
           ) : (
             <div className="list">
               <ContactsList onPatientClick={handlePatientClick} />
             </div>
           )}
         </div>
      ) : (
        <div className='table-whats'>
        <div className="list">
        <ContactsList onPatientClick={handlePatientClick} /></div>
        <div className="window">
        {selectedContact && (
          <ChatWindow
            selectedContact={selectedContact}
            
          />
        )}
        </div>
        </div>)}
      </div>
      
    </div>
  );
}

export default ChatApp;
