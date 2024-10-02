import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Box, Button, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import './styles/Header.css';

export const Header = () => {
    const { signoutRedirect } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.between("xs", "md"));

    return (
        <Grid container>
            <Grid size={12}>
                <div className="page-header">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 2, md: 2, xl: 1 }}>
                            {isMobile ?
                            <div className="logo small">
                                <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1514 1040" width="41" height="28">
                                    <path fill="white" d="m938.8 550.8c0 216.4-128.6 450.4-467.5 450.4-245.5 0-470.5-134.5-470.5-450.4 0-260.3 169.5-462.2 502.6-444.6 356.5 20.5 435.4 289.6 435.4 444.6zm-634.1-163.8c-32.1 46.8-43.8 105.3-43.8 163.8 0 131.6 67.2 251.5 210.4 251.5 140.2 0 207.4-111.1 207.4-239.8 0-93.6-23.3-163.8-73-207.7-52.6-46.8-114-49.7-152-46.8-70.1 2.9-113.9 26.3-149 79z"/>
                                    <path fill="white" d="m1343.5 735.1c-2.9 52.7-2.9 96.5 67.2 96.5l90.6-2.9v196c-52.6 8.8-87.7 14.6-134.4 14.6-90.6 0-187-5.8-242.5-84.8-35.1-49.7-38-111.2-38-193.1v-406.5h-157.8l116.9-175.5h40.9v-178.5h257.1v181.4h169.5v175.5h-169.5z"/>
                                </svg>
                            </div>
                            :
                            <div className="logo large"></div>
                            }
                        </Grid>
                        <Grid size={{ xs: 4, xl: 1 }}>
                            <Box sx={{ mt: "1.4rem", fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>Viewer App</Box>
                        </Grid>
                        <Grid size={{ xs: 6, xl: 10 }}>
                            <Grid container display="flex" justifyContent="flex-end">
                                <Button sx={{ mt: "1rem", color: "white" }} onClick={signoutRedirect}>Log Out</Button>
                            </Grid> 
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    )
}