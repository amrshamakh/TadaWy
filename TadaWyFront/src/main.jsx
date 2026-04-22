import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n.js'; 
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/themeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
       <App />
       <ToastContainer position="top-center" autoClose={3000} />
    </AuthProvider>
  </ThemeProvider>
   
   
  </BrowserRouter>,
)
