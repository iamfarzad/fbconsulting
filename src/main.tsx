
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Initializing application");

try {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("App successfully rendered to DOM");
  } else {
    console.error("Root element not found, cannot mount React application");
  }
} catch (error) {
  console.error("Error initializing application:", error);
}
