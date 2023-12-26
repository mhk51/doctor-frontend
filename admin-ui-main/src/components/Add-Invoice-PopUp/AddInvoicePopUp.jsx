import React, { useState, useEffect } from 'react';
import "./addinvoice.scss";
import API_BASE_URL from '../../config/config';
import { Radio, FormControl} from "@mui/material";
import Axios from 'axios';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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
const AddInvoicePopUp = ({ selectedPatientId, isOpen, onClose, fetchData,preFilledData }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const currentDate = new Date();
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const initialInvDetails = {
    patient_id: '',
    invoice_date: '',
    invoice_amount: "",
    notes: "",
   invoice_number:'',
   payment_amount:'',
   payment_date:'',
   payment_method:'Credit Card',

  };
  console.log(currentDate.toISOString())
    console.log("patient", selectedPatientId);
    const [invDetails, setInvDetails]=useState([]);
    useEffect(() => {
      if (preFilledData && preFilledData.id) {
        // If there is pre-filled data, set it in the state
        setInvDetails(preFilledData);
      } else {
        // Otherwise, reset the state to initial values
        setInvDetails(initialInvDetails);
      }
    }, [preFilledData]);
  console.log("raed", invDetails);
  
  


  const handleFieldChange = (e) => {
    const { name, value } = e.target;
  console.log("e", e.target);
    setInvDetails((prevState) => ({
      ...prevState,
       [name]: value,
       patient_id:selectedPatientId,
    }));
  
  };

  const saveInvoice = () => {
    console.log("data", invDetails);

    const formattedInvDetails = {
      ...invDetails,
      payment_date: invDetails.payment_date === '' ? null : invDetails.payment_date,
      invoice_date: invDetails.invoice_date === '' ? null : invDetails.invoice_date,
    };
    if (preFilledData && preFilledData.id) {
      // Perform a PUT request to update the existing data
      Axios.put(`${API_BASE_URL}/billing/${preFilledData.id}/`, formattedInvDetails)
        .then((response) => {
          console.log("Invoice data updated successfully:", response.data);
          onClose();
          fetchData();
        })
        .catch((error) => {
          console.error("Error updating invoice data:", error);
        });
    } else {
    console.log("savedpatient", selectedPatientId);
    console.log("sendpatient", formattedInvDetails.patient_id);
    Axios.post(`${API_BASE_URL}/billing/`, formattedInvDetails)
      .then((response) => {
        console.log("Invoice data saved successfully:", response.data);
        
            onClose();
            fetchData();
            setInvDetails(initialInvDetails);
          
          
      })
      .catch((error) => {
        console.error("Error saving invoice data:", error);
      });}
  };
  const Close = () => {
    setInvDetails(initialInvDetails);
    onClose();
  }
  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="add-invoice">
      <div className="contentinv">
        <div className="top">
        <th >{preFilledData.id ? "Edit Invoice" : t("Add New Invoice")}</th>
        </div>
        <table className="field-table">
  <tbody>
    <tr>
      <td>
        <label className='labinv'>{t("Invoice Amount")}</label>
      </td>
      <td>
        <input
          type="text"
          name="invoice_amount"
          value={invDetails.invoice_amount}
          onChange={handleFieldChange}
          className='borderinv'
        />
      </td>
    </tr>
    <tr>
      <td>
        <label className='labinv'>{t('Invoice Date')}:</label>
      </td>
      <td>
        <input
          type="date"
          name="invoice_date"
          value={invDetails.invoice_date}
          onChange={handleFieldChange}
          className='borderinv'
        />
      </td>
    </tr>
    <tr>
      <td>
        <label className='labinv'>{t('Payment Amount')}:</label>
      </td>
      <td>
        <input
          type="text"
          name="payment_amount"
          value={invDetails.payment_amount}
          onChange={handleFieldChange}
          className='borderinv'
        />
      </td>
    </tr>
    <tr>
      <td>
        <label className='labinv'>{t("Payment Date")}:</label>
      </td>
      <td>
        <input
          type="date"
          name="payment_date"
          value={invDetails.payment_date}
          onChange={handleFieldChange}
          className='borderinv'
        />
      </td>
    </tr>
    <tr>
      <td>
        <label className='labinv'>{t('Payment Method')}:</label>
      </td>
      <td>
        <div className="payment-methods">
          <FormControl component="fieldset">
            <div className="radiopay" style={{ display: "flex" }}>
              <Radio
                name="payment_method"
                value="Credit Card"
                checked={invDetails.payment_method === "Credit Card"}
                onChange={handleFieldChange}
              />
              <label htmlFor="creditCard"className='titleradio'>{t("credit card")}</label>
              <Radio
                name="payment_method"
                value="Paypal"
                checked={invDetails.payment_method === "Paypal"}
                onChange={handleFieldChange}
              />
              <label htmlFor="paypal"className='titleradio'>Paypal</label>
              <Radio
                name="payment_method"
                value="Cash Payment"
                checked={invDetails.payment_method === "Cash Payment"}
                onChange={handleFieldChange}
              />
              <label htmlFor="cashPayment" className='titleradio'>{t("Cash Payment")}</label>
              <Radio
                name="payment_method"
                value="Check"
                checked={invDetails.payment_method === "Check"}
                onChange={handleFieldChange}
              />
              <label htmlFor="check" className='titleradio'>{t("Check")}</label>
            </div>
          </FormControl>
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <label label className='labinv'>{t("Notes")}:</label>
      </td>
      <td>
        <input
          type="text"
          name="notes"
          value={invDetails.notes}
          onChange={handleFieldChange}
          className='borderinv'
        />
      </td>
    </tr>
  </tbody>
</table>


        <div className="bottominv">
          <div className="row">
          
            <button  className="closesss" onClick={saveInvoice}>{preFilledData.id ? "Edit Invoice" : t("Add New Invoice")}</button>
            <button className="closesss" onClick={Close}>{t('close')}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default AddInvoicePopUp;