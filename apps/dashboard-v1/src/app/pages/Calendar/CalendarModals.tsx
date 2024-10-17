import { Modal, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IAppointment, IBlockedTime } from '../../types';
import BlockTimeModal from './BlockTimeModal';
import BookAppointmentModal from './BookAppointmentModal';
import CancelAppointmentModal from './CancelAppointmentModal_old';

interface CalendarModalsProps {
  selectedAppointment: IAppointment | null;
  selectedBlockedTime: IBlockedTime | null;
  closeAppointmentModal: () => void;
  selectedTimeRange: { start: Date; end: Date } | null;
  isBlockModalOpen: boolean;
  isAppointmentModalOpen: boolean;
  closeBlockModal: () => void;
  onBlockTimeSubmit: (data: { startTime: string; endTime: string; reason: string }) => void;
  onBookAppointmentSubmit: (data: any) => void;
  onCancelAppointmentConfirm: (appointmentId: string, reason: string) => void; // New prop to handle cancellation
}

const CalendarModals: React.FC<CalendarModalsProps> = ({
  selectedAppointment,
  selectedBlockedTime,
  closeAppointmentModal,
  selectedTimeRange,
  isBlockModalOpen,
  isAppointmentModalOpen,
  closeBlockModal,
  onBlockTimeSubmit,
  onBookAppointmentSubmit,
  onCancelAppointmentConfirm, 
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // Manage Cancel Modal state

  const handleCancelAppointment = (appointment: IAppointment) => {
    setIsCancelModalOpen(true); // Open the cancel modal
  };

  const handleConfirmCancellation = (appointmentId: string, reason: string) => {
    // Logic to cancel the appointment goes here (e.g., dispatch action or call API)
    console.log('Cancellation reason:', reason, appointmentId);
    onCancelAppointmentConfirm(appointmentId, reason);
    // Close modals after cancellation is confirmed
    setIsCancelModalOpen(false);
    closeAppointmentModal();
  };

  // Determine initial tab based on selectedAppointment or selectedTimeRange
  useEffect(() => {
    if (selectedAppointment) {
      setActiveTab(1); // Book Appointment tab
    } else if (selectedTimeRange) {
      setActiveTab(0); // Block Time tab
    }
  }, [selectedAppointment, selectedTimeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Modal
      open={isBlockModalOpen || isAppointmentModalOpen || isCancelModalOpen} // Ensure modal state is managed here
      onClose={() => {
        closeBlockModal();
        closeAppointmentModal();
        setIsCancelModalOpen(false); // Ensure cancel modal is closed properly
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '20px', maxWidth: '600px', margin: '100px auto' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Block Time" />
          <Tab label="Book Appointment" />
        </Tabs>

        {activeTab === 0 && (
          <BlockTimeModal
            isOpen={isBlockModalOpen}
            onClose={closeBlockModal}
            timeRange={selectedTimeRange}
            onSubmit={onBlockTimeSubmit}
            selectedBlockedTime={selectedBlockedTime || null} // Pass the selected blocked time if applicable
            onCancelBlockedTime={closeBlockModal} // Ensure onClose is passed
          />
        )}

        {activeTab === 1 && (
          <BookAppointmentModal
            isOpen={isAppointmentModalOpen && !isCancelModalOpen} // Hide BookAppointmentModal if Cancel modal is open
            onClose={closeAppointmentModal} // Ensure onClose is passed
            selectedAppointment={selectedAppointment || null}
            timeRange={selectedTimeRange}
            onSubmit={onBookAppointmentSubmit}
            onCancelAppointment={handleCancelAppointment} // Pass the cancel handler
          />
        )}

        {/* Add the CancelAppointmentModal */}
        {selectedAppointment && (
          <CancelAppointmentModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            appointment={selectedAppointment}
            onCancelConfirm={handleConfirmCancellation}
            
          />
        )}
      </div>
    </Modal>
  );
};

export default CalendarModals;
