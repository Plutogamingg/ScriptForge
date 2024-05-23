import React, { useState } from 'react'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkPasswordStrength = (password) => {
    setPassword(password);  // Set the password state
    if (password.length < 6) {
        setPasswordStrength('weak');
    } else if (password.length >= 8 && /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
        setPasswordStrength('strong');
    } else if (/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
        setPasswordStrength('medium');
    } else {
        setPasswordStrength('weak');
    }
  };
  



  // Handle the logic after a successful signup to login the user
  const loginNewUser = (email, password) => {
    fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok during login');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error during login:', error);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return; // Prevent submission if passwords do not match
    }
  
    checkPasswordStrength(password);

    // check password strength before proceeding 
    if (passwordStrength === 'weak') {
      // Handle weak password case (e.g., show an error message)
      console.error('Password is too weak');
      return; // Prevent submission if the password is weak
    }
  
    fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: data.get('firstName'),
        last_name: data.get('lastName'),
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok during signup');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Call login function for the new user
      loginNewUser(email, password);
    })
    .catch((error) => {
      console.error('Error during signup:', error);
    });
  };
  

  return (
    <ThemeProvider theme={defaultTheme}>
     <Box sx={{ bgcolor: '#2a3e52', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
    <Container component="main" maxWidth="xs" sx={{ margin: 'auto', display: 'flex', flexDirection: 'column', height: '120vh' }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: '100%' }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(event) => checkPasswordStrength(event.target.value)}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Password strength:
                  <span
                    style={{
                      color: passwordStrength === 'weak' ? '#f44336' :
                              passwordStrength === 'medium' ? '#ff9800' :
                              passwordStrength === 'strong' ? '#4caf50' : 'inherit',
                    }}
                  >
                    {passwordStrength}
                  </span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
           {/* Submit button and other form components */}
           <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={passwordStrength === 'weak' || password !== confirmPassword}
              >
                Sign Up
              </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="./signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={5}>
        {/* Copyright Component */}
      </Box>
    </Container>
    </Box>

  </ThemeProvider>
);
}
