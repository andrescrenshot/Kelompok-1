import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./component/Register";
import Login from "./component/Login";
import Daftar from "./component/Daftar";
import MainLayout from "./component/MainLayaout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/Daftar" element={<Daftar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
