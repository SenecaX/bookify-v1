import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store'; // Adjust the import to match your store's structure
import ProfileForm from '../components/ProfileForm';
import { User } from '../types';
import { updateUserProfileAsync } from '../store/authSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Access the Redux dispatch function
  // Retrieve the user profile and auth status from Redux
  const userProfile = useSelector((state: RootState) => state.auth.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  // Handle form submission
  const handleProfileSubmit = (data: Partial<User>) => {
    dispatch(updateUserProfileAsync(data));
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {userProfile ? (
        <ProfileForm
          userProfile={userProfile}
          onSubmit={handleProfileSubmit}
          loading={authStatus.loading} // Use actual loading state
          error={authStatus.error} // Use actual error state
        />
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
