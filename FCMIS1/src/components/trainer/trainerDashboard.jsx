import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LogoSmall from '../../assets/logo1s.png'
import Profile from '../../assets/profile.jpg'
import Noti from '../../assets/noti.png'
import axios from 'axios';

const trainerDashboard = () => {
  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const [trainername, settrainername] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError('No token found, please log in.');
        return;
    }

    axios.get('http://localhost:3000/train/trainerprofile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.data.Status) {
            settrainername(response.data.trainer.username);
        } else {
            setError(response.data.Error);
        }
    })
    .catch(err => setError('An error occurred while fetching data.'));
}, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
        .then(response => {
            if (response.data.Status) {
                localStorage.removeItem('token'); // Clear the token from localStorage
                navigate('/trainerlogin');
            }
        })
        .catch(err => console.log(err));
};

  return (
    <div className="min-h-screen flex flex-row bg-#1E1E1E">
      <div className="fixed top-0 left-0 w-64 bg-black h-full shadow-lg overflow-y-auto">
        <div className="flex items-center pl-6 h-20 border-b border-gray-800 ">
          <img
            src={Profile}
            alt="profilde"
            className="rounded-full h-10 w-10 flex items-center justify-center mr-3 border-2 border-blue-500"
          />
          <div className="ml-1">
            <p className="ml-1 text-md font-medium tracking-wide truncate text-gray-100 font-sans">{trainername}</p>
            <div className="badge">
              <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-800 bg-blue-100 rounded-full">Admin</span>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          
          <ul className="flex flex-col py-6 space-y-1">

            <li>
              <Link to="/trainerDashboard/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.64104 0.163528C2.812 0.163528 2.01691 0.540832 1.43069 1.21244C0.844472 1.88404 0.515137 2.79494 0.515137 3.74473L0.515137 21.6507C0.515137 22.6005 0.844472 23.5114 1.43069 24.183C2.01691 24.8546 2.812 25.2319 3.64104 25.2319H22.3964C23.2255 25.2319 24.0205 24.8546 24.6068 24.183C25.193 23.5114 25.5223 22.6005 25.5223 21.6507V3.74473C25.5223 2.79494 25.193 1.88404 24.6068 1.21244C24.0205 0.540832 23.2255 0.163528 22.3964 0.163528H3.64104ZM22.3964 1.95413C22.8109 1.95413 23.2085 2.14278 23.5016 2.47858C23.7947 2.81439 23.9594 3.26983 23.9594 3.74473V7.32593H2.07809V3.74473C2.07809 3.26983 2.24275 2.81439 2.53586 2.47858C2.82897 2.14278 3.22652 1.95413 3.64104 1.95413H22.3964ZM2.07809 21.6507V9.11653H8.32988V23.4413H3.64104C3.22652 23.4413 2.82897 23.2527 2.53586 22.9169C2.24275 22.5811 2.07809 22.1256 2.07809 21.6507ZM9.89283 23.4413V9.11653H23.9594V21.6507C23.9594 22.1256 23.7947 22.5811 23.5016 22.9169C23.2085 23.2527 22.8109 23.4413 22.3964 23.4413H9.89283Z"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Dashboard</span>
              </Link>

            </li>
            <li>
              <Link to="/trainerDashboard/trainerprofile" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Profile</span>
              </Link>
            </li>

            <li>
              <Link to="/trainerDashboard/memberschedule" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Members</span>
              </Link>

            </li>
            <li>
              <Link to="/trainerDashboard/manageschedule" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-6 h-5" fill="" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M7 11c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2s2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 6.993L9 18c.55 0 1-.45 1-1v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2c0 .552.448.993 1 .993zM19 18h-6c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1z"/>
                  <path fill="currentColor" d="M22 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 17.5c0 .28-.22.5-.5.5h-19c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h19c.28 0 .5.22.5.5v15z"/>                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Schedules</span>
              </Link>
            </li>

            <li>
            <Link to="/trainerDashboard/category" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Category</span>
            </Link>
            </li>

            <li>
            <Link to="/trainerDashboard/memberstat" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Member Progress</span>
            </Link>
            </li>

           
            <li onClick={handleLogout}>
            <Link class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-red-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4 text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Logout</span>
            </Link>
            </li>

          </ul>
        </div>
      </div>
  <div className="flex-grow flex flex-col ml-64 pt-9 px-12">

  <div className="h-16 bg-#1E1E1E flex items-center px-6"> {/*shadow-md*/}
    <img src={LogoSmall} alt='image1' className='w-10' />
    <div className="text-sm text-left basis-1/2 pl-2">MUSCLE MAX<br/>FITNESS KINGDOM</div>
    <div className="basis-1/2 text-right flex items-center justify-end space-x-4">
      <Link to="/trainerDashboard/feedback" className="text-sm">Feedback</Link>
      <Link to="/trainerDashboard/trainerprofile" className="text-sm"><img src={Noti} alt='image1' className='w-4' /></Link>
    </div>
  </div>
  <div className="flex-grow p-6 bg-#1E1E1E">
    <Outlet />
  </div>
</div>

    </div>
  );
};

export default trainerDashboard;
