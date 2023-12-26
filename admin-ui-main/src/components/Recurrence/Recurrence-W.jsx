import React from "react";
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
const RecurrenceWeekly = () => {
  const navigate = useNavigate();
  return (
    <div className="recurrence">
      <div className="row1">
        <h2>Message Scheduling</h2>
        <SaveButton />
      </div>
      <div className="row2">
        <div className="col1">
          <h3>Pattern</h3>
          <ul>
            <li onClick={() => navigate("/Custom")}>Custom</li>
            <li onClick={() => navigate("/Daily")}>Daily</li>
            <li>Weekly</li>
            <li onClick={() => navigate("/Monthly")}>Monthly</li>
            <li onClick={() => navigate("/Annually")}>Annually</li>
          </ul>
        </div>
        <div className="col2">
          <h3>Details</h3>
          <div className="content">
            <div className="details">
              <p>Send</p>
              <DropDown width={"20%"} size={"small"} options={[]}></DropDown>
              <p style={{ marginLeft: "1rem" }}>week(s)</p>
              <DropDown width={"20%"} size={"small"} options={[]}></DropDown>
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
                    />
                  }
                  label={
                    <div className="box-content">
                      <div className="box-details">
                        <DropDown
                          width={"60%"}
                          size={"small"}
                          options={[]}
                        ></DropDown>
                        <p style={{ marginLeft: "1rem" }}>Occurence(s)</p>
                      </div>
                    </div>
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
                    />
                  }
                  label={
                    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
                      Never
                    </Typography>
                  }
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceWeekly;
