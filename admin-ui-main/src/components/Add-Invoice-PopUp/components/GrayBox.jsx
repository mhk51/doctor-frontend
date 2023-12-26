import { PencilSimple } from "@phosphor-icons/react";
import React from "react";
import "../../Add-Invoice-PopUp/addinvoice.scss";

const GrayBox = () => {
  return (
    <div className="greybox">
      <div className="col-1">
        <div className="row-1">
          <p className="titles">Issuer's Name</p>
          <p className="inputs"></p>
        </div>
        <div className="row-2">
          <p className="titles">Address</p>
          <p className="inputs"></p>
        </div>
        <div className="row-3">
          <p className="titles">Phone Number</p>
          <p className="inputs"></p>
        </div>
        <div className="row-4">
          <p className="titles">Email Address</p>
          <p className="inputs"></p>
        </div>
      </div>
      <div className="col-2">
        <div className="editbtn">
          <p>Edit</p>
          <PencilSimple size={18} color="#828282" />
        </div>
      </div>
    </div>
  );
};

export default GrayBox;