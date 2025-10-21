import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(u => u.email === formData.email);
    if (exists) {
      Swal.fire({
        title: "Email sudah terdaftar!",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    users.push(formData);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      title: "Registrasi berhasil!",
      icon: "success",
      draggable: true
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Registrasi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama lengkap</label>
            <input 
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukan Nama anda"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukan email anda"
              required
            />
          </div>

          <div className="relative mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="shadow appearance-none rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:shadow-outline"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              <i className={`ri-${showPassword ? "eye-off-line" : "eye-line"} text-xl`}></i>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              type="submit"
            >
              Daftar
            </button>
            <p className="mt-4 text-gray-700 text-sm">
              Sudah punya akun? <Link to="/" className="text-blue-600 hover:underline">Login di sini</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
