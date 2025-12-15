import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function TambahData() {
  const navigate = useNavigate();

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_KATEGORI = "http://localhost:5001/Kategori";
  const API_KELAS = "http://localhost:5001/Kelas";

  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [loadingKelas, setLoadingKelas] = useState(true);

  const [formData, setFormData] = useState({
    nama: "",
    kelas: "",
    jurusan: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });

  const getKategoriAktif = async () => {
    const res = await axios.get(API_KATEGORI);
    const aktif = res.data
      .filter((k) => k.aktif)
      .map((k) => k.kategori_nama);
    setKategoriAktif(aktif);
  };

  const getKelasList = async () => {
    try {
      setLoadingKelas(true);
      const res = await axios.get(API_KELAS);
      setKelasList(res.data || []);
    } finally {
      setLoadingKelas(false);
    }
  };

  useEffect(() => {
    getKategoriAktif();
    getKelasList();
  }, []);

  useEffect(() => {
    const isSiswa = formData.kategori.toLowerCase().includes("siswa");
    if (!isSiswa) {
      setFormData((p) => ({ ...p, kelas: "-", jurusan: "-" }));
    } else {
      setFormData((p) => ({ ...p, kelas: "", jurusan: "" }));
    }
  }, [formData.kategori]);

  useEffect(() => {
    if (!formData.kelas || formData.kelas === "-") {
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

  const generateUniqueNumber = () =>
    Math.floor(10000000 + Math.random() * 90000000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSiswa = formData.kategori.toLowerCase().includes("siswa");
    if (isSiswa && (!formData.kelas || !formData.jurusan)) {
      return Swal.fire(
        "Peringatan",
        "Kelas dan Jurusan wajib diisi untuk kategori Siswa",
        "warning"
      );
    }

    try {
      await axios.post(API_DAFTAR, {
        ...formData,
        nomorUnik: generateUniqueNumber(),
        jabatan: formData.jabatan.trim() || "Belum ada jabatan/bagian",
      });
      Swal.fire("Berhasil", "Data berhasil ditambahkan", "success");
      navigate("/Daftar");
    } catch {
      Swal.fire("Gagal", "Tidak dapat menambahkan data", "error");
    }
  };

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");
  const kelasUnique = [...new Set(kelasList.map((k) => k.kelas).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">
          Tambah Data
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
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
                  disabled={loadingKelas}
                  required
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
                <label className="block text-sm font-medium mb-1 ml-45">Jurusan</label>
                <select
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  className="w-full border p-2 rounded  ml-45"
                  disabled={!jurusanList.length}
                  required
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
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahData;
   