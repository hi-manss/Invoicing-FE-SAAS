import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProfileLauncher from './ProfileLauncher.jsx'

createRoot(document.getElementById('root')).render(<React.StrictMode><App /><ProfileLauncher /></React.StrictMode>)
