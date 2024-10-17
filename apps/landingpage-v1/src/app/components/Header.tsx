import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Menu, MenuItem, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '@bookify-v1/shared';
import useMediaQuery from '@mui/material/useMediaQuery';

// Styled AppBar for Flat Design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent', // Transparent background for the nav bar
  boxShadow: 'none', // Remove box shadow
  borderBottom: 'none', // Remove borders for minimalism
  padding: theme.spacing(2), // Ensure padding remains
}));
// Flat Style Navigation Button (no background)
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

// Add this styled component near the top of your file
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>('En');
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

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageChange = (language: string) => {
    const lang = language === 'English' ? 'En' : 'Fr';
    setSelectedLanguage(lang);
    handleClose();
  };

  const handleLoginClick = () => {
    setOpenLoginModal(true);
  };

  const handleCloseModal = () => {
    setOpenLoginModal(false);
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

              <Button
                startIcon={<LanguageIcon />}
                onClick={handleLanguageClick}
                sx={{ color: theme.palette.text.primary, textTransform: 'none' }}
              >
                {selectedLanguage}
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
                  <ListItem onClick={handleMenuClick(setIndustriesMenuAnchor)}>
                    <ListItemText primary="Industries ▼" />
                  </ListItem>
                  <ListItem onClick={handleMenuClick(setResourcesMenuAnchor)}>
                    <ListItemText primary="Resources ▼" />
                  </ListItem>
                  <ListItem>
                    <LanguageIcon sx={{ mr: 1 }} />
                    <ListItemText primary={selectedLanguage} />
                  </ListItem>
                </List>
              </Drawer>
            </>
          )}
        </Toolbar>
      </StyledAppBar>

      <TransparentMenu 
        anchorEl={industriesMenuAnchor} 
        open={Boolean(industriesMenuAnchor)} 
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Industry 1</MenuItem>
        <MenuItem onClick={handleClose}>Industry 2</MenuItem>
        <MenuItem onClick={handleClose}>Industry 3</MenuItem>
      </TransparentMenu>

      <TransparentMenu 
        anchorEl={resourcesMenuAnchor} 
        open={Boolean(resourcesMenuAnchor)} 
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Resource 1</MenuItem>
        <MenuItem onClick={handleClose}>Resource 2</MenuItem>
        <MenuItem onClick={handleClose}>Resource 3</MenuItem>
      </TransparentMenu>

      <TransparentMenu 
        anchorEl={languageMenuAnchor} 
        open={Boolean(languageMenuAnchor)} 
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleLanguageChange('English')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('French')}>French</MenuItem>
      </TransparentMenu>

      {/* <LoginModal open={openLoginModal} onClose={handleCloseModal} /> */}
    </>
  );
};

export default Header;
