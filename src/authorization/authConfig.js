const authConfig = {
    authority: `${import.meta.env.VITE_API_BASE_URL}/tenants/${import.meta.env.VITE_TENANT_ID}`,
    client_id: import.meta.env.VITE_PUBLIC_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid',
    post_logout_redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    automaticSilentRenew: true,
    silent_redirect_uri: import.meta.env.VITE_API_REDIRECT_URI,
    onSigninCallback: () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    },
  };
  
  export default authConfig;