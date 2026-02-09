import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loadRuntimeConfig } from '@core/config/runtimeConfig';
import { downloadApiLogAsFile } from '@core/http';
import App from './App';
import './index.css';

if (typeof window !== 'undefined') {
  (window as unknown as { downloadApiLog?: () => void }).downloadApiLog = downloadApiLogAsFile;
}

loadRuntimeConfig().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
