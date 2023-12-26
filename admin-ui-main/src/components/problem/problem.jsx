import React, { useState,useEffect } from 'react';
import Axios from 'axios';
import "./problem.scss";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
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

const Problem = ({ selectedPatientId, isOpen, onClose, fetchPro, preFilledData }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
    const currentDate = new Date();
    const initialProDetails = {
      patient: selectedPatientId,
      icd_problem: '',
      date: '',
       
        }
  const [problemDetails, setproblemDetails] = useState([]);

   
  
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    if (preFilledData && preFilledData.id) {
      // If there is pre-filled data, set it in the state
      setproblemDetails(preFilledData);
    } else {
      // Otherwise, reset the state to initial values
      setproblemDetails(initialProDetails);
    }
  }, [preFilledData]);
  useEffect(() => {
    Axios.get(`${API_BASE_URL}/problem/`)
      .then((response) => {
        setProblems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
      });
  }, []);


  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setproblemDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const saveproblem = () => {
    console.log("data", problemDetails);
    const formattedProDetails = {
      ...problemDetails,
      
      date: problemDetails.date === '' ? null : problemDetails.date,
    };
    if (preFilledData && preFilledData.id) {
      // Perform a PUT request to update the existing data
      Axios.put(`${API_BASE_URL}/patienthasproblem/${preFilledData.id}/`, formattedProDetails)
        .then((response) => {
          console.log("Problem data updated successfully:", response.data);
          onClose();
          fetchPro();
          setproblemDetails(initialProDetails);
        })
        .catch((error) => {
          console.error("Error updating invoice data:", error);
        });
    } else{
    Axios.post(`${API_BASE_URL}/patienthasproblem/`, formattedProDetails)
      .then((response) => {
        console.log("problem data saved successfully:", response.data);
        onClose();
        fetchPro();
        setproblemDetails(initialProDetails);
        // Close the popup or perform other actions as needed
      })
      .catch((error) => {
        console.error("Error saving problem data:", error);
      });
  }};

  if (!isOpen) return null;
  return (
    <div className={`popup-wrapper ${isOpen ? "open" : ""}`}>
    <div className="probpop">
      <div className="contentprob">
        <div className="top5">
     
          <h2 >{preFilledData.id ? "Edit Problem" : t("Add New Problem")}</h2>
        </div>

        <div className="center">
  <div>
  <label style={{fontSize:"0.75rem"}}> {t('Date')} </label>
              <input
                type="date"
                name="date"
                value={problemDetails.date}
                onChange={handleFieldChange}
                className='dateborder'
              />
  </div>
  <br/> 
  <br/>
  <div className="#">

              <h3 style={{fontSize:"0.75rem"}}>{t('ICD NUMBER')}</h3>

              
              <Autocomplete
                  id="icd_problem"
                  options={problems}
                  getOptionLabel={(problem) => problem.problem_desc}
                  value={problems.find((problem) => problem.id === problemDetails.icd_problem) || null}
                  onChange={(event, newValue) => {
                    handleFieldChange({ target: { name: "icd_problem", value: newValue ? newValue.id : "" } });
                  }}
                  renderInput={(params) => <TextField {...params} label={t("Choose Problem")} />}
                  filterOptions={(options, state) => {
                    return options.filter((option) =>
                      option.problem_desc.toLowerCase().includes(state.inputValue.toLowerCase())
                    );
                  }}
                  size='small'
                />
             
            
   </div>
    
    
</div>

        
        
       

        <div className="bottom">
        <div className="row">
       

          <button  className="closeprob"onClick={saveproblem}>{preFilledData.id ? t('Edit'):t('Save')}</button>
         
          <button className="closeprob" onClick={() => { console.log("Close button clicked"); onClose(); setproblemDetails(initialProDetails);}}>
             {t('close')}

            </button>
            </div>
        </div>
      </div>
      </div>
    </div>
 
  );
};

export default Problem;
