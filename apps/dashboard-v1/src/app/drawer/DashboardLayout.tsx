import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBarComponent from './AppBarComponent';
import DrawerComponent from './DrawerComponent';
import { Outlet } from 'react-router-dom'; // Import Outlet

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBarComponent
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
      />

      <DrawerComponent
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        {/* Outlet renders the nested components */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
