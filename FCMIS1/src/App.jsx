import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/login'
import Dashboard from './components/dashboard'
import Home from './components/home'
import Profile from './components/profile'
import Member from './components/member'
import Attendance from './components/attendance'
import Payment from './components/payments'
import Equipment from './components/equipment'
import Package from './components/packages'
import Trainer from './components/trainer'
import Schedule from './components/schedule'
import Announcment from './components/announcement'
import Report from './components/report'
import Feedback from './components/feedback'
import AddPackage from './components/addPackage'
import AddMember from './components/addMember'
import AddTrainer from './components/addTrainer'
import EditMember from './components/editMember'



import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/adminlogin' element={<Login/>}></Route>

        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='/dashboard/' element={<Home/>}></Route>
          <Route path='/dashboard/profile' element={<Profile/>}></Route>
          <Route path='/dashboard/member' element={<Member/>}></Route>
          <Route path='/dashboard/attendance' element={<Attendance/>}></Route>
          <Route path='/dashboard/payment' element={<Payment/>}></Route>        
          <Route path='/dashboard/equipment' element={<Equipment/>}></Route>
          <Route path='/dashboard/package' element={<Package/>}></Route>
          <Route path='/dashboard/trainer' element={<Trainer/>}></Route>
          <Route path='/dashboard/schedule' element={<Schedule/>}></Route> 
          <Route path='/dashboard/announcement' element={<Announcment/>}></Route>
          <Route path='/dashboard/report' element={<Report/>}></Route>  
          <Route path='/dashboard/feedback' element={<Feedback/>}></Route>
          <Route path='/dashboard/add_package' element={<AddPackage/>}></Route>
          <Route path='/dashboard/add_member' element={<AddMember/>}></Route>
          <Route path='/dashboard/add_trainer' element={<AddTrainer/>}></Route>
          <Route path='/dashboard/edit_member/:memberID' element={<EditMember/>}></Route>

        </Route>
      </Routes>
    </BrowserRouter>
    
    

  )
}

export default App
