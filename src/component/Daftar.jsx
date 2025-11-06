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
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const API_URL = "http://localhost:5001/Daftar";

  const getData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getData();
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
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire("Data Berhasil Dihapus!", "", "success");
          getData();
        } catch (err) {
          console.error("Gagal hapus:", err.response?.data || err.message);
          Swal.fire("Gagal hapus data!", "", "error");
        }
      }
    });
  };

  // Ambil daftar jurusan unik dari data
  const jurusanList = ["Semua", ...new Set(data.map((d) => d.jurusan).filter(Boolean))];

  // 🔍 Filter + Search logic
  const filteredData = data.filter((d) => {
    const matchKategori =
      filterKategori === "Semua" || d.kategori === filterKategori;
    const matchKelas = filterKelas === "Semua" || d.kelas === filterKelas;
    const matchJurusan = filterJurusan === "Semua" || d.jurusan === filterJurusan;
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchKelas && matchJurusan && matchSearch;
  });

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-gray-800">
            <i className="ri-dashboard-horizontal-fill text-4xl text-blue-500 animate-pulse"></i>
            DAFTAR DATA
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Cari nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Filter Kategori */}
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>

            {/* Filter Kelas */}
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            {/* Filter Jurusan */}
            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {jurusanList.map((j, i) => (
                <option key={i} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Table Section */}
          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Daftar Guru, Siswa, dan Karyawan
              </h3>

              <button
                onClick={() => navigate("/TambahData")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
              >
                + Tambah Data
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
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
                        } hover:bg-blue-50 transition duration-300`}
                      >
                        <td className="p-3 text-gray-700">{index + 1}</td>
                        <td className="p-3 text-gray-800">{item.nama}</td>
                        <td className="p-3 text-gray-800">{item.kelas}</td>
                        <td className="p-3 text-gray-800">{item.jurusan}</td>
                        <td className="p-3 text-gray-700">{item.jabatan}</td>
                        <td className="p-3 text-gray-600">{item.email}</td>
                        <td className="p-3 text-gray-800">{item.kategori}</td>
                        <td className="p-3 flex justify-center gap-2">
                          <button
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                            onClick={() => navigate(`/EditData/${item.id}`)}
                          >
                            <i className="ri-edit-line"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                          >
                            <i className="ri-delete-bin-line"></i> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="p-4 text-center text-gray-500 italic bg-gray-50"
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
