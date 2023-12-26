import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import MessageTemplate from "../../../components/widgets/MessageTemplate/MessageTemplate";
import "./messagelist.scss";
import API_BASE_URL from "../../../config/config";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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

const MessageList = (props) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [messageFields, setMessageFields] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [recurrenceDetails, setRecurrenceDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messages = await props.templates || [];
        setMessageFields(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchData();
  }, [props.templates]);

  useEffect(() => {
    // componentDidUpdate logic
    if (props.templates !== messageFields) {
      setMessageFields(props.templates);
    }
  }, [props.templates, messageFields]);

  const toggleExpand = (index) => {
    setExpandedIndexes((prevIndexes) =>
      prevIndexes.includes(index)
        ? prevIndexes.filter((i) => i !== index)
        : [...prevIndexes, index]
    );
  };

  const toggleEdit = (messageID) => {
    setIsEditing((prevIsEditing) =>
      prevIsEditing === messageID ? null : messageID
    );
  };

  const deleteMessage = async (messageID) => {
    try {
      await axios.delete(`${API_BASE_URL}/templates/${messageID}/`);
      await props.getTemplates();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const getRecurrenceTypeLabel = (type) => {
    switch (type) {
      case "custom":
        return "hour(s)";
      case "daily":
        return "day(s)";
      case "weekly":
        return "week(s)";
      case "monthly":
        return "month(s)";
      case "annually":
        return "year(s)";
      default:
        return "";
    }
  };

  return (
    <div className="message-fields">
      <ul>
        {messageFields.map((message, index) => (
          <li key={index}>
            <p style={{ fontWeight: "bold", fontSize: "17px" }}>
              {message.templateID__name}
            </p>
            {message.templateID__body && (
              <div>
                <p>
                  {message.templateID__body.split(" ").length > 10 ? (
                    expandedIndexes.includes(index) ? (
                      message.templateID__body
                    ) : (
                      `${message.templateID__body.split(" ").slice(0, 10).join(" ")} `
                    )
                  ) : (
                    message.templateID__body
                  )}
                  &nbsp;
                  {message.templateID__body.split(" ").length > 10 && (
                    <button
                      className="buttonn"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedIndexes.includes(index) ? "See Less" : "See More"}
                    </button>
                  )}
                </p>
              </div>
            )}

            <div style={{ marginBottom: "10px" }}>
              <p style={{ fontWeight: "bold", fontSize: "15px" }}>

                {t("Recurrence Details")}
              </p>
              <p>
                {t("Send")}: {message.send} {getRecurrenceTypeLabel(message.type)}{" "}

                {message.appointment} appointment. Occurrences:{" "}
                {message.occurrence}
              </p>
            </div>
            <div className="task-done">
              <button
                className="btntasks"
                style={{ marginRight: "5px" }}
                onClick={() =>
                  deleteMessage(message.templateID__idTemplates)
                }
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                className="btntasks"
                style={{ marginLeft: "5px" }}
                onClick={() => toggleEdit(message.idrecurrence)}
              >
                <FontAwesomeIcon icon={faPencil} />
              </button>
            </div>

            {isEditing === message.idrecurrence && (
              <MessageTemplate
                onDelete={() => setIsEditing(null)}
                editMessageID={message.idrecurrence}
                templateId={message.templateID__idTemplates}
                type={message.templateID__type}
                subtype={message.templateID__subType}
                getTemplates={props.getTemplates}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;