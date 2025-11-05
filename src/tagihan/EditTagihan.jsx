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

  const API_TAGIHAN = "http://localhost:5001/tagihan";
  const API_JENIS = "http://localhost:5001/JenisTagihan";

  useEffect(() => {
    axios
      .get(API_JENIS)
      .then((res) => setJenisTagihan(res.data))
      .catch((err) => console.error("Gagal ambil jenis tagihan:", err));
  }, []);

  // Ambil data tagihan berdasarkan ID
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
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
        <div className="text-lg animate-pulse">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <div className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-purple-500 w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Edit Tagihan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/50 border border-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Jenis Tagihan</label>
            <select
              name="jenis_tagihan"
              value={formData.jenis_tagihan}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/50 border border-purple-500 text-white"
            >
              <option value="">-- Pilih Jenis Tagihan --</option>
              {jenisTagihan.map((item) => (
                <option key={item.id} value={item.nama}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Jumlah</label>
            <input
              type="text"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/50 border border-purple-500 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/50 border border-purple-500 text-white"
            >
              <option value="Belum Lunas">Belum Lunas</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/Tagihan")}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 font-bold transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTagihan;
