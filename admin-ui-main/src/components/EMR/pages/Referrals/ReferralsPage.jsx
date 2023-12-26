import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './referralspage.scss';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveButton from "../../../widgets/Buttons/Save/SaveButton";
import CancelButton from "../../../widgets/Buttons/Cancel/CancelButton";
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Referral from "../../../Referral/Referral"
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import cookies from 'js-cookie'
import classNames from 'classnames'
import API_BASE_URL from '../../../../config/config';
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
const ReferralsPage = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const [referralList, setReferralList] = useState([]);
  const [editingReferral, setEditingReferral] = useState(null);
  const currentDate = new Date();
  const [editedContent, setEditedContent] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for delete confirmation dialog
  const [referralToDelete, setReferralToDelete] = useState(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  
     const fetchReferrals= async() =>{
      try {
        if (!selectedPatientId) {
          setReferralList([]);
          return;
        }
        const response = await Axios.get(
          `${API_BASE_URL}/patienthasreferraldoctors/?patient=${selectedPatientId}`
        )
        .then(async (response) => {
          // Filter data for the selected patient
          const filteredData = response.data.filter(
            (item) => item.patient == selectedPatientId
          );
        const sortedReferrals = filteredData.map((referral) => ({
          ...referral,
          referral_doctor: {
            ...referral.referral_doctor,
          },
        })).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setReferralList(sortedReferrals);
      })
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    }
    useEffect(() => {
    fetchReferrals();
  }, [selectedPatientId]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleEditClick = (referral) => {
    setEditingReferral(referral);
    setEditedContent(referral.reason);
  };

  const handleSaveEdit = async () => {
    try {
      if (editingReferral) {
        const referralId = editingReferral.id;
        await Axios.put(`${API_BASE_URL}/patienthasreferraldoctors/${referralId}/`, {
          patient:selectedPatientId,
          reason: editedContent,
          date: currentDate.toISOString(),
        });
        fetchReferrals();
        setEditingReferral(null);
        setEditedContent("");
     
      }
    } catch (error) {
      console.error("Error saving edited referral:", error);
    }
  };


  const handleDeleteClick = async (referral) => {
    setDeleteConfirmationOpen(true);
    setReferralToDelete(referral);
  };
  const handleConfirmDelete = async () => {
    try {
      if (referralToDelete) {
        const referralId = referralToDelete.id;
        await Axios.delete(`${API_BASE_URL}/patienthasreferraldoctors/${referralId}/`);
        const updatedReferral = referralList.filter((n) => n.id !== referralId);
        setReferralList(updatedReferral);
        setReferralToDelete(null); // Clear the note to delete
        setDeleteConfirmationOpen(false); // Close the delete confirmation dialog
        fetchReferrals();
      }
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  };

  const handleCancelDelete = () => {
    // Close the delete confirmation dialog without deleting
    setReferralToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  return (
    <div className="referral-page">
      <div className="col1">
        <button className="btn-add" onClick={openPopup}>+ {t('Add Referral')}</button>
      </div>
      <div className="col2-ref">
        {referralList.map((referral) => (
          <div key={referral.id}>
          <div>
            
            
            
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{`${referral.referral_doctor.first_name} ${referral.referral_doctor.last_name}`}</h2>
                <h5>{formatDate(referral.date)}</h5>
              </div>
             
              <div >

                {editingReferral === referral ? (
                  <div style={{ marginTop: '10px' }}>
                  
                    <TextField
                      label="Reason"
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div style={{ marginTop: '10px' }}>
                      <CancelButton
                        onClick={() => {
                          setEditingReferral(null);
                          setEditedContent("");
                        }}
                      />
                      <SaveButton onClick={handleSaveEdit} />
                    </div>
                  </div>
                ) : (
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <p>{t('Reason:')}</p>
    <h4>{referral.reason}</h4>
  </div>
  <div>
    <EditIcon
      onClick={() => handleEditClick(referral)}
      style={{ cursor: 'pointer', color: '#545454' }}
    />

    <DeleteIcon
      onClick={() => handleDeleteClick(referral)}
      style={{ cursor: 'pointer', color: '#545454' }}
    />
  </div></div>


                )}
              
              </div>
            
            
          
          </div>
          </div>
        
        ))}
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmationOpen}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">t{('Delete Referral?')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('Are you sure you want to delete this referral?')}
            </DialogContentText>
            {referralToDelete && (
              <div>
                <h5>{formatDate(referralToDelete.date)}</h5>
                <h4>{referralToDelete.reason}</h4>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <CancelButton onClick={handleCancelDelete} />
            <SaveButton onClick={handleConfirmDelete}>Delete</SaveButton>
          </DialogActions>
        </Dialog>
      </div>
      <Referral selectedPatientId={selectedPatientId} isOpen={isPopupOpen} fetchReferrals={fetchReferrals} onClose={closePopup} />
    </div>
  );
};

export default ReferralsPage;
