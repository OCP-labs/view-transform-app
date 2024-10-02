import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  Alert, Box, CircularProgress
} from '@mui/material';
import { Home } from './Home';
import { Header } from './Header';
import './styles/App.css';

const App = () => {
  const {
    activeNavigator,
    error,
    isAuthenticated,
    isLoading,
    signinRedirect,
  } = useAuth();
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        signinRedirect();
      } else if (!isAppLoaded && isAuthenticated) {
        setIsAppLoaded(true);
      }
    }
  }, [isAuthenticated, isLoading, isAppLoaded]);

  switch (activeNavigator) {
    case 'signoutRedirect':
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} />
        </Box>
      );
    default:
  }

  if (error) {
    return (
      <div>
        <Alert severity="error">
          Authentication error:
          {' '}
          {error.message}
        </Alert>
      </div>
    );
  }

  if (!isAppLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default App;
