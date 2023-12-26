import React, { useEffect, useState, useRef } from "react";
import "./lab.scss";
import Axios from "axios";
import Table from "../../../../components/Table/Table";
import LabPopup from"../../../labPopup/LabPopup";
import {
  randomId,
} from "@mui/x-data-grid-generator";
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
const Lab = ({ selectedPatientId }) => {
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
  const [LabData, setLabData] = useState([]);
  const fetchData = () => {
    console.log("Lab component useEffect is triggered."); 
    if (selectedPatientId) {
      console.log("Selected Patient ID:", selectedPatientId);
      Axios.get(`${API_BASE_URL}/result/`)
    .then(async (response) => {
      console.log("result Data:", response.data);

      // Filter data for the selected patient
      const filteredData = response.data.filter((item) => item.patient == selectedPatientId);

      const mappedData = await Promise.all(
        filteredData.map(async (item) => {
          const labResponse = await Axios.get(
            `${API_BASE_URL}/medicaltest/${item.medical_test_idmedical_test}/`
          );
          return {
            id: item.id, // Generate a random ID here
            lab_date: item.lab_date,
            test_name: labResponse.data.test_name,
            test_code: labResponse.data.test_code,
            normal_average: labResponse.data.normal_average,
            value:item.value,
            value_type:item.value_type,
            medical_test_idmedical_test:item.medical_test_idmedical_test,
            image_url:item.image_url,
      };
    })
  );
  console.log("Mapped lab Data:", mappedData);
  setLabData(mappedData);
})
.catch((error) => {
  console.error("Error fetching problems data: ", error);
});

    } else {
      // Clear the data when no patient is selected
      setLabData([]);

    }
  };
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [selectedPatientId]);
  
  const handleRowDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/result`; 
      await Axios.delete(`${apiUrl}/${id}/`);
      fetchData();
      // Handle successful deletion
      console.log(`Row with ID ${id} deleted successfully.`);
    } catch (error) {
      // Handle errors
      console.error(`Error deleting row with ID ${id}:`, error);
    }
  };
  
  const handleUpdateRow = async (id, editedRow) => {
    try {
      // Define the URL for updating data (replace with your API endpoint)
      const apiUrl = `${API_BASE_URL}/result/${id}/`;
      console.log('editedRow:', editedRow);
      const labDate = editedRow.lab_date || null;
      // Construct the updated data object
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient: selectedPatientId, // Include the patient field
        lab_date: labDate,
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
  
  console.log("lab", LabData);
    const new_cols = [
      {
        field: "test_code",
        headerName: t("Test Code"),
        editable: false,
        flex: 0.5,
        minWidth: 100,
      },
      {
        field: "value",
        headerName: t("Value"),
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        editable: true,
      },
      {
        field: "normal_average",
        headerName: t("Normal Range"),
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        editable: false,
      },
      {
        field: "value_type",
        headerName: t("Result"),
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        editable: false,
      },
      {
        field: "image_url",
        headerName: t("Document URL"),
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        editable: false,
      },
      {
        field: "lab_date",
        headerName: t("Date"),
        flex: 0.5,
        minWidth: 100,
        align: "left",
        headerAlign: "left",
        editable: true,
      },
    ];
   
    return (
      <div className="labresult">
          <div className="row">
            <h2>{t('Lab Results')}</h2>
            <button className="add-to-table" onClick={openPopup}>+ {t("Add to table")}</button>
          </div>
          <div className="labtable">
          <Table data_rows={LabData} new_cols={new_cols} onDelete={handleRowDelete} onUpdate={handleUpdateRow} onEditClick={openPopup} height={400} />
        </div>
        <LabPopup selectedPatientId={selectedPatientId} isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchData} preFilledData={selectedRowData} />
      </div>
    );
  
};

export default Lab;