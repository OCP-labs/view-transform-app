# View and Transform

This app showcases OpenText's Viewing and Transformation Services. It allows the user to upload a file, view it with the web Viewer, add user-defined markup, and export new versions. It also includes a button to programmatically redact Social Security and credit card numbers found in a document. The app uses OAuth2 for authentication, with OpenText Directory Services as the identity provider. 

To get started:
1. Add an .env file to the root folder with the following variables defined:
    * VITE_APP_BASE_URL=
    * VITE_TENANT_ID=
    * VITE_PUBLIC_CLIENT_ID=
    * VITE_REDIRECT_URI=
2. (Optional) If you would like to test on an already uploaded file, add VITE_TESTING=true to the .env file. This will allow the user to download the last uploaded file rather than uploading a new one.
3. Run `npm install` to install all dependencies.
4. Run `npm run dev` to start the app.

By default, the app runs on port 6500, but this can be changed in vite.config.js.

