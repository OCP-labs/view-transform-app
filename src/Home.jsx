import React, { useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createPublicationBody } from "./utilities/createPublicationBody";
import { Viewer } from "./Viewer";

export const Home = () => {
  const { user } = useAuth();
  const [ publicationData, setPublicationData ] = useState();
  const [ viewerDisplay, setViewerDisplay ] = useState("none");
  const [ selectedFile, setSelectedFile ] = useState();
  const [ publicationId, setPublicationId ] = useState();
  const [ loading, setLoading ] = useState(false);

  const handleFileSelection = async(e) => {
    if (e.target.files[0]) {
        const file = e.target.files[0];
        setLoading(true);
        setSelectedFile(file);
        await uploadFile(file);
    }
    e.target.value = null;
  }

  const uploadFile = async(file) => {
    try {
        console.log(file);
        const formData = new FormData();
        formData.append('name', file);
        const requestOptions = { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${user.access_token}` },
            body: formData 
        };
        const response = await fetch('css-api/v3/files/fromStream', requestOptions);
        const responseJson = await response.json();
        console.log(responseJson);
        const publicationBody = createPublicationBody(file.name, responseJson.mimeType, responseJson.id);
        await addPublication(publicationBody);
    } catch(error) {
        console.log(error);
        setLoading(false);
    }
  }

  const addPublication = async(publicationBodyJson) => {
    console.log(publicationBodyJson);
    try {
        const requestOptions = { 
            method: 'POST', 
            headers: { 
                'Authorization': `Bearer ${user.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(publicationBodyJson)
        };
        const response = await fetch('api/publication/api/v1/publications', requestOptions);
        const responseJson = await response.json();
        if (!responseJson.id) {
            throw new Error("Publication failed");
        } else {
            setPublicationId(responseJson.id);
        }
        /*
        } else {
            const attempts = 1;
            return await getPublicationStatus(responseJson.id, attempts);
        }
        */
    } catch(error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  }

  const getPublicationStatus = async(publicationId, attempts) => {
    setLoading(true);
    try {
        const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
        const response = await fetch(`api/publication/api/v1/publications/${publicationId}?embed=page_links`, requestOptions);
        const responseJson = await response.json();

        if (responseJson.status === "Complete") {
            setPublicationData(responseJson);
            console.log(responseJson);
            setLoading(false);
            setViewerDisplay("block");
        } else if (responseJson.status === "Failed") {
            throw new Error("Publication failed");
        } else {
            attempts++;
            console.log(`Rendition not ready yet. Sending request #${attempts}.`)
            await asyncTimeout(500);
            return await getPublicationStatus(publicationId, attempts);
        }
    } catch(error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
  }

  const asyncTimeout = (delay) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} sx={{ mt: "2rem" }}>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
          <Button variant="contained" component="label"
          >
            Upload file
            <input type="file" hidden onChange={handleFileSelection} />
          </Button>
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
            {loading && <CircularProgress />}
            {selectedFile && !loading && 
                <>
                    <Box sx={{ display: "inline-flex" }}>{selectedFile.name}</Box>
                    <IconButton 
                        sx={{ display: "inline-flex" }} 
                        onClick={() => getPublicationStatus(publicationId, 1)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </>
            }
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
            <Viewer publicationData={publicationData} viewerDisplay={viewerDisplay} setViewerDisplay={setViewerDisplay} />
        </Grid>
      </Grid>
    </Box>
  )
}