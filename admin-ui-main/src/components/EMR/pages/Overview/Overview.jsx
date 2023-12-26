import React, { useEffect, useState, useRef } from "react";
import "./overview.scss";
import Problem from "../../../problem/problem";
import ExpandableText from "../../../../components/widgets/ParagraphText/ExpandableText";
import SaveButton from "../../../../components/widgets/Buttons/Save/SaveButton";
import CancelButton from "../../../widgets/Buttons/Cancel/CancelButton";
import Allergies from "../../../Allergies/Allergies";
import { File } from "@phosphor-icons/react";
import AddButton from "../../../../components/widgets/Buttons/Add/AddButton";
import axios from "axios";
import Table from "../../../../components/Table/Table"; // Import your custom table component
import CustomTable from "../../../../components/Table/CustomTable";
import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import PrescriptionOverview from "../../../Prescription/PrescriptionOverview";
import PrescriptionPopup from "../../../Prescription/Prescription";
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
const Overview = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [attachmentType, setAttachmentType] = useState(null); // Set a default value if needed
  const [filename, setFilename] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setstatus] = useState('');
  const [allergiesData, setAllergiesData] = useState([]);
  const [problemsData, setProblemsData] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [isPopupOpenallergie, setIsPopupOpenallergie] = useState(false);
  const [isPopupOpenprob, setIsPopupOpenprob] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
  });
  const [selectedRowAllergyData, setSelectedRowAllergyData]= useState([]);
  const [selectedProblemRowData, setSelectedProblemRowData]= useState([]);
  const openPopupallergie = (rowData) => {
    const preFilledData = rowData ? { ...rowData } : null;
    setSelectedRowAllergyData(preFilledData);
    setIsPopupOpenallergie(true);
  };
  /*const openPopupallergie = () => {
    setIsPopupOpenallergie(true);
  };*/
  const closePopupallergie = () => {
    setIsPopupOpenallergie(false);
  };

  const openPopupp = (rowData) => {
    const preFilledData = rowData ? { ...rowData } : null;
    setSelectedProblemRowData(preFilledData);
    setIsPopupOpenprob(true);
  };
  /*const openPopupp = () => {

    setIsPopupOpenprob(true);
  };*/
  const closePopupp = () => {
    setIsPopupOpenprob(false);
  };

  const fetchData = () => {
    if (selectedPatientId) {
      console.log("Selected Patient ID:", selectedPatientId);

      // Fetch allergies data for the selected patient and map the fields
      axios.get(`${API_BASE_URL}/allergies/`)
        .then(async (response) => {
          console.log("result Data:", response.data);
          // Filter data for the selected patient
          const filteredData = response.data.filter((item) => item.patient == selectedPatientId);
          console.log("Filtered allergie Data:", filteredData);
          const mappedData = await Promise.all(
            filteredData.map(async (item) => {
              return {
                id: item.id,
                type: item.type,
                level: item.level,
                patient: selectedPatientId,
              };
            })
          );
          console.log("Mapped lab Data:", mappedData);
          setAllergiesData(mappedData);
        })
        .catch((error) => {
          console.error("Error fetching allergies data: ", error);
        });
      } else {
        // Clear the data when no patient is selected
        setAllergiesData([]);
      }
      };
      const fetchPro = () => {
        if (selectedPatientId) {
          console.log("Selected Patient ID:", selectedPatientId);
      // Fetch problems data for the selected patient and map the fields
      axios.get(`${API_BASE_URL}/patienthasproblem/`)
        .then(async (response) => {
          console.log("Problems Data:", response.data);
          // Filter data for the selected patient
          const filteredData = response.data.filter((item) => item.patient == selectedPatientId);
          console.log("Filtered problem Data:", filteredData);
          const mappedData = await Promise.all(
            filteredData.map(async (item) => {
              const problemResponse = await axios.get(
                `${API_BASE_URL}/problem/${item.icd_problem}/`
              );
              return {
                id: item.id,
                date: item.date,
                patient: selectedPatientId,
                icd: problemResponse.data.icd,
                problem: problemResponse.data.problem_desc,
                icd_problem:item.icd_problem
              };
            })
          );
          console.log("Mapped Problems Data:", mappedData);
          setProblemsData(mappedData);
        })
        .catch((error) => {
          console.error("Error fetching problems data: ", error);
        });
    } else {
      // Clear the data when no patient is selected
      
      setProblemsData([]);
    }
  };
  useEffect(() => {
    fetchData(); // Initial data fetch
    fetchPro();
    fetchPresData();
  }, [selectedPatientId]);

  const handleRowDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/allergies`; 
      await axios.delete(`${apiUrl}/${id}/`);
      // Handle successful deletion
      console.log(`Row with ID ${id} deleted successfully.`);
      fetchData();
    } catch (error) {
      // Handle errors
      console.error(`Error deleting row with ID ${id}:`, error);
    }
  };

  const handleProDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/patienthasproblem`; 
      await axios.delete(`${apiUrl}/${id}/`);
      // Handle successful deletion
      console.log(`Row with ID ${id} deleted successfully.`);
      fetchPro();
    } catch (error) {
      // Handle errors
      console.error(`Error deleting row with ID ${id}:`, error);
    }
  };
  
  const updateDataInBackend =  async (id, editedRow) => {
    try {
      // Define the URL for updating data (replace with your API endpoint)
      const apiUrl = `${API_BASE_URL}/allergies/${id}/`;
      console.log('editedRow:', editedRow);
      // Construct the updated data object
     
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient: selectedPatientId, // Include the patient field
        
      };
      console.log('updatedRow:', updatedData);
      // Send a PUT request to update the data
      const response = await axios.put(apiUrl, updatedData);
  
      // Handle a successful response (you can log or perform other actions)
      console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
      fetchData();
    } catch (error) {
      // Handle errors (you can log or display an error message)
      console.error(`Error updating row with ID ${id}:`, error);
    }
  };

  const updateProInBackend =  async (id, editedRow) => {
    try {
      // Define the URL for updating data (replace with your API endpoint)
      const apiUrl = `${API_BASE_URL}/patienthasproblem/${id}/`;
      console.log('editedRow:', editedRow);
      // Construct the updated data object
      const Date = editedRow.date || null;
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient: selectedPatientId, // Include the patient field
        date: Date,
        
      };
      console.log('updatedRow:', updatedData);
      // Send a PUT request to update the data
      const response = await axios.put(apiUrl, updatedData);
      fetchPro();
  
      // Handle a successful response (you can log or perform other actions)
      console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
    } catch (error) {
      // Handle errors (you can log or display an error message)
      console.error(`Error updating row with ID ${id}:`, error);
    }
  };
  const allergiesColumns = [
    {
      headerName: t("Type"),
      field: "type",
      editable: true,
      width: 100,
    },
    {
      headerName: t("Level"),
      field: "level",
      editable: true,
      width: 100,
    },
  ];

  const problemsColumns = [
    {
      headerName: t("Date"),
      field: "date",
      editable: true,
      flex: 0.5,
      width: 100,
    },
    {
      headerName: "ICD",
      field: "icd",
      flex: 0.2,
      width: 100,
      editable: false,
    },
    {
      headerName: t("Problem"),
      field: "problem",
      flex: 0.5,
      width: 70,
      editable: false,
    },
  ];

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };
  const [userApiKey, setUserApiKey] = useState('');
  const token = localStorage.getItem('token');
  console.log("token", token);
  const [user, setUser] = useState(null);
  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await axios.get(`${API_BASE_URL}/users/`, config)

        const userData = response.data;
        if (userData.gpt) {
          console.log("API Key received:", userData.gpt);
          setUserApiKey(userData.gpt);}
        console.log("userdatasaved", userData);
        setUser(userData);
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []); 
  const handleSubmitNote = async () => {
    try {
      const currentDate = new Date();
      // Send a POST request to save the note
      await axios.post(`${API_BASE_URL}/notes/`, {
        saved_notes: noteContent,
        title: inputs.title,
        patient: selectedPatientId,
        date: currentDate.toISOString(),
        user:user.id,
        // Add any other necessary fields to the request
      });
      // Optionally, you can clear the note input field after submission
      setNoteContent("");
      setInputs({
        title: "",
      });
      // Handle success or show a notification to the user
      console.log("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCancelClick = () => {
    setNoteContent("");
    setInputs({
      title: "",
      patient: selectedPatientId,
      date: currentDate.toISOString(),
    });
  };
  const currentDate = new Date();
  let api = `${API_BASE_URL}`;

  const saveFile = () => {
    console.log('Button clicked');
    let formData = new FormData();
    console.log("file", filename);
    formData.append("attachment_file", filename); // Append the file with its name.
    formData.append("name", filename.name);
    formData.append("patient", selectedPatientId);
    formData.append("date", currentDate.toISOString());
    formData.append("type", attachmentType);
    let axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    console.log(formData);
    axios.post(api + '/attachment/', formData, axiosConfig)
      .then(response => {
        console.log(response);
        setstatus('File Uploaded Successfully');
        
        setAttachmentType(null);
        
 // Set a default value if needed
        setFilename("");
        setstatus('');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [selectedFile, setSelectedFile] = useState(null); // New state variable to store the selected file

  const viewFile = (file) => {
    setSelectedFile(file); // Set the selected file to be viewed
  };

  const resetSelectedFile = () => {
    setSelectedFile(null); // Clear the selected file viewer
  };

  const getFiles = () => {
    axios.get(api + '/attachment/').then(
      response => {
        setFiles(response.data);
      }
    ).catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    getFiles();
  }, []);

  const [PrescData, setPrescData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupPresOpen, setIsPopupPresOpen] = useState(false);
   const openAddPopup = () => {
     setIsPopupPresOpen(true);
   };
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
   const closePresPopup = () => {
    setIsPopupPresOpen(false);
    console.log('Is Popup Open:', isPopupOpen); 
  };
     const fetchPresData = () => {
     if (selectedPatientId) {
       axios.get(`${API_BASE_URL}/patienthasprescription/`)
         .then(async (response) => {
           // Filter data for the selected patient
           const filteredData = response.data.filter(
             (item) => item.patient == selectedPatientId
           );
   
           const mappedData = await Promise.all(
             filteredData.map(async (item) => {
               const PrescResponse = await axios.get(
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
   
          
         })
         .catch((error) => {
           console.error("Error fetching data: ", error);
         });
     } else {
       // Clear the data when no patient is selected
       setPrescData([]);
  
     }
     };

   
 

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
 
 
 
 
 const savePrescription = () => {
   console.log("Form Data:", newPrescription);
   // Make an API request to save the patient data with the inputs state
   axios
     .post(`${API_BASE_URL}/patienthasprescription/`, newPrescription)
     .then((response) => {
       console.log("Prescription data saved successfully:", response.data);
       // Close the popup or perform other actions as needed
       fetchPresData();
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
     axios.get(`${API_BASE_URL}/prescription/`)
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
 const handleRowPresDelete = async (id) => {
   try {
     // Determine the URL based on the current page or component
     const apiUrl = `${API_BASE_URL}/patienthasprescription`; 
     await axios.delete(`${apiUrl}/${id}/`);
     // Handle successful deletion
     console.log(`Row with ID ${id} deleted successfully.`);
     fetchPresData();
   } catch (error) {
     // Handle errors
     console.error(`Error deleting row with ID ${id}:`, error);
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
  const updateDataPresInBackend =  async (id, editedRow) => {
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
      const response = await axios.put(apiUrl, updatedData);
      fetchData()
      // Handle a successful response (you can log or perform other actions)
      console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
    } catch (error) {
      // Handle errors (you can log or display an error message)
      console.error(`Error updating row with ID ${id}:`, error);
    }
  };

  /*const [generationType, setGenerationType] = useState(null);
  const [symptoms, setSymptoms] = useState([{ name: '', onset: '', duration: '', severity: '' }]);

  const handleSymptomChange = (index, field, value) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index][field] = value;
    setSymptoms(updatedSymptoms);
  };

  const handleAddSymptom = () => {
    setSymptoms([...symptoms, { name: '', onset: '', duration: '', severity: '' }]);
  };

  const handleRemoveSymptom = (index) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms.splice(index, 1);
    setSymptoms(updatedSymptoms);
  };
  const handleGeneration = async (type) => {
    try {
      // Check if symptoms are added
      if (symptoms.length === 0) {
        alert('Please add symptoms before generating content.');
        return;
      }
  
      const generatedContent = await generateContent(type, symptoms);
      console.log('Generated Content:', generatedContent);
      // You can handle the generated content as needed (e.g., display it to the user)
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error('Error handling generation:', error);
    }
  };
  const generateContent = async (generationType, symptoms) => {
    try {
      
      const apiRequestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Generate ${generationType} for symptoms: ${JSON.stringify(symptoms)}` },
        ],
      };
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userApiKey,
        },
        body: JSON.stringify(apiRequestBody),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      const generatedContent = data.choices[0].message.content; // Adjust based on the actual response structure
      console.log('Generated Content:', generatedContent);
      
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };
  
    */
  return (
    <div className="overview" >
      
        <div className="first-row" >
          <div className= "rowalle" >
            <span style={{

              fontSize: "0.95rem",

              fontWeight: "800",
              marginBottom: "0.9rem",
            }}>{t('Allergies')}</span>
            <button className="custom-button"  onClick={openPopupallergie}>
              {t('Add New Allergies')}
            </button>
          </div>
          <Table data_rows={allergiesData} new_cols={allergiesColumns} onDelete={handleRowDelete} onUpdate={updateDataInBackend} onEditClick={openPopupallergie} height={330} />
        </div>
        <div className="second-row" >
          <div className= "rowalle" style={{ display: 'flex', alignItems: 'center' }}>
            
            <span style={{

              fontSize: "0.95rem",

              fontWeight: "800",
              marginBottom: "0.9rem"}}>
               {t('Problem')}
               </span>
            <button className="custom-button"  onClick={openPopupp}>
              {t('Add New Problem')}
            </button>
          </div>
          <Table data_rows={problemsData} new_cols={problemsColumns} onDelete={handleProDelete} onUpdate={updateProInBackend} onEditClick={openPopupp} height={330} />
        </div>
      
        <div className="fifth-row" >
          <div className= "rowalle" style={{ display: 'flex', alignItems: 'center' }}>
            
            <span style={{

              fontSize: "0.95rem",

              fontWeight: "800",
              marginBottom: "0.9rem"}}>
               {t('Prescription')}
               </span>
            <button className="custom-button"  onClick={openAddPopup}>
              {t('Add New Prescription')}
            </button>
          </div>
          <Table new_cols={history_cols} data_rows={PrescData} onDelete={handleRowPresDelete} onUpdate={updateDataPresInBackend} onEditClick={openPopup} height={330} />
        </div>
        <div className="third-row" >
          <h2 style={{
            fontSize: "0.95rem",
            fontWeight: "bold",
            marginBottom: "0.9rem",
            marginTop: "20px",
          }}>
            {t('Notes')}
          </h2>
          <TextField
              label={t("Title")}
              name="title"
              style={ {marginBottom: '1rem'}}
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{
                style: { fontSize: '14px' } 
              }}
              value={inputs.title}
              onChange={handleFieldChange}
            />
          <ExpandableText
            width={"100%"}
            text={t("Notes")}
            onChange={handleNoteChange}
            value={noteContent}
            className="css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root"
          />
          <br />
          <br />
          <div className="btn">
            <CancelButton onClick={handleCancelClick} />
            <SaveButton onClick={handleSubmitNote} />
          </div>
        </div>
        <div className="fourth-row" >
          <h2 style={{
            fontSize: "0.95rem",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "20px",
          }}>
            Files
        </h2>
       {/* <h2 style={{
            fontSize: "0.95rem",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "20px",
          }}>
            Generate Differential Diagnosis and Management Plan
        </h2>*/}
          <div className="container-fluid">
            <h2 className="text-center alert alert-danger mt-2"></h2>
            <div className="row">
              <div className="col-md-4">
                <form>
                  <div className="form-group">
                    <select value={attachmentType} onChange={(e) => setAttachmentType(e.target.value)}>
                      <option value= {null} disabled selected>Select an option</option>
                      <option value="lab">Lab</option>
                      <option value="radiology">Radiology</option>
                      <option value="personal">Personal</option>
                      <option value="insurance">Insurance</option>
                      <option value="others">Others</option>
                    </select>
                    <input
                      type="file"
                      onChange={(e) => setFilename(e.target.files[0])}
                      className="form-control"
                    />
                    &nbsp;&nbsp;
                    <label htmlFor="exampleFormControlFile1" className="float-left">
                      Browse A File To Upload
                    </label>
                    <br />
                    <br />
                    <p>{t("Selected File:")} {filename ? filename.name : 'No file selected'}</p>
                  </div>
                  <br />
                  <br />
                  <table>
                    <tr>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            
                            saveFile(); // Call your saveFile function
                            

                          }}
                          className="custom-button"
                          style={{ marginTop: "-20px" }}
                        >
                          {t('Submit')}
                        </button>
                      </td>
                    </tr>
                  </table>
                  {status ? <h2>{status}</h2> : null}
                        </form>
{/*
{symptoms.map((symptom, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Symptom"
            value={symptom.name}
            onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Onset"
            value={symptom.onset}
            onChange={(e) => handleSymptomChange(index, 'onset', e.target.value)}
          />
          <input
            type="text"
            placeholder="Duration"
            value={symptom.duration}
            onChange={(e) => handleSymptomChange(index, 'duration', e.target.value)}
          />
          <input
            type="text"
            placeholder="Severity"
            value={symptom.severity}
            onChange={(e) => handleSymptomChange(index, 'severity', e.target.value)}
          />
          <button type="button" onClick={() => handleRemoveSymptom(index)}>
            Remove
          </button>
        </div>
      ))}
    <div>
  <button type="button" onClick={handleAddSymptom}>
    Add Symptom
  </button></div>
  <div style={{ display: 'flex', alignItems: 'center' , justifyContent:"space-between"}}>
  <button onClick={() => handleGeneration('diagnosis')}>Generate Diagnosis</button>
  <button onClick={() => handleGeneration('managementPlan')}>Generate Management Plan</button>
</div>  </div>
              
*/}
        
          </div>
        </div>
      </div>
     
    </div>  <div className="sixth-row"></div>  <PrescriptionOverview selectedPatientId={selectedPatientId} isOpen={isPopupPresOpen} onClose={closePresPopup} fetchData={fetchPresData} />
<PrescriptionPopup selectedPatientId={selectedPatientId} isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchPresData} preFilledData={selectedRowData}/>
      <Allergies selectedPatientId={selectedPatientId} isOpen={isPopupOpenallergie} onClose={closePopupallergie} fetchData={fetchData} preFilledData={selectedRowAllergyData}/>
      <Problem selectedPatientId={selectedPatientId} isOpen={isPopupOpenprob} onClose={closePopupp} fetchPro={fetchPro} preFilledData={selectedProblemRowData} /> </div>  
  );
};

export default Overview;