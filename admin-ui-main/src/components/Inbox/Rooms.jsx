import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './rooms.scss';
import API_BASE_URL from '../../config/config';
const Rooms = ({ handleRoomClick }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (token) {
          const config = {
            headers: {
              Authorization: `Token ${token}`,
            },
          };
          const response = await axios.get(`${API_BASE_URL}/rooms/`, config);
          const data = await response.data;
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [token]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const config = {
            headers: {
              Authorization: `Token ${token}`,
            },
          };

          const response = await axios.get(`${API_BASE_URL}/users/?all=true/`, config);
          const userData = response.data;
          console.log("userdata", userData);
          setUsers(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const mapUsersToRooms = () => {
    const updatedRooms = rooms.map((room) => {
      const userEmail = room.slug.split('room_')[1]; // Extract user email from slug
      const userData = users.find((user) => user.email === userEmail); // Find user by email
  
      if (userData) {
        let updatedUser = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
        };
  
        if (userRole === 'Nurse' || userRole === 'Secretary') {
          // Nurse or Secretary - Fetch Doctor's details
          const doctor = users.find((user) => user.role_idrole === 1);
          if (doctor) {
            updatedUser = {
              first_name: doctor.first_name,
              last_name: doctor.last_name,
              email: doctor.email,
            };
          }
        }
  
        return {
          ...room,
          user: updatedUser,
        };
      }
  
      return room; // Return the original room if user data is not found
    });
  
    return updatedRooms;
  };
  
  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials;
  };

  // Inside the component:
  const mappedRooms = mapUsersToRooms();
  return (
    <div>
      
      <div className="messitems">
      {mappedRooms.map((mappedRoom) => (
          <div key={mappedRoom.slug} className="w-full lg:w-1/4 px-3 py-3">
            <div
              className="messitem"
              onClick={() => {handleRoomClick(mappedRoom.id); setSelectedRoomId(mappedRoom.id);}}
              
            >
              <div className="message-avatar">
              <div className="initials">
                {getInitials(`${mappedRoom.user && mappedRoom.user.first_name} ${mappedRoom.user && mappedRoom.user.last_name}`)}
              </div>
            </div>
              <h2 className="usermess"
              style={{
                fontWeight: selectedRoomId === mappedRoom.id ? 'bold' : 'normal', // Apply bold style for selected room
              }}
             >
                {mappedRoom.user && mappedRoom.user.first_name} {mappedRoom.user && mappedRoom.user.last_name}
              </h2>
          
        </div>
      
    </div>
  ))}
</div>
    </div>
  );
};

export default Rooms;
