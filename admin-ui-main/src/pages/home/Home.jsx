import React, { useState } from "react";
import "./home.scss";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import Appointments from "./Cards/Appointments/Appointments";
import PatientInfo from "./Cards/PatientInfo/PatientInfo";
import References from "./Cards/References/References";
import Tasks from "./Cards/Tasks/Tasks";
import Task_Popup from "../../components/task-popup/Task-Popup"; // Import the Task_Popup component
import AllRefs from "../../components/reference-popup/AllRefs";
import AddNewRef from "../../components/reference-popup/AddNewRef/AddNewRef";
import axios from 'axios';
const Home = () => {
  
   
 
  return (
    <div className="container">
      <div className="side-bar">
        <SideBar />
      </div>
      <div className="nav-bar">
        <NavBar />
      </div>
      <div className="cards">
        <div className="appointment">
          <Appointments />
        </div>
        <div className="PatientInfo">
          <PatientInfo />
        </div>
        <div className="refrences">
          <References />
        </div>
        <div className="task">
          <Tasks />
        </div>
      </div>

      
     
    </div>
  );
};

export default Home;
