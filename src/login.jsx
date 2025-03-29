import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/index.css'
import '/src/assets/tooltips.css'
import Login from './components/mainComponents/Login'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Login/>
  </React.StrictMode>,
)
