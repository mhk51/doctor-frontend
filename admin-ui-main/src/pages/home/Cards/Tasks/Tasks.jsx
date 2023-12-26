import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./tasks.scss";
import Task_Popup from "../../../../components/task-popup/Task-Popup"; // Import the Task_Popup component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faPencil } from '@fortawesome/free-solid-svg-icons';
import {  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from '../../../../config/config';
const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  {
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    country_code: 'sa',
  },
]

const Tasks = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [tasks, setTasks] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for delete confirmation dialog
  const [taskToDelete, setTaskToDelete] = useState(null); 
const [taskToEdit, setTaskToEdit] = useState(null);
  const token = localStorage.getItem('token');
  console.log("token", token);
  const [user, setUser] = useState(null);
  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await axios.get(`${API_BASE_URL}/users/`, config)

        const userData = response.data;
        console.log("userdatasaved", userData);
        setUser(userData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []); 
  // Function to extract and format the time from ISO date
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };
  
  useEffect(() => {
    if (user && user.id) {
      fetchTask();
    }
    
}, [user]);

const [isPopupOpen, setIsPopupOpen] = useState(false);

const openPopup = () => {
  setIsPopupOpen(true);
};

const closePopup = () => {
  setIsPopupOpen(false);
};

async function fetchTask() {
  if (user && user.id) {
    console.log("user, task", user);
    const userId = user.id;
    axios
      .get(`${API_BASE_URL}/tasks/`)
      .then((response) => {
        // Filter tasks by user ID
        const filteredTasks = response.data.filter((task) => task.user === userId);
        setTasks(filteredTasks);
      })
      .catch((error) => {
        console.error("Error fetching task data:", error);
      });
  }
}

  const handleDeleteClick = async (task) => {
    setDeleteConfirmationOpen(true);
    setTaskToDelete(task);
    console.log("t",taskToDelete);
  };
  const handleConfirmDelete = async () => {
    try {
      if (taskToDelete) {
        const taskId = taskToDelete.idtasks;
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}/`);
       
        setTaskToDelete(null); // Clear the note to delete
        setDeleteConfirmationOpen(false); // Close the delete confirmation dialog
        fetchTask();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  const handleCancelDelete = () => {
    // Close the delete confirmation dialog without deleting
    setTaskToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  const handleEditClick = (task) => {
    setTaskToEdit(task);
    openPopup();
  };
  const handleAddNewClick = () => {
    setTaskToEdit(null); // Set editedTask to null for adding a new task
    setIsPopupOpen(true); // Open the popup for adding
  };

  

  
  return (
    <div className="tasks">
  <div className="top">
    <p className="title">{t('Your Tasks')}</p>
    <span className="link" onClick={handleAddNewClick}>{t('Add_new ')}</span>
  </div>
 
  <div className="scrollable-list">
    <ul className="list-of-tasks">
      {tasks.map((task) => (
        <li key={task.id}>
          <div className="task-item"   style={{
                
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <div>
            <div className="task-info">
            <strong>{task.title || "No title available"}</strong>
            
            
              <p>{task.body || "No details available"}</p>
            </div>
            <div className="task-infos">
            {task.task_date ? formatDate(task.task_date) : "No due date available"}
            </div></div>
            <div className="task-done">
            <button className="btntask" style={{ marginRight: '5px' }} onClick={() => handleDeleteClick(task)}>
             <FontAwesomeIcon icon={faCheck} />
           </button>
           <button className="btntask" style={{ marginLeft: '5px' }} onClick={() => handleEditClick(task)}>
            <FontAwesomeIcon icon={faPencil} />
             </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>


      {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t('Did you finish this task?')} </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {t('Are you sure you want to remove it?')}
            </DialogContentText>
            
          </DialogContent>
          <DialogActions>
          <button onClick={handleCancelDelete} className='closee'>{t('Cancel')}</button>&nbsp;&nbsp;
          
            <button  className="closee" onClick={handleConfirmDelete}>{t('Done')}</button>
          </DialogActions>
        </Dialog>
          

        {isPopupOpen && (
        <Task_Popup isOpen={isPopupOpen} onClose={closePopup} fetchTask={fetchTask} editedTask={taskToEdit}/>)}
    </div>
  );
};

export default Tasks;