import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Adjust the import to match your store's structure
import ProfileForm from '../components/ProfileForm';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  // Retrieve the user profile and auth status from Redux
  const userProfile = useSelector((state: RootState) => state.auth.user);
  const authStatus = useSelector((state: RootState) => state.auth.authStatus);

  // Handle form submission
  const handleProfileSubmit = (data: User) => {
    console.log('Profile data submitted:', data);
    // Implement actual submission logic here (e.g., dispatch an update action)
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
