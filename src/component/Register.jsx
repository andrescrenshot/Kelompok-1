import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../public/kakangku.jpg";

function Register() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Konfirmasi password tidak cocok!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (data.status === "error") {
        Swal.fire({ title: data.message, icon: "error", confirmButtonText: "OK" });
      } else {
        Swal.fire({ title: data.message, icon: "success" }).then(() => navigate("/"));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Terjadi kesalahan server!", icon: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-3xl shadow-lg w-[720px] h-[480px] overflow-hidden">
        <div className="w-1/3 flex items-center justify-center bg-white p-6 shadow-md">
          <img src={logo} alt="Logo" className="w-90 h-90 object-contain" />
        </div>

        <div className="w-2/3 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-6">Registrasi</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukan Email Anda"
                className="shadow appearance-none rounded-full w-full py-2 px-4 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukan Password"
                className="shadow appearance-none rounded-full w-full py-2 px-4 pr-10 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              >
                <i className={`ri-${showPassword ? "eye-line" : "eye-off-line"} text-xl`}></i>
              </button>
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Masukan ulang password"
                className="shadow appearance-none rounded-full w-full py-2 px-4 pr-10 text-gray-700 focus:outline-none focus:shadow-outline"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              >
                <i className={`ri-${showConfirmPassword ? "eye-line" : "eye-off-line"} text-xl`}></i>
              </button>
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Registrasi
            </button>
          </form>

          <p className="text-center text-gray-700 text-sm mt-4">
            Sudah punya akun?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
