import React, { useState, useEffect } from "react";
import "../../EditProfile/editprofile.scss";
import { Trash } from "@phosphor-icons/react";
import { Pencil } from "@phosphor-icons/react";
import axios from 'axios';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../../../../config/config";
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
const Platform = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [platforms, setPlatforms] = useState([]);
  const [newPlatformName, setNewPlatformName] = useState("");
  const [isAddingPlatform, setIsAddingPlatform] = useState(false);
  const [isEdittngPlatform, setIsEditingPlatform] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState(null);
  const [editingPlatformIndex, setEditingPlatformIndex] = useState(null);

  useEffect(() => {
    getPlatforms();
  }, []);

  const getPlatforms = () => {
    axios.get(`${API_BASE_URL}/virtualmeet/`)
      .then(response => {
        setPlatforms(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const closePlatform = () => {
    setIsAddingPlatform(false);
    setIsEditingPlatform(false);
  };

  const addNewPlatform = () => {
    setIsAddingPlatform(true);
    setNewPlatformName("");
  };

  const addPlatform = () => {
    if (newPlatformName.trim() === "") {
      return;
    }

    const newPlatform = {
      platform: newPlatformName,
    };

    axios.post(`${API_BASE_URL}/virtualmeet/`, newPlatform)
      .then(response => {
        setNewPlatformName("");
        setIsAddingPlatform(false);
        getPlatforms();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleEditPlatform = (index, platformId) => {
    const platformToEdit = platforms.find(platform => platform.id === platformId);

    setIsEditingPlatform(true);
    setNewPlatformName(platformToEdit.platform);
    setEditingPlatformId(platformId);
    setEditingPlatformIndex(index);
  };

  const handleUpdatePlatform = () => {
    if (newPlatformName.trim() === "") {
      return;
    }

    const updatedPlatform = {
      platform: newPlatformName,
    };

    axios.put(`${API_BASE_URL}/virtualmeet/${editingPlatformId}/`, updatedPlatform)
      .then(response => {
        setNewPlatformName("");
        setIsEditingPlatform(false);
        setEditingPlatformId(null);
        setEditingPlatformIndex(null);
        getPlatforms();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handlePlatformDelete = (platformId, indexToDelete) => {
    axios.delete(`${API_BASE_URL}/virtualmeet/${platformId}/`)
      .then(response => {
        setPlatforms(prevPlatforms => prevPlatforms.filter((_, index) => index !== indexToDelete));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
      <h3 style={{ marginBottom: "1rem" , fontSize:"0.9rem" }}>{t("Your Platforms")}</h3>

      {platforms.map((platform, index) => (
        <div key={platform.id} style={{ display:"flex", flexDirection:"row", alignItems:"center", marginBottom: "1rem" , marginTop:'1rem'}}>
          {platform.platform}
          <Trash
            onClick={() => handlePlatformDelete(platform.id, index)}
            size={18}
            color="red"
            style={{ marginLeft: "1rem", cursor: "pointer" }}
          />
          <Pencil
            onClick={() => handleEditPlatform(index, platform.id)}
            size={18}
            style={{ cursor: "pointer", color: "#007bff" }}
          />
        </div>
      ))}

      {isAddingPlatform || isEdittngPlatform ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}>
            <input
              type="text"
              placeholder={t("Platform Name")}
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              onClick={isEdittngPlatform ? handleUpdatePlatform : addPlatform}
              style={{
                color: "blue",
                fontSize: "0.9rem",
                marginTop: "1rem",
                marginRight: "1rem",
                cursor: 'pointer',
              }}
            >
              {isEdittngPlatform ? "Submit Changes" : "+ Add"}
            </p>

            <p
              onClick={closePlatform}
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "1rem",
                cursor: 'pointer',
              }}
            >
              ✖ {t("close")}
            </p>
          </div>
        </div>
      ) : (
        <p
          onClick={addNewPlatform}
          style={{
            color: "blue",
            fontSize: "0.9rem",
            marginTop: "1rem",
            cursor: 'pointer',
          }}
        >
          + {t("Add New")}
        </p>
      )}
    </div>
  );
};

export default Platform;
