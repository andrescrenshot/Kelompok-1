import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidnav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // =========================
  // MENU DEFINISI
  // =========================
  const menuAtas = [
    { path: "/Dasboard", label: "Dashboard", icon: "ri-dashboard-line text-purple-400" },
  ];

  const menuSiswaGuru = [
    { path: "/KategoriData", label: "Kategori Data", icon: "ri-clipboard-line" },
    { path: "/Kelas", label: "Kelas", icon: "ri-school-line text-gray-400" },
    { path: "/Daftar", label: "Master Data", icon: "ri-database-2-line text-red-400" },
  ];

  const menuTagihan = [
    { path: "/JenisTagihan", label: "Kategori Tagihan", icon: "ri-price-tag-3-line text-orange-400" },
    { path: "/Tagihan", label: "Tagihan", icon: "ri-wallet-2-line text-green-400" },
    { path: "/RekapTagihan", label: "Rekap Tagihan", icon: "ri-file-list-3-line" },
  ];

  const menuPresensi = [
    { path: "/Presensi", label: "Presensi", icon: "ri-hourglass-2-fill text-blue-200" },
    { path: "/RekapPresensi", label: "Rekap Presensi", icon: "ri-time-line text-blue-300" },
  ];

  // =========================
  // SIDEBAR BUTTON COMPONENT
  // =========================
  const SidebarButton = ({ item }) => (
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
  );

  return (
    <>
      {/* Toggle Mobile Button */}
      <button
        className="fixed top-4 left-4 z-50 text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-md md:hidden shadow-md transition duration-300"
        onClick={() => setOpen(!open)}
      >
        <i className="ri-menu-line text-2xl"></i>
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex-none text-2xl font-extrabold text-center bg-blue-800/90 py-6 tracking-wide shadow-inner sticky top-0 z-50">
          <i className="ri-bar-chart-grouped-line mr-2 text-yellow-300"></i>
          Binusa.S
        </div>

        {/* MENU SCROLLABLE */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          <nav className="px-4 space-y-2 pb-24">
            {menuAtas.map((item) => (
              <SidebarButton key={item.path} item={item} />
            ))}

            <div className="border-t border-white/40 my-3"></div>

            {menuSiswaGuru.map((item) => (
              <SidebarButton key={item.path} item={item} />
            ))}

            <div className="border-t border-white/40 my-3"></div>

            {menuTagihan.map((item) => (
              <SidebarButton key={item.path} item={item} />
            ))}

            <div className="border-t border-white/40 my-3"></div>

            {menuPresensi.map((item) => (
              <SidebarButton key={item.path} item={item} />
            ))}
          </nav>
        </div>

        {/* BOTTOM LOGOUT */}
        <div className="flex-none p-4 border-t border-blue-600/40">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold transition-all duration-300 shadow-md"
          >
            <i className="ri-logout-box-line text-lg"></i>
            Keluar
          </button>

          <p className="text-xs text-center text-blue-200 mt-3">
            © {new Date().getFullYear()} Dashboard Sekolah
          </p>
        </div>
      </div>

      {/* SCROLLBAR STYLING */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 10px;
          }
        `}
      </style>
    </>
  );
}

export default Sidnav;
