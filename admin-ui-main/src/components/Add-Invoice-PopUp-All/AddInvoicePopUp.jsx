import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './addinvoice.scss';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Radio, FormControl} from "@mui/material";
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames';
import API_BASE_URL from '../../config/config';
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
const AddInvoicePopUp = ({ isOpen, onClose, fetchData, preFilledData }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const currentDate = new Date();
console.log("pre", preFilledData);
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
  const [patients, setPatients] = useState([]); // State to store the list of patients

  // Fetch the list of patients when the component mounts
  useEffect(() => {
    Axios.get(`${API_BASE_URL}/patients/`)
      .then((response) => {
        console.log("patients", response.data);
        setPatients(response.data);
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  const handlePatientSelect = (patientId) => {
    setInvDetails((prevState) => ({
      ...prevState,
      patient_id: patientId,
    }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setInvDetails((prevState) => ({
      ...prevState,
      [name]: value,
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
      // Otherwise, it's an add operation
      Axios.post(`${API_BASE_URL}/billing/`, formattedInvDetails)
        .then((response) => {
          console.log("Invoice data saved successfully:", response.data);
          onClose();
          fetchData();
        })
        .catch((error) => {
          console.error("Error saving invoice data:", error);
        });
    }
  
  };

  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? 'open' : ''}`}>
    <table className="add-invoices">
    <tbody>
        
        <tr>
          <th >{preFilledData.id ? "Edit Invoice" : t("Add New Invoice")}</th>
        </tr>
     
   
        <tr>
          <td className='labinv'>{t("Patients")}:</td>
          <td>
          <Autocomplete
  value={patients.find((patient) => patient.id === invDetails.patient_id) || null}
  onChange={(e, newValue) => handlePatientSelect(newValue?.id || '')}
  options={patients}
  getOptionLabel={(patient) => patient.full_name_phone || ''}
  renderInput={(params) => <TextField {...params} label={t("Select a patient")} />}
  filterOptions={(options, state) => {
    return options.filter((option) =>
      option.full_name_phone.toLowerCase().includes(state.inputValue.toLowerCase())
    );
  }}
  sx={{ width: "190px" }}
  size="small"
/>

          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Invoice Amount")}</td>
          <td>
            <input
              type="text"
              name="invoice_amount"
              value={invDetails.invoice_amount}
              onChange={handleFieldChange}
              className='textinputsbilling'
            />
          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Invoice Date")}:</td>
          <td>
            <input
              type="date"
              name="invoice_date"
              value={invDetails.invoice_date}
              onChange={handleFieldChange}
              className='textinputsbilling'
            />
          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Payment Amount")}:</td>
          <td>
            <input
              type="text"
              name="payment_amount"
              value={invDetails.payment_amount}
              onChange={handleFieldChange}
              className='textinputsbilling'
            />
          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Payment Date")}:</td>
          <td>
            <input
              type="date"
              name="payment_date"
              value={invDetails.payment_date}
              onChange={handleFieldChange}
              className='textinputsbilling'
            />
          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Payment Method")}:</td>
          <td>
          <FormControl component="fieldset">
            <div  className="radiopay" style={{ display: "flex" }}>
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
          </td>
        </tr>
        <tr>
          <td className='labinv'>{t("Notes")}:</td>
          <td>
            <input
              type="text"
              name="notes"
              value={invDetails.notes}
              onChange={handleFieldChange}
              className='textinputsbilling'
            />
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <div className="butonsadd">
            <button  className="closeinvall" onClick={saveInvoice}>{preFilledData.id ? "Edit Invoice" : t("Add New Invoice")}</button>
            <button
              className="closeinvall"
              onClick={() => {
                console.log('Close button clicked');
                onClose();
              }}
            >
              {t("close")}
            </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
};

export default AddInvoicePopUp;
