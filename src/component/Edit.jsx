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
    try {
      Swal.fire({
        title: "Yakin ingin menyimpan perubahan?",
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`http://localhost:5001/Daftar/${id}`, formData);
          Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
          navigate("/Daftar");
        }
      });
    } catch (err) {
      console.error("Gagal mengupdate data:", err);
      Swal.fire("Error", "Gagal mengupdate data!", "error");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-xl font-semibold">Loading data...</p>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm mt-20">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Data</h1>
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
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
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
