import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = "http://localhost:5001/tagihan";

  const [formData, setFormData] = useState({
    nama: "",
    jenis_tagihan: "",
    jumlah: "",
    status: "Belum Lunas",
  });
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setFormData(res.data);
    } catch {
      Swal.fire("Error!", "Gagal mengambil data.", "error");
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

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
      await axios.put(`${API_URL}/${id}`, { ...formData, jumlah: Number(formData.jumlah) });
      Swal.fire("Berhasil!", "Tagihan berhasil diperbarui.", "success");
      navigate("/Tagihan");
    } catch {
      Swal.fire("Error!", "Gagal memperbarui tagihan.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mt-20">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Tagihan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama Siswa"
            required
            className="border border-gray-300 p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="jenis_tagihan"
            value={formData.jenis_tagihan}
            onChange={handleChange}
            placeholder="Jenis Tagihan"
            required
            className="border border-gray-300 p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="jumlah"
            value={formatRupiah(formData.jumlah)}
            onChange={handleChange}
            placeholder="Jumlah (Rp)"
            required
            className="border border-gray-300 p-2.5 rounded w-full focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Tagihan")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded w-full"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTagihan;     
