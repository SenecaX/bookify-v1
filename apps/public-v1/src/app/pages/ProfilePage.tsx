import React from 'react';
import { User } from '../types'; // Assuming User type is defined in types
import ProfileForm from '../components/ProfileForm';

const ProfilePage: React.FC = () => {
  // Sample user data (replace with actual data retrieval logic)
  const userProfile: Partial<User> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345',
      country: 'Country',
    },
  };

  // Mock function to handle form submission
  const handleProfileSubmit = (data: User) => {
    console.log('Profile data submitted:', data);
    // Implement actual submission logic here
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <ProfileForm
        userProfile={userProfile}
        onSubmit={handleProfileSubmit}
        loading={false} // Replace with loading state logic if needed
        error={null} // Replace with error state logic if needed
      />
    </div>
  );
};

export default ProfilePage;
