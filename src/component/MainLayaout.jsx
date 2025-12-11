import React, { useState, useEffect } from 'react';
import Sidnav from "./Sidnav"
import { Outlet, useLocation } from 'react-router-dom';

function MainLayout() {
  const { pathname } = useLocation();

  // Jika berada di halaman Presensi, sidebar auto hide
  const autoHide = pathname === "/Presensi";

  // Sidebar dibuka manual oleh user
  const [manualOpen, setManualOpen] = useState(false);

  // RESET manualOpen setiap kali pindah halaman
  useEffect(() => {
    setManualOpen(false);
  }, [pathname]);

  // Sidebar disembunyikan hanya jika autoHide + manualOpen masih false
  const hideSidebar = autoHide && !manualOpen;

  return (
    <div className="flex">

      {/* Sidebar wrapper */}
      <div className={`${hideSidebar ? "w-0" : "w-64"} transition-all duration-300`}>
        {!hideSidebar && <Sidnav />}
      </div>

      {/* Tombol tampilkan sidebar (hanya ketika sidebar disembunyikan) */}
      {hideSidebar && (
        <button
          className="fixed top-4 left-4 z-50 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md shadow-md"
          onClick={() => setManualOpen(true)}
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      )}

      {/* Konten utama */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}

export default MainLayout;
