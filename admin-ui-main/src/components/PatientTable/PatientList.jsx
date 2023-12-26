import React, { useEffect, useState } from "react";
import axios from "axios";
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
const PatientList = ({ onPatientClick, patients }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSortingOption, setSelectedSortingOption] = useState("first_name");


  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to calculate initials
  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
    return initials;
  };

  // Function to sort patients based on the selected sorting option
  const sortedPatients = [...patients].sort((a, b) => {
    const valueA = a[selectedSortingOption] ? a[selectedSortingOption].toLowerCase() : '';
    const valueB = b[selectedSortingOption] ? b[selectedSortingOption].toLowerCase() : '';
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });
  
  const filteredPatients = sortedPatients.filter((patient) => {
    const firstName = patient.first_name ? patient.first_name.toLowerCase() : '';
    const lastName = patient.last_name ? patient.last_name.toLowerCase() : '';
    const middleName = patient.middle_name ? patient.middle_name.toLowerCase() : '';; // Convert MRN to a string for comparison
  
    return (
      firstName.includes(searchQuery.toLowerCase()) ||
      lastName.includes(searchQuery.toLowerCase()) ||
      middleName.includes(searchQuery.toLowerCase())
    );
  });
  
  const sortingOptions = [
    { label: t("By First Name"), value: "first_name" },
    { label: t("By Last Name"), value: "last_name" },
    { label: t("By Middle Name"), value: "middle_name" },
  ];
  
  // Function to handle sorting option change
  const handleSortingChange = (event) => {
    setSelectedSortingOption(event.target.value);
  };
  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <div className="search-sort-container">
          <div className="search-container">
            <input
              type="text"
              id="search"
              className="search-input"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
          <div className="sort-button">
            
            <select
              id="sortingOptions"
              onChange={handleSortingChange}
              value={selectedSortingOption}
            >
              {sortingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="contact-list-items">
        {filteredPatients.map((patient, index) => (
          <div
            key={patient.id}
            className="contact-list-item"
            onClick={() => onPatientClick(patient)}
          >
            <div className="contact-avatar">
              <div className="initials">
                {getInitials(`${patient.first_name} ${patient.last_name}`)}
              </div>
            </div>
            <div className="contact-details">
              <div className="contact-name">{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</div>
              <div className="phone-number">{patient.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
