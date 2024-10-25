import { theme } from '@bookify-v1/shared';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Menu, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent', // Transparent background for the nav bar
  boxShadow: 'none', // Remove box shadow
  borderBottom: 'none', // Remove borders for minimalism
  padding: theme.spacing(2), // Ensure padding remains
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 'bold',
  padding: theme.spacing(1, 2), // Adjust padding for breathing space
  borderRadius: '0px', // Flat design, remove rounded corners
  '&:hover': {
    backgroundColor: 'transparent', // No hover background
    textDecoration: 'underline', // Minimal hover effect
  },
}));

const TransparentMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  '& .MuiMenuItem-root': {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)', // Very light hover effect
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const [industriesMenuAnchor, setIndustriesMenuAnchor] = useState<null | HTMLElement>(null);
  const [resourcesMenuAnchor, setResourcesMenuAnchor] = useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuClick = (setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchor(event.currentTarget);
    };

  const handleClose = () => {
    setIndustriesMenuAnchor(null);
    setResourcesMenuAnchor(null);
    setLanguageMenuAnchor(null);
  };

  const handleLoginClick = () => {
    setOpenLoginModal(true);
  };

  const handleSignUpClick = () => {
    navigate('/register-admin');
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: "#000"}} component={"h1"}>
          Instabooking
          </Typography>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }} onClick={handleLoginClick}>
                Log in
              </Button>
              <Button sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }} onClick={handleSignUpClick}>
                Sign Up
              </Button>
            </Box>
          ) : (
            <>
              <IconButton 
                edge="end" 
                onClick={toggleDrawer(true)}
                sx={{ color: theme.palette.text.primary }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List>
                  <ListItem onClick={handleLoginClick}>
                    <ListItemText primary="Log in" />
                  </ListItem>
                  <ListItem onClick={handleSignUpClick}>
                    <ListItemText primary="Sign Up" />
                  </ListItem>
                </List>
              </Drawer>
            </>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* <LoginModal open={openLoginModal} onClose={handleCloseModal} /> */}
    </>
  );
};

export default Header;
