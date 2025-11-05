import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahTagihan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    jenis_tagihan: "",
    jumlah: "",
    status: "Belum Lunas",
  });

  const [jenisTagihan, setJenisTagihan] = useState([]);
  const API_TAGIHAN = "http://localhost:5001/tagihan";
  const API_JENIS = "http://localhost:5001/JenisTagihan";

  useEffect(() => {
    axios
      .get(API_JENIS)
      .then((res) => setJenisTagihan(res.data))
      .catch((err) => console.error("Gagal ambil Jenis Tagihan:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_TAGIHAN, {
        ...formData,
        id: `t${Date.now()}`,
        jumlah: Number(formData.jumlah),
      });
      Swal.fire("Berhasil!", "Tagihan berhasil ditambahkan!", "success");
      navigate("/Tagihan");
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menambah tagihan", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      <div className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-purple-500 w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center">Tambah Tagihan</h1>

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
              type="number"
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

          <button
            type="submit"
            className="w-full py-2 mt-4 rounded bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 font-bold transition"
          >
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
}

export default TambahTagihan;
