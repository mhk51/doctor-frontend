import React, { useState } from "react";
import SaveButton from "../widgets/Buttons/Save/SaveButton";
import "./recurrenceC.scss";
import { useNavigate } from "react-router-dom";
import DropDown from "../widgets/DropDown/DropDown";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import CancelButton from "../widgets/Buttons/Cancel/CancelButton";

const Recurrence = ({ recurrenceType, isOpen, onClose,updateRecurrenceDetails }) => {
  const navigate = useNavigate();

  // State to track selected values
  const [sendValue, setSendValue] = useState("");
  const [appointmentValue, setAppointmentValue] = useState("");
  const [occurrenceValue, setOccurrenceValue] = useState("");
  

  // Generate options based on recurrence type
  const generateSendOptions = () => {
    switch (recurrenceType) {
      case "custom":
        return ["0", ...Array.from({ length: 24 }, (_, i) => `${i + 1}`)];
      case "daily":
        return Array.from({ length: 31 }, (_, i) => `${i + 1}`);
      case "weekly":
        return Array.from({ length: 10 }, (_, i) => `${i + 1}`);
      case "monthly":
        return Array.from({ length: 12 }, (_, i) => `${i + 1}`);
      case "annually":
        return Array.from({ length: 5 }, (_, i) => `${i + 1}`);
      default:
        return [];
    }
  };

  // Options for the "Before" and "After" appointment dropdown
  const appointmentOptions = ["Before", "After"];

  // Options for the occurrence dropdown
  const occurrenceOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

  // Handle change for "Never" checkbox
  const handleNeverChange = (event) => {
    // Set occurrenceValue to "0" when "Never" is selected
    setOccurrenceValue(event.target.checked ? "0" : "");
  };

  // Handle change for occurrence checkbox
  const handleOccurrenceChange = (event) => {
    setOccurrenceValue(event.target.checked ? "1" : "");
  };

  // Handle save to display the selected recurrence details and save the values
  const handleSave = () => {
    // Save the selected values to the component's state
    const recurrenceDetails = {
      send: sendValue,
      appointment: appointmentValue,
      occurrence: occurrenceValue || null,
    };

    updateRecurrenceDetails(recurrenceDetails);

    // Log the selected values to the console
    console.log("Recurrence Details:", recurrenceDetails);
  };

  const handleClose = () => {
    onClose();
  };

  return isOpen ? (
    <div className="recurrence">
      <div className="row1">
        <h2>Message Scheduling</h2>
        <SaveButton onClick={handleSave}> Save</SaveButton>
        <CancelButton onClick={handleClose}>Close</CancelButton>
      </div>

      <div className="row2">
        <div className="col2">
          <h3>Details</h3>
          <div className="content">
            <div className="details">
              <p>Send</p>
              <DropDown
                width={"20%"}
                size={"small"}
                options={generateSendOptions()}
                value={sendValue}
                onChange={(event) => setSendValue(event.target.value)}
              />
              <p style={{ marginLeft: "1rem" }}>
                {recurrenceType === "weekly" ? "week(s)" : ""}
                {recurrenceType === "daily" ? "day(s)" : ""}
                {recurrenceType === "monthly" ? "month(s)" : ""}
                {recurrenceType === "annually" ? "year(s)" : ""}
                {recurrenceType === "custom" ? "hour(s)" : ""}
              </p>
              <DropDown
                width={"20%"}
                size={"small"}
                options={appointmentOptions}
                value={appointmentValue}
                onChange={(event) => setAppointmentValue(event.target.value)}
              />
              <p style={{ marginLeft: "1rem" }}>Appointment</p>
            </div>

            <div className="checkboxes">
              <h3>End after:</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#004957",
                        "&.Mui-checked": {
                          color: "#004957",
                        },
                      }}
                      checked={occurrenceValue === "0"}
                      onChange={handleNeverChange}
                    />
                  }
                  label={
                    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
                      Never
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#004957",
                        "&.Mui-checked": {
                          color: "#004957",
                        },
                      }}
                      checked={occurrenceValue !== "0" && occurrenceValue !== ""}
                      onChange={handleOccurrenceChange}
                      disabled={occurrenceValue === "0"}
                    />
                  }
                  label={
                    <div className="box-content">
                      <div className="box-details">
                        <DropDown
                          width={"60%"}
                          size={"small"}
                          options={occurrenceOptions}
                          value={occurrenceValue}
                          onChange={(event) =>
                            setOccurrenceValue(event.target.value)
                          }
                          disabled={occurrenceValue === "0"}
                        />
                        <p style={{ marginLeft: "1rem" }}>Occurrence(s)</p>
                      </div>
                    </div>
                  }
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Recurrence;
