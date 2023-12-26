import React, { useState, useEffect } from "react";
import "./savedNotes.scss";
import Axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; 
import ExpandableText from "../../../widgets/ParagraphText/ExpandableText";
import SaveButton from "../../../widgets/Buttons/Save/SaveButton";
import CancelButton from "../../../widgets/Buttons/Cancel/CancelButton";
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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

const SavedNotes = ({ selectedPatientId }) => {
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find((l) => l.code === currentLanguageCode)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('Setting page stuff')
    document.body.dir = currentLanguage.dir || 'ltr'
  }, [currentLanguage, t])
  const currentDate = new Date();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const [inputs, setInputs] = useState({
    title: "",
  });
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State for delete confirmation dialog
  const [noteToDelete, setNoteToDelete] = useState(null); 
  const userRole = localStorage.getItem('role');
  console.log("roleemr", userRole);
  const [allUsers, setAllUsers] = useState([]);

  const token = localStorage.getItem('token');
  console.log("token", token);
  const [user, setUser] = useState(null);
  const getUserData = async () => {
    try {
      if (token) {
        // Include the JWT token in the request headers
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const response = await Axios.get(`${API_BASE_URL}/users/`, config)

        const userData = response.data;
        console.log("userdatasaved", userData);
        setUser(userData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    // Fetch user data when the component is mounted
    getUserData();
  }, []); 
  const getAllUserData = async () => {
    try {
    console.log("tokesaved", token);
    if (token) {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
    // Fetch all users
    const response = await Axios.get(`${API_BASE_URL}/users/?all=true/`,config)
    const userData = response.data;
        console.log("Alluserdatasaved", userData);
        setAllUsers(userData);  
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    // Fetch user data when the component is mounted
    getAllUserData();
  }, []); 

    async function fetchNotes() {
      try {
        if (!selectedPatientId) {
          return;
        }
        const response = await Axios.get(
          `${API_BASE_URL}/notes/?patient=${selectedPatientId}`
        );
        const notesData = response.data;

        // Match notes with their authors using user IDs
        const notesWithUserNames = notesData.map((note) => {
          const author = allUsers.find((user) => user.id === note.user);
          const lastUpdater = allUsers.find((user) => user.id === note.last_update);
          if (author) {
            note.userName = `${author.first_name} ${author.last_name}`;
          } else {
            note.userName = "Unknown";
          }
          if (lastUpdater) {
            note.lastUpdatedBy = `${lastUpdater.first_name} ${lastUpdater.last_name}`;
          } else {
            note.lastUpdatedBy = "Unknown";
          }  
          return note;
        });
        const sortedNotes = notesWithUserNames.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotesList(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    useEffect(() => {
    fetchNotes();
  }, [selectedPatientId, allUsers]);

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleAddNoteClick = () => {
    setIsAddingNote(true);
    setInputs({
      title: "",
    });
  };

  const handleSaveClick = async () => {
    try {
      await Axios.post(`${API_BASE_URL}/notes/`, {
        title: inputs.title,
        saved_notes: noteContent,
        patient: selectedPatientId,
        date: currentDate.toISOString(),
        user:user.id,
      });
      setIsAddingNote(false);
      console.log("Note saved successfully!");
     fetchNotes();
     setInputs({
      title: "",
    });
    setNoteContent("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleCancelClick = () => {
    setIsAddingNote(false);
    setInputs({
      title: "",
      patient: selectedPatientId,
      date: currentDate.toISOString(),
    });
    setNoteContent("");
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditedContent(note.saved_notes);
    setEditedTitle(note.title);
  };

  const handleSaveNoteEdit = async () => {
    try {
      if (editingNote) {
        const noteId = editingNote.idnotes;
        await Axios.put(`${API_BASE_URL}/notes/${noteId}/`, {
          title: editedTitle,
          saved_notes: editedContent,
          date: currentDate.toISOString(),
          last_update: user.id,
        });
        setEditingNote(null);
        fetchNotes();
        setEditedContent("");
        setEditedTitle("");
      }
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  const handleDeleteClick = async (note) => {
    setDeleteConfirmationOpen(true);
    setNoteToDelete(note);
  };
  const handleConfirmDelete = async () => {
    try {
      if (noteToDelete) {
        const noteId = noteToDelete.idnotes;
        await Axios.delete(`${API_BASE_URL}/notes/${noteId}/`);
        const updatedNotes = notesList.filter((n) => n.id !== noteId);
        setNotesList(updatedNotes);
        setNoteToDelete(null); // Clear the note to delete
        setDeleteConfirmationOpen(false); // Close the delete confirmation dialog
        fetchNotes();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleCancelDelete = () => {
    // Close the delete confirmation dialog without deleting
    setNoteToDelete(null);
    setDeleteConfirmationOpen(false);
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const filteredNotes = notesList.filter((note) =>
    (note.title || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );
  return (
    <div className="notes-page">
      <div className="col1">
        {isAddingNote ? (
          <div className="new-note-section">
            <TextField
              label={t("Title")}
              name="title"
              fullWidth
              variant="outlined"
              size="small"
              value={inputs.title}
              onChange={handleFieldChange}
            />
            <div className="note-desc">
              <ExpandableText
                width={"100%"}
                text={t("Add Note")}
                value={noteContent}
                onChange={handleNoteChange}
              />
            </div>
            <div className="cancel-and-save">
              <CancelButton onClick={handleCancelClick} />
              <SaveButton onClick={handleSaveClick} />
            </div>
          </div>
        ) : (
          <button className="btn-add" onClick={handleAddNoteClick}>
            + {t('Add Note')}
          </button>
        )}
      </div>
      <div className="col2">
        <div className="row">

          

       
          <TextField
            label="Search by Title"
            name="search"
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{
              style: { fontSize: '14px' } 
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredNotes
          .filter((note) => note.patient == selectedPatientId)
          
          .map((note, index) => (
            
            <div
              key={index}
             
            >
              <div>
                {editingNote === note ? (
                  <div>
                    <TextField
                      label="Title"
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <ExpandableText
                      width={"100%"}
                      text={"Edit Note"}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div>
                      <CancelButton
                        onClick={() => {
                          setEditingNote(null);
                          setEditedContent("");
                          setEditedTitle("");
                        }}
                      />
                      <SaveButton onClick={handleSaveNoteEdit} />
                    </div>
                  </div>
                ) : (
                  <div>
        <div  style={{
                marginTop: "1rem",
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}>
          <h2>{note.title}</h2>
          <h5>{formatDate(note.date)}</h5>
        </div>
        <div  style={{
                
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}>
        <h4>{note.saved_notes}</h4>
        <div>
        {userRole === "Doctor" || user.id === note.user ? ( // Check user role and note authorship
          editingNote === note ? (
            null
          ) : (
            <div>
              <EditIcon
                onClick={() => handleEditClick(note)}
                style={{ cursor: 'pointer', color: '#545454' }}
              />
              <DeleteIcon
                onClick={() => handleDeleteClick(note)}
                style={{ cursor: 'pointer', color: '#545454' }}
              /> 
            </div>
          )
        ) : null}
      </div></div>
        <p><strong>{t("Created by: ")}</strong>{note.userName}</p>
        {note.lastUpdatedBy !== "Unknown" && (
          <p><strong>{t("Last Updated by:")}</strong> {note.lastUpdatedBy}</p>
        )}
      </div>
    )}
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
          <DialogTitle id="alert-dialog-title">{t('Delete Note?')}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('Are you sure you want to delete this note?')}
            </DialogContentText>
            {noteToDelete && (
              <div>
                <h2>{noteToDelete.title}</h2>
                <h5>{formatDate(noteToDelete.date)}</h5>
                <h4>{noteToDelete.saved_notes}</h4>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <CancelButton onClick={handleCancelDelete} />
            <SaveButton onClick={handleConfirmDelete}>{t('Delete')}</SaveButton>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedNotes;
