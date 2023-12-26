import { MagnifyingGlass } from '@phosphor-icons/react';
import React, { useState,useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './searchbar.scss';
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


const SearchBar = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const history = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPages, setSearchedPages] = useState([]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filteredPages = availablePages.filter(page =>
      page.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchedPages(filteredPages);
  };

  const handlePageClick = (pageRoute) => {
    history(pageRoute);
  };
  const availablePages = [
    { title: "Patients Contacts", route: "/contactspatients" },
    { title: "EMR", route: "/contactspatients" },
    
    { title: "Radiology", route: "/contactspatients" },
    { title: t("Prescriptions"), route: "/contactspatients" },
    { title: "Lab", route: "/contactspatients" },
    { title: t("Communications"), route: "/contactspatients" },
    { title: t("Add New Patient Contact"), route: "/contactspatients" },
    { title: t("Doctors Contacts"), route: "/contactsdoctors" },
    { title: t("Referrals"), route: "/contactsdoctors" },
    { title: t("Add New Doctor Contact"), route: "/contactsdoctors" },
    { title: t("Schedule"), route: "/schedule" },
    { title: t("Tasks"), route: "/" },
    { title: t("Today Appointments"), route: "/" },
    { title: t("Current Patient Info"), route: "/" },
    { title: t("Tasks"), route: "/" },
    { title: t("Quick References"), route: "/" },
    { title: t("Billing"), route: "/billing" },
    { title: t("Add new Invoice"), route: "/billing" },
    { title: t("Settings"), route: "/settings" },
    { title: t("Configure Medical Information"), route: "/Configmed" },
    
    
  ];
  return (
      <div className="search">
    <MagnifyingGlass size={25} className="icon" />
    <input
      type="text"
      placeholder={t("Search")}
      value={searchQuery}
      onChange={handleInputChange}
    />
    {searchQuery !== '' && searchedPages.length > 0 && (
        <div className="search-list">
          {searchedPages.map((page, index) => (
            <div key={index} onClick={() => handlePageClick(page.route)}>
              <div className="page-title">{page.title}</div>
            </div>
          ))}
        </div>
      )}
  </div>
  );
};

export default SearchBar;



// const [searchQuery, setSearchQuery] = useState('');
// const [patientSuggestions, setPatientSuggestions] = useState([]);
// const [doctorSuggestions, setDoctorSuggestions] = useState([]);

// useEffect(() => {
//   // Fetch initial suggestions for patients and doctors
//   const fetchInitialSuggestions = async () => {
//     try {
//       const patientsResponse = await axios.get('http://127.0.0.1:8000/patients/');
//       const doctorsResponse = await axios.get('http://127.0.0.1:8000/referraldoctors/');

//       if (patientsResponse.status === 200) {
//         setPatientSuggestions(patientsResponse.data);
//         console.log(patientSuggestions);

//       }

//       if (doctorsResponse.status === 200) {
//         setDoctorSuggestions(doctorsResponse.data);
//         console.log(doctorSuggestions);
//       }
//     } catch (error) {
//       console.error('Error fetching initial suggestions:', error);
//     }
//   };

//   fetchInitialSuggestions();
// }, []);

// const handleInputChange = async (e) => {
//   const query = e.target.value;
//   setSearchQuery(query);

//   try {
//     // Fetch suggestions for patients
//     const patientsResponse = await axios.get(`http://127.0.0.1:8000/patients/?query=${query}`);
//     if (patientsResponse.status === 200) {
//       setPatientSuggestions(patientsResponse.data);
//       console.log(patientSuggestions);
//     }

//     // Fetch suggestions for doctors
//     const doctorsResponse = await axios.get(`http://127.0.0.1:8000/referraldoctors/?query=${query}`);
//     if (doctorsResponse.status === 200) {
//       setDoctorSuggestions(doctorsResponse.data);
//       console.log(doctorSuggestions);
//     }
//   } catch (error) {
//     console.error('Error fetching suggestions:', error);
//   }
// };

// return (
//   <div className="search">
//     <MagnifyingGlass size={25} className="icon" />
//     <input
//       type="text"
//       placeholder="Search patient or doctor by name"
//       value={searchQuery}
//       onChange={handleInputChange}
//     />
//      <div className="suggestions">
//       <ul>
//         {patientSuggestions.map((patient, index) => (
//           <li key={`patient-${index}`}>{patient.name}</li>
//         ))}
//         {doctorSuggestions.map((doctor, index) => (
//           <li key={`doctor-${index}`}>{doctor.name}</li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );