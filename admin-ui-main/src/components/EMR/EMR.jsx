import React, { useState } from "react";
import "./emr.scss";
import Overview from "./pages/Overview/Overview";
import Radiology from "./pages/Radiology/Radiology";
import Lab from "./pages/Lab/Lab";
import Prescriptions from "./pages/Prescriptions/Prescriptions";
import Billing from "./pages/Billing/Billing";
import ReferralsPage from "./pages/Referrals/ReferralsPage";
import Communications from "./pages/Communications/Communications";
import Attachments from "./pages/Attachments/Attachments";
import SavedNotes from "./pages/SavedNotes/SavedNotes";

const EMR = (props) => {
  const [activeComponent, setActiveComponent] = useState("Component1");

  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const { selectedPatientId } = props;

  return (
    <div className="EMR">
      <div>
        <ul className="horizontal-list">
          <li
            onClick={() => handleButtonClick("Component1")}
            className={activeComponent === "Component1" ? "active" : ""}
          >
            Overview
          </li>
          <li
            onClick={() => handleButtonClick("Component2")}
            className={activeComponent === "Component2" ? "active" : ""}
          >
            Radiology
          </li>
          <li
            onClick={() => handleButtonClick("Component3")}
            className={activeComponent === "Component3" ? "active" : ""}
          >
            Prescriptions
          </li>
          <li
            onClick={() => handleButtonClick("Component4")}
            className={activeComponent === "Component4" ? "active" : ""}
          >
            Lab
          </li>
          <li
            onClick={() => handleButtonClick("Component5")}
            className={activeComponent === "Component5" ? "active" : ""}
          >
            Billing
          </li>
          <li
            onClick={() => handleButtonClick("Component6")}
            className={activeComponent === "Component6" ? "active" : ""}
          >
            Referrals
          </li>
          <li
            onClick={() => handleButtonClick("Component8")}
            className={activeComponent === "Component8" ? "active" : ""}
          >
            Saved Notes
          </li>
          <li
            onClick={() => handleButtonClick("Component9")}
            className={activeComponent === "Component9" ? "active" : ""}
          >
            Attachments
          </li>
        </ul>
      </div>

      <div className="content">
        {activeComponent === "Component1" && <Overview selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component2" && <Radiology selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component3" && <Prescriptions selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component4" && <Lab selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component5" && <Billing selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component6" && <ReferralsPage selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component8" && <SavedNotes selectedPatientId={selectedPatientId} />}
        {activeComponent === "Component9" && <Attachments selectedPatientId={selectedPatientId} />}
      </div>
    </div>
  );
};

export default EMR;
