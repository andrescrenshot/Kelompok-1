import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Register from "./component/Register";
import Login from "./component/Login";
import Daftar from "./component/Daftar";
import MainLayout from "./component/MainLayaout";
import TambahData from "./component/TambahData";
import Edit from "./component/Edit";
import Dasboard from "./component/Dasboard";
import Tagihan from "./tagihan/Tagihan";
import EditTagihan from "./tagihan/EditTagihan";
import Kelas from "./component/Kelas";
import JenisTagihan from "./tagihan/JenisTagihan";
import KategoriData from "./component/KategoriData";
import RekapTagihan from "./tagihan/RekapTagihan";
import Presensi from "./component/Presensi/Presensi";
import RekapPresensi from "./component/Presensi/RekapPresensi";

/* ================= WRAPPER ================= */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        {/* TANPA LAYOUT */}
        <Route path="/TambahData" element={<TambahData />} />
        <Route path="/EditData/:id" element={<Edit />} />
        <Route path="/EditTagihan/:id" element={<EditTagihan />} />

        {/* DENGAN LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="/Dasboard" element={<Dasboard />} />
          <Route path="/Presensi" element={<Presensi />} />
          <Route path="/Daftar" element={<Daftar />} />
          <Route path="/Tagihan" element={<Tagihan />} />
          <Route path="/JenisTagihan" element={<JenisTagihan />} />
          <Route path="/KategoriData" element={<KategoriData />} />
          <Route path="/Kelas" element={<Kelas />} />
          <Route path="/RekapTagihan" element={<RekapTagihan />} />
          <Route path="/RekapPresensi" element={<RekapPresensi />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
