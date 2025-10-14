import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Login Berhasil!",
      icon: "success",
      draggable: true,
    }).then(() => {
      navigate("/Daftar");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-14 shadowlg">
      <div className="bg-white p-8 ronded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukan Email anda"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukan Password Email Anda"
              required
            />
          </div>
          <div>
            <button
              className="bg-blue-500 shadow-lg px-3 py-2 rounded-lg items-center ml-30 text-white"
              type="submit"
            >
              Daftar
            </button>
            <button className="shadow ml-5 mt-4">
              <Link to="/Register">Belum Punya Akun? Daftar disini bre🤔</Link>
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
