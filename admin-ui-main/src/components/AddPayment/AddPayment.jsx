import React, { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import Axios from 'axios';
import Table from "../Table/Table"; // Assuming you have a Table component
import { Radio, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"; // Import required components
import API_BASE_URL from "../../config/config";
function AddPayment({ selectedPatientId }) {
  const [invoices, setInvoices] = useState([]); // State to store the invoices for the selected patient
  const [selectedInvoice, setSelectedInvoice] = useState(""); // State to store the selected invoice number
  const [selectedBillingId, setSelectedBillingId] = useState(null); // State to store the billing_id associated with the selected invoice
  const [payDetails, setPayDetails] = useState({
    patient_id: selectedPatientId,
    invoice_number: selectedInvoice, 
    payment_date: "",
    payment_method: "Credit Card", // Default payment method
    payment_amount: "", // Payment amount will be set based on the selected invoice
  });

  useEffect(() => {
    // Fetch the invoices for the selected patient from the server
    Axios.get(`${API_BASE_URL}/billing/?patient_id=${selectedPatientId}`)
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, [selectedPatientId]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    setPayDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInvoiceSelect = (event) => {
    const selectedInvoiceNumber = event.target.value;

    // Find the selected invoice and set payment amount based on it
    const selectedInvoiceData = invoices.find((invoice) => invoice.invoice_number === selectedInvoiceNumber);
    if (selectedInvoiceData) {
      setPayDetails((prevState) => ({
        ...prevState,
        selectedInvoice: selectedInvoiceNumber,
        payment_amount: selectedInvoiceData.invoice_amount,
      }));

      // Set the selected billing_id associated with the selected invoice
      setSelectedBillingId(selectedInvoiceData.billing_id);
    } else {
      setPayDetails((prevState) => ({
        ...prevState,
        selectedInvoice: "",
        payment_amount: "",
      }));

      // Clear the selected billing_id
      setSelectedBillingId(null);
    }

    setSelectedInvoice(selectedInvoiceNumber);
  };

  const savePayment = () => {
    console.log("data", payDetails);

    // Check if a billing_id is selected
    if (selectedBillingId) {
      // Send the payment data to the server using the PUT method with the selected billing_id
      Axios.put(`${API_BASE_URL}/billing/${selectedBillingId}/`, payDetails)
        .then((response) => {
          console.log("Payment data saved successfully:", response.data);

          // Close the popup or perform other actions as needed
        })
        .catch((error) => {
          console.error("Error saving payment data:", error);
        });
    } else {
      console.error("No billing_id selected. Payment not saved.");
    }
  };
  const paymentData = [
    {
 
      invoice_number: payDetails.invoice_number, // Include invoice_number
      payment_date: payDetails.payment_date,
      payment_method: payDetails.payment_method,
      payment_amount: payDetails.payment_amount,
    },
  ];
  
  

  const payment_billing_cols = [
    {
      field: "invoice_number",
      headerName: "Invoice Number",
      editable: false,
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "payment_date",
      headerName: "Payment Date",
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "payment_amount",
      headerName: "Payment Amount",
      flex: 0.5,
      minWidth: 100,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
  ];

  return (
    <div className="add-payment-page">
      <div className="payment-header">
        <div className="row">
          <h2>Add Payment to records</h2>
          <X size={26} />
        </div>
      </div>
      <div className="payment-content">
        <div className="col1">
          <div className="payment-row1">
            <div className="title">
              <h2>Select Invoice Number and Payment Amount</h2>
            </div>
            <div className="invoice-selection">
              <FormControl fullWidth>
                <InputLabel>Invoice Number</InputLabel>
                <Select
                  name="selectedInvoice"
                  value={selectedInvoice}
                  onChange={handleInvoiceSelect}
                >
                  {invoices.map((invoice) => (
                    <MenuItem key={invoice.invoice_number} value={invoice.invoice_number}>
                      {invoice.invoice_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="payment_amount"
                label="Payment Amount"
                type="number"
                fullWidth
                value={payDetails.payment_amount}
                onChange={handleFieldChange}
              />
            </div>
          </div>
          <div className="payment-row2">
            <div className="title">
              <h2>Select Payment Method</h2>
            </div>
            <div className="payment-methods">
              <FormControl component="fieldset">
                <Radio
                  name="payment_method"
                  value="Credit Card"
                  checked={payDetails.payment_method === "Credit Card"}
                  onChange={handleFieldChange}
                />
                Credit Card
                <Radio
                  name="payment_method"
                  value="Paypal"
                  checked={payDetails.payment_method === "Paypal"}
                  onChange={handleFieldChange}
                />
                Paypal
                <Radio
                  name="payment_method"
                  value="Cash Payment"
                  checked={payDetails.payment_method === "Cash Payment"}
                  onChange={handleFieldChange}
                />
                Cash Payment
                <Radio
                  name="payment_method"
                  value="Check"
                  checked={payDetails.payment_method === "Check"}
                  onChange={handleFieldChange}
                />
                Check
              </FormControl>
            </div>
          </div>
        </div>
        <div className="col2">
          <div className="firstrow">
            <h2>Payment Date</h2>
            <TextField
              name="payment_date"
              label="Payment Date"
              type="date"
              fullWidth
              value={payDetails.payment_date}
              onChange={handleFieldChange}
            />
          </div>
          <div className="button">
            <Button variant="contained" color="primary" onClick={savePayment}>
              Add payment to patient records
            </Button>
          </div>
        </div>
      </div>
      <div className="payment-table">
        <Table
           data_rows={paymentData} // Pass the payment data as rows
           new_cols={payment_billing_cols} // Pass the column configurations
           height={300}
        />
      </div>
    </div>
  );
}

export default AddPayment;
