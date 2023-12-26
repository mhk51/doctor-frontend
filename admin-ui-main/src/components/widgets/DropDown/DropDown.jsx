import React from "react";

function DropDown({ text, width, size, options, onChange, value, disabled}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange({ target: { name: "name", value: e.target.value } })}
      style={{ width }}
      size={size}
      disabled={disabled}
      
    >
      <option value="">{text}</option>
      {options?.map((option) => (
        <option key={option} value={option} disabled={disabled}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default DropDown;
