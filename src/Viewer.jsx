import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import * as bravaTools from "./utilities/bravaTools";

export const Viewer = (props) => {
    const VIEWER_ID = "file-viewer-root";

    const { publicationData, viewerDisplay, setViewerDisplay } = props;
    const [ bravaApi, setBravaApi ] = useState();
    const { user } = useAuth();

    const onBravaReady = (e) => {
        window.api = window[e.detail];
        setBravaApi(window.api);
        console.log(e.detail);
    }

    const loadViewer = useCallback(async () => {
        const requestOptions = { method: 'GET' };
        const response = await fetch('api/viewer/api/v1/viewers/brava-view-1.x/loader', requestOptions);
        const script = document.createElement('script');
        script.src = response.url;
        document.body.appendChild(script);
      // eslint-disable-next-line
      }, []);

    const closeViewer = useCallback(() => {
        setViewerDisplay("none");
    }, [setViewerDisplay]);

    useEffect(() => {
      window.addEventListener("bravaReady", onBravaReady);
      loadViewer();
      return () => {
        window.removeEventListener("bravaReady", onBravaReady);
      }
    }, [loadViewer]);

    useEffect(() => {
      const viewerDiv = document.getElementById(VIEWER_ID);
      viewerDiv.addEventListener("close", closeViewer);
      return () => {
        viewerDiv.removeEventListener("close", closeViewer);
      }
    }, [closeViewer]);

    useEffect(() => {
      if (bravaApi) {
        bravaApi.setHttpHeaders({
          Authorization: `Bearer ${user.access_token}`
        });
        bravaApi.setScreenBanner(
          "Viewer Service by OpenText | Document Viewed at %Time"
        );
        bravaApi.enableMarkup(true);
        bravaApi.editableMarkupPredicate = () => true;
        bravaApi.commentableMarkupPredicate = () => true;
        bravaApi.DisplayToolPropertyPredicate = () => true;
        bravaApi.deletableMarkupPredicate = () => true;
        bravaApi.deletableStampPredicate = () => true;
        bravaApi.editableStampPredicate = () => true;
        bravaApi.addableStampPredicate = () => true;
        bravaApi.setSearchHost(import.meta.env.VITE_API_BASE_URL);
        bravaApi.setSearchApiPrefix('highlight/search');
        bravaApi.setMarkupHost(import.meta.env.VITE_API_BASE_URL);
        bravaApi.setPublishingHost(import.meta.env.VITE_API_BASE_URL);
        bravaApi.setUserName(user.profile.name);
        bravaApi.setScreenWatermark("DevEx Viewer");
    
        bravaApi.setLayout({
          topToolbar: 'toolbarWithMarkupStuff',
          toolbarWithMarkupStuff: bravaTools.toolbarWithMarkupStuff,
          mainContainer: [
            { component: 'TabContainer', layoutKey: 'tabContainerWithMarkups' },
            { component: 'PageContainer' }
          ],
          tabContainerWithMarkups: bravaTools.createTabContainer(true),
          markupTools: bravaTools.markupTools
          });
          bravaApi.addPublication(publicationData, true);
          bravaApi.render(VIEWER_ID); 
      }
    }, [bravaApi, publicationData]);

    return (
      <Box
        sx={{ 
          display: viewerDisplay, 
          height: { xs: "100vh", md: "90vh" }, 
          width: { xs: "100vw", md: "90vw" },
          position: { xs: "fixed", md: "absolute" }, 
          zIndex: { xs: 1, md: "auto" },
          left: { xs: 0, md: "auto" },
          top: { xs: 0, md: 80 }
        }}
      >
        <div 
          id={VIEWER_ID} 
          style={{ 
          display: viewerDisplay, 
          height: "100%",
          width: "100%"
        }}
        >
        </div>
      </Box>
    )
}