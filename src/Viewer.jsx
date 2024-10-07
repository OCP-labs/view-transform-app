import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box } from "@mui/material";
import * as bravaTools from "./utilities/bravaTools";

export const Viewer = (props) => {
    const VIEWER_ID = "file-viewer-root";
    const FULL_TOOLBAR_NEEDED = true;

    const { publicationData, viewerDisplay, setViewerDisplay } = props;
    const [ bravaApi, setBravaApi ] = useState();
    const { user } = useAuth();

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

    const getDownloadUrlFromPublication = (publicationJson) => {
      console.log(publicationJson);    
      const createDownloadUrl = (obj) => {
        const urlTemplate = obj._embedded["pa:get_publication_artifacts"][0]._embedded["ac:get_artifact_content"].urlTemplate;
        const id = obj._embedded["pa:get_publication_artifacts"][0]._embedded["ac:get_artifact_content"].contentLinks[0].id;
        const url = urlTemplate.replace(/\{id\}/, id);
        return url;
      }
      const url = createDownloadUrl(publicationJson);
      console.log(url);
      return url;
    }

    const downloadPdf = async(publicationJson) => {
      const url = getDownloadUrlFromPublication(publicationJson);
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
      link.setAttribute('download', 'Export.pdf');
      document.body.appendChild(link);
      link.click();
    }

    useEffect(() => {
      const handleExportDownload = async (e) => {
        await downloadPdf(e.detail);
      }
      const onBravaReady = (e) => {
        window.api = window[e.detail];
        setBravaApi(window.api);
        window.addEventListener(e.detail + '-exportSuccess-download', handleExportDownload);
        console.log(e.detail);
      }
      window.addEventListener("bravaReady", onBravaReady);
      const viewerDiv = document.getElementById(VIEWER_ID);
      viewerDiv.addEventListener("close", closeViewer);
      loadViewer();
      return () => {
        window.removeEventListener("bravaReady", onBravaReady);
        viewerDiv.removeEventListener("close", closeViewer);
        window.removeEventListener(window.viewDetail + '-exportSuccess-download', handleExportDownload);
      }
    }, [loadViewer, closeViewer]);

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
          tabContainerWithMarkups: bravaTools.createTabContainer(FULL_TOOLBAR_NEEDED),
          markupTools: bravaTools.markupTools,
          pdfExport: bravaTools.pdfExport,
          pdfExportActions: bravaTools.pdfExportActions,
          pdfExportDefaults: bravaTools.pdfExportDefaults,
          exportDialogs: ['pdf'],
          pageSizeOptions: bravaTools.exportOptions.pageSizeOptions,
          isoOptions: bravaTools.exportOptions.isoOptions,
          orientationOptions: bravaTools.exportOptions.orientationOptions,
          layerOptions: bravaTools.exportOptions.layerOptions,
          pageOutputOptions: bravaTools.exportOptions.pageOutputOptions,
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