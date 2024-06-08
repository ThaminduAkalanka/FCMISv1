// App.jsx
import './App.css';
import Login from './components/login';
import MemberLogin from './components/memberLogin';
import TrainerLogin from './components/trainer/trainerlogin';

import Dashboard from './components/dashboard';
import Home from './components/home';
import Profile from './components/profile';
import Member from './components/member';
import Status from './components/membershipStatus';
import Attendance from './components/attendance';
import Payment from './components/payments';
import Equipment from './components/equipment';
import Package from './components/packages';
import Trainer from './components/trainer';
import Schedule from './components/schedule';
import Announcement from './components/announcement';
import Report from './components/report';
import Feedback from './components/feedback';
import AddPackage from './components/addPackage';
import AddMember from './components/addMember';
import AddTrainer from './components/addTrainer';
import EditMember from './components/editMember';
import AddPayment from './components/addPayment';
import EditPackage from './components/editPackage';
import EditTrainer from './components/editTrainer';
import AddEquipment from './components/addEquipment';
import EditEquipment from './components/editEquipment';
import AddAnnouncement from './components/addAnnouncement';

import ScanQR from './components/scanQR';
import Home1 from "./Pages/Home";
import MemberProfile from "./Pages/memberProfile";
import Schedule1 from "./Pages/Schedule";
import Update from "./Pages/update";
import Contact from "./Pages/Contact";
import MemberPackage from "./Pages/memberPackage";
import Classes from "./Pages/Classes";
import AdminLayout from './components/layouts/AdminLayout';
import MemberLayout from './components/layouts/MemberLayout';
import ScrollToTop from "./components/ScrollToTop";

import TrainerDashboard from './components/trainer/trainerDashboard';
import TrainerHome from './components/trainer/trainerHome';


import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/memberlogin' element={<MemberLogin />} />
        <Route path='/trainerlogin' element={<TrainerLogin />} />
        
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='/dashboard/' element={<Home />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route path='/dashboard/member' element={<Member />} />
          <Route path='/dashboard/status' element={<Status />} />
          <Route path='/dashboard/attendance' element={<Attendance />} />
          <Route path='/dashboard/payment' element={<Payment />} />
          <Route path='/dashboard/equipment' element={<Equipment />} />
          <Route path='/dashboard/package' element={<Package />} />
          <Route path='/dashboard/trainer' element={<Trainer />} />
          <Route path='/dashboard/schedule' element={<Schedule />} />
          <Route path='/dashboard/announcement' element={<Announcement />} />
          <Route path='/dashboard/report' element={<Report />} />
          <Route path='/dashboard/feedback' element={<Feedback />} />
          <Route path='/dashboard/add_package' element={<AddPackage />} />
          <Route path='/dashboard/add_member' element={<AddMember />} />
          <Route path='/dashboard/add_trainer' element={<AddTrainer />} />
          <Route path='/dashboard/add_equipment' element={<AddEquipment />} />
          <Route path='/dashboard/add_announcement' element={<AddAnnouncement />} />
          <Route path='/dashboard/add_payment/:memberID' element={<AddPayment />} />
          <Route path='/dashboard/edit_member/:memberID' element={<EditMember />} />
          <Route path='/dashboard/edit_package/:packageID' element={<EditPackage />} />
          <Route path='/dashboard/edit_trainer/:trainerID' element={<EditTrainer />} />
          <Route path='/dashboard/edit_equipment/:equipmentID' element={<EditEquipment />} />
          <Route path='/dashboard/scanqr' element={<ScanQR />} />
        </Route>

        <Route path='/member' element={<MemberLayout />}>
          <Route path='/member/' element={<Home1 />} />
          <Route path='/member/about' element={<MemberProfile />} />
          <Route path='/member/schedule' element={<Schedule1 />} />
          <Route path='/member/update' element={<Update />} />
          <Route path='/member/contact' element={<Contact />} />
          <Route path='/member/memberpackage' element={<MemberPackage />} />
          <Route path='/member/classes' element={<Classes />} />
        </Route>

        <Route path='/trainerDashboard' element={<TrainerDashboard />}>
          <Route path='/trainerDashboard/' element={<TrainerHome />} />

        </Route>




      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
