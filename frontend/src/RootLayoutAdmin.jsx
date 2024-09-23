import React from "react";
import AdminLeftNav from "./components/admin/AdminLeftNav.jsx";
import { Outlet } from "react-router-dom";
import AdminHeader from './components/admin/AdminHeader.jsx';
const RootLayoutAdmin = () => {
  return (
    <div className="w-full h-screen flex overflow-hidden relative">
      {/* Sidebar */}
      <div className="relative z-10">
        <AdminLeftNav />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto z-0">
        <AdminHeader />
        <main className="p-4 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayoutAdmin;
