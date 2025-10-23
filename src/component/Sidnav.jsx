import { useState } from "react";

function Sidnav() {
  const [open, setOpen] = useState(false);

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
          transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="text-xl font-bold mb-8 text-center bg-blue-800 py-5 h-18">
          <i className="ri-bar-chart-grouped-line"></i> Statistik data
        </div>

        <nav className="space-y-3 px-3">
          <a
            href="/Dasboard"
            className="block py-2 px-3 font-bold rounded hover:bg-blue-600"
          >
            <i className="ri-dashboard-line text-lg"></i> Dasboard
          </a>
          <a
            href="/Daftar"
            className="block py-2 px-3 font-bold rounded hover:bg-blue-600"
          >
            <i class="ri-dashboard-horizontal-fill"></i> Tabel
          </a>
          <a
            href="/Datakelas"
            className="block py-2 px-3 font-bold rounded hover:bg-blue-600"
          >
            <i class="ri-id-card-line"></i> New
          </a>
          <a
            href="/"
            className="block py-2 px-3 font-bold rounded-lg hover:bg-red-600 mt-20 bg-red-600 mt-110"
          >
            <i className="ri-logout-box-line text-lg"></i> Log Out
          </a>
        </nav>
      </div>
    </>
  );
}

export default Sidnav;
