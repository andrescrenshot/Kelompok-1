import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./component/Register";
import Login from "./component/Login";
import Daftar from "./component/Daftar";
import MainLayout from "./component/MainLayaout";
import TambahData from "./component/TambahData";
import Edit from "./component/Edit"
import Dasboard from "./component/Dasboard"
import Tagihan from "./tagihan/Tagihan";
import EditTagihan from "./tagihan/EditTagihan";
import Kelas from "./component/Kelas";
import JenisTagihan from "./tagihan/JenisTagihan"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/TambahData" element={<TambahData />} />
        <Route path="/EditData/:id" element={<Edit />} />
        <Route path="/EditTagihan/:id" element={<EditTagihan />} />

        <Route element={<MainLayout />}>
        <Route path="/Dasboard" element={<Dasboard />} />
          <Route path="/Daftar" element={<Daftar />} />
          <Route path="/Tagihan" element={<Tagihan />} />
          <Route path="/JenisTagihan" element={<JenisTagihan />} />
          <Route path="/Kelas" element={<Kelas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
