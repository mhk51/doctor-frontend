import React from "react";
import "./bookapp.scss";
import { book_new_app } from "../../config/constants";
import DropDown from "../widgets/DropDown/DropDown";
import NewPatient from "../widgets/Buttons/NewPatient/NewPatientButton";
import TextBox from "../widgets/TextBox/TextBox";
import ExpandableText from "../widgets/ParagraphText/ExpandableText";
import BookButton from "../widgets/Buttons/Book/Book";
import CancelButton from "../widgets/Buttons/Cancel/CancelButton";
import NewPatientButton from "../widgets/Buttons/NewPatient/NewPatientButton";

const BookApp = () => {
  return (
    <div className="book-app">
      <div className="content">
        <div className="top">
          <h2>{book_new_app}</h2>
        </div>

        <div className="center">
          <div className="choose-patient">
            <DropDown text={"Choose Patient"} width={"90%"} size={"small"} />
          </div>
          <div className="chief-complaint">
            <TextBox text={"Chief Complaint"} width={"60%"} size={"small"} />
          </div>
          <div className="new-patient">
            <NewPatientButton />
          </div>

          <hr />

          <h3>Appointment Details</h3>

          <div className="second-section">
            <div className="first-row">
              <TextBox text={"Date"} width={"100%"} size={"small"} />
              <div className="first-row-col2">
                {" "}
                <TextBox text={"Duration"} width={"60%"} size={"small"} />
              </div>
            </div>

            <div className="second-row">
              <DropDown text={"Assigned Clinic"} width={"90%"} size={"small"} />
            </div>
            <div className="third-row">
              <DropDown text={"Procedure Type"} width={"60%"} size={"small"} />
            </div>
            <div className="third-section">
              <h3>Appointment Type</h3>
              <div className="first-row" id="Type">
                <DropDown text={"Type"} width={"40%"} size={"small"} />
              </div>
              <div className="second-row" id="link">
                <TextBox text={"Link"} width={"90%"} size={"small"} />
              </div>
              <div className="third-row">
                <p>Remind me before</p>
                <DropDown text={""} width={"25%"} size={"small"} />
              </div>
            </div>
          </div>

          <hr />

          <div className="fourth-section">
            <h3>Additional Notes</h3>
            <div className="first-row">
              <ExpandableText width={"90%"} />
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <CancelButton />
        <BookButton />
      </div>
    </div>
  );
};

export default BookApp;
