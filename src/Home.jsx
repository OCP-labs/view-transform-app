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

  // Upload file to CSS and initiate publication request 
  const uploadFile = async(file) => {
    try {
      const formData = new FormData();
      formData.append('name', file);
      const requestOptions = { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${user.access_token}` },
        body: formData 
      };
      // Uploading file
      const response = await fetch('css-api/v3/files/fromStream', requestOptions);
      const responseJson = await response.json();
      // Saving CSS id for the file
      setBlobId(responseJson.id);
      const publicationBody = publicationTools.createPublicationBody(file.name, responseJson.mimeType, responseJson.id);

      window.localStorage.setItem("last_blob_id", responseJson.id);

      // Initiate request to Publication Service
      await addNewPublication(publicationBody);
    } catch(error) {
      console.log(error);
      setLoading(false);
    }
  }

  // TODO: Add a new publication with Transformation / Publication Service
  const addNewPublication = async(publicationBodyJson) => {
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
        // Save publication id in order to check when the publication completed
        setPublicationId(responseJson.id);
        window.localStorage.setItem("last_pub_id", responseJson.id);
        setViewFileEnabled(true);
      }
    } catch(error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Check when publication is "Complete"
  const getPublicationStatus = async(publicationId, attempts, redactedVersion) => {
    setLoading(true);
    try {
      const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
      const response = await fetch(`api/publication/api/v1/publications/${publicationId}?embed=page_links`, requestOptions);
      const responseJson = await response.json();
      if (responseJson.status === "Complete") {
        // If we want the redacted version, just download the new document
        if (redactedVersion) {
          await downloadPdf(responseJson, redactedVersion);

        // If we want to load a viewer rendition, then save the entire publication response for use by the Viewing Service JSAPI
        } else {
          setPublicationData(responseJson);
          setLoading(false);
          setViewerDisplay("block");
        }
      } else if (responseJson.status === "Failed") {
        throw new Error("Publication failed");

        // Poll the Transformation / Publication Service until the new publication is complete
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
  
  // Inititiate request for redacted version to the Transformation / Publication Service
  const createRedactedDocument = async() => {
    setLoading(true);
    const filename = selectedFile.name;
    const mimeType = selectedFile.type;
    const cssId = blobId;
    const rawXmlString = publicationTools.createXmlRedactionScript([publicationTools.RedactMacros.SSN, publicationTools.RedactMacros.CREDIT_CARD]);
    const base64EncodedXmlString = btoa(rawXmlString);
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
          
          // Check when new redacted version is "Complete"
          await getPublicationStatus(responseJson.id, attempts, redactedVersion);
        }
    } catch(error) {
      console.log(error);
    }
  }

  // Use download URL from the publication response to download the document from CSS
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
    let filename = 'Export.pdf';
    if (redactedVersion) {
      const createRedactedFilename = (originalFilename) => {
        const index = originalFilename.lastIndexOf(".");
        const baseFilename =  originalFilename.substring(0, index);
        const fileExtension = originalFilename.substring(index);
        const newBaseFilename = baseFilename + "[REDACTED]";
        const newFilename = newBaseFilename + fileExtension;
        return newFilename;
      }
      const originalFilename = selectedFile.name;
      filename = createRedactedFilename(originalFilename);
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }

  // Function for downloading previously uploaded file, intended for testing purposes only
  const downloadTestFile = async() => {
    setLoading(true);
    const requestOptions = { method: 'GET', headers: { 'Authorization': `Bearer ${user.access_token}` } };
    const testBlobId = window.localStorage.getItem("last_blob_id") ? window.localStorage.getItem("last_blob_id") : "48476cb7-3316-421d-b24b-fa9621d8f5a0";
    try {
      const response = await fetch(`css-api/v3/files/${testBlobId}`, requestOptions);
      const responseJson = await response.json();
      setSelectedFile({ name: responseJson.originalFileName, type: responseJson.mimeType });
      const publicationBody = publicationTools.createPublicationBody(responseJson.originalFileName, responseJson.mimeType, responseJson.id);
      setBlobId(responseJson.id);
      const lastPubId = window.localStorage.getItem("last_pub_id");
      if (lastPubId) {
        setPublicationId(lastPubId);
        setViewFileEnabled(true);
        setLoading(false);
      } else {
        await addNewPublication(publicationBody)
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
            import.meta.env.VITE_TESTING === "true" ?
            <Button sx={{ 
              display: "inline-flex",
              width: { xs: "40%", sm: "35%", md: "25%", lg: "15%" }, 
            }} 
              variant="contained" 
              component="label" 
              onClick={downloadTestFile}
            >
              Download
            </Button>
            :
            <Button sx={{ 
              width: { xs: "40%", sm: "35%", md: "25%", lg: "12%" }, 
              display: "inline-flex",
            }} 
              variant="contained" 
              component="label"
            >
              Upload
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
            onClick={() => getPublicationStatus(publicationId, 1, false)}
            disabled={!viewFileEnabled}
          >
            View
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
          <Box sx={{ display: "inline-block", position: "relative" }}>{selectedFile.name}</Box>
        </Box>
      }
      </Box>
      <Grid display="flex" justifyContent="center" alignItems="center" size={12}>
        <Viewer publicationData={publicationData} viewerDisplay={viewerDisplay} setViewerDisplay={setViewerDisplay} downloadPdf={downloadPdf} />
      </Grid>
    </Box>
  )
}