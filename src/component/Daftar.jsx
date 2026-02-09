import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_MASTER = "http://localhost:8080/api/master-data";
const API_KELAS = "http://localhost:8080/api/kelas";
const API_KATEGORI = "http://localhost:8080/api/kategori";

export default function Daftar() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterJurusan, setFilterJurusan] = useState("Semua");

  const [kategoriList, setKategoriList] = useState(["Semua"]);
  const [kelasList, setKelasList] = useState(["Semua  "]);
  const [jurusanList, setJurusanList] = useState(["Semua"]);

  const navigate = useNavigate();

  // ========================= FETCH DATA =========================
  const fetchAll = async () => {
    try {
      const [resMaster, resKelas, resKategori] = await Promise.all([
        axios.get(API_MASTER),
        axios.get(API_KELAS),
        axios.get(API_KATEGORI),
      ]);

      const masterData = resMaster.data || [];
      setData(masterData);

      // Kategori aktif dari backend
      const kategoriAktif = (resKategori.data || [])
        .filter(k => k.aktif)
        .map(k => k.nama);
      setKategoriList(["Semua", ...kategoriAktif]);

      // Kelas unik dari backend
      const kelasUnique = [...new Set((resKelas.data || []).map(k => k.nama).filter(Boolean))];
      setKelasList(["Semua", ...kelasUnique]);

      // Jurusan unik dari backend
      const jurusanUnique = [...new Set((resKelas.data || []).map(k => k.jurusan).filter(Boolean))];
      setJurusanList(["Semua", ...jurusanUnique]);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      Swal.fire("Error", "Gagal mengambil data", "error");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ========================= DELETE =========================
  const handleDelete = async (id) => {
    if (!id) return Swal.fire("Error", "ID tidak ditemukan", "error");

    const confirm = await Swal.fire({
      title: "Yakin hapus data?",
      text: "Data tidak bisa dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_MASTER}/${id}`);
      setData(prev => prev.filter(d => d.id !== id));
      Swal.fire("Berhasil", "Data berhasil dihapus", "success");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      Swal.fire("Error", "Gagal hapus data", "error");
    }
  };

  // ========================= FILTER =========================
  const filteredData = data.filter(d => {
    const nama = d.nama?.toLowerCase() || "";
    const kategori = d.kategori || "";
    const kelas = d.kelas || "";
    const jurusan = d.jurusan || "";

    return (
      nama.includes(search.toLowerCase()) &&
      (filterKategori === "Semua" || kategori === filterKategori) &&
      (filterKelas === "Semua" || kelas === filterKelas) &&
      (filterJurusan === "Semua" || jurusan === filterJurusan)
    );
  });

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Master Data</h1>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            placeholder="Cari nama..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="border p-2 rounded"
          >
            {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>

          <select
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
            className="border p-2 rounded"
          >
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>

          <select
            value={filterJurusan}
            onChange={e => setFilterJurusan(e.target.value)}
            className="border p-2 rounded"
          >
            {jurusanList.map(j => <option key={j} value={j}>{j}</option>)}
          </select>

          <button
            onClick={() => navigate("/TambahData")}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-auto"
          >
            + Tambah Data
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">RFID</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Jurusan</th>
                <th className="p-3">Jabatan</th>
                <th className="p-3">Email</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length ? (
                filteredData.map((d, i) => (
                  <tr key={d.id} className="even:bg-gray-100">
                    <td className="p-2">{i + 1}</td>
                    <td>{d.nomorUnik || "-"}</td>
                    <td>{d.nama || "-"}</td>
                    <td>{d.kelas || "-"}</td>
                    <td>{d.jurusan || "-"}</td>
                    <td>{d.jabatan || "-"}</td>
                    <td>{d.email || "-"}</td>
                    <td>{d.kategori || "-"}</td>
                    <td className="flex gap-2 p-2 justify-center">
                      <button
                        onClick={() => navigate(`/EditData/${d.id}`)}
                        className="bg-blue-500 text-white px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
}
