import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'; // Import for Redux
import { RootState } from '../store'; // Assuming you have RootState type for your Redux state
import { logout } from '../store/authSlice'; // Assuming you have a logout action in your auth slice

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's mobile
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer state for mobile menu
  const dispatch = useDispatch();

  // Access auth state from the store
  const { authStatus, user } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/register-customer');
  const handleProfile = () => navigate('/profile'); // Assuming there's a profile route
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/'); // Optionally, navigate to the home page after logging out
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Drawer content for mobile
  const drawerContent = (
    <List>
      <ListItem onClick={() => navigate('/')}>
        <ListItemText primary="Home" />
      </ListItem>
      {authStatus.success ? (
        <>
          <ListItem onClick={handleProfile}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem onClick={handleLogin}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem onClick={handleSignup}>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <>
      <AppBar position="static" color="primary" sx={{ padding: '0 20px', borderRadius: 0 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left side: Company Name/Logo */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Bookify
          </Typography>

          {/* Mobile: Hamburger menu */}
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ display: { sm: 'block', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                {drawerContent}
              </Drawer>
            </>
          ) : (
            // Desktop: Regular buttons
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/')}>
                Home
              </Button>

              {authStatus.success ? (
                <>
                  <Button color="inherit" onClick={handleProfile}>
                    Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    sx={{
                      bgcolor: 'secondary.main',
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px' },
                      minWidth: { xs: '80px', sm: '100px', md: '150px' },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSignup}
                    sx={{
                      bgcolor: 'secondary.main',
                      fontSize: { xs: '12px', sm: '14px', md: '16px' },
                      padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px' },
                      minWidth: { xs: '80px', sm: '100px', md: '150px' },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
