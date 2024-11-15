import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from 'react-oidc-context';
import { Box } from "@mui/material";
import * as bravaTools from "./utilities/bravaTools";

export const Viewer = (props) => {
  const VIEWER_ID = "file-viewer-root";

  const auth = useAuth();
  const { publicationData, viewerDisplay, setViewerDisplay, downloadFile } = props;
  const [ bravaApi, setBravaApi ] = useState();
  const [ viewerDetail, setViewerDetail ] = useState();

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

  // Listening for Viewer events - bravaReady and close
  useEffect(() => {
    const onBravaReady = (e) => {
      window.api = window[e.detail];
      setBravaApi(window.api);
      console.log(e.detail);
      setViewerDetail(e.detail);
    }

    window.addEventListener("bravaReady", onBravaReady);
    const viewerDiv = document.getElementById(VIEWER_ID);
    viewerDiv.addEventListener("close", closeViewer);
    loadViewer();
    return () => {
      window.removeEventListener("bravaReady", onBravaReady);
      viewerDiv.removeEventListener("close", closeViewer);
    }
  }, [loadViewer, closeViewer]);

  // Listening for Viewer event - exportSuccess. This useEffect is separate because it depends on token refresh.
  useEffect(() => {
    const handleExportDownload = async (e) => {
      let filename;
      const exportType = e.detail.tags[0].bravaView;
      switch(exportType) {
        case 'pdfExport':
          filename = 'Export.pdf';
          break;
        case 'tiffExport':
          filename = 'Export.tif';
          break;
        default:
          filename = 'Export.pdf';
      }
      await downloadFile(e.detail, filename);
    };
      window.addEventListener(viewerDetail + "-exportSuccess-download", handleExportDownload);
    return () => {
      window.removeEventListener(viewerDetail + "-exportSuccess-download", handleExportDownload);
    }
  }, [viewerDetail, auth])

  // Configuring the Viewer
  useEffect(() => {
    if (bravaApi) {
      bravaApi.setHttpHeaders({
        Authorization: `Bearer ${auth.user.access_token}`
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
      bravaApi.setUserName(auth.user.profile.name);
      bravaApi.setScreenWatermark("DevEx Viewer");
  
      bravaApi.setLayout({
        topToolbar: 'toolbarWithMarkupStuff',
        toolbarWithMarkupStuff: bravaTools.toolbarWithMarkupStuff,
        mainContainer: [
          { component: 'TabContainer', layoutKey: 'tabContainerWithMarkups' },
          { component: 'PageContainer' }
        ],
        onSearchClearSetActiveTab: {
          layoutKey: 'tabContainerWithMarkups',
          title: 'tab.thumbnails'
        },
        onSearchResultsSetActiveTab: {
          layoutKey: 'tabContainerWithMarkups',
          title: 'tab.searchResults'
        },
        tabContainerWithMarkups: bravaTools.tabContainerWithMarkups,
        markupTools: bravaTools.markupTools,
        tiffExport: bravaTools.tiffExport,
        tiffExportDefaults: bravaTools.tiffExportDefaults,
        exportDialogs: ['tiff'],
        searchOptions: bravaTools.searchOptions,
        pageSizeOptions: bravaTools.exportOptions.pageSizeOptions,
        isoOptions: bravaTools.exportOptions.isoOptions,
        orientationOptions: bravaTools.exportOptions.orientationOptions,
        layerOptions: bravaTools.exportOptions.layerOptions,
        pageOutputOptions: bravaTools.exportOptions.pageOutputOptions,
        compressionOptions: bravaTools.exportOptions.compressionOptions,
        colorConversionOptions: bravaTools.exportOptions.colorConversionOptions,
        colorDepthOptions: bravaTools.exportOptions.colorDepthOptions
      });
      bravaApi.addPublication(publicationData, true);
      bravaApi.render(VIEWER_ID); 
    }
  }, [bravaApi, publicationData, auth]);

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