import React, { useEffect, useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box, Button } from "@mui/material";
import Grid from '@mui/material/Grid2';

export const Home = () => {
  const { user } = useAuth();
  const [ sampleFiles, setSampleFiles ] = useState();

  const getSampleFiles = async() => {
    const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } }
    const response = await fetch(`proxy/cms/instances/folder/cms_folder/${import.meta.env.VITE_SAMPLES_FOLDER_ID}`, requestOptions);
    const responseJson = await response.json()
    console.log(responseJson);
    setSampleFiles(responseJson);  
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button onClick={getSampleFiles}>Get sample files</Button>
        </Grid>
      </Grid>
    </Box>
  )
}