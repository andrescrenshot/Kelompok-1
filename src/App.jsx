import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./component/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
