import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_KATEGORI = "http://localhost:5001/Kategori";
  const API_KELAS = "http://localhost:5001/Kelas";

  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
    nomorUnik: "",
  });

  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getKategoriAktif = async () => {
    const res = await axios.get(API_KATEGORI);
    setKategoriAktif(
      res.data.filter((k) => k.aktif).map((k) => k.kategori_nama)
    );
  };

  const getKelasList = async () => {
    const res = await axios.get(API_KELAS);
    setKelasList(res.data || []);
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_DAFTAR}/${id}`);
      setFormData(res.data);
    } catch {
      Swal.fire("Error", "Gagal mengambil data!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKategoriAktif();
    getKelasList();
    getUserData();
  }, [id]);

  useEffect(() => {
    if (!formData.kelas) {
      setJurusanList([]);
      return;
    }
    const filtered = [
      ...new Set(
        kelasList
          .filter((k) => k.kelas === formData.kelas)
          .map((k) => k.jurusan)
          .filter(Boolean)
      ),
    ];
    setJurusanList(filtered);
  }, [formData.kelas, kelasList]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(formData.nomorUnik)) {
      return Swal.fire(
        "Peringatan",
        "Nomor Unik harus tepat 8 angka",
        "warning"
      );
    }

    const confirm = await Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API_DAFTAR}/${id}`, {
        ...formData,
        jabatan: formData.jabatan.trim() || "Belum ada jabatan/bagian",
      });
      Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      navigate("/Daftar");
    } catch {
      Swal.fire("Error", "Gagal mengupdate data!", "error");
    }
  };

  if (loading) return <p className="text-center mt-20">Memuat data...</p>;

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");
  const kelasUnique = [...new Set(kelasList.map((k) => k.kelas).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Data</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Nomor Unik */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Nomor Unik
            </label>
            <input
              type="text"
              value={formData.nomorUnik}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v.length <= 8)
                  setFormData({ ...formData, nomorUnik: v });
              }}
              className="w-full border p-2 rounded"
              placeholder="Contoh: 12345678"
              required
            />
          </div>

          {/* Nama */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Jabatan */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Jabatan / Bagian
            </label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {kategoriAktif.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {isSiswa && (
            <>
              {/* Kelas */}
              <div>
                <label className="block text-sm font-medium mb-1">Kelas</label>
                <select
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih Kelas</option>
                  {kelasUnique.map((k, i) => (
                    <option key={i} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jurusan */}
              <div>
                <label className="block text-sm font-medium mb-1 ml-45  ">
                  Jurusan
                </label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full border p-2 rounded ml-45"
                  disabled={!jurusanList.length}
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.map((j, i) => (
                    <option key={i} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Tombol */}
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded w-full"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="bg-gray-500 hover:bg-gray-600 transition text-white py-2 rounded w-full"
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
