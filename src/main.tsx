import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App.tsx';
import './styles/tokens.css';
import './styles/theme.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
