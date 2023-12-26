import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect,useState} from "react";
import "./patientupdates.scss";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import NewReminderButton from "../../components/widgets/Buttons/NewReminder/NewReminderButton";
import DropDown from "../../components/widgets/DropDown/DropDown";
import CustomTable from "../../components/Table/CustomTable";
import { randomId } from "@mui/x-data-grid-generator";
import { patient_updates } from "../../config/constants";
import axios from "axios";
import API_BASE_URL from "../../config/config";


const PatientUpdates = () => {
  const navigate = useNavigate();
  const [dataRows, setDataRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patientreceivetemplates/`);
  
// Fetch all patient receive templates
const templatesResponse = await axios.get(`${API_BASE_URL}/templates/`);
const patientsResponse = await axios.get(`${API_BASE_URL}/patients/`);

const templatesMap = {}; // Map to store templates by ID
const patientsMap = {}; // Map to store patients by ID

// Store templates in a map with their ID as the key
templatesResponse.data.forEach(template => {
  templatesMap[template.idTemplates] = template;
});
console.log("t",templatesResponse);
// Store patients in a map with their ID as the key
patientsResponse.data.forEach(patient => {
  patientsMap[patient.id] = patient;
});

const extractedData = response.data.map(item => {
  const patient = patientsMap[item.patient];
  const template = templatesMap[item.templates];
  const formattedDate = new Date(item.date).toLocaleDateString();
  const status = item.status ? "Sent" : "Unsent";
console.log("tem",template);
  return {
    id: randomId(),
    patient: patient ? patient.full_name_phone : "Unknown",
    templates: template ? template.name : "Unknown",
    date: formattedDate,
    status: status,
    type: template ? template.type : "Unknown",
    subtype: template ? template.subType : "Unknown"
  };
});

const sortedData = extractedData.sort((a, b) => new Date(a.date) - new Date(b.date));
setDataRows(sortedData);
} catch (error) {
console.error("Error fetching data:", error);
}
};

fetchData();
  }, []);


  const new_rows = [
    {
      id: randomId()
    }
  ];

    const new_cols = [
      {
        field: "templates",
        headerName: "Message Title",
        flex: 0.5,
        minWidth: 100,
      },
      {
        field: "patient",
        headerName: "Patient Name",
        type: "text",
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        
      },
      {
        field: "date",
        headerName: "Scheduled",
        type: "text",
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        
      },
      {
        field: "status",
        headerName: "Status",
        type: "text",
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        
      },

      {
        field: "type",
        headerName: "Type",
        type: "text",
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        
      },
      {
        field: "subtype",
        headerName: "Subtype",
        type: "text",
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        
      },
    ];
  return (
    <div className="patient-updates">
      <SideBar />
      <div className="patient-updates-container">
        <NavBar />
        
        <div className="top">
          <div className="row-1">
            <h2>Reminders</h2>
            <NewReminderButton onClick={() => navigate("/createreminder")} />
          </div>
          <div className="row-2" >
           <CustomTable data_rows={dataRows} new_cols={new_cols} height="470px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientUpdates;