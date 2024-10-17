import React from 'react';
import { useProviderManager } from '../hooks/useProviderManager';
import ProviderContainer from '../containers/ProviderContainer';

export const ProvidersPage: React.FC = () => {
  const { providers, ...otherProps } = useProviderManager();

  return <ProviderContainer data={providers} {...otherProps} addButtonText="Add Provider" title="Provider" />;
};

export default ProvidersPage;
