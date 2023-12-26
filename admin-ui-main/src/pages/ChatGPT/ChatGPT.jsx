import { useState, useEffect } from 'react';
import "./chatgpt.scss"
import Sidebar from"../../components/Sidebar/SideBar";
import NavBar from '../../components/NavBar/NavBar';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Axios from 'axios';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import SideBar from '../../components/Sidebar/SideBar';
import API_BASE_URL from '../../config/config';


const ChatGPT = () => {
  const token = localStorage.getItem('token');

  const [userApiKey, setUserApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const getUserData = async () => {
    try {
      if (token) {
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await Axios.get(`${API_BASE_URL}/users/`, config);

        const userData = response.data;
        console.log("userchat", userData);
        if (userData.gpt) {
          console.log("API Key received:", userData.gpt);
          setUserApiKey(userData.gpt);

          // Construct the chat history key based on the user's API key
          const chatHistoryKey = `chatHistory_${userData.gpt}`;

          // Retrieve the existing chat history from local storage or initialize it as an empty array
          const initialMessages = localStorage.getItem(chatHistoryKey)
            ? JSON.parse(localStorage.getItem(chatHistoryKey))
            : [];

          setMessages(initialMessages);
        } else {
          console.log("Empty API Key received:", userData.gpt);
        }
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const addMessageToHistory = (message, sender) => {
    const newMessage = {
      message,
      direction: sender === "user" ? "outgoing" : "incoming",
      sender,
      sentTime: new Date().toLocaleTimeString(),
    };

    // Update the state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Construct the chat history key based on the user's API key
    const chatHistoryKey = `chatHistory_${userApiKey}`;

    // Retrieve the existing chat history from local storage or initialize it as an empty array
    const existingChatHistory = localStorage.getItem(chatHistoryKey)
      ? JSON.parse(localStorage.getItem(chatHistoryKey))
      : [];

    // Add the new message to the chat history
    const updatedChatHistory = [...existingChatHistory, newMessage];

    // Save the updated chat history to local storage
    localStorage.setItem(chatHistoryKey, JSON.stringify(updatedChatHistory));
  };

  const handleSendRequest = async (message) => {
    if (message.trim() === '') return;

    // Add user's input message to the chat history
    addMessageToHistory(message, "user");
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, { message, sender: "user" }]);
      if (response && response.choices && response.choices[0] && response.choices[0].message) {
        const content = response.choices[0].message.content;
        if (content) {
          // Add ChatGPT's response to the chat history
          addMessageToHistory(content, "ChatGPT");
        }
      } else {
        console.error("No valid response received from OpenAI.");
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  }    

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === 'ChatGPT' ? 'assistant' : 'user';
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + userApiKey, // Use the user's API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  useEffect(() => {
    getUserData();
  }, []);
  
  return (
    
    <div className="Chatgpttt">
       <div className="navchatr">
       <NavBar />
      </div>
      <div className="side-bar">
     <SideBar/>
      </div>
    <div className="Chatgpt">
      
        <MainContainer>
          <ChatContainer>
            
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator  content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />
          </ChatContainer>
        </MainContainer>
    
    </div>
    </div>  
  );
};

export default ChatGPT;
