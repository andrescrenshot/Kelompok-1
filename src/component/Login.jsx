import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../public/logo.jpg"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === formData.email);

    if (!user) {
      Swal.fire({
        title: "Akun belum terdaftar!",
        text: "Silakan daftar terlebih dahulu.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    if (user.password !== formData.password) {
      Swal.fire({
        title: "Password salah!",
        icon: "error",
        confirmButtonText: "Coba Lagi"
      });
      return;
    }

    Swal.fire({
      title: "Login Berhasil!",
      icon: "success",
      draggable: true,
    }).then(() => {
      navigate("/Dasboard");
    });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-3xl shadow-lg w-[720px] h-[350px] overflow-hidden">
        
        <div className="w-1/3 bg-blue-100 flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"                                                                    
            className="w-43 h-43 object-contain"
          />
        </div>

        <div className="w-2/3 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                className="shadow appearance-none rounded-full w-full py-2 px-4 text-gray-700 focus:outline-none focus:shadow-outline"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukan Email anda"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                className="shadow appearance-none rounded-full w-full py-2 px-4 pr-10 text-gray-700 focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukan Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              >
                <i className={`ri-${showPassword ? "eye-off-line" : "eye-line"} text-xl`}></i>
              </button>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              type="submit"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-700 text-sm mt-4">
            Belum punya akun? <Link to="/Register" className="text-blue-600 hover:underline">Daftar di sini</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
