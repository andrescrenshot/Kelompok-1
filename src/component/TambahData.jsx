// src/pages/TambahData.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_MASTER = "http://localhost:8080/api/master-data";
const API_KELAS = "http://localhost:8080/api/kelas";
const API_KATEGORI = "http://localhost:8080/api/kategori";

export default function TambahData({ editData }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomorUnik: "",
    nama: "",
    kelas: "",
    jurusan: "",
    jabatan: "",
    email: "",
    kategori: "Siswa",
  });

  const [dataDaftar, setDataDaftar] = useState([]);
  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [loadingKelas, setLoadingKelas] = useState(true);

  // ========================= FETCH MASTER DATA =========================
  useEffect(() => {
    if (editData) setFormData(editData);

    // Semua data daftar
    axios.get(API_MASTER).then(res => setDataDaftar(res.data || []));

    // Kategori aktif
    axios.get(API_KATEGORI).then(res => {
      const aktif = (res.data || []).filter(k => k.aktif).map(k => k.nama);
      setKategoriAktif(aktif.length ? aktif : ["Siswa"]);
    });

    // Kelas & jurusan
    axios.get(API_KELAS).then(res => {
      const kelasData = res.data || [];
      setKelasList([...new Set(kelasData.map(k => k.nama).filter(Boolean))]);
      setLoadingKelas(false);
    });
  }, [editData]);

  // ========================= FILTER JURUSAN =========================
  useEffect(() => {
    if (!formData.kelas || formData.kelas === "-") {
      setJurusanList([]);
      setFormData(prev => ({ ...prev, jurusan: "" }));
      return;
    }
    axios.get(API_KELAS).then(res => {
      const filtered = [
        ...new Set(
          (res.data || [])
            .filter(k => k.nama === formData.kelas)
            .map(k => k.jurusan)
            .filter(Boolean)
        ),
      ];
      setJurusanList(filtered);
      if (!filtered.includes(formData.jurusan)) {
        setFormData(prev => ({ ...prev, jurusan: "" }));
      }
    });
  }, [formData.kelas]);

  // ========================= HANDLE CHANGE =========================
  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ========================= GENERATE RFID =========================
  const generateRFID = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const last = dataDaftar
      .filter(d => d.nomorUnik?.startsWith(`RFID-${today}`))
      .map(d => Number(d.nomorUnik.split("-")[2]))
      .sort((a, b) => b - a)[0] || 0;
    return `RFID-${today}-${String(last + 1).padStart(3, "0")}`;
  };

  // ========================= SUBMIT DATA =========================
  const handleSubmit = async e => {
    e.preventDefault();

    const isSiswa = formData.kategori.toLowerCase().includes("siswa");
    if (isSiswa && (!formData.kelas || !formData.jurusan)) {
      return Swal.fire(
        "Peringatan",
        "Kelas dan Jurusan wajib diisi untuk Siswa",
        "warning"
      );
    }

    let rfidFinal = formData.nomorUnik.trim();
    if (!rfidFinal) rfidFinal = generateRFID();

    const duplikat = dataDaftar.some(
      d => d.nomorUnik === rfidFinal && d.id !== formData.id
    );
    if (duplikat) {
      return Swal.fire("Error", "RFID sudah digunakan", "error");
    }

    try {
      if (formData.id) {
        // UPDATE
        await axios.put(`${API_MASTER}/${formData.id}`, {
          ...formData,
          nomorUnik: rfidFinal,
        });
        Swal.fire("Berhasil", "Data diperbarui", "success");
      } else {
        // CREATE
        await axios.post(API_MASTER, {
          ...formData,
          nomorUnik: rfidFinal,
          jabatan: formData.jabatan.trim() || "Belum ada jabatan/bagian",
        });
        Swal.fire("Berhasil", `RFID: ${rfidFinal}`, "success");
      }
      navigate("/Daftar");
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data || "Tidak dapat menyimpan data",
        "error"
      );
    }
  };

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">
          {formData.id ? "Edit Data" : "Tambah Data"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* RFID */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">RFID</label>
            <input
              type="text"
              name="nomorUnik"
              value={formData.nomorUnik}
              onChange={handleChange}
              placeholder="Kosongkan jika ingin otomatis"
              className="w-full border p-2 rounded"
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
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas & Jurusan (hanya untuk Siswa) */}
          {isSiswa && (
            <>
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
                  {kelasList.map((k, i) => (
                    <option key={i} value={k}>
                      {k}
                    </option>
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
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => navigate("/Daftar")}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded w-full"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
