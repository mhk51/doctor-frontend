import React, { useEffect, useState, useRef } from "react";
import "./radiology.scss";
import { randomTraderName, randomId } from "@mui/x-data-grid-generator";
import Table from "../../../../components/Table/Table";
import Axios from "axios";
import RadPopup from"../../../radPopup/RadPopup";
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
const Radiology = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
 /* const openPopup = () => {
    setIsPopupOpen(true);
  };*/
  const openPopup = (rowData) => {
    const preFilledData = rowData ? { ...rowData } : null;
    setSelectedRowData(preFilledData);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const [RadData, setRadData] = useState([]);

  const fetchData = () => {
    if (selectedPatientId) {
      console.log("Selected Patient ID:", selectedPatientId);
  
      Axios.get(`${API_BASE_URL}/radiologyresult/`)
        .then(async (response) => {
          console.log("result Data:", response.data);
  
         
          const filteredData = response.data.filter(
            (item) => item.patient == selectedPatientId
          );
          console.log("filtered", filteredData);

          const mappedData = await Promise.all(
            filteredData.map(async (item) => {
              const RadResponse = await Axios.get(
                `${API_BASE_URL}/radiologytest/${item.radiology_test}/`
              );
              return {
                id: item.id, // Generate a random ID here
                date: item.date,
                test_name: RadResponse.data.test_name,
                test_code: RadResponse.data.test_code,
                imaging_type: RadResponse.data.imaging_type,
                description: RadResponse.data.description,
                result_text: item.result_text,
                conclusion: item.conclusion,
                image_url: item.image_url,
                rad_date: item.rad_date,
                radiology_test: item.radiology_test,
              };
            })
          );
  
          console.log("Mapped lab Data:", mappedData);
          setRadData(mappedData);
    
        })
        .catch((error) => {
          console.error("Error fetching problems data: ", error);
        });
    } else {
      // Clear the data when no patient is selected
      setRadData([]);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [selectedPatientId]);
  
  const handleRowDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/radiologyresult`; 
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
      const apiUrl = `${API_BASE_URL}/radiologyresult/${id}/`;
      console.log('editedRow:', editedRow);
      // Construct the updated data object
      const radDate = editedRow.rad_date || null;
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient: selectedPatientId, // Include the patient field
        rad_date: radDate,
      };
      console.log('updatedRow:', updatedData);
      // Send a PUT request to update the data
      const response = await Axios.put(apiUrl, updatedData);
      fetchData();
      // Handle a successful response (you can log or perform other actions)
      console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
    } catch (error) {
      // Handle errors (you can log or display an error message)
      console.error(`Error updating row with ID ${id}:`, error);
    }
  };
  const new_cols = [
    {
      field: "test_code",
      headerName: t("Test Code"),
      editable: false,
      flex: 0.5,
      minWidth: 75,
    },
    {
      field: "imaging_type",
      headerName: t("Image Type"),
      editable: false,
      flex: 0.5,
      minWidth: 75,
    },
    {
      field: "result_text",
      headerName:t("Result"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "conclusion",
      headerName: t("Summary"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "image_url",
      headerName:t("Image URL"),
      flex: 0.5,
      minWidth: 75,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "rad_date",
      headerName: t("Date"),
      flex: 0.5,
      minWidth: 75,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
  ];
  return (
    <div className="radiology">

     
      <div className="specialrow">
          <h2>{t('Radiology Results')}</h2>
          <button className="add-to-table" onClick={openPopup}>+{t('Add to table')}</button>
          </div>

        <div className="radtablee">
        <Table data_rows={RadData} new_cols={new_cols} onDelete={handleRowDelete} onUpdate={updateDataInBackend} onEditClick={openPopup} height={400} />
      </div>
      

      <RadPopup selectedPatientId={selectedPatientId} isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchData} preFilledData={selectedRowData}  />
    </div>
  );
};

export default Radiology;