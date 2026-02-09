import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import logo from "../../public/kakangku.jpg";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "error") {
        Swal.fire({ title: data.message, icon: "error" });
      } else {
        Swal.fire({ title: data.message, icon: "success" }).then(() =>
          navigate("/Dasboard")
        );
      }
    } catch {
      Swal.fire({ title: "Server error", icon: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex items-center justify-center min-h-screen bg-gray-200"
    >
      <div className="flex bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-3xl shadow-lg w-[670px] h-[350px] overflow-hidden">
        <div className="w-1/3 flex items-center justify-center bg-white p-6 shadow-md">
          <img src={logo} alt="Logo" className="w-90 h-90 object-contain" />
        </div>

        <div className="w-2/3 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan Email"
              className="rounded-full px-4 py-2 shadow"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan Password"
                className="rounded-full px-4 py-2 shadow w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2 text-gray-500 hover:text-gray-700"
              >
                <i
                  className={`ri-${
                    showPassword ? "eye-line" : "eye-off-line"
                  } text-xl`}
                ></i>
              </button>
            </div>

            <button className="bg-blue-500 text-white rounded-full py-2 hover:bg-blue-600">
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Belum punya akun?{" "}
            <Link to="/Register" className="text-blue-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
