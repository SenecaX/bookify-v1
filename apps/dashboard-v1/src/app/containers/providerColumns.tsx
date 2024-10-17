import moment from 'moment';
import { formatAddress } from '../utils/date.utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

// Extracted column definitions with actions for edit and delete
export const providerColumns = (handleEditProvider: (row: any) => void, handleDeleteProvider: (row: any) => void) => [
  { 
    header: 'Name', 
    key: 'firstName', 
    render: (row: any) => `${row.firstName} ${row.lastName}`  // Concatenate firstName and lastName
  },
  { header: 'Email', key: 'email' },
  { header: 'Phone', key: 'phone' },
  { 
    header: 'Address', 
    key: 'address',
    render: (row: any) => formatAddress(row.address) // Use helper to format the address
  },
  { 
    header: 'Created At', 
    key: 'createdAt',
    render: (row: any) => moment(row.createdAt).format('MMMM Do YYYY') // Format date using moment
  },
  { 
    header: 'Actions', 
    key: 'actions',
    render: (row: any) => (
      <>
      {/* Edit Action */}
      <IconButton onClick={() => handleEditProvider(row)}> {/* Pass row to edit */}
        <EditIcon />
      </IconButton>
      {/* Delete Action */}
      <IconButton onClick={() => handleDeleteProvider(row)}> {/* Pass row to delete */}
        <DeleteIcon />
      </IconButton>
    </>
    )  // Render icons for edit and delete actions
  },
];
