import React from 'react';
import { useProviderManager } from '../hooks/useProviderManager';
import ProviderContainer from '../containers/ProviderContainer';

export const UsersPage: React.FC = () => {
  const { users, ...otherProps } = useProviderManager();

  return <ProviderContainer data={users} {...otherProps} addButtonText="Add User" title="User" />;
};

export default UsersPage;
