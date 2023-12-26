import React from "react";
import"./configmed.scss";
import SideBar from"../Sidebar/SideBar";
import NavBar from"../NavBar/NavBar";
import Radiology from "./medd/radiology";
import Prescriptionn from "./medd/prescriptionn";
import MedicalTest from"../configuremed/medd/medicaltest";
import Problem from "./medd/problem";
const Configmed = () => {
return(
      <div className="cardss1">
  <div className="nav-conf">
    <NavBar />
  </div>
  <div className="side-bar-conf">
    <SideBar />
  </div>
  <div className="configmedi">
    <div className="con-group">
      <div className="con">
        <Prescriptionn />
      </div>
      <div className="con">
        <Problem />
      </div>
    
      <div className="con">
        <Radiology />
      </div>
   
      <div className="con">
        <MedicalTest />
      </div>
     
    </div>
  </div>
</div>

    
)
}
export default Configmed;