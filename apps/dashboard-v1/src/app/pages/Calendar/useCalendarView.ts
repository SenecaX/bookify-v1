import moment, { Moment } from 'moment';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { View } from 'react-big-calendar';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper function to calculate start and end dates based on view
const calculateStartAndEndDates = (currentDate: Moment, currentView: View) => {
  let startOfRange = moment(currentDate).startOf('day');
  let endOfRange = moment(currentDate).endOf('day');

  switch (currentView) {
    case 'month':
      // Start at the first day of the first visible week of the month
      startOfRange = moment(currentDate).startOf('month').startOf('week').day(0); // Force Sunday
      // End at the last day of the last visible week of the month
      endOfRange = moment(currentDate).endOf('month').endOf('week').day(6);       // Force Saturday
      break;
    case 'week':
      // Start at Sunday and end at Saturday for the week view
      startOfRange = moment(currentDate).startOf('week').day(0); // Sunday
      endOfRange = moment(currentDate).endOf('week').day(6);     // Saturday
      break;
    case 'day':
    default:
      // Already set to start and end of the day
      break;
  }

  return { startOfRange, endOfRange };
};

const useCalendarView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getParamsFromURL = () => {
    const params = new URLSearchParams(location.search);
    const view = (params.get('view') as View) || 'day'; // Default to 'day' view
    const start = params.get('start') ? moment(params.get('start')) : moment(); // Default to today
    return { view, start };
  };

  const [currentView, setCurrentView] = useState<View>(getParamsFromURL().view);
  const [currentDate, setCurrentDate] = useState<Moment>(getParamsFromURL().start);

  // Calculate start and end of the current visible range
  const { startOfRange, endOfRange } = useMemo(
    () => calculateStartAndEndDates(currentDate, currentView),
    [currentDate, currentView],
  );

  const updateUrl = useCallback(
    (view: View, date: Moment) => {
      const params = new URLSearchParams(location.search);
      const { startOfRange, endOfRange } = calculateStartAndEndDates(date, view); // Calculate the start and end date based on the view
  
      // Update the 'view', 'start', and 'end' parameters in the URL
      params.set('view', view);
      params.set('start', startOfRange.format('YYYY-MM-DD')); // Set the start of the visible range
      params.set('end', endOfRange.format('YYYY-MM-DD'));     // Set the end of the visible range
      navigate({ search: params.toString() }, { replace: true });
    },
    [location.search, navigate],
  );

  // Sync URL when view or date changes
  useEffect(() => {
    updateUrl(currentView, currentDate);
  }, [currentView, currentDate, updateUrl]);

  // Handlers for view and date changes
  const onViewChange = (view: View) => {
    setCurrentView(view);
  };

  const onNavigateDate = (date: Date | Moment) => {
    setCurrentDate(moment(date));
  };

  return {
    currentView,
    setCurrentView: onViewChange,
    currentDate,
    setCurrentDate: onNavigateDate,
    startOfRange,
    endOfRange,
  };
};

export default useCalendarView;
