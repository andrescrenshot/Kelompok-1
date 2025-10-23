import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/Daftar/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        Swal.fire("Error", "Gagal mengambil data!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Simpan perubahan?",
      text: "Perubahan akan disimpan permanen.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5001/Daftar/${id}`, formData);
          Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
          navigate("/Daftar");
        } catch (err) {
          console.error("Gagal mengupdate data:", err);
          Swal.fire("Error", "Gagal mengupdate data!", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-gray-700 text-lg font-medium animate-pulse">
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522204501806-5c0c3e1aa7b0?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8 border border-white/30">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Edit Data
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama"
              required
              className="w-full p-2.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Jabatan/Kelas/Bagian
            </label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              placeholder="Masukkan jabatan atau kelas"
              required
              className="w-full p-2.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
              className="w-full p-2.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full p-2.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            >
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-5 py-2.5 rounded-md shadow-md"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="bg-gray-500 hover:bg-gray-700 transition text-white font-semibold px-5 py-2.5 rounded-md shadow-md"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditData;
