// Utility function to determine status color
export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'primary';
      case 'completed':
        return 'success.main';
      case 'cancelled':
        return 'error.main';
      case 'blocked':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };