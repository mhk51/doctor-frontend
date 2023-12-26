import React, { useEffect, useState, useRef } from "react";
import "./prescriptions.scss";
import DropDown from "../../../../components/widgets/DropDown/DropDown";
import ExpandableText from "../../../../components/widgets/ParagraphText/ExpandableText";
import { Printer } from "@phosphor-icons/react";
import Table from "../../../../components/Table/Table";
import PrescriptionPopup from "../../../Prescription/Prescription";
import Axios from "axios";
import { TextField } from "@mui/material";
import Custom_Table from "../../../../components/Table/CustomTable";
import { randomId } from "@mui/x-data-grid-generator";
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../../../config/config";
const languages = [
  {
    code: 'fr',
    name: 'Français',
    country_code: 'fr',
  },
  { 
    code: 'en',
    name: 'English',
    country_code: 'gb',
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    country_code: 'sa',
  },
]

const Prescriptions = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
//get
  const [PrescData, setPrescData] = useState([]);
  const [mostPrescribedData, setMostPrescribedData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
 /* const openPopup = () => {
    setIsPopupOpen(true);
  };*/
  const openPopup = (rowData) => {
    const preFilledData = rowData ? { ...rowData } : null;
    setSelectedRowData(preFilledData);
    setIsPopupOpen(true);
    console.log('Is Popup Open:', isPopupOpen); // Add this line
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    console.log('Is Popup Open:', isPopupOpen); 
  };
    const fetchData = () => {
    if (selectedPatientId) {
      Axios.get(`${API_BASE_URL}/patienthasprescription/`)
        .then(async (response) => {
          // Filter data for the selected patient
          const filteredData = response.data.filter(
            (item) => item.patient == selectedPatientId
          );
  
          const mappedData = await Promise.all(
            filteredData.map(async (item) => {
              const PrescResponse = await Axios.get(
                `${API_BASE_URL}/prescription/${item.prescription_idprescription}/`
              );
              return {
                id: item.id,
                date: item.date,
                name: PrescResponse.data.name,
                dose: item.dose,
                reason:item.reason,
                strength: item.strength,
                unit: item.unit,
                duration: item.duration,
              };
            })
          );
  
          // Set the state after all data is fetched and processed
          setPrescData(mappedData);
  
          // Calculate most prescribed medications
          const prescriptionCounts = {};
          mappedData.forEach((item) => {
            const prescriptionName = item.name;
            if (prescriptionCounts[prescriptionName]) {
              prescriptionCounts[prescriptionName]++;
            } else {
              prescriptionCounts[prescriptionName] = 1;
            }
          });
  
          // Sort by prescription count
          const sortedMedications = Object.entries(prescriptionCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
  
          // Generate unique IDs for the most prescribed data
          const mostPrescribedWithIds = sortedMedications.map((item) => ({
            id: randomId(),
            name: item.name,
          }));
  
          // Set the state for most prescribed data
          setMostPrescribedData(mostPrescribedWithIds);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    } else {
      // Clear the data when no patient is selected
      setPrescData([]);
      setMostPrescribedData([]);
    }
    };
    useEffect(() => {
      fetchData();
    }, [selectedPatientId]);
  

  const currentDate = new Date();
//post
const [newPrescription, setNewPrescription] = useState({
  name: "",
  dose: "",
  strength: "",
  unit: "",
  duration: "",
  reason: "",
  patient:selectedPatientId,
  date: currentDate.toISOString(),
});
const [prescriptionNames, setPrescriptionNames] = useState([]);

// Ref to keep track of whether prescription names have been fetched
const prescriptionNamesFetched = useRef(false);
const findSelectedPrescription = (name) => {
  // Find the selected prescription object based on the name
  return prescriptionID.find((prescription) => prescription.name === name);
};



const handleFieldChange = (e) => {
  const { name, value } = e.target;

  if (name === "name") {
    console.log("Selected Name:", value);
    // Find the selected prescription object based on the name
    const selectedPrescription = findSelectedPrescription(value);
    console.log("Selected Prescription:", selectedPrescription);
    console.log(selectedPrescription)
    if (selectedPrescription) {
      
      const prescriptionId = selectedPrescription.idprescription;
      console.log('prescription id', prescriptionId);
      setNewPrescription((prevState) => ({
        ...prevState,
        [name]: value,
        prescription_idprescription: prescriptionId,
      }));
    } else {
      setNewPrescription((prevState) => ({
        ...prevState,
        [name]: value,
        prescription_idprescription: null,
      }));
    }
  } else {
    setNewPrescription((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  } 
};


const savePrescription = () => {
  console.log("Form Data:", newPrescription);
  // Make an API request to save the patient data with the inputs state
  Axios
    .post(`${API_BASE_URL}/patienthasprescription/`, newPrescription)
    .then((response) => {
      console.log("Prescription data saved successfully:", response.data);
      // Close the popup or perform other actions as needed
      fetchData();
      setNewPrescription({
        name: "",
        dose: "",
        strength: "",
        unit: "",
        duration: "",
        reason: "",
        patient: selectedPatientId,
        date: currentDate.toISOString(),
      });
      
    })
    .catch((error) => {
      console.error("Error saving patient data:", error);
    });
};
const [prescriptionID, setPrescriptionID] = useState([]);
const fetchPrescriptionNames = () => {
  if (!prescriptionNamesFetched.current) {
    Axios.get(`${API_BASE_URL}/prescription/`)
      .then((response) => {
        // Extract prescription names from the response
        setPrescriptionID(response.data)
        const names = response.data.map((prescription) => prescription.name);
        setPrescriptionNames(names);
        prescriptionNamesFetched.current = true;

      })
      .catch((error) => {
        console.error("Error fetching prescription names:", error);
      });
  }
};


// Call the fetchPrescriptionNames function when the component mounts
useEffect(() => {
  fetchPrescriptionNames();
}, []);
const handleRowDelete = async (id) => {
  try {
    // Determine the URL based on the current page or component
    const apiUrl = `${API_BASE_URL}/patienthasprescription`; 
    await Axios.delete(`${apiUrl}/${id}/`);
    // Handle successful deletion
    console.log(`Row with ID ${id} deleted successfully.`);
    fetchData();
  } catch (error) {
    // Handle errors
    console.error(`Error deleting row with ID ${id}:`, error);
  }
};

const updateDataInBackend =  async (id, editedRow) => {
  try {
    // Define the URL for updating data (replace with your API endpoint)
    const apiUrl = `${API_BASE_URL}/patienthasprescription/${id}/`;
    console.log('editedRow:', editedRow);
    // Construct the updated data object
    const selectedPrescription = findSelectedPrescription(editedRow.name);
    const updatedData = {
      ...editedRow, // Include existing editedRow data
      patient: selectedPatientId, // Include the patient field
      prescription_idprescription: selectedPrescription.idprescription,
    };
    console.log('updatedRow:', updatedData);
    // Send a PUT request to update the data
    const response = await Axios.put(apiUrl, updatedData);
    fetchData()
    // Handle a successful response (you can log or perform other actions)
    console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
  } catch (error) {
    // Handle errors (you can log or display an error message)
    console.error(`Error updating row with ID ${id}:`, error);
  }
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
  const history_cols = [
    {
      field: "name",
      headerName: t("Prescription Name"),
      editable: false,
      flex: 0.3,
      minWidth: 100,
    },
    {
      field: "strength",
      headerName: t("Strength"),
      editable: true,
      flex: 0.3,
      minWidth: 100,
    },
    {
      field: "unit",
      headerName: t("Unit"),
      editable: true,
      flex: 0.3,
      minWidth: 100,
    },
    {
      field: "dose",
      headerName: "Dose",
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "date",
      headerName: t("Date"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: false,
      renderCell: (params) => formatDate(params.row.date),
    },
  ];
  const most_cols = [
    {
      field: "name",
      headerName: "Prescription Name",
      
      flex: 1,
      minWidth: 100,
    },
  ];


  return (
    <div className="prescriptions">
      <div className="rowpre1">
        <div className="col1">
          <h2
            style={{
              fontSize: "0.9rem",
              marginTop: ".5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
           {t("Prescription History")}
          </h2>
          <div className="tables">
          <Table new_cols={history_cols} data_rows={PrescData} onDelete={handleRowDelete} onUpdate={updateDataInBackend} onEditClick={openPopup} height={330} />
        </div>
        </div>
        </div>
        <div className="rowmed">
        <div className="col1">
          <h2
            style={{
              fontSize: "0.9rem",
              marginTop: ".5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            {t("Most Prescribed Medications")}
          </h2>
          <div className="tables">
          <Custom_Table new_cols={most_cols} data_rows={mostPrescribedData} height={330} />
          </div>
        </div>
      </div>
      <div className="rowpre">
        <h2
          style={{
            fontSize: "0.9rem",
            marginTop: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
         {t('Add Prescription')} 
        </h2>
      
      <div className="row2">
        {/* first row */}

        <div className="col1">
          <div className="row" style={{ marginBottom: "0.5rem" }}>
            <div className="first"
              style={{ width: "40%", marginRight: "0.5rem", marginBottom: "0.5rem"  }}>
             
             
            
            <Autocomplete
  id="name"
  options={prescriptionNames}
  value={newPrescription.name}
  onChange={(event, newValue) => {
    handleFieldChange({ target: { name: "name", value: newValue } });
  }}
  renderInput={(params) => <TextField {...params} label={t("Drug Name")} variant="outlined" InputLabelProps={{ style: { fontSize: '14px' }  }} />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  
  size='small'
/>
            </div>
            
            <div
              className="first"
              style={{ width: "40%", marginRight: "0.5rem", marginBottom: "0.5rem" }}
            >
                <TextField
                label={t("Strength")}
                name="strength"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{
                  style: { fontSize: '0.75rem' } 
                }}
                value={newPrescription.strength}
                onChange={handleFieldChange} 
              />
            </div>
            <div
              className="first"
              style={{ width: "40%", marginRight: "0.5rem", marginBottom: "0.5rem" }}
            >
            <TextField
              label={t("Unit")}
              name="unit"
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{
                style: { fontSize: '0.75rem' } 
              }}
              value={newPrescription.unit}
              onChange={handleFieldChange} 
            
            /></div>
          </div>

          {/* second row */}
          <div className="row">
            <div
              className="first"
              style={{ width: "40%", marginRight: "0.5rem",marginBottom: "0.5rem"  }}
            >
              <TextField
                label={t("Duration")}
                name="duration"
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{
                  style: { fontSize: '0.75rem' } 
                }}
                value={newPrescription.duration}
                onChange={handleFieldChange} 
              />
            </div>
            <div
              className="first"
              style={{ width: "40%", marginRight: "0.5rem", marginBottom: "0.5rem" }}
            >
            <TextField
              label={t("Dose")}
              name="dose"
              fullWidth
              variant="outlined"
              size="small"
              value={newPrescription.dose}
              onChange={handleFieldChange} 
              />
            </div>
           
          </div>

          
          <div   className="first"
              style={{ width: "40%", marginRight: "0.5rem", marginBottom: "0.5rem" }}>
          <textarea

  name="reason"
  rows={4}
  value={newPrescription.reason}
  onChange={handleFieldChange}
  placeholder={t("Reason")}
  className="custom-textarea" 
  
/>
            </div>
            <div
              className="first"
              style={{ width: "40%", marginRight: "0.5rem" }}
            ></div>
            <div className="bottoms">
     
     <button onClick={savePrescription}>{t('Prescribe to patient')}</button>
   </div>
           </div>
          </div>
          
         
          <PrescriptionPopup selectedPatientId={selectedPatientId} isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchData} preFilledData={selectedRowData} />
   
          
        </div>
          </div>
      

      
      );
};

export default Prescriptions;
