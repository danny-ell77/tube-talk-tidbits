
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the fonts are loaded before rendering the app
document.documentElement.classList.add('font-sans');

createRoot(document.getElementById("root")!).render(<App />);
