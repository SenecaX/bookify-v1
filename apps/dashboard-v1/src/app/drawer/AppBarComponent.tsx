import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch, persistor } from '../store';
import { logout } from '../store/authSlice';

const companyName = window.location.hostname.split('.')[0]; // Extract subdomain

interface AppBarComponentProps {
  isMobile: boolean;
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({
  isMobile,
  drawerWidth,
  onDrawerToggle,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch the logout action to clear Redux state
    dispatch(logout());
    persistor.purge();

    // Redirect to login page
    navigate('/login');
  };

  const handleVisitWebsite = () => {
    const websiteUrl = `https://${companyName}.instabooking.xyz`; // Dynamically build URL
    window.open(websiteUrl, '_blank'); // Open in new tab
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: '#1976d2',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: 0,
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        {/* Visit Website Button */}
        <Button 
          color="inherit" 
          onClick={handleVisitWebsite}
          sx={{ textTransform: 'none', mr: 2 }} // Styling: No uppercase, small margin
        >
          Visit your website
        </Button>

        {/* Notifications Icon */}
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        {/* Logout Icon */}
        <IconButton color="inherit" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
