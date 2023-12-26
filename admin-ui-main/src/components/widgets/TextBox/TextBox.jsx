import { TextField } from "@mui/material";
import React, { useState } from "react";
import { green } from "@mui/material/colors";

function TextBox({ width, size, text, value , onChange}) {

  return (
    <TextField
      className="text-box"
      id="outlined-basic"
     style={{ width }}
      label={text}
      variant="outlined"
      size={size}
      onChange={onChange} // Add this line to handle input changes
      value={value} 
    />
  );
}

export default TextBox;