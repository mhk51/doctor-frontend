// AddNewRef.jsx
import "./addnewref.scss";
import Axios from "axios";
import ExpandableText from "../../widgets/ParagraphText/ExpandableText";
import SaveButton from "../../widgets/Buttons/Save/SaveButton";
import CancelButton from "../../widgets/Buttons/Cancel/CancelButton";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from 'react-i18next';
import cookies from 'js-cookie';
import API_BASE_URL from "../../../config/config";
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

const AddNewRef = ({ isOpen, onClose, fetchReference, editedReference }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en';
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode);
  const { t } = useTranslation();

  useEffect(() => {
    console.log('Setting page stuff');
    document.body.dir = currentLanguage.dir || 'ltr';
  }, [currentLanguage, t]);

  const [inputs, setInputs] = useState({
    title: editedReference ? editedReference.title : "",
  });

  const [refContent, setRefContent] = useState(editedReference ? editedReference.url_ref : "");

  const handleSaveClick = async () => {
    try {
      if (editedReference) {
        await Axios.put(`${API_BASE_URL}/reference/${editedReference.id}/`, {
          title: inputs.title,
          url_ref: refContent,
        });
      } else {
        await Axios.post(`${API_BASE_URL}/reference/`, {
          title: inputs.title,
          url_ref: refContent,
        });
      }

      console.log("Reference saved successfully!");
      fetchReference();
      onClose();
    } catch (error) {
      console.error("Error saving reference:", error);
    }
  };

  const handleRefChange = (event) => {
    setRefContent(event.target.value);
  };

  const handleCancelClick = () => {
    setInputs({
      title: "",
    });
    setRefContent("");
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
      <div className="add-new-ref">
        <div className="top">
          <h2>{editedReference ? t("Edit Reference") : t("Add New Reference")}</h2>
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
            text={t("Add Reference URL")}
            value={refContent}
            onChange={handleRefChange}
            style={{ marginBottom: "0.5rem" }}
          />
        </div>
        <div className="cancel-and-saves-newref">
          <SaveButton onClick={handleSaveClick} />&nbsp;&nbsp;
          <CancelButton onClick={handleCancelClick} />
        </div>
      </div>
    </div>
  );
};

export default AddNewRef;
