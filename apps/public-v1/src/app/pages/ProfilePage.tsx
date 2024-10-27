import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import ProfileForm from '../components/ProfileForm';
import { User } from '../types';
import { resetAuthStatus, updateUserProfileAsync } from '../store/authSlice';
import { useSnackbar } from '../hooks/useSnackbar';
import { CustomSnackbar } from '@bookify-v1/shared-components';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: RootState) => state.auth.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useSnackbar();

  // Handle form submission
  const handleProfileSubmit = (data: Partial<User>) => {
    dispatch(updateUserProfileAsync(data));
  };

  useEffect(() => {
    if (authStatus.success) {
      showSnackbar('Profile updated successfully', 'success');
      dispatch(resetAuthStatus()); // Reset success status after showing snackbar
    }
    if (authStatus.error) {
      showSnackbar(authStatus.error, 'error');
      dispatch(resetAuthStatus()); // Reset error status after showing snackbar
    }
  }, [authStatus.success, authStatus.error, dispatch, showSnackbar]);


  return (
    <div>
      <h1>Profile Page</h1>
      {userProfile ? (
        <ProfileForm
          userProfile={userProfile}
          onSubmit={handleProfileSubmit}
          loading={authStatus.loading}
          error={authStatus.error}
        />
      ) : (
        <p>Loading profile...</p>
      )}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};

export default ProfilePage;
