
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EditConfirmationDialog from "./EditConfirmationDialog";
import React, { useState , useEffect } from 'react';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import "./table.scss";
export default function Table({ data_rows, new_cols, height, onDelete, onUpdate, onEditClick }) {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for the delete confirmation dialog
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editedRows, setEditedRows] = useState({});
  useEffect(() => {
    // Fetch data and set it in the rows state when the component mounts
    setRows(data_rows || []);
  }, [data_rows]);
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    // Set the row mode to edit
    /*setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: GridRowModes.Edit },
    }))*/
    const selectedRow = rows.find((row) => row.id === id);

    // Call the onEditClick prop to open the Add Invoice popup
    onEditClick(selectedRow);
  };
  
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  
  

  const handleDeleteClick = (id) => () => {
    // Open the delete confirmation dialog and store the row ID to delete
    setDeleteDialogOpen(true);
    setRowToDelete(id);
  };

  const handleDeleteConfirm = () => {
    // Call the onDelete callback function and pass the row ID to delete
    onDelete(rowToDelete);

    // Close the delete confirmation dialog
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    // Close the delete confirmation dialog without deleting the row
    setDeleteDialogOpen(false);
  };
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    console.log("Updated Row in processRowUpdate:", updatedRow); 
    // Now, call the onUpdate function to save the changes
    onUpdate(newRow.id, updatedRow);
  
    return updatedRow;
  };
  
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
 
  // Define your existing columns
  const columns = [
    ...new_cols,
    {
      field: "actions",
      align: "left",
      type: "actions",
      headerAlign: "left",
      headerName: "Actions",
      flex: 0.3,
      width: 50,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  console.log("Data Rows:", data_rows);
  console.log("Columns:", new_cols);
  console.log("Rows:", rows);
  console.log("Final Columns:", columns);
  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ padding: ".5rem 0rem 0rem .5rem " }}>
        <GridToolbarColumnsButton style={{ color: "#004957" }} />
        <GridToolbarFilterButton style={{ color: "#004957" }} />
        <GridToolbarDensitySelector style={{ color: "#004957" }} />
        <GridToolbarExport style={{ color: "#004957" }} />
      </GridToolbarContainer>
    );
  }
  return (
    <div
      style={{
        height: height,
        width: "97%",
      }}
    >
     <DataGrid
  checkboxSelection
  slots={{ toolbar: CustomToolbar }}
  rows={data_rows}
  columns={columns} // Use the combined columns
  editMode="row"
  rowModesModel={rowModesModel}
  onRowModesModelChange={handleRowModesModelChange}
  onRowEditStop={handleRowEditStop}
  onEditRowsModelChange={(editRowsModel) => {
    // When rows are edited, update the editedRows state
    console.log("Edited Rows Model:", editRowsModel);
    setEditedRows(editRowsModel);
  }}
  processRowUpdate={processRowUpdate}
  slotProps={{
    toolbar: { setRows, setRowModesModel },
  }}
/>

       <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );


}