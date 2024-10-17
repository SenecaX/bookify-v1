import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

// Column definitions with actions for edit and delete
export const serviceColumns = (handleEditService: (row: any) => void, handleDeleteService: (row: any) => void) => [
  { 
    header: 'Service Name', 
    key: 'name', 
    render: (row: any) => row?.name  // Display service name
  },
  {
    header: 'Duration (mins)',
    key: 'duration',
    render: (row: any) => row?.duration,
  },
  {
    header: 'Buffer Duration (mins)',
    key: 'bufferDuration',
    render: (row: any) => row?.bufferDuration,
  },  
  { 
    header: 'Description', 
    key: 'description', 
    render: (row: any) => row?.description // Display service description
  },
  { 
    header: 'Created At', 
    key: 'createdAt',
    render: (row: any) => moment(row?.createdAt).format('MMMM Do YYYY') // Format created date
  },
  { 
    header: 'Actions', 
    key: 'actions',
    render: (row: any) => (
      <>
      {/* Edit Action */}
      <IconButton onClick={() => handleEditService(row)}> {/* Pass row to edit */}
        <EditIcon />
      </IconButton>
      {/* Delete Action */}
      <IconButton onClick={() => handleDeleteService(row)}> {/* Pass row to delete */}
        <DeleteIcon />
      </IconButton>
    </>
    )  // Render icons for edit and delete actions
  },
];
