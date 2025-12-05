// src/pages/TambahData.js
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
    try {
      const res = await axios.get(API_KATEGORI);
      const aktifList = res.data.filter(k => k.aktif).map(k => k.kategori_nama);
      setKategoriAktif(aktifList);
      if (aktifList.length > 0 && !aktifList.includes("Siswa")) {
        setFormData(prev => ({ ...prev, kategori: aktifList[0] }));
      } else if (aktifList.length === 0) {
        setFormData(prev => ({ ...prev, kategori: "" }));
      }
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
      Swal.fire("Gagal", "Tidak bisa mengambil data kategori", "error");
    }
  };

  const getKelasList = async () => {
    try {
      setLoadingKelas(true);
      const res = await axios.get(API_KELAS);
      setKelasList(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data kelas:", err);
      Swal.fire("Gagal", "Tidak bisa mengambil data kelas", "error");
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
      setFormData(prev => ({ ...prev, kelas: "-", jurusan: "-" }));
    } else {
      setFormData(prev => ({ ...prev, kelas: "", jurusan: "" }));
    }
  }, [formData.kategori]);

  useEffect(() => {
    if (!formData.kelas || formData.kelas === "-" || formData.kategori !== "Siswa") {
      setJurusanList([]);
      return;
    }
    const jurusanFiltered = [...new Set(kelasList.filter(k => k.kelas === formData.kelas).map(k => k.jurusan).filter(Boolean))];
    setJurusanList(jurusanFiltered);
  }, [formData.kelas, kelasList, formData.kategori]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateUniqueNumber = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `SIS-${randomNumber}`;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const isSiswa = formData.kategori.toLowerCase().includes("siswa");
    if (isSiswa && (!formData.kelas || !formData.jurusan)) {
      return Swal.fire("Peringatan", "Kelas dan Jurusan wajib diisi untuk kategori Siswa", "warning");
    }
    try {
      const dataToSend = {
        ...formData,
        nomorUnik: generateUniqueNumber(),
        jabatan: formData.jabatan.trim() ? formData.jabatan : "Belum ada jabatan/bagian",
      };
      await axios.post(API_DAFTAR, dataToSend);
      Swal.fire("Berhasil", "Data berhasil ditambahkan", "success");
      navigate("/Daftar");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Tidak dapat menambahkan data";
      Swal.fire("Gagal", errorMessage, "error");
    }
  };

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");
  const kelasUniqueList = [...new Set(kelasList.map(k => k.kelas).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Tambah Data</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nama" placeholder="Nama Lengkap" value={formData.nama} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
          <input name="jabatan" placeholder="Jabatan / Bagian (Opsional)" value={formData.jabatan} onChange={handleChange} className="w-full border px-3 py-2 rounded"/>
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded"/>
          <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            {kategoriAktif.map((k, i) => <option key={i} value={k}>{k}</option>)}
          </select>

          {isSiswa && (
            <>
              <select name="kelas" value={formData.kelas} onChange={handleChange} className="w-full border px-3 py-2 rounded" disabled={loadingKelas || kelasUniqueList.length === 0} required>
                <option value="">Pilih Kelas</option>
                {kelasUniqueList.map((k, i) => <option key={i} value={k}>{k}</option>)}
              </select>
              <select name="jurusan" value={formData.jurusan} onChange={handleChange} className="w-full border px-3 py-2 rounded" disabled={loadingKelas || jurusanList.length === 0} required>
                <option value="">Pilih Jurusan</option>
                {jurusanList.map((jurusan, i) => <option key={i} value={jurusan}>{jurusan}</option>)}
              </select>
            </>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button type="button" onClick={()=>navigate("/Daftar")} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-150">Batal</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-150" disabled={loadingKelas}>
              {loadingKelas ? "Memuat Data..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TambahData;
