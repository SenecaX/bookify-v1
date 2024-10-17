import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CompanyRegistrationPage: React.FC = () => {

    const { userId } = useSelector((state: RootState) => state.auth.user);


  return (
    <>test</>
  );
};

export default CompanyRegistrationPage;
