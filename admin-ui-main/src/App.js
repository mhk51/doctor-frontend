
import AuthenticatedRoute from './components/AuthenticatedRoute';
import RecurrenceCustom from "./components/Recurrence/Recurrence-C";
import RecurrenceDaily from "./components/Recurrence/Recurrence-D";
import RecurrenceMonthly from "./components/Recurrence/Recurrence-M";
import RecurrenceWeekly from "./components/Recurrence/Recurrence-W";
import RecurrenceAnnually from "./components/Recurrence/Recurrence-Y";
import NewDoctor from "./components/new-doctor/NewDoctor";
import NewPatient from "./components/new-patient/NewPatient";
import Task_Popup from "./components/task-popup/Task-Popup";
import Billing from "./pages/Billing/BillingsPage";
import ContactsDoctor from "./pages/Contacts/Contacts-Doctors";
import ContactsPatients from "./pages/Contacts/Contacts-Patients";
import EMR from "./components/EMR/EMR";
import Login from "./pages/Login/Login";
import Location from "./components/Location/Location";
import CreateReminder from "./pages/PatientUpdates/CreateReminder/CreateReminder";
import HealthReminders from './pages/HealthReminders/HealthReminders';
import PatientUpdates from "./pages/PatientUpdates/PatientUpdates";
import Register from "./pages/Register/Register";
import Schedule from "./pages/Schedule/Schedule";
import Settings from "./pages/Settings/Settings";
import EditProfile from "./pages/Settings/pages/EditProfile/EditProfile";
import Home from "./pages/home/Home";
import ChatGPT from"./pages/ChatGPT/ChatGPT";
import ChatApp from "./pages/WhatsApp/ChatApp";
import Referral from "./components/Referral/Referral";
import LabPopup from "./components/labPopup/LabPopup";
import Configmed from"./components/configuremed/configmed";
import AddPayment from "./components/AddPayment/AddPayment";
import AddInvoicePopUp from "./components/Add-Invoice-PopUp/AddInvoicePopUp";
import AddInvoiceAll from "./components/Add-Invoice-PopUp-All/AddInvoicePopUp";
import Calendar from "./components/Calendar/ExternalDragDrop";
import AddNewRef from "./components/reference-popup/AddNewRef/AddNewRef";
import AllRefs from "./components/reference-popup/AllRefs";
import Rooms from "./components/Inbox/Rooms";
import Room from "./components/Inbox/Room";
import MessagingPage from './pages/Messaging/MessagingPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";  // Import Axios
import { useNavigate } from "react-router-dom";
import API_BASE_URL from './config/config';
import Cookies from 'js-cookie';
function App() {

  useEffect(() => {
    const logoutAndRemoveToken = async () => {
      try {
        const staySignedInCookie = Cookies.get('staySignedIn');
    
        if (!staySignedInCookie || staySignedInCookie !== 'true') {
          // Remove the token from local storage (client-side)
          localStorage.removeItem('token');
          localStorage.removeItem('role');
    
          // Send a request to the server to handle server-side logout
          await axios.post(`${API_BASE_URL}/logout/`); // Replace with your server-side logout URL
    
          // Remove the "stay signed in" cookie and any other cookies you want to remove
          Cookies.remove('staySignedIn');
          // Add more Cookies.remove() calls for other cookies as needed
          Cookies.remove('tokenExpiration');
        }
      } catch (error) {
        // Handle errors here
        console.error('Logout error:', error);
      }
    };
    

    const handleUnload = () => {
      // Trigger the logout and token removal function
      logoutAndRemoveToken();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      // Remove the beforeunload event listener when the component unmounts
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  
  
    
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<AuthenticatedRoute element={<Home />} />} />
          <Route path="/contactspatients/:contactId?" element={<AuthenticatedRoute element={<ContactsPatients />} />} />
          <Route path="/Calendar" element={<AuthenticatedRoute element={<Calendar />} />} />
          <Route path="/location" element={<AuthenticatedRoute element={<Location />} />} />
          <Route path="/contactsdoctors" element={<AuthenticatedRoute element={<ContactsDoctor />} />} />
          <Route path="/patientupdates" element={<AuthenticatedRoute element={<PatientUpdates />} />} />
          <Route path="/createreminder" element={<AuthenticatedRoute element={<CreateReminder />} />} />
          <Route path="/healthReminders" element={<AuthenticatedRoute element={<HealthReminders />} />} />
          <Route path="/Custom" element={<AuthenticatedRoute element={<RecurrenceCustom />} />} />
          <Route path="/Daily" element={<AuthenticatedRoute element={<RecurrenceDaily />} />} />
          <Route path="/Weekly" element={<AuthenticatedRoute element={<RecurrenceWeekly />} />} />
          <Route path="/Monthly" element={<AuthenticatedRoute element={<RecurrenceMonthly />} />} />
          <Route path="/Annually" element={<AuthenticatedRoute element={<RecurrenceAnnually />} />} />
          <Route path="/TaskPopup" element={<AuthenticatedRoute element={<Task_Popup />} />} />
          <Route path="/Configmed" element={<AuthenticatedRoute element={<Configmed />} />} />
          <Route path="/addDoctor" element={<AuthenticatedRoute element={<NewDoctor />} />} />
          <Route path="/billing" element={<AuthenticatedRoute element={<Billing />} />} />
          <Route path="/newpatient" element={<AuthenticatedRoute element={<NewPatient />} />} />
          <Route path="/settings" element={<AuthenticatedRoute element={<Settings />} />} />
          <Route path="/profile" element={<AuthenticatedRoute element={<EditProfile />} />} />
          <Route path="/EMR" element={<AuthenticatedRoute element={<EMR />} />} />
          <Route path="/ChatGPT" element={<AuthenticatedRoute element={<ChatGPT />} />} />
          <Route path="/ChatApp" element={<AuthenticatedRoute element={<ChatApp />} />} />
          <Route path="/referral" element={<AuthenticatedRoute element={<Referral />} />} />
          <Route path="/LabPopup" element={<AuthenticatedRoute element={<LabPopup />} />} />
          <Route path="/AddPayment" element={<AuthenticatedRoute element={<AddPayment />} />} />
          <Route path="/AddInvoice" element={<AuthenticatedRoute element={<AddInvoicePopUp />} />} />
          <Route path="/AddInvoiceAll" element={<AuthenticatedRoute element={<AddInvoiceAll />} />} />
          <Route path="/schedule" element={<AuthenticatedRoute element={<Schedule />} />} />
          <Route path="/addnewref" element={<AuthenticatedRoute element={<AddNewRef />} />} />
          <Route path="/allrefs" element={<AuthenticatedRoute element={<AllRefs />} />} />
          <Route path="/message" element={<AuthenticatedRoute element={<MessagingPage />} />} />
        
          <Route path="/rooms" element={<AuthenticatedRoute element={<Rooms />} />} />
          <Route path="/room/:id" element={<AuthenticatedRoute element={<Room />} />} />
          <Route path="/login">
            <Route index element={<Login />} />
          </Route>
          <Route path="/register">
            <Route index element={<Register />} />
          </Route>
         
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;