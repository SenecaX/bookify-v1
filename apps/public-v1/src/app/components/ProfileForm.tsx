import React, { useEffect } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Paper,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { ControlledFormInput, profileSchema } from '@bookify-v1/shared-components';
import { User } from '../types';


interface ProfileFormProps {
  userProfile: Partial<User> | null;
  onSubmit: (data: User) => void;
  loading: boolean;
  error: string | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  userProfile,
  onSubmit,
  loading,
  error,
}) => {
    const methods = useForm<Partial<User>>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            zip: '',
            country: '',
          } as User['address'],  // Type assertion for optional address
        },
      });
      

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (userProfile) {
      reset(userProfile);
    }
  }, [userProfile, reset]);

  const onFormSubmit: SubmitHandler<Partial<User>> = (data) => {
    onSubmit(data as User); 
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 600 }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <Typography variant="h5" gutterBottom align="center">
              Edit Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="firstName"
                  label="First Name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <ControlledFormInput
                  name="email"
                  label="Email"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <ControlledFormInput
                  name="phone"
                  label="Phone Number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.street"
                  label="Street"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.city"
                  label="City"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.zip"
                  label="ZIP Code"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ControlledFormInput
                  name="address.country"
                  label="Country"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
};

export default ProfileForm;
