import React from "react";
import "./schedule.scss";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import ExternalDragDrop from "../../components/Calendar/ExternalDragDrop";

const Schedule = () => {
  return (
    <div className="schedule">
      <div className="side-bar-schedule">
        <SideBar />
      </div>
      <div className="schedule-containerr-navbar">
        <NavBar /></div>
        <div className="schedule-content">
          <ExternalDragDrop />
        </div>
      </div>
    
  );
};

export default Schedule;
