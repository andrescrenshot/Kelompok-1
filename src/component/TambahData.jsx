import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Tambahdatamenu1() {
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/Daftar", formData);

      Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil ditambahkan.",
        icon: "success",
      });

      setFormData({
        nama: "",
        jabatan: "",
        email: "",
        kategori: "Siswa",
      });

      navigate("/Daftar");
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menambahkan data.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm mt-20">
        <h1 className="text-2xl font-bold text-center mb-6">Tambah Data</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama"
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Jabatan/Kelas/Bagian</label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              placeholder="Jabatan/Kelas/Bagian"
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              {loading ? "Menambahkan..." : "Tambah Data"}
            </button>
            <Link
              to="/Daftar"
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
            >
              Kembali
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Tambahdatamenu1;
