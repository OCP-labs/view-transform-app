import React, { useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box, Button, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import * as publicationTools from "./utilities/publicationTools";
import { Viewer } from "./Viewer";

export const Home = () => {
  const { user } = useAuth();
  const [ publicationData, setPublicationData ] = useState();
  const [ viewerDisplay, setViewerDisplay ] = useState("none");
  const [ selectedFile, setSelectedFile ] = useState();
  const [ publicationId, setPublicationId ] = useState();
  const [ blobId, setBlobId ] = useState();
  const [ viewFileEnabled, setViewFileEnabled ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const TESTING = true;
  const TEST_PUBLICATION_ID = "0635468b-ebd2-4d4b-86a6-1434c61603ab";
  const TEST_FILENAME = "Standard Contract [RISK = 5-VERY HIGH].pdf";

  const handleFileSelection = async(e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setViewFileEnabled(false);
      setLoading(true);
      setSelectedFile(file);
      await uploadFile(file);
    }
    e.target.value = null;
  }

  const uploadFile = async(file) => {
    try {
      const formData = new FormData();
      formData.append('name', file);
      const requestOptions = { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${user.access_token}` },
        body: formData 
      };
      const response = await fetch('css-api/v3/files/fromStream', requestOptions);
      const responseJson = await response.json();
      const publicationBody = publicationTools.createPublicationBody(file.name, responseJson.mimeType, responseJson.id);
      setBlobId(responseJson.id);
      await addPublication(publicationBody);
    } catch(error) {
      console.log(error);
      setLoading(false);
    }
  }

  const addPublication = async(publicationBodyJson) => {
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
        setViewFileEnabled(true);
        console.log(responseJson.id);
      }
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getPublicationStatus = async(publicationId, attempts, redactedVersion) => {
    setLoading(true);
    try {
      const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
      const response = await fetch(`api/publication/api/v1/publications/${publicationId}?embed=page_links`, requestOptions);
      const responseJson = await response.json();
      if (responseJson.status === "Complete") {
        if (redactedVersion) {
          await downloadPdf(responseJson, redactedVersion);
        } else {
          setPublicationData(responseJson);
          setLoading(false);
          setViewerDisplay("block");
        }
      } else if (responseJson.status === "Failed") {
        throw new Error("Publication failed");
      } else {
        attempts++;
        console.log(`Rendition not ready yet. Sending request #${attempts}.`)
        const asyncTimeout = (delay) => {
          return new Promise((resolve) => {
            setTimeout(resolve, delay);
          })
        }
        await asyncTimeout(500);
        return await getPublicationStatus(publicationId, attempts, redactedVersion);
      }
    } catch(error) {
      console.log(error);
    } finally {
        setLoading(false);
    }
  }
  
  const createRedactedDocument = async() => {
    setLoading(true);
    const filename = TESTING ? TEST_FILENAME : selectedFile.name;
    const mimeType = TESTING ? "application/pdf" : selectedFile.type;
    const cssId = TESTING ? publicationData.featureSettings[0].value[0].url.split("/")[5] : blobId;
    const base64EncodedXmlString = btoa(publicationTools.xmlRedactionScriptString);
    const publicationBody = publicationTools.createRedactedPublicationBody(filename, mimeType, cssId, base64EncodedXmlString);

    try {
      const requestOptions = { 
        method: 'POST', 
        headers: { 
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(publicationBody)
      };
      const response = await fetch('api/publication/api/v1/publications', requestOptions);
      const responseJson = await response.json();
        if (!responseJson.id) {
          throw new Error("Publication failed");
        } else {
          const attempts = 1;
          const redactedVersion = true;
          await getPublicationStatus(responseJson.id, attempts, redactedVersion);
        }
    } catch(error) {
      console.log(error);
    }
  }

  const downloadPdf = async(publicationJson, redactedVersion) => {
    const url = publicationTools.getDownloadUrlFromPublication(publicationJson, redactedVersion);
    const index = url.indexOf('v3');
    const pathForProxy = url.substring(index);
    const requestOptions = {
      method: 'GET',
      headers: { 'Accept': 'application/octet-stream', 'Authorization': `Bearer ${user.access_token}` },
      responseType: 'blob'
    };
    const response = await fetch(`css-api/${pathForProxy}`, requestOptions);
    const responseBlob = await response.blob();
    const objectUrl = URL.createObjectURL(responseBlob);
    const link = document.createElement('a');
    link.href = objectUrl;
    const createRedactedFilename = (originalFilename) => {
      const index = originalFilename.lastIndexOf(".");
      const baseFilename =  originalFilename.substring(0, index);
      const fileExtension = originalFilename.substring(index);
      const newBaseFilename = baseFilename + "[REDACTED]";
      const newFilename = newBaseFilename + fileExtension;
      return newFilename;
    }
    const originalFilename = TESTING ? TEST_FILENAME : selectedFile.name;
    const newFilename = createRedactedFilename(originalFilename);
    link.setAttribute('download', newFilename);
    document.body.appendChild(link);
    link.click();
}

  const getTestPublication = async () => {
    setLoading(true);
    const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
    const response = await fetch(`api/publication/api/v1/publications/${TEST_PUBLICATION_ID}?embed=page_links`, requestOptions);
    const responseJson = await response.json();
    setPublicationData(responseJson);
    setViewerDisplay("block");
    setLoading(false);
  }

  const downloadTestFile = async() => {
    setLoading(true);
    const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
    const response = await fetch(`api/publication/api/v1/publications/${TEST_PUBLICATION_ID}`, requestOptions);
    const responseJson = await response.json();
    setSelectedFile(responseJson);
    setViewFileEnabled(true);
    setLoading(false);
  }

  return (
    <Box sx={{ height: "100vh" }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        flexDirection: "column", 
        height:"60%", 
        width: "100%" 
        }}
      >
        <Box sx={{ 
          display: "flex", 
          position: "absolute", 
          flexDirection: "row", 
          width: "100%",
          justifyContent: "center", 
          alignItems: "center", 
        }}>
          {
            TESTING ?
            <Button sx={{ 
              display: "inline-flex",
              width: { xs: "40%", sm: "35%", md: "25%", lg: "15%" }, 
            }} 
              variant="contained" 
              component="label" 
              onClick={downloadTestFile}
            >
              Download file
            </Button>
            :
            <Button sx={{ 
              width: { xs: "40%", sm: "35%", md: "25%", lg: "12%" }, 
              display: "inline-flex",
            }} 
              variant="contained" 
              component="label"
            >
              Upload file
              <input type="file" hidden onChange={handleFileSelection} />
            </Button>
          }
          <Button sx={{ 
            display: "inline-flex", 
            width: { xs: "40%", sm: "35%", md: "25%", lg: "12%" },
            margin: "0.5rem"
          }} 
            variant="contained" 
            component="label"
            onClick={TESTING ? () => getTestPublication(): () => getPublicationStatus(publicationId, 1, false)}
            disabled={!viewFileEnabled}
          >
            View File
          </Button>
          <Button sx={{ 
            display: "inline-flex", 
            width: { xs: "40%", sm: "35%", md: "25%", lg: "12%" },
          }} 
            variant="contained" 
            component="label"
            disabled={!viewFileEnabled}
            onClick={createRedactedDocument}
          >
            Redact
          </Button>
        </Box>
        {loading && <CircularProgress sx={{ position: "relative", top: 50 }} />}
        {selectedFile && !loading && 
        <Box sx={{ position: "relative", top: 50 }} >
          {TESTING ?
          <Box sx={{ display: "inline-block", position: "relative" }}>{selectedFile.featureSettings[0].value[0].filenameHint}</Box>
          :
          <Box sx={{ display: "inline-block", position: "relative" }}>{selectedFile.name}</Box>
          }
        </Box>
      }
      </Box>
      <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
        <Viewer publicationData={publicationData} viewerDisplay={viewerDisplay} setViewerDisplay={setViewerDisplay} />
      </Grid>
    </Box>
  )
}