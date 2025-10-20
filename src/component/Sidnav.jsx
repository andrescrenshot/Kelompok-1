import { useState } from "react";

function Sidnav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-red-800">
      <div
        className={`fixed top-0 h-full w-65 bg-black text-white
            ${open ? "translate-0" : "-translate-x-full"}
            transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="text-xl font-bold mb-8 text-center bg-gray-900 py-5 h-18" >
         Statistik data
        </div>

        <nav className="space-y-3" >
          <a
            href="/Dasboard"
            className="block py-2 px-3 font-bold rounded hover:bg-blue-600"
          >
            <i className  ="ri-dashboard-line text-lg animate"></i>
            Dasboard
          </a>
          <a
            href="/Daftar"
            className="block py-2 px-3 font-bold rounded hover:bg-blue-600"
          >
            <i class="ri-function-ai-line text-lg"></i>
            Daftar Tabel
          </a>
          
          <a
            href="/"
            className="block py-2 px-3 font-bold rounded-lg hover:bg-blue-600 mt-110 bg-red-400 animate-pulse"
          >
            <i class="ri-logout-box-line text-lg"></i>
            Log Out
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Sidnav;
