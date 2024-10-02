import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WrappedSecuredApp from './WrappedSecuredApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WrappedSecuredApp />
  </StrictMode>,
)
