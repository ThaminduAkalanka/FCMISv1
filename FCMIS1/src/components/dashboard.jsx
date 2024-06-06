import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import LogoSmall from '../assets/logo1s.png'
import Profile from '../assets/profile.jpg'
import Noti from '../assets/noti.png'
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const [adminname, setAdminname] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError('No token found, please log in.');
        return;
    }

    axios.get('http://localhost:3000/auth/adminprofile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.data.Status) {
            setAdminname(response.data.admin.username);
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
                navigate('/adminlogin');
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
            <p className="ml-1 text-md font-medium tracking-wide truncate text-gray-100 font-sans">{adminname}</p>
            <div className="badge">
              <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-800 bg-blue-100 rounded-full">Admin</span>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          
          <ul className="flex flex-col py-6 space-y-1">

            <li>
              <Link to="/dashboard" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.64104 0.163528C2.812 0.163528 2.01691 0.540832 1.43069 1.21244C0.844472 1.88404 0.515137 2.79494 0.515137 3.74473L0.515137 21.6507C0.515137 22.6005 0.844472 23.5114 1.43069 24.183C2.01691 24.8546 2.812 25.2319 3.64104 25.2319H22.3964C23.2255 25.2319 24.0205 24.8546 24.6068 24.183C25.193 23.5114 25.5223 22.6005 25.5223 21.6507V3.74473C25.5223 2.79494 25.193 1.88404 24.6068 1.21244C24.0205 0.540832 23.2255 0.163528 22.3964 0.163528H3.64104ZM22.3964 1.95413C22.8109 1.95413 23.2085 2.14278 23.5016 2.47858C23.7947 2.81439 23.9594 3.26983 23.9594 3.74473V7.32593H2.07809V3.74473C2.07809 3.26983 2.24275 2.81439 2.53586 2.47858C2.82897 2.14278 3.22652 1.95413 3.64104 1.95413H22.3964ZM2.07809 21.6507V9.11653H8.32988V23.4413H3.64104C3.22652 23.4413 2.82897 23.2527 2.53586 22.9169C2.24275 22.5811 2.07809 22.1256 2.07809 21.6507ZM9.89283 23.4413V9.11653H23.9594V21.6507C23.9594 22.1256 23.7947 22.5811 23.5016 22.9169C23.2085 23.2527 22.8109 23.4413 22.3964 23.4413H9.89283Z"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Dashboard</span>
              </Link>

            </li>
            <li>
              <Link to="/dashboard/profile" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Profile</span>
              </Link>
            </li>

            <li>
              <Link to="/dashboard/member" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Members</span>
              </Link>

            </li>
            <li>
              <Link to="/dashboard/status" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-6 h-5" fill="" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M7 11c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2s2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 6.993L9 18c.55 0 1-.45 1-1v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2c0 .552.448.993 1 .993zM19 18h-6c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1z"/>
                  <path fill="currentColor" d="M22 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 17.5c0 .28-.22.5-.5.5h-19c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h19c.28 0 .5.22.5.5v15z"/>                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Membership Status</span>
              </Link>
            </li>

            <li>
            <Link to="/dashboard/payment" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Payments</span>
            </Link>
            </li>

            <li>
              <Link to="/dashboard/attendance" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-6 h-5" fill="" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M7 11c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2s2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 6.993L9 18c.55 0 1-.45 1-1v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2c0 .552.448.993 1 .993zM19 18h-6c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1z"/>
                  <path fill="currentColor" d="M22 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 17.5c0 .28-.22.5-.5.5h-19c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h19c.28 0 .5.22.5.5v15z"/>                  </svg>
                </span>
                <span className="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Attendance</span>
              </Link>
            </li>
            
            <li>
            <Link to="/dashboard/equipment" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-red-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-5 h-5" fill="none" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.2192 16.0796L25.0072 14.2916L23.2192 12.5036L18.7554 16.9674L8.03981 6.2518L12.5036 1.78801L10.7156 0L8.92757 1.78801L7.13955 0L4.46378 2.67577L2.67577 0.887755L0.887755 2.67577L2.67577 4.46378L0 7.13955L1.78801 8.92757L0 10.7156L1.78801 12.5036L6.2518 8.03981L16.9674 18.7554L12.5036 23.2192L14.2916 25.0072L16.0796 23.2192L17.8676 25.0072L20.5434 22.3314L22.3314 24.1194L24.1194 22.3314L22.3314 20.5434L25.0072 17.8676L23.2192 16.0796Z" fill="currentColor"/>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Equipments</span>
            </Link>
            </li>

            <li>
            <Link to="/dashboard/package" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-red-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-5 h-6" fill="none" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1035_1078)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.9642 9.6294C17.037 9.70217 17.0947 9.78861 17.1341 9.88379C17.1735 9.97896 17.1938 10.081 17.1938 10.184C17.1938 10.2871 17.1735 10.3891 17.1341 10.4843C17.0947 10.5795 17.037 10.6659 16.9642 10.7387L12.2754 15.439C12.2028 15.512 12.1166 15.5698 12.0216 15.6093C11.9267 15.6488 11.8249 15.6691 11.7221 15.6691C11.6193 15.6691 11.5175 15.6488 11.4226 15.6093C11.3276 15.5698 11.2414 15.512 11.1688 15.439L8.82439 13.0888C8.75173 13.016 8.6941 12.9295 8.65478 12.8344C8.61545 12.7392 8.59521 12.6372 8.59521 12.5342C8.59521 12.4312 8.61545 12.3292 8.65478 12.234C8.6941 12.1389 8.75173 12.0524 8.82439 11.9796C8.89705 11.9067 8.98331 11.8489 9.07824 11.8095C9.17317 11.7701 9.27492 11.7498 9.37768 11.7498C9.48043 11.7498 9.58218 11.7701 9.67711 11.8095C9.77204 11.8489 9.8583 11.9067 9.93096 11.9796L11.7221 13.7766L15.8577 9.6294C15.9303 9.55644 16.0165 9.49856 16.1114 9.45907C16.2064 9.41957 16.3082 9.39925 16.4109 9.39925C16.5137 9.39925 16.6155 9.41957 16.7105 9.45907C16.8054 9.49856 16.8916 9.55644 16.9642 9.6294Z" fill="currentColor"/>
                <path d="M4.68883 0H20.3183C21.1474 0 21.9424 0.330141 22.5287 0.917796C23.1149 1.50545 23.4442 2.30248 23.4442 3.13355V21.9349C23.4442 22.7659 23.1149 23.563 22.5287 24.1506C21.9424 24.7383 21.1474 25.0684 20.3183 25.0684H4.68883C3.85979 25.0684 3.0647 24.7383 2.47848 24.1506C1.89226 23.563 1.56293 22.7659 1.56293 21.9349V20.3681H3.12588V21.9349C3.12588 22.3504 3.29054 22.7489 3.58365 23.0427C3.87676 23.3366 4.27431 23.5016 4.68883 23.5016H20.3183C20.7328 23.5016 21.1304 23.3366 21.4235 23.0427C21.7166 22.7489 21.8813 22.3504 21.8813 21.9349V3.13355C21.8813 2.71802 21.7166 2.3195 21.4235 2.02567C21.1304 1.73185 20.7328 1.56678 20.3183 1.56678H4.68883C4.27431 1.56678 3.87676 1.73185 3.58365 2.02567C3.29054 2.3195 3.12588 2.71802 3.12588 3.13355V4.70033H1.56293V3.13355C1.56293 2.30248 1.89226 1.50545 2.47848 0.917796C3.0647 0.330141 3.85979 0 4.68883 0V0Z" fill="currentColor"/>
                <path d="M1.56295 7.83388V7.05049C1.56295 6.84273 1.64528 6.64347 1.79184 6.49655C1.93839 6.34964 2.13716 6.26711 2.34442 6.26711C2.55168 6.26711 2.75045 6.34964 2.89701 6.49655C3.04356 6.64347 3.1259 6.84273 3.1259 7.05049V7.83388H3.90737C4.11463 7.83388 4.3134 7.91642 4.45996 8.06333C4.60651 8.21024 4.68885 8.4095 4.68885 8.61727C4.68885 8.82504 4.60651 9.02429 4.45996 9.17121C4.3134 9.31812 4.11463 9.40066 3.90737 9.40066H0.781475C0.574215 9.40066 0.375443 9.31812 0.228889 9.17121C0.0823337 9.02429 0 8.82504 0 8.61727C0 8.4095 0.0823337 8.21024 0.228889 8.06333C0.375443 7.91642 0.574215 7.83388 0.781475 7.83388H1.56295ZM1.56295 12.5342V11.7508C1.56295 11.5431 1.64528 11.3438 1.79184 11.1969C1.93839 11.05 2.13716 10.9674 2.34442 10.9674C2.55168 10.9674 2.75045 11.05 2.89701 11.1969C3.04356 11.3438 3.1259 11.5431 3.1259 11.7508V12.5342H3.90737C4.11463 12.5342 4.3134 12.6167 4.45996 12.7637C4.60651 12.9106 4.68885 13.1098 4.68885 13.3176C4.68885 13.5254 4.60651 13.7246 4.45996 13.8715C4.3134 14.0184 4.11463 14.101 3.90737 14.101H0.781475C0.574215 14.101 0.375443 14.0184 0.228889 13.8715C0.0823337 13.7246 0 13.5254 0 13.3176C0 13.1098 0.0823337 12.9106 0.228889 12.7637C0.375443 12.6167 0.574215 12.5342 0.781475 12.5342H1.56295ZM1.56295 17.2345V16.4511C1.56295 16.2434 1.64528 16.0441 1.79184 15.8972C1.93839 15.7503 2.13716 15.6678 2.34442 15.6678C2.55168 15.6678 2.75045 15.7503 2.89701 15.8972C3.04356 16.0441 3.1259 16.2434 3.1259 16.4511V17.2345H3.90737C4.11463 17.2345 4.3134 17.3171 4.45996 17.464C4.60651 17.6109 4.68885 17.8102 4.68885 18.0179C4.68885 18.2257 4.60651 18.4249 4.45996 18.5719C4.3134 18.7188 4.11463 18.8013 3.90737 18.8013H0.781475C0.574215 18.8013 0.375443 18.7188 0.228889 18.5719C0.0823337 18.4249 0 18.2257 0 18.0179C0 17.8102 0.0823337 17.6109 0.228889 17.464C0.375443 17.3171 0.574215 17.2345 0.781475 17.2345H1.56295Z" fill="currentColor"/>
                </g>
                <defs>
                <clipPath id="clip0_1035_1078">
                <rect width="25.0072" height="25.0684" fill="currentColor"/>
                </clipPath>
                </defs>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Packages</span>
            </Link>
            </li>

            <li>
            <Link to="/dashboard/trainer" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-red-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Trainers</span>
            </Link>
            </li>

            <li>
            <Link to="/dashboard/schedule" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-red-500 pr-6">
                <span class="inline-flex justify-center items-center ml-4">
                <svg class="w-6 h-5" fill="none" stroke="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.3333 4C22.0697 4 22.6667 4.59696 22.6667 5.33333V6.66667H25.3333C26.8061 6.66667 28 7.86057 28 9.33333V25.3333C28 26.8061 26.8061 28 25.3333 28H6.66667C5.19391 28 4 26.8061 4 25.3333V9.33333C4 7.86057 5.19391 6.66667 6.66667 6.66667H9.33333V5.33333C9.33333 4.59696 9.93028 4 10.6667 4C11.4031 4 12 4.59696 12 5.33333V6.66667H20V5.33333C20 4.59696 20.5969 4 21.3333 4ZM25.3333 9.33333H6.66667V25.3333H25.3333V9.33333ZM19.7655 12.505C20.2861 11.9843 21.1304 11.9843 21.6511 12.505C22.1719 13.0257 22.1719 13.8699 21.6511 14.3905L15.0609 20.9808C14.5349 21.5067 13.6823 21.5067 13.1564 20.9808L10.3374 18.1619C9.81671 17.6411 9.81671 16.7969 10.3374 16.2761C10.8581 15.7555 11.7023 15.7555 12.223 16.2761L14.1087 18.1619L19.7655 12.505Z" fill="currentColor"/>
                </svg>
                </span>
                <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Schedules</span>
            </Link>
            </li>

            <li>
                <Link to="/dashboard/announcement" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Annoucements</span>
                </Link>
            </li>

            <li>
                <Link to="/dashboard/report" class="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-700 text-gray-500 hover:text-gray-200 border-l-4 border-transparent hover:border-blue-500 pr-6">
                    <span class="inline-flex justify-center items-center ml-4">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    </span>
                    <span class="ml-2 font-semibold text-sm tracking-wide truncate font-sans">Repotrs</span>
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
      <Link to="/dashboard/feedback" className="text-sm">Feedback</Link>
      <Link to="/dashboard/profile" className="text-sm"><img src={Noti} alt='image1' className='w-4' /></Link>
    </div>
  </div>
  <div className="flex-grow p-6 bg-#1E1E1E">
    <Outlet />
  </div>
</div>

    </div>
  );
};

export default Dashboard;
