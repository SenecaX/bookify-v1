import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const pricingPlans = [
  { title: 'Basic', price: '$10/month', features: ['Feature 1', 'Feature 2'] },
  { title: 'Pro', price: '$20/month', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
  { title: 'Enterprise', price: '$30/month', features: ['All Features'] },
];

const PricingSection = () => {
  return (
    <Box sx={{ mt: 8, px: 2 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Pricing Plans
      </Typography>
      <Grid container spacing={4}>
        {pricingPlans.map((plan, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">{plan.title}</Typography>
              <Typography variant="h5" sx={{ color: '#00bcd4' }}>
                {plan.price}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {plan.features.join(', ')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PricingSection;