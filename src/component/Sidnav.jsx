import { useState } from "react";
import { useLocation } from "react-router-dom";

function Sidnav() {
  const [open, setOpen] = useState(false);
  const location = useLocation(); // Supaya kita bisa cek path
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 text-white bg-blue-900 p-2 rounded-md md:hidden"
        onClick={() => setOpen(!open)}
      >
        <i className="ri-menu-line text-2xl"></i>
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out md:translate-x-0
          flex flex-col justify-between`}
      >
        <div>
          <div className="text-xl font-bold mb-8 text-center bg-blue-800 py-5 h-18">
            <i className="ri-bar-chart-grouped-line"></i> Statistik Data
          </div>

          <nav className="space-y-3 px-3">
            <a
              href="/Dasboard"
              className={`block py-3 px-4 font-bold text-lg rounded-xl transition-all duration-300 ${
                isActive("/Dasboard")
                  ? "bg-blue-600 shadow-inner text-white"
                  : "hover:bg-blue-600 hover:translate-x-1"
              }`}
            >
              <i className="ri-dashboard-line text-lg"></i> Dasboard
            </a>
            <a
              href="/Daftar"
              className={`block py-3 px-4 font-bold text-lg rounded-xl transition-all duration-300 ${
                isActive("/Daftar")
                  ? "bg-blue-600 shadow-inner text-white"
                  : "hover:bg-blue-600 hover:translate-x-1"
              }`}
            >
              <i className="ri-dashboard-horizontal-fill"></i> Tabel
            </a>
          </nav>
        </div>

        <a
          href="/"
          className="block py-2 px-3 font-bold rounded-lg hover:bg-red-600 bg-red-600 m-3"
        >
          <i className="ri-logout-box-line text-lg"></i> Keluar
        </a>
      </div>
    </>
  );
}

export default Sidnav;
