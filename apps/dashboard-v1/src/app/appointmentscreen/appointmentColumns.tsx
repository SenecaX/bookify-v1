import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { IAppointment } from '../types';

export const appointmentColumns = (
  handleEditAppointment?: (row: IAppointment) => void,
  handleDeleteAppointment?: (row: IAppointment) => void
) => [
  { 
    header: 'Customer ID', 
    key: 'customerId', 
    render: (row: IAppointment) => row.customerId 
  },
  { 
    header: 'Provider ID', 
    key: 'providerId', 
    render: (row: IAppointment) => row.providerId 
  },
  { 
    header: 'Service ID', 
    key: 'serviceId', 
    render: (row: IAppointment) => row.serviceId 
  },
  { 
    header: 'Date & Time', 
    key: 'dateTime',
    render: (row: IAppointment) => moment(row.dateTime).format('MMMM Do YYYY, h:mm a') 
  },
  { 
    header: 'Status', 
    key: 'status',
    render: (row: IAppointment) => row.status 
  },
  { 
    header: 'Actions', 
    key: 'actions',
    render: (row: IAppointment) => (
      <>
        {/* Edit Action */}
        <IconButton onClick={() => handleEditAppointment?.(row)}>
          <EditIcon />
        </IconButton>
        {/* Delete Action */}
        <IconButton onClick={() => handleDeleteAppointment?.(row)}>
          <DeleteIcon />
        </IconButton>
      </>
    )
  },
];
