import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidnav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/Dasboard", label: "Dashboard", icon: "ri-dashboard-line text-purple-400" },
    { path: "/Daftar", label: "Data SGK", icon: "ri-database-2-line text-red-400" },
    { path: "/Tagihan", label: "Tagihan", icon: "ri-wallet-2-line text-green-400" },
  ];

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-md md:hidden shadow-md transition duration-300"
        onClick={() => setOpen(!open)}
      >
        <i className="ri-menu-line text-2xl"></i>
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col justify-between shadow-2xl transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div>
          <div className="text-2xl font-extrabold mb-8 text-center bg-blue-800/90 py-6 tracking-wide shadow-inner">
            <i className="ri-bar-chart-grouped-line mr-2 text-yellow-300"></i>
            Statistik Data
          </div>

          <nav className="px-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.path}>
                {item.label === "Tagihan" && <div className="border-t border-white/40 my-2"></div>}

                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-blue-500/90 text-white shadow-inner scale-[1.02]"
                      : "hover:bg-blue-600/70 hover:translate-x-1"
                  }`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  {item.label}
                </button>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-blue-600/40">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition-all duration-300 shadow-md"
          >
            <i className="ri-logout-box-line text-lg"></i> Keluar
          </button>

          <p className="text-xs text-center text-blue-200 mt-3">
            © {new Date().getFullYear()} Dashboard Sekolah
          </p>
        </div>
      </div>
    </>
  );
}

export default Sidnav;
