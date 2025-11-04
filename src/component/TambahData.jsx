import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahData() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5001/Daftar";

  const [formData, setFormData] = useState({
    nama: "",
    kelas: "", 
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, formData);
      Swal.fire("Berhasil!", "Data berhasil ditambahkan", "success");
      navigate("/Daftar");
    } catch (err) {
      console.error("Gagal tambah data:", err);
      Swal.fire("Gagal!", "Tidak dapat menambahkan data", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Tambah Data Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Jabatan / Bagian
            </label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Contoh: Wali Kelas, Bendahara, XI IPA 1"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Masukkan email aktif"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Siswa">Siswa</option>
              <option value="Guru">Guru</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          {formData.kategori === "Siswa" && (
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Kelas
              </label>
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              >
                <option value="">Pilih Kelas</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahData;
