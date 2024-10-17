import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Container, Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import Day from './Day';
import { companyHoursSetupSchema } from '@bookify-v1/shared-components';
import { companyHourUtils } from './companyHourUtils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateCompanyAsync } from '../../store/companySlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CompanyHoursSetup = () => {
  const methods = useForm({
    resolver: yupResolver(companyHoursSetupSchema),
    defaultValues: {
      workingHours: companyHourUtils,
    },
  });

  // Get user ID and company ID from Redux
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const companyId = useSelector((state: RootState) => state.company.companyId);

  const { handleSubmit } = methods;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const onSubmit = async (data: any) => {
    console.log('Saved Data:', data);
    console.log('Company ID:', companyId);
    console.log('User ID:', userId);

    // Dispatch the thunk with the formatted form data
    if (companyId && userId) {
      const resultAction = await dispatch(updateCompanyAsync({ companyId, data, userId }));
      if (updateCompanyAsync.fulfilled.match(resultAction)) {
        navigate('/welcome'); // Navigate to /welcome page after successful update
      } else {
        console.error('Failed to update the company');
      }
    } else {
      console.error('Company ID or User ID is null');
    }
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box>
          <h1>Company Hours Setup</h1>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {methods.watch('workingHours').map((dayData: any, index: number) => (
              <Day key={index} index={index} />
            ))}
          </Grid>

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save
          </Button>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CompanyHoursSetup;
