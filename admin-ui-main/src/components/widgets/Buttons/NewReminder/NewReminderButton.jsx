import React from "react";
import "./newreminderbutton.scss";

const NewReminderButton = ({ onClick }) => {
  return (
    <button className="reminder-btn" onClick={onClick}>
      <div className="plus">+</div>
      <div className="text">Create new reminder</div>
    </button>
  );
};

export default NewReminderButton;
