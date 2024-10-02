import React from "react";
import { useAuth } from 'react-oidc-context';
import { Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';

export const Home = () => {
  const { user } = useAuth();

  const getFolders = async () => {
    const response = await fetch('proxy/cms/instances/folder/cms_folder', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.access_token}`,
      }
    });
    const responseJson = await response.json();
    console.log(responseJson);
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button onClick={getFolders}>Get folders</Button>
        </Grid>
      </Grid>
    </Box>
  )
}