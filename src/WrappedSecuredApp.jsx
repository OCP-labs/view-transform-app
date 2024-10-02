import { AuthProvider } from 'react-oidc-context';
import App from './App';
import authConfig from './authorization/authConfig';

const WrappedSecuredApp = () => {
  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <AuthProvider {...authConfig}>
      <App />
    </AuthProvider>
  );
}

export default WrappedSecuredApp;