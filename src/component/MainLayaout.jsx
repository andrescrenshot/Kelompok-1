import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidnav from "./Sidnav";

function MainLayout() {
  const { pathname } = useLocation();
  const hideSidebar = pathname === "/Presensi";

  return (
    <div className="flex min-h-screen bg-transparent">

      {/* SIDEBAR */}
      {!hideSidebar && (
        <div className="w-64 flex-shrink-0">
          <Sidnav />
        </div>
      )}

      {/* KONTEN UTAMA */}
      <div
        className={`flex-1 ${
          hideSidebar ? "p-0" : "p-6"
        } transition-all duration-300`}
      >
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;
