// components/layouts/MemberLayout.jsx
import React from 'react';
import NavBar from '../navigation/Navbar';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';

const MemberLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MemberLayout;
