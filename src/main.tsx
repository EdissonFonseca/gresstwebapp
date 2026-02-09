import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { downloadApiLogAsFile } from '@core/http';
import App from './App';
import './index.css';

if (typeof window !== 'undefined') {
  (window as unknown as { downloadApiLog?: () => void }).downloadApiLog = downloadApiLogAsFile;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
