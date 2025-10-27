import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 Deteksi asal halaman
  const isKelasPage = location.pathname.includes("Kelas");

  // 🔧 State umum
  const [formData, setFormData] = useState(
    isKelasPage
      ? { namaKelas: "", waliKelas: "", murid: [] }
      : { nama: "", jabatan: "", email: "", kategori: "Siswa" }
  );
  const [loading, setLoading] = useState(true);

  const API_URL = isKelasPage
    ? `http://localhost:5001/Kelas/${id}`
    : `http://localhost:5001/Daftar/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
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
    const { name, value } = e.target;

    // Untuk input daftar murid (dipisahkan dengan koma)
    if (isKelasPage && name === "murid") {
      setFormData({ ...formData, murid: value.split(",").map((m) => m.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Simpan perubahan?",
      text: "Perubahan akan disimpan dan dapat diubah kembali.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(API_URL, formData);
          Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
          navigate(isKelasPage ? "/Kelas" : "/Daftar");
        } catch (err) {
          console.error("Gagal mengupdate data:", err);
          Swal.fire("Error", "Gagal mengupdate data!", "error");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg font-medium">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm mt-20">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isKelasPage ? "Edit Data Kelas" : "Edit Data Pengguna"}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Form Edit Data Kelas */}
          {isKelasPage ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Kelas
                </label>
                <input
                  type="text"
                  name="namaKelas"
                  value={formData.namaKelas}
                  onChange={handleChange}
                  placeholder="Nama Kelas"
                  required
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  Wali Kelas
                </label>
                <input
                  type="text"
                  name="waliKelas"
                  value={formData.waliKelas}
                  onChange={handleChange}
                  placeholder="Nama Wali Kelas"
                  required
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-1">
                  Daftar Murid (pisahkan dengan koma)
                </label>
                <textarea
                  name="murid"
                  value={formData.murid.join(", ")}
                  onChange={handleChange}
                  placeholder="Contoh: Andi, Budi, Citra"
                  rows="3"
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          ) : (
            /* Form Edit Data Daftar */
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama
                </label>
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
                <label className="block text-gray-700 font-semibold mb-1">
                  Jabatan/Kelas/Bagian
                </label>
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
                <label className="block text-gray-700 font-semibold mb-1">
                  Email
                </label>
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
                <label className="block text-gray-700 font-semibold mb-1">
                  Kategori
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Guru">Guru</option>
                  <option value="Siswa">Siswa</option>
                  <option value="Karyawan">Karyawan</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate(isKelasPage ? "/Kelas" : "/Daftar")}
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

export default EditData;
