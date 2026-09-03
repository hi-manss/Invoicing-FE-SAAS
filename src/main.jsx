import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BusinessSettingsLauncher from './BusinessSettingsLauncher.jsx'
import HisaaboFeaturePanel from './HisaaboFeaturePanel.jsx'
import HisaaboAnalyticsPanel from './HisaaboAnalyticsPanel.jsx'

function RootEnhancements() {
  const navigate = page => window.dispatchEvent(new CustomEvent('app:navigate',{detail:page}))
  return <><BusinessSettingsLauncher /><HisaaboFeaturePanel onNavigate={navigate}/><div className="pointer-events-none fixed bottom-5 right-20 z-30 hidden w-[min(420px,calc(100vw-7rem))] lg:block"><HisaaboAnalyticsPanel /></div></>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /><RootEnhancements /></React.StrictMode>)
