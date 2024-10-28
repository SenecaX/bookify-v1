import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { IAppointment } from '../types';

export const appointmentColumns = (
  getUserNameById: (userId: string) => string,
  getServiceNameById: (serviceId: string) => string,
  handleEditAppointment?: (row: IAppointment) => void,
  handleDeleteAppointment?: (row: IAppointment) => void
) => [
  { 
    header: 'Customer Name', 
    key: 'customerId', 
    render: (row: IAppointment) => getUserNameById(row.customerId) 
  },
  { 
    header: 'Provider Name', 
    key: 'providerId', 
    render: (row: IAppointment) => getUserNameById(row.providerId) 
  },
  { 
    header: 'Service Name', 
    key: 'serviceId', 
    render: (row: IAppointment) => getServiceNameById(row.serviceId) 
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
  }
];
