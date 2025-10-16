import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./component/Register";
import Login from "./component/Login";
import Daftar from "./component/Daftar";
import MainLayout from "./component/MainLayaout";
import TambahData from "./component/TambahData";
import Edit from "./component/Edit"
import Dasboard from "./component/Dasboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/TambahData" element={<TambahData />} />
        <Route path="/EditData/:id" element={<Edit />} />

        <Route element={<MainLayout />}>
        <Route path="/Dasboard" element={<Dasboard />} />
          <Route path="/Daftar" element={<Daftar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
