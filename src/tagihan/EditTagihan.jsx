import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditTagihan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    jenis_tagihan: "",
    jumlah: "",
    status: "Belum Lunas",
  });
  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_TAGIHAN = "http://localhost:5001/tagihan";
  const API_JENIS = "http://localhost:5001/JenisTagihan";

  useEffect(() => {
    axios
      .get(API_JENIS)
      .then((res) => setJenisTagihan(res.data))
      .catch((err) => console.error("Gagal ambil jenis tagihan:", err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_TAGIHAN}/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data tagihan:", err);
        Swal.fire("Error", "Gagal mengambil data tagihan", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "jumlah") {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, jumlah: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Simpan perubahan?",
      text: "Pastikan data sudah benar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, simpan",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setSaving(true);
      try {
        await axios.put(`${API_TAGIHAN}/${id}`, {
          ...formData,
          jumlah: Number(formData.jumlah),
        });
        Swal.fire("Berhasil!", "Data tagihan berhasil diperbarui", "success");
        navigate("/Tagihan");
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui data", "error");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <div className="text-white text-lg animate-pulse">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit Tagihan
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Siswa"
            value={formData.nama}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />

          <select
            name="jenis_tagihan"
            value={formData.jenis_tagihan}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          >
            <option value="">-- Pilih Jenis Tagihan --</option>
            {jenisTagihan.map((item) => (
              <option key={item.id} value={item.nama}>
                {item.nama}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="jumlah"
            placeholder="Jumlah (Rp)"
            value={formData.jumlah}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Tagihan")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition duration-200"
            >
              Batal
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/Tagihan")}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTagihan;
