import useWorkingHours from './useWorkingHours';
import useCalendarView from './useCalendarView';
import { useSnackbar } from '../../hooks/useSnackbar';


const useProviderCalendarManager = () => {
  const workingHours = useWorkingHours(); // manages working hours, breaks, holidays
  const calendarView = useCalendarView(); // manages calendar view state and URL syncing
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useSnackbar();

  const triggerSuccessSnackbar = (message: string) => {
    showSnackbar(message, 'success'); // Trigger success snackbar
  };

  const triggerErrorSnackbar = (message: string) => {
    showSnackbar(message, 'error'); // Trigger error snackbar
  };

  return {
    ...workingHours, // Spread individual hooks into the return value
    ...calendarView,
    triggerSuccessSnackbar, // Add success snackbar handler
    triggerErrorSnackbar,   // Add error snackbar handler
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose
  };
};

export default useProviderCalendarManager;
