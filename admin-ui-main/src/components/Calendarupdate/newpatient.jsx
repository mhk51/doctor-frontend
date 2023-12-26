import React from "react"; 

import "./newpatient.scss";





 

const NewPatient = ({ isOpen, onClose }) => {
  // State for managing the form data

  // Function to handle changes in form fields
 
 

 

  if (!isOpen) return null;

 

  return (
<div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
<div className="new-patient">
<div className="content">
<div className="top">
<h2>Add a new patient</h2>
</div>

 <div className="button">
 

        
<div className="row">

<button className="close" onClick={onClose}>
              Close
</button>
</div>
</div></div>
</div>
    </div>
  );
};

 

export default NewPatient;


