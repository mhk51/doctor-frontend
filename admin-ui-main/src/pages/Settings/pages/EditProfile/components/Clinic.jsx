import React, { useState, useEffect } from "react";
import "../../EditProfile/editprofile.scss";
import { SketchPicker } from "react-color";
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

const Clinic = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [clinics, setClinics] = useState([]);
  const [newClinicName, setNewClinicName] = useState("");
  const [newClinicColor, setNewClinicColor] = useState("#000000");
  const [isAddingClinic, setIsAddingClinic] = useState(false);
  const [isEdittngClinic, setIsEditingClinic] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [editingClinicId, setEditingClinicId] = useState(null);
  const [editingClinicIndex, setEditingClinicIndex] = useState(null);

  useEffect(() => {
    getClinics();
  }, []);

  const getClinics = () => {
    axios.get(`${API_BASE_URL}/clinic/`)
      .then(response => {
        setClinics(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const closeClinic = () => {
    setIsAddingClinic(false);
    setIsEditingClinic(false);
  };

  const addNewClinic = () => {
    setNewClinicName("");
    setNewClinicColor("#000000");
    setIsAddingClinic(true);
    setIsColorPickerVisible(false);
  };

  const addClinic = () => {
    if (newClinicName.trim() === "") {
      return;
    }

    const newClinic = {
      name: newClinicName,
      color: newClinicColor,
    };

    axios.post(`${API_BASE_URL}/clinic/`, newClinic)
      .then(response => {
        setNewClinicName("");
        setIsAddingClinic(false);
        getClinics();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleEditClinic = (index, clinicId) => {
    const clinicToEdit = clinics.find(clinic => clinic.id === clinicId);

    setIsEditingClinic(true);
    setIsColorPickerVisible(false);
    setNewClinicName(clinicToEdit.name);
    setNewClinicColor(clinicToEdit.color);
    setEditingClinicId(clinicId);
    setEditingClinicIndex(index);
  };

  const handleUpdateClinic = () => {
    if (newClinicName.trim() === "") {
      return;
    }

    const updatedClinic = {
      name: newClinicName,
      color: newClinicColor,
    };

    axios
      .put(`${API_BASE_URL}/clinic/${editingClinicId}/`, updatedClinic)
      .then(response => {
        setNewClinicName("");
        setIsEditingClinic(false);
        setIsColorPickerVisible(false);
        setEditingClinicId(null);
        setEditingClinicIndex(null);
        getClinics();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleClinicDelete = (clinicId, indexToDelete) => {
    axios.delete(`${API_BASE_URL}/clinic/${clinicId}/`)
      .then(response => {
        setClinics(prevClinics => prevClinics.filter((_, index) => index !== indexToDelete));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const toggleColorPicker = () => {
    setIsColorPickerVisible(prevState => !prevState);
  };

  const handleColorChange = (color) => {
    setNewClinicColor(color.hex);
  };

  return (
    <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
      <h3 style={{ marginBottom: "1rem" , fontSize:"0.9rem" }}>{t("Your Clinics")}</h3>

      {/* Display clinics list */}
      {clinics.map((clinic, index) => (
        <div key={clinic.id} style={{ display:"flex", flexDirection:"row", alignItems:"center", marginBottom: "1rem" , marginTop:'1rem'}}>
          <span
            style={{
              backgroundColor: clinic.color,
              width: "20px",
              height: "20px",
              display: "inline-block",
              borderRadius: "50%",
              marginRight: "1rem",
              fontSize: "0.9rem", 
            }}
          ></span>
          {clinic.name}

          <Trash
            onClick={() => handleClinicDelete(clinic.id, index)}
            size={18}
            color="red"
            style={{ marginLeft: "1rem", cursor: "pointer" }}
          />
          <Pencil
            onClick={() => handleEditClinic(index, clinic.id)}
            size={18}
            style={{ cursor: "pointer", color: "#007bff" }}
          />
        </div>
      ))}

      {isAddingClinic || isEdittngClinic ? (
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", flexDirection:"column" }}>
            <input
              type="text"
              placeholder="Clinic Name"
              value={newClinicName}
              onChange={(e) => setNewClinicName(e.target.value)}
            />
            <div
              style={{
                background: "radial-gradient(circle,  blue, violet, red)",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              onClick={toggleColorPicker}
            />
            {isColorPickerVisible && (
               window.innerWidth > 850 ? (
              <SketchPicker
                color={newClinicColor}
                onChange={handleColorChange}
                style={{ position: "fixed", zIndex: "2", display: "block" }}
                width="200px"
              />):(
                <SketchPicker
                color={newClinicColor}
                onChange={handleColorChange}
                style={{ position: "fixed", zIndex: "2", display: "block" }}
                width="100px"
              />)
              
            )}
          </div>
          <div >
            <p
              onClick={isEdittngClinic ? handleUpdateClinic : addClinic}
              style={{
                color: "blue",
                fontSize: "0.9rem",
                marginTop: "1rem",
                
                cursor: "pointer",
              }}
            >
              {isEdittngClinic ? "Submit Changes" : "+ Add"}
            </p>

            <p
              onClick={() => {
                setIsEditingClinic(false);
                setIsAddingClinic(false);
                setNewClinicName("");
                setNewClinicColor("#000000");
              }}
              style={{
                color: "red",
                fontSize: "0.9rem",
                marginTop: "1rem",
                cursor: "pointer",
              }}
            >
              ✖ {t("close")}
            </p>
          </div>
        </div>
      ) : (
        <p
          onClick={addNewClinic}
          style={{
            color: "blue",
            fontSize: "0.9rem",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          + {t("Add New")}
        </p>
      )}
    </div>
  );
};

export default Clinic;
