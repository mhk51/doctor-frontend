import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';

export default function CustomTable({ data_rows, new_cols, height }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data and set it in the rows state when the component mounts
    setRows(data_rows || []);
  }, [data_rows]);
  const columns = [
    ...new_cols,]
  function CustomToolbar() {
    return (
      <GridToolbarContainer style={{ padding: '0.5rem 0rem 0rem 0.5rem' }}>
        <GridToolbarColumnsButton style={{ color: '#004957' }} />
        <GridToolbarFilterButton style={{ color: '#004957' }} />
        <GridToolbarDensitySelector style={{ color: '#004957' }} />
        <GridToolbarExport style={{ color: '#004957' }} />
      </GridToolbarContainer>
       );
    }

    return (
      <div style={{ height: height, width: '100%' }}>
        <DataGrid
          rows={data_rows}
          columns={new_cols}
          slots={{ toolbar: CustomToolbar }}
        />
      </div>
    );
}
