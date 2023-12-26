import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "./datepicker.scss";
import { CalendarBlank } from "@phosphor-icons/react";

const DatePickerField = ({ text, value, onChange }) => {
  const handleSelect = (date) => {
    if (date === null) {
      onChange(""); // Pass an empty string if date is null
    } else {
      onChange(date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="date-picker"
        showDaysOutsideCurrentMonth
        components={{ OpenPickerIcon: CalendarBlank }}
        value={value || null} // Pass null if value is an empty string
        onChange={handleSelect}
        slotProps={{ textField: { placeholder: text } }}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "0.85rem",
            color: "black",
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;
