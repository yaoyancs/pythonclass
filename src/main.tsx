import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AnalyticsRoot } from './analytics/AnalyticsRoot';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AnalyticsRoot>
        <App />
      </AnalyticsRoot>
    </BrowserRouter>
  </StrictMode>,
);
