import React, {useState, useEffect} from "react";
import Rooms from '../../components/Inbox/Rooms';
import Room from '../../components/Inbox/Room';
import SideBar from"../../components/Sidebar/SideBar";
import NavBar from '../../components/NavBar/NavBar';
import './messagingpage.scss';
const MessagingPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
  };
  return (
    <div className='messagesapp'>
      <div className="navinternal">
        <NavBar />
      </div>
      <div className="side-bar-internal">
        <SideBar />
      </div>
      {window.innerWidth < 850 ? (
        <div className="messaging-content">
          {selectedRoomId ? (
            <Room roomId={selectedRoomId} />
          ) : (
            <Rooms handleRoomClick={handleRoomClick}/>
          )}
        </div>
      ) : (
        <div className="messaging-content">
          <div className="rooms-column">
            <Rooms handleRoomClick={handleRoomClick}/>
          </div>
          <div className="room-column">
            {selectedRoomId ? (
              <Room roomId={selectedRoomId} />
            ) : (
              <p className="no-room-selected">Click on a contact to chat</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;