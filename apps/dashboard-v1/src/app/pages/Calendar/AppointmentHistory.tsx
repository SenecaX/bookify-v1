import React from 'react';
import { Appointment } from './mockAppointments';
import mockAppointments from './mockAppointments';

const AppointmentHistory: React.FC = () => {
  const pastAppointments = mockAppointments.filter((appointment) => appointment.status !== 'Booked');

  return (
    <div>
      <h2>Past and Canceled Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Service ID</th>
            <th>Provider ID</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Cancellation Reason</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {pastAppointments.map((appointment) => (
            <tr key={appointment.dateTime.toString()}>
              <td>{appointment.customerId}</td>
              <td>{appointment.serviceId}</td>
              <td>{appointment.providerId}</td>
              <td>{new Date(appointment.dateTime).toLocaleString()}</td>
              <td>{appointment.status}</td>
              <td>{appointment.cancellationReason || 'N/A'}</td>
              <td>{appointment.review ? `${appointment.review.rating} Stars - ${appointment.review.comment}` : 'No Review'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentHistory;
