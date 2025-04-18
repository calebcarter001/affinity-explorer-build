import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar className="h-16 flex-shrink-0" /> {/* Fixed 64px height */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 