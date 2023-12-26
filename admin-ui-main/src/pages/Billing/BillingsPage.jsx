import React, { useEffect, useState, useRef } from "react";
import SideBar from "../../components/Sidebar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import "./billingsPage.scss";
import Axios from 'axios'; 
import AddInvoiceButton from "../../components/widgets/Buttons/AddInvoice/AddInvoice";
import { billing_title, total_amount } from "../../config/constants";
import { randomId } from "@mui/x-data-grid-generator";
import Table from "../../components/Table/Table";
import AddInvoicePopUp from "../../components/Add-Invoice-PopUp-All/AddInvoicePopUp";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from "../../config/config";
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
const BillingsPage = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [BillData, setBillData] = useState([]);
  const [PatientNames, setPatientNames] = useState({});
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
  const fetchData = async () => {
    console.log("Billing component useEffect is triggered.");
  
    try {
      const response = await Axios.get(`${API_BASE_URL}/billing/`);
      console.log("result Data:", response.data);
  
      const patientNames = {};
      await Promise.all(
        response.data.map(async (item) => {
          if (!patientNames[item.patient_id]) {
            const billResponse = await Axios.get(
              `${API_BASE_URL}/patients/${item.patient_id}/`
            );
            patientNames[item.patient_id] = {
              first_name: billResponse.data.first_name,
              last_name: billResponse.data.last_name,
            };
          }
        })
      );
  
      console.log("Patient Names:", patientNames);
      await new Promise((resolve) => {
        setPatientNames(patientNames);
        resolve(); // Resolve the promise to ensure it runs after the state update.
      });
  
      const mappedData = response.data.map((item) => {
        const patientInfo = patientNames[item.patient_id] || {};
        return {
          id: item.billing_id,
          name: `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`,
          invoice_number: item.invoice_number,
          invoice_amount: item.invoice_amount,
          invoice_date: item.invoice_date,
          payment_amount: item.payment_amount,
          payment_date: item.payment_date,
          payment_method: item.payment_method,
          notes: item.notes,
          patient_id: item.patient_id,
        };
      });
  
      console.log("Mapped lab Data:", mappedData);
      setBillData(mappedData);
    } catch (error) {
      console.error("Error fetching problems data: ", error);
    }
  };
  
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []);
  
    
  const handleRowDelete = async (id) => {
    try {
      // Determine the URL based on the current page or component
      const apiUrl = `${API_BASE_URL}/billing`; 
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
      const apiUrl = `${API_BASE_URL}/billing/${id}/`;
      console.log('editedRow:', editedRow);
      // Construct the updated data object
      const invoiceDate = editedRow.invoice_date || null;
      const paymentDate= editedRow.payment_date || null;
      const updatedData = {
        ...editedRow, // Include existing editedRow data
        patient_id: editedRow.patient_id,
        invoice_date: invoiceDate, 
        payment_date: paymentDate, 
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

  const billing_cols = [
    {
      field: "name",
      headerName: t("Patient Name"),
      editable: false,
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "invoice_number",
      headerName:t("Invoice Number"),
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
  const calculateTotalPaymentAmount = () => {
    // Calculate the total payment amount
    const totalPaymentAmount = BillData.reduce((total, data) => {
      const amount = parseInt(data.payment_amount, 10) || 0;
      return total + amount;
    }, 0);
    return totalPaymentAmount;
  };

  return (
    <div className="billing">
      <div className="sidebarr">
      <SideBar /></div>
      <div className="Navv">
      <NavBar /></div>
      <div className="billing-container">
        
        <div className="content">
          <div className="top-row">
            <h1>{t('Billings')}</h1>
            <p>{t("Total: $")}{calculateTotalPaymentAmount()}</p>
          </div>

          <div className="center-row">
            <span>{t("All Bills")}</span>
            <div className="btns">
              <AddInvoiceButton onClick={openPopup}/>
            </div>
          </div>
          <div className="billings-bottom">
            <Table new_cols={billing_cols} data_rows={BillData} onDelete={handleRowDelete} onUpdate={handleUpdateRow}  onEditClick={openPopup} height={300}/>
          </div>
        </div>
      </div>
      <AddInvoicePopUp  isOpen={isPopupOpen} onClose={closePopup} fetchData={fetchData}  preFilledData={selectedRowData} />
    </div>
  );
};

export default BillingsPage;
