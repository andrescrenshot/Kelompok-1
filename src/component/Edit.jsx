import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_MASTER = "http://localhost:8080/api/master-data";
  const API_KATEGORI = "http://localhost:8080/api/kategori";
  const API_KELAS = "http://localhost:8080/api/kelas";

  const [formData, setFormData] = useState({
    nomorUnik: "",
    nama: "",
    kelas: "",
    jurusan: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });

  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data master + kategori + kelas
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resMaster, resKategori, resKelas] = await Promise.all([
          axios.get(`${API_MASTER}/${id}`),
          axios.get(API_KATEGORI),
          axios.get(API_KELAS),
        ]);

        const d = resMaster.data;

        setFormData({
          nomorUnik: d.nomorUnik ?? "",
          nama: d.nama ?? "",
          kelas: d.kelas ?? "",
          jurusan: d.jurusan ?? "",
          jabatan: d.jabatan ?? "",
          email: d.email ?? "",
          kategori: d.kategori ?? "Siswa",
        });

        setKategoriAktif(
          (resKategori.data || [])
            .filter(k => k.aktif)
            .map(k => k.nama)
        );

        setKelasList(resKelas.data || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Filter jurusan jika kategori Siswa
  useEffect(() => {
    const isSiswa = formData.kategori.toLowerCase().includes("siswa");

    if (!isSiswa) {
      setFormData(prev => ({ ...prev, kelas: "-", jurusan: "-" }));
      setJurusanList([]);
      return;
    }

    if (!formData.kelas) {
      setJurusanList([]);
      return;
    }

    const jurusan = [
      ...new Set(
        kelasList
          .filter(k => k.nama === formData.kelas)
          .map(k => k.jurusan)
          .filter(Boolean)
      ),
    ];

    setJurusanList(jurusan);
  }, [formData.kelas, formData.kategori, kelasList]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSiswa = formData.kategori.toLowerCase().includes("siswa");
    if (isSiswa && (!formData.kelas || !formData.jurusan)) {
      return Swal.fire(
        "Peringatan",
        "Kelas & Jurusan wajib diisi untuk Siswa",
        "warning"
      );
    }

    try {
      await axios.put(`${API_MASTER}/${id}`, {
        ...formData,
        jabatan: formData.jabatan?.trim() || "Belum ada jabatan/bagian",
      });

      Swal.fire("Berhasil", "Data berhasil diperbarui", "success");
      navigate("/Daftar");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data || "Gagal update data", "error");
    }
  };

  if (loading) return <p className="text-center mt-20">Memuat data...</p>;

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");
  const kelasUnique = [...new Set(kelasList.map(k => k.nama).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Data</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* RFID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">RFID</label>
            <input
              type="text"
              name="nomorUnik"
              value={formData.nomorUnik}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
            <label className="block text-sm font-medium mb-1">Jabatan / Bagian</label>
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
                <option key={i} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Kelas & Jurusan */}
          {isSiswa && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Kelas</label>
                <select
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {kelasUnique.map((k, i) => (
                    <option key={i} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Jurusan</label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  disabled={!jurusanList.length}
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.map((j, i) => (
                    <option key={i} value={j}>{j}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Tombol */}
          <div className="md:col-span-2 flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded w-full"
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
