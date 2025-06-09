import { Box } from '@mui/system';
import React from 'react';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Button,
  InputBase,
  InputAdornment,
  ListItem,
  List,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box position="relative" mt={20}>
      <Box
        width="90%"
        m="auto"
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems="center"
        gap={4}
        position="absolute"
        top={-110}
        left="50%"
        sx={{
          backgroundColor: 'black',
          borderRadius: 10,
          py: { xs: 4, md: 8 },
          px: { xs: 4, md: 10 },
          transform: 'translateX(-50%)',
        }}
      >
        <Box width={{ xs: '100%', md: '70%' }}>
          <Typography
            variant="h4"
            fontWeight={900}
            width={"70%"}
            textTransform="uppercase"
            color="white"
            fontSize={{ xs: '1.5rem', sm: '2rem', md: '2.5rem' }}
          >
            Stay up to date about our latest offer
          </Typography>
        </Box>

        <Box
          width={{ xs: '100%', md: '30%' }}
          display="flex"
          flexDirection="column"
          gap={1}
        >
          <Paper
            component={InputBase}
            placeholder="Enter your email"
            sx={{
              height: 43,
              px: 2,
              borderRadius: 10,
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              '& input': {
                height: '100%',
                padding: 0,
              },
            }}
            startAdornment={
              <InputAdornment position="start">
                <EmailOutlinedIcon color="action" />
              </InputAdornment>
            }
          />
          <Button
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              width: '100%',
              height: 45,
              fontWeight: 600,
              color: 'black',
              '&:hover': { backgroundColor: '#e0e0e0' },
            }}
          >
            Subscribe to our newsletter
          </Button>
        </Box>
      </Box>

      <Box
        width="100%"
        backgroundColor="#f5f5f5"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        py={{ xs: 25, md: 20 }}
        px={{ xs: 4, sm: 6, md: 10 }}
        gap={6}
      >
        <Box sx={{ width: { xs: '100%', sm: '100%', md: '15%' } }}>
          <Typography variant="h4" color="initial">
            Shop.co
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            mt={2}
            sx={{ width: { xs: '100%', sm: '90%' } }}
          >
            We have clothes that suit your style and you’re proud to wear. From women to men.
          </Typography>
          <Box display="flex" gap={2} mt={4}>
            <TwitterIcon fontSize="medium" />
            <FacebookIcon fontSize="medium" />
            <InstagramIcon fontSize="medium" />
            <GitHubIcon fontSize="medium" />
          </Box>
        </Box>

        <List sx={{ width: { xs: '100%', sm: '45%', md: '15%' } }}>
          <ListItem sx={{ fontWeight: 700 }}>Company</ListItem>
          <ListItem>About</ListItem>
          <ListItem>Feature</ListItem>
          <ListItem>Work</ListItem>
          <ListItem>Career</ListItem>
        </List>

        <List sx={{ width: { xs: '100%', sm: '45%', md: '15%' } }}>
          <ListItem sx={{ fontWeight: 700 }}>Help</ListItem>
          <ListItem>Customer Support</ListItem>
          <ListItem>Delivery Details</ListItem>
          <ListItem>Terms & Conditions</ListItem>
          <ListItem>Privacy Policy</ListItem>
        </List>

        <List sx={{ width: { xs: '100%', sm: '45%', md: '15%' } }}>
          <ListItem sx={{ fontWeight: 700 }}>Resources</ListItem>
          <ListItem>Free eBooks</ListItem>
          <ListItem>Development Tutorial</ListItem>
          <ListItem>How to - Blog</ListItem>
          <ListItem>Youtube Playlist</ListItem>
        </List>

        <List sx={{ width: { xs: '100%', sm: '45%', md: '15%' } }}>
          <ListItem sx={{ fontWeight: 700 }}>Links</ListItem>
          <ListItem>Home</ListItem>
          <ListItem>Shop</ListItem>
          <ListItem>Categories</ListItem>
          <ListItem>Contact</ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default Footer;
