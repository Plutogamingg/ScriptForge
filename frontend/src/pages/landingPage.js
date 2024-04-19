import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/sfLogo.png';

function LandingPage() {
    return (
        <Box className="min-h-screen flex flex-col items-center justify-center bg-[#2a3e52] text-white p-6">
            <Container maxWidth="sm" className="text-center"> {/* Ensure text-center is applied here */}
                <img src={logoImage} alt="ScriptForge Logo" className="mb-2 w-94 md:w-96 mx-auto" />
                
                <Typography variant="h3" component="h1" className="font-bold text-4xl mb-4">
                    Welcome to ScriptForge
                </Typography>
                <Typography variant="subtitle1" className="text-lg mb-6">
                    Crafting your scripts with precision and ease.
                </Typography>

                <Box className="flex flex-col md:flex-row justify-center gap-4">
                    <Button variant="contained" color="primary" className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded w-full md:w-auto" component={Link} to="/signup">
                        Sign Up
                    </Button>
                    <Button variant="contained" color="secondary" className="bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded w-full md:w-auto" component={Link} to="/signin">
                        Sign In
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;
