import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorList = ({ onDoctorClick, doctors }) => {
 
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

  const sortedDoctors = [...doctors].sort((a, b) => {
    const valueA = a[selectedSortingOption] ? a[selectedSortingOption].toLowerCase() : '';
    const valueB = b[selectedSortingOption] ? b[selectedSortingOption].toLowerCase() : '';
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });
  
  const filteredDoctors = sortedDoctors.filter((doctor) => {
    const firstName = doctor.first_name ? doctor.first_name.toLowerCase() : '';
    const lastName = doctor.last_name ? doctor.last_name.toLowerCase() : '';
    
  
    return (
      firstName.includes(searchQuery.toLowerCase()) ||
      lastName.includes(searchQuery.toLowerCase()) 
    );
  });
  

  const sortingOptions = [
    { label: "By First Name", value: "first_name" },
    { label: "By Last Name", value: "last_name" },
  
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
        {filteredDoctors.map((doctor, index) => (
          <div
            key={doctor.idreferral_doctors}
            className="contact-list-item"
            onClick={() => onDoctorClick(doctor)}
          >
            <div className="contact-avatar">
              <div className="initials">
                {getInitials(`${doctor.first_name} ${doctor.last_name}`)}
              </div>
            </div>
            <div className="contact-details">
              <div className="contact-name">{`${doctor.first_name} ${doctor.last_name}`}</div>
              <div className="phone-number">{doctor.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
