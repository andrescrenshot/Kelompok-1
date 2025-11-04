import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahTagihan() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5001/tagihan";

  const [formData, setFormData] = useState({
    nama: "",
    jenis_tagihan: "",
    jumlah: "",
    status: "Belum Lunas",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "jumlah") {
      const numeric = value.replace(/\D/g, "");
      setFormData({ ...formData, jumlah: numeric ? parseInt(numeric) : "" });
    } else setFormData({ ...formData, [name]: value });
  };

  const formatRupiah = (angka) =>
    angka ? "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.jenis_tagihan || formData.jumlah <= 0)
      return Swal.fire("Oops!", "Semua field wajib diisi.", "warning");

    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      Swal.fire("Berhasil!", "Tagihan berhasil ditambahkan.", "success");
      navigate("/Tagihan");
    } catch (err) {
      Swal.fire("Error!", "Tidak dapat menambahkan tagihan.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Tambah Tagihan
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nama"
            placeholder="Nama Siswa"
            value={formData.nama}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <input
            type="text"
            name="jenis_tagihan"
            placeholder="Jenis Tagihan (contoh: SPP)"
            value={formData.jenis_tagihan}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <input
            type="text"
            name="jumlah"
            placeholder="Jumlah (Rp)"
            value={formatRupiah(formData.jumlah)}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              {loading ? "Menyimpan..." : "Tambah Tagihan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Tagihan")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahTagihan;
