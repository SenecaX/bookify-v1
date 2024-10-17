import React from 'react';
import { useServiceManager } from '../hooks/useServiceManager';
import ServiceContainer from '../containers/ServiceContainer';

export const ServicesPage: React.FC = () => {
  const { services, ...otherProps } = useServiceManager();

  return <ServiceContainer data={services} {...otherProps} addButtonText="Add Service" title="Service" />;
};

export default ServicesPage;
