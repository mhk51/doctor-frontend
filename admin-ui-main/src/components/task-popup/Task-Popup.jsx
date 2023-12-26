// Task_Popup.jsx

import React, { useState, useEffect } from "react";
import "./taskpopup.scss";
import Axios from "axios";
import ExpandableText from "../widgets/ParagraphText/ExpandableText";
import SaveButton from "../widgets/Buttons/Save/SaveButton";
import CancelButton from "../widgets/Buttons/Cancel/CancelButton";
import { TextField } from "@mui/material";
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import API_BASE_URL from "../../config/config";
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
];

const Task_Popup = ({ isOpen, onClose, fetchTask, editedTask }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();

  useEffect(() => {
    console.log('Setting page stuff');
    document.body.dir = currentLanguage.dir || 'ltr';
  }, [currentLanguage, t]);

  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

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
        console.log("userdatasaved", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const [inputs, setInputs] = useState({
    title: editedTask ? editedTask.title : "",
    task_date: editedTask ? editedTask.task_date : "",
  });

  const [taskContent, setTaskContent] = useState(editedTask ? editedTask.body : "");

  const handleSaveClick = async () => {
    try {
      if (editedTask) {
        await Axios.put(`${API_BASE_URL}/tasks/${editedTask.idtasks}/`, {
          title: inputs.title,
          body: taskContent,
          task_date: inputs.task_date || null,
          user: user.id,
        });
      } else {
        await Axios.post(`${API_BASE_URL}/tasks/`, {
          title: inputs.title,
          body: taskContent,
          task_date: inputs.task_date || null,
          user: user.id,
        });
      }

      console.log("Task saved successfully!");
      fetchTask();
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleTaskChange = (event) => {
    setTaskContent(event.target.value);
  };

  const handleCancelClick = () => {
    setInputs({
      title: "",
      task_date: "",
    });
    setTaskContent("");
    onClose();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
      <div className="task-popup">
        <div className="top">
          <h2>{editedTask ? t("Edit Task") : t("Add New Task")}</h2>
          <br />
          <br />
        </div>

        <TextField
          label={t('Title')}
          name="title"
          fullWidth
          variant="outlined"
          size="small"
          value={inputs.title}
          onChange={handleFieldChange}
          style={{ marginBottom: "0.5rem" }}
        />

        <div className="note-desc">
          <ExpandableText
            width={"100%"}
            text={t("Add Task")}
            value={taskContent}
            onChange={handleTaskChange}
            style={{ marginBottom: "0.5rem" }}
          />
          <label className="duetask">{t('Due Date')}: </label>
          <input
            type="datetime-local"
            name="task_date"
            value={inputs.task_date}
            onChange={handleFieldChange}
            className='due'
          />
        </div>

        <br />
        <br />
        <div className="cancel-and-saved-task">
        <SaveButton onClick={handleSaveClick} />&nbsp;&nbsp;
          <CancelButton onClick={handleCancelClick} />
          
        </div>
      </div>
    </div>
  );
};

export default Task_Popup;
