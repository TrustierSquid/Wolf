import React from 'react'
import ReactDOM from 'react-dom/client'
import '/src/assets/stylesheets/index.css'
import '/src/assets/stylesheets/tooltips.css'
import '/src/assets/stylesheets/moodles.css' // moodle css for the home page
import Home from './components/mainComponents/Home'


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Home/>
  </>
)
