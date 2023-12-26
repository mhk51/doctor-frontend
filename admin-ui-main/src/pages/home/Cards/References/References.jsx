import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './references.scss';
import AddNewRef from "../../../../components/reference-popup/AddNewRef/AddNewRef";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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

const References = () => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])

  const [references, setReferences] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [referenceToDelete, setReferenceToDelete] = useState(null);
  const [referenceToEdit, setReferenceToEdit] = useState(null);
  const [isAddNewRefOpen, setIsAddNewRefOpen] = useState(false);

  const fetchReference = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reference/`);
      setReferences(response.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  useEffect(() => {
    fetchReference();
  }, []);

  const handleDeleteClick = (reference) => {
    setDeleteConfirmationOpen(true);
    setReferenceToDelete(reference);
  };

  const handleConfirmDelete = async () => {
    try {
      if (referenceToDelete) {
        const referenceId = referenceToDelete.id;
        await axios.delete(`${API_BASE_URL}/reference/${referenceId}/`);
        setReferenceToDelete(null);
        setDeleteConfirmationOpen(false);
        fetchReference();
      }
    } catch (error) {
      console.error("Error deleting reference:", error);
    }
  };

  const handleCancelDelete = () => {
    setReferenceToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleEditClick = (reference) => {
    setReferenceToEdit(reference);
    setIsAddNewRefOpen(true);
  };

  const handleAddNewRefClick = () => {
    setReferenceToEdit(null);
    setIsAddNewRefOpen(true);
  };

  const handleCloseAddNewRef = () => {
    setReferenceToEdit(null);
    setIsAddNewRefOpen(false);
    fetchReference();
  };

  const openUrlInNewTab = (url) => {
    window.open(url, '_blank');
  };

  const addHttpOrHttps = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `http://${url}`;
  };

  return (
    <div className="references">
      <div className="top">
        <p className="title">{t('Quick References')}</p>
        <span className="link" onClick={handleAddNewRefClick}> {t('Add_new ')}</span>
      </div>
      <div className="scrollable-lists">
        <ul className="list-of-references">
          {references.map((reference) => (
            <li key={reference.id}>
              <div className="reference-item" style={{alignItems: "center",
                display: "flex",
                justifyContent: "space-between"}}>
                  <div>
                <div className="reference-info">
                  {reference.title || "No title available"}
                </div>
              
                  <a
                    href={addHttpOrHttps(reference.url_ref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkd"
                    onClick={(e) => { e.preventDefault(); openUrlInNewTab(addHttpOrHttps(reference.url_ref)); }}
                  >
                    {reference.url_ref ? t('Visit Website') : ''}
                  </a>
                  </div>
                  <div>
                  <button className="btnref" style={{ marginLeft: '5px' }} onClick={() => handleDeleteClick(reference)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                  <button className="btnref" style={{ marginLeft: '5px' }} onClick={() => handleEditClick(reference)}>
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  </div>
              
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('Are you sure?')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('Are you sure you want to remove this reference?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleCancelDelete} className='closee'>{t('Cancel')}</button>&nbsp;&nbsp;
          <button className="closee" onClick={handleConfirmDelete}>{t('Done')}</button>
        </DialogActions>
      </Dialog>

      {isAddNewRefOpen && (
        <AddNewRef
          isOpen={isAddNewRefOpen}
          onClose={handleCloseAddNewRef}
          fetchReference={fetchReference}
          editedReference={referenceToEdit}
        />
      )}
    </div>
  );
};

export default References;
