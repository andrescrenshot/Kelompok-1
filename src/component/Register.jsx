import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    nomor: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); 


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
  title: "regsiterasi berhasil!",
  icon: "success",
  draggable: true
}).then(()=>{
   navigate("/Dasboard");
})
  

   

    
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-14">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Registerasi</h1>
        <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Nama">
                     Nama lengkap
                </label>
                <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="nama"
                type="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukan Nama anda"
                required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
                     Email
                </label>
                <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="masukan email"
                required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Password">
                     Password
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="masukan password"
                    required
                    />
            </div>
            <div className="flex flex-col items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Daftar
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Register;