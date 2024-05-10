import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/login'
import Dashboard from './components/dashboard'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/adminlogin' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
      
      </Routes>
    </BrowserRouter>
    
    

  )
}

export default App
