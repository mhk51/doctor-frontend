import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react';
import API_BASE_URL from '../../config/config';
const Room = ({ roomId }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const webSockets = useRef({});

  const fetchRoomData = async () => {
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
        const roomResponse = await axios.get(`${API_BASE_URL}/room/${roomId}/`, config);
        const roomData = await roomResponse.data;
        setRoom(roomData.room);
        setMessages(roomData.messages);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };
  const [users, setUsers] = useState([]);

 
    const fetchUsers = async () => {
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

    const getUserFromSlug = (slug) => {
      console.log("slug",slug);
      const userEmail = slug.split('room_')[1]; // Extract user email from slug
      const foundUser = users.find((user) => user.email === userEmail);
      return foundUser;
    };
  const getUserData = async () => {
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
        const response = await axios.get(`${API_BASE_URL}/users/`, config);
        const userData = response.data;
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getUserIdFromUsername = (username) => {
    return user && user.email === username ? user.id : null;
  };

  const initializeWebSocket = (roomId) => {
    if (!webSockets.current[roomId]) {
      webSockets.current[roomId] = new WebSocket(`wss://doctor1-backend.azurewebsites.net/ws/${roomId}/`);

      webSockets.current[roomId].onopen = (event) => {
        console.log('WebSocket connection opened:', event);
      };

      webSockets.current[roomId].onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          const userId = getUserIdFromUsername(data.username);
          const currentRoomId = await getRoomIdFromSlug(data.room);
          console.log("current", currentRoomId);

          if (currentRoomId === roomId) {
            const tempUserId = user && user.id ? user.id : userId;
            const modifiedData = {
              user: userId,
              content: data.message,
              direction: tempUserId === userId ? 'outgoing' : 'incoming',
            };
            setMessages(prevMessages => [...prevMessages, modifiedData]);
          } else {
            console.log('Received message is not for the current room');
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      webSockets.current[roomId].onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
    }
  };

  const getRoomIdFromSlug = async (slug) => {
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
        const response = await axios.get(`${API_BASE_URL}/rooms/`, config);
        const room = response.data.rooms.find(room => room.slug === slug);
        if (room) {
          return room.id;
        } else {
          console.error('No matching room found for the slug');
          return null;
        }
      }
    } catch (error) {
      console.error('Error fetching room ID:', error);
      return null;
    }
  };

  const handleSendMessage = (roomId) => {
    const currentWebSocket = webSockets.current[roomId];

    if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
      currentWebSocket.send(JSON.stringify({ message: messageInput, username: user.email, room: room.slug }));
      setMessageInput('');
    } else {
      initializeWebSocket(roomId);
    }
  };

  const handleSubmit = () => {
    handleSendMessage(roomId);
  };

  useEffect(() => {
    if (!user) {
      getUserData();
    } else {
      fetchRoomData();

      // Clean up existing WebSocket connections
      Object.keys(webSockets.current).forEach(key => {
        if (webSockets.current[key]) {
          webSockets.current[key].close();
          webSockets.current[key] = null;
        }
      });

      initializeWebSocket(roomId); // Initialize WebSocket for the current room
    }

    // Clean up WebSocket connections when the component unmounts
    return () => {
      Object.keys(webSockets.current).forEach(key => {
        if (webSockets.current[key]) {
          webSockets.current[key].close();
          webSockets.current[key] = null;
        }
      });
    };
    
  }, [roomId, token, user]);

  const userId = user ? user.id : null;
  const [userFromSlug, setUserFromSlug] = useState(null);
  useEffect(() => {
    // Fetch users when needed
    const fetchRoomAndUsersData = async () => {
      try {
        await fetchRoomData();
        if (users.length === 0) {
          await fetchUsers();
        }
        let foundUser='Unknown';
        if (userRole==='Doctor'){
          foundUser = getUserFromSlug(room.slug);}
        else{
          console.log("usersall", users);
          foundUser= users.find((user) => user.role_idrole === 1);
          console.log("foundnurse",foundUser);
        }
        setUserFromSlug(foundUser);
        if (foundUser) {
          console.log('User found. Stopping further data fetching.');
        }
      } catch (error) {
        console.error('Error fetching room and users data:', error);
      }
    };

    if (roomId && token) {
      fetchRoomAndUsersData();
    }
  }, [roomId, token, room.slug, users]);

  
  const userName = userFromSlug
  ? `${userFromSlug.first_name} ${userFromSlug.last_name}`
  : 'Unknown';

  return (
    
    <MainContainer>
      <ChatContainer>
      <ConversationHeader>
          
          <ConversationHeader.Content userName={userName} />
               
        </ConversationHeader>
        <MessageList>
          {messages.map((m, index) => (
            <Message
              key={index}
              model={{
                message: m.content,
                sender: `User ${m.user}`,
                direction: m.user === userId ? 'outgoing' : 'incoming',
              }}
            />
          ))}
        </MessageList>
        <MessageInput
          value={messageInput}
          onSend={handleSubmit}
          onChange={(e) => setMessageInput(e)}
          placeholder="Your message..."
        />
      </ChatContainer>
    </MainContainer>
    
  );
};

export default Room;
