import React, { useEffect, useState, useRef } from "react";
import './billing.scss';
import Axios from 'axios';
import Table from '../../../../components/Table/Table';
import AddInvoicePopUp from "../../../Add-Invoice-PopUp/AddInvoicePopUp";
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
const Billing = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [BillData, setBillData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  /*const openPopup = () => {
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

 
  const fetchData = () => {
    console.log("Billing component useEffect is triggered."); 
    if (selectedPatientId) {
      console.log("Selected Patient ID:", selectedPatientId);
      Axios.get(`${API_BASE_URL}/billing/`)
    .then(async (response) => {
      console.log("result Data:", response.data);

      // Filter data for the selected patient
      const filteredData = response.data.filter(
        (item) => item.patient_id == selectedPatientId
      );

      console.log("Filtered Data:", filteredData);

      const mappedData = await Promise.all(
        filteredData.map(async (item) => {
          const billResponse = await Axios.get(
            `${API_BASE_URL}/patients/${item.patient_id}/`
          );
          return {
            id: item.billing_id, 
            first_name: billResponse.data.first_name,
            last_name:billResponse.data.last_name,
            invoice_number: item.invoice_number,
            invoice_amount: item.invoice_amount,
            invoice_date:item.invoice_date,
            payment_amount:item.payment_amount,
            payment_date:item.payment_date,
            payment_method:item.payment_method,
            notes:item.notes,
            patient_id:selectedPatientId,
      };
    })
  );
  console.log("Mapped lab Data:", mappedData);
  setBillData(mappedData);
})
.catch((error) => {
  console.error("Error fetching problems data: ", error);
});

    } else {
      // Clear the data when no patient is selected
      setBillData([]);

    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [selectedPatientId]);
  const handleRowDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/billing`; 
      await Axios.delete(`${apiUrl}/${id}/`);
      // Handle successful deletion
      console.log(`Row with ID ${id} deleted successfully.`);
      fetchData();
    } catch (error) {
      // Handle errors
      console.error(`Error deleting row with ID ${id}:`, error);
    }
  };
  
  const handleUpdateRow = async (id, editedRow) => {
    try {
      // Define the URL for updating data (replace with your API endpoint)
      const apiUrl = `${API_BASE_URL}/billing/${id}/`;
      console.log('editedRow:', editedRow);
      // Construct the updated data object
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient_id: selectedPatientId, // Include the patient field
      };
      console.log('updatedRow:', updatedData);
      // Send a PUT request to update the data
      const response = await Axios.put(apiUrl, updatedData);
  
      // Handle a successful response (you can log or perform other actions)
      console.log(`Row with ID ${id} updated successfully. Response:`, response.data);
      fetchData();
    } catch (error) {
      // Handle errors (you can log or display an error message)
      console.error(`Error updating row with ID ${id}:`, error);
    }
  };

  const calculateTotalInvoiceAmount = () => {
    // Calculate the total invoice amount
    const totalInvoiceAmount = BillData.reduce((total, data) => {
      const amount = parseInt(data.invoice_amount, 10) || 0;
      return total + amount;
    }, 0);
    return totalInvoiceAmount;
  };
  
  const calculateTotalPaymentAmount = () => {
    // Calculate the total payment amount
    const totalPaymentAmount = BillData.reduce((total, data) => {
      const amount = parseInt(data.payment_amount, 10) || 0;
      return total + amount;
    }, 0);
    return totalPaymentAmount;
  };
  
  
  
  const billing_cols = [
    {
      field: "invoice_number",
      headerName: t("Invoice Number"),
      editable: false,
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "invoice_amount",
      headerName: t("Invoice Amount"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "invoice_date",
      headerName: t("Invoice Date"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "payment_amount",
      headerName: t("Payment Amount"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "payment_method",
      headerName: t("Payment Method"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left", 
      editable: true,
    },
    {
      field: "payment_date",
      headerName: t("Payment Date"),
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
   
   
  ];
  
  return (
    <div id="billings-personal">
      <div className="row1">
        <div className="billing-title">
          <h2>{t('Patient Recent Issued Invoices')}</h2>
        </div>
        <Table new_cols={billing_cols} data_rows={BillData} onDelete={handleRowDelete} onUpdate={handleUpdateRow} onEditClick={openPopup} height={400}/>
      </div>
      <div className="row2">
        <div className="box">
          <div className="top">

            <h3 style={{ fontSize: "0.9rem" }}>{t('Patient Billing')}</h3>
          </div>
          <div className="center">
            <div className="first-row">
              <p style={{ paddingLeft: "1rem",fontSize: "0.89rem"  }}>{t('Balance')}</p>
              <p>$</p>
            </div>
            <div className="second-row">
              <p style={{ paddingLeft: "1rem",fontSize: "0.89rem"  }}>{t('Invoices')}</p>
              <p>${calculateTotalInvoiceAmount()}</p>
            </div>
            <div className="third-row">
              <p style={{ paddingLeft: "1rem" ,fontSize: "0.89rem" }}>{t('Payments')}</p>

              <p>${calculateTotalPaymentAmount()}</p>
            </div>
            <div className="fourth-row">
              
              <button id="btn2" onClick={openPopup} >{t('Add Invoice')}</button>
            </div>
          </div>
        </div>
      </div>
      
      <AddInvoicePopUp selectedPatientId={selectedPatientId} isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchData} preFilledData={selectedRowData} />
    </div>
  );
}

export default Billing