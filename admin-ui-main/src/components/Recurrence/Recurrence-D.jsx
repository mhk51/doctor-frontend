import React from "react";
import SaveButton from "../widgets/Buttons/Save/SaveButton";
import "./recurrenceD.scss";
import { useNavigate } from "react-router-dom";
import DropDown from "../widgets/DropDown/DropDown";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
const RecurrenceDaily = () => {
  const navigate = useNavigate();
  return (
    <div className="recurrenceD">
      <div className="row1">
        <h2>Message Scheduling</h2>
        <SaveButton />
      </div>
      <div className="row2">
        <div className="col1">
          <h3>Pattern</h3>
          <ul>
            <li onClick={() => navigate("/Custom")}>Custom</li>
            <li>Daily</li>
            <li onClick={() => navigate("/Weekly")}>Weekly</li>
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
              <p style={{ marginLeft: "1rem" }}>days(s)</p>
              <DropDown width={"20%"} size={"small"} options={[]}></DropDown>
              <p style={{ marginLeft: "1rem" }}>Appointment</p>
            </div>

            <div className="checkboxes">
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
                    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
                      Repeat on this day every month
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
                    />
                  }
                  label={
                    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
                      Repeat on this day every week
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
                    />
                  }
                  label={
                    <Typography variant="body2" style={{ fontSize: "0.8rem" }}>
                      Repeat on this day every year
                    </Typography>
                  }
                />

                {/* Second Section */}
                <h3>End after:</h3>
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
                  label={<p style={{fontSize: "0.9rem" }}>Never</p>}
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceDaily;
