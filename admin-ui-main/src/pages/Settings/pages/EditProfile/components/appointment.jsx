import React, { useState, useEffect } from "react";
import "../../EditProfile/editprofile.scss";
import DropDown from "../../../../../components/widgets/DropDown/DropDown";
import { Trash } from "@phosphor-icons/react";
import { Pencil } from "@phosphor-icons/react";
import axios from 'axios';
import API_BASE_URL from "../../../../../config/config";
const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [newAppointmentName, setNewAppointmentName] = useState("");
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [isEditingAppointment, setIsEditingAppointment] = useState(false);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [editingAppointmentIndex, setEditingAppointmentIndex] = useState(null);

  const routeMapping = {
    "Procedure Instruction": "procedure-instruction",
    "Patient Education": "patient-education",
    "General Health Reminders": "general-health-reminders",
  };

  useEffect(() => {
    if (selectedAppointmentType) {
      getAppointments(selectedAppointmentType);
    }
  }, [selectedAppointmentType]);

  const handleAppointmentTypeChange = (selectedType) => {
    setSelectedAppointmentType(selectedType.target.value);
  };

  const getAppointments = (type) => {
    const route = routeMapping[type];
    axios.get(`${API_BASE_URL}/${route}/`)
      .then(response => {
        const appointments = response.data;
        setAppointments(appointments);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const addNew = () => {
    setIsAddingAppointment(true);
    setNewAppointmentName("");
  };

  const addNewAppointmentType = () => {
    if (!newAppointmentName.trim()) {
      return;
    }
    const route = routeMapping[selectedAppointmentType];

    const newAppointmentType = {
      name: newAppointmentName,
    };

    axios.post(`${API_BASE_URL}/${route}/`, newAppointmentType)
      .then(response => {
        console.log('New appointment type added:', response.data);

        setNewAppointmentName("");
        setIsAddingAppointment(false);

        getAppointments(selectedAppointmentType);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleEditAppointment = (index, appointmentId) => {
    const appointmentToEdit = appointments.find(appointment => appointment.id === appointmentId);

    setIsEditingAppointment(true);
    setNewAppointmentName(appointmentToEdit.name);
    setEditingAppointmentId(appointmentId);
    setEditingAppointmentIndex(index);
  };

  const handleUpdateAppointmentType = () => {
    if (!newAppointmentName.trim()) {
      return;
    }

    const route = routeMapping[selectedAppointmentType];

    const updatedAppointmentType = {
      name: newAppointmentName,
    };

    axios.put(`${API_BASE_URL}/${route}/${editingAppointmentId}/`, updatedAppointmentType)
      .then(response => {
        console.log('Appointment type updated:', response.data);

        setNewAppointmentName("");
        setIsEditingAppointment(false);
        setEditingAppointmentId(null);
        setEditingAppointmentIndex(null);

        getAppointments(selectedAppointmentType);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleAppointmentDelete = (appointmentId, indexToDelete) => {
    const route = routeMapping[selectedAppointmentType];

    axios.delete(`${API_BASE_URL}/${route}/${appointmentId}/`)
      .then(response => {
        console.log('Appointment type deleted:', response.data);
        setAppointments(prevAppointments => prevAppointments.filter((_, index) => index !== indexToDelete));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="row" style={{ marginBottom: "1rem" , marginLeft:"1rem", marginTop:'1rem'}}>
      <h3 style={{ marginBottom: "1rem" , fontSize:"0.9rem" }}>Appointment Types</h3>
      <div className="col2">
        <DropDown
          width={"100%"}
          text={"Select type here"}
          size={"small"}
          options={[
            "Procedure Instruction",
            "Patient Education",
            "General Health Reminders",
          ]}
          onChange={handleAppointmentTypeChange}
        ></DropDown>
      </div>

      {selectedAppointmentType && (
        <div style={{ margin: '10px' }}>
          {appointments.map((appointment, index) => (
            <div key={appointment.id}>
              {appointment.name}
              <Trash
                onClick={() => handleAppointmentDelete(appointment.id, index)}
                size={20}
                color="red"
                style={{ marginLeft: "1rem", cursor: "pointer" }}
              />
              <Pencil
                onClick={() => handleEditAppointment(index, appointment.id)}
                size={20}
                style={{ cursor: "pointer", color: "#007bff" }}
              />
            </div>
          ))}
          {isAddingAppointment || isEditingAppointment ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}>
                <input
                  type="text"
                  placeholder="AppointmentType Name"
                  value={newAppointmentName}
                  onChange={(e) => setNewAppointmentName(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  onClick={isEditingAppointment ? handleUpdateAppointmentType : addNewAppointmentType}
                  style={{
                    color: "blue",
                    fontSize: "0.9rem",
                    marginTop: "1rem",
                    marginRight: "1rem",
                    cursor: 'pointer',
                  }}
                >
                  {isEditingAppointment ? "Submit Changes" : "+ Add"}
                </p>

                <p
                  onClick={() => {
                    setIsAddingAppointment(false);
                    setIsEditingAppointment(false);
                    setNewAppointmentName("");
                  }}
                  style={{
                    color: "red",
                    fontSize: "0.9rem",
                    marginTop: "1rem",
                    cursor: 'pointer',
                  }}
                >
                  ✖ Close
                </p>
              </div>
            </div>
          ) : (
            <p
              onClick={addNew}
              style={{
                color: "blue",
                fontSize: "0.9rem",
                marginTop: "1rem",
                cursor: 'pointer',
              }}
            >
              + Add New
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Appointment;
