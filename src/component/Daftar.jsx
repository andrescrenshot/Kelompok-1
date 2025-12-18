// src/pages/Daftar.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Daftar() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState(["Semua"]);
  const [jurusanList, setJurusanList] = useState(["Semua"]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_KATEGORI = "http://localhost:5001/Kategori";
  const API_KELAS = "http://localhost:5001/Kelas";

  const getData = async () => {
    try {
      const res = await axios.get(API_DAFTAR);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getKategoriAktif = async () => {
    try {
      const res = await axios.get(API_KATEGORI);
      setKategoriAktif(
        res.data.filter((k) => k.aktif).map((k) => k.kategori_nama)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getKelasJurusan = async () => {
    try {
      const res = await axios.get(API_KELAS);
      setKelasList([
        "Semua",
        ...new Set(res.data.map((k) => k.kelas).filter(Boolean)),
      ]);
      setJurusanList([
        "Semua",
        ...new Set(res.data.map((k) => k.jurusan).filter(Boolean)),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
    getKategoriAktif();
    getKelasJurusan();
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin hapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_DAFTAR}/${id}`);
          Swal.fire("Data Berhasil Dihapus!", "", "success");
          getData();
        } catch (err) {
          console.error(err);
          Swal.fire("Gagal hapus data!", "", "error");
        }
      }
    });
  };

  const filteredData = data.filter((d) => {
    const matchKategori =
      filterKategori === "Semua" || d.kategori === filterKategori;
    const matchKelas = filterKelas === "Semua" || d.kelas === filterKelas;
    const matchJurusan =
      filterJurusan === "Semua" || d.jurusan === filterJurusan;
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase());
    const isKategoriAktif = kategoriAktif.includes(d.kategori);
    return (
      matchKategori &&
      matchKelas &&
      matchJurusan &&
      matchSearch &&
      isKategoriAktif
    );
  });

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-gray-800">
            Master Data
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <input
              placeholder="Cari nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded w-48"
            />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Semua">Semua Kategori</option>
              {kategoriAktif.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="border p-2 rounded"
            >
              {kelasList.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="border p-2 rounded"
            >
              {jurusanList.map((j, i) => (
                <option key={i} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 overflow-x-auto">
            <div className="flex justify-between mb-4 items-center">
              <h3 className="text-xl font-bold">
                Daftar Guru, Siswa, dan Karyawan
              </h3>
              <button
                onClick={() => navigate("/TambahData")}
                className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded"
              >
                + Tambah Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">RFID</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Kelas</th>
                    <th className="p-3 text-left">Jurusan</th>
                    <th className="p-3 text-left">Jabatan/Bagian</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Kategori</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                        } hover:bg-blue-50`}
                      >
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-mono">{item.nomorUnik}</td>
                        <td className="p-3">{item.nama}</td>
                        <td className="p-3">{item.kelas}</td>
                        <td className="p-3">{item.jurusan}</td>
                        <td className="p-3">{item.jabatan}</td>
                        <td className="p-3">{item.email}</td>
                        <td className="p-3">{item.kategori}</td>
                        <td className="p-3 flex gap-2 justify-center">
                          <button
                            onClick={() => navigate(`/EditData/${item.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 transition text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="p-4 text-center text-gray-500 italic"
                      >
                        Tidak ada data untuk filter ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
}

export default Daftar;
  