import { TextField } from "@mui/material";
import React from "react";

const ExpandableText = ({ width, text, height,onChange, value}) => {
  return (
    <TextField
      className="choose-box"
      id="outlined-basic"
      style={{ width }}
      label={text}
      multiline
      variant="outlined"
      InputProps={{ style: { height } }}
      
      onChange={onChange} // Add this line to handle input changes
      value={value} // Add this line to bind the value of the input
    />
  );
};

export default ExpandableText;
