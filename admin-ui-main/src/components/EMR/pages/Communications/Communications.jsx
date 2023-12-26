import React, { Component, useState } from "react";
import "./communications.scss";
import DropDown from "../../../../components/widgets/DropDown/DropDown";
class Communications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communicationsList: [],
    };
  }
  render() {
    const { communicationsList } = this.state;
    return (
      <div className="communications-page">
        <div className="col1">
          <div className="row">
            <p>Title Name</p>
            <DropDown
              text={"Select Duration"}
              size={"small"}
              width={"40%"}
              options={[]}
            />
          </div>
          {communicationsList.map((_, index) => (
            <div
              key={index}
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            ></div>
          ))}
        </div>
        <div className="col2"></div>
      </div>
    );
  }
}

export default Communications;
