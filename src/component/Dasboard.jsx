import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const API_URL = "http://localhost:5001/Daftar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setData(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchData();
    setTimeout(() => setVisible(true), 200);
  }, []);

  const totalGuru = data.filter((d) => d.kategori === "Guru").length;
  const totalSiswa = data.filter((d) => d.kategori === "Siswa").length;
  const totalKaryawan = data.filter((d) => d.kategori === "Karyawan").length;
  const totalSemua = data.length;

  const filteredData = data.filter((d) => {
    const cocokKategori = filter === "Semua" || d.kategori === filter;
    const cocokNama = d.nama.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokNama;
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
            <i className="ri-dashboard-line text-4xl text-blue-500 animate-pulse"></i>
            DASHBOARD
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Semua", value: totalSemua },
              { label: "Total Guru", value: totalGuru },
              { label: "Total Siswa", value: totalSiswa },
              { label: "Total Karyawan", value: totalKaryawan },
            ].map((card, idx) => (
              <div
                key={idx}
                title={`Menampilkan jumlah ${card.label.toLowerCase()}`}
                className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-md border border-gray-200 text-center transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  {card.label}
                </h2>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="relative w-full md:w-64">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Cari nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-200"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 shadow-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-200"
            >
              <option value="Semua">Semua</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Daftar Data Terbaru
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Jabatan/Kelas/Bagian</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Kategori</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                        } hover:bg-blue-50 hover:border-l-4 hover:border-blue-500 transition duration-300`}
                      >
                        <td className="p-3 font-medium text-gray-700">
                          {index + 1}
                        </td>
                        <td className="p-3 text-gray-800">{item.nama}</td>
                        <td className="p-3 text-gray-700">{item.jabatan}</td>
                        <td className="p-3 text-gray-600">{item.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.kategori === "Guru"
                                ? "bg-blue-100 text-blue-700"
                                : item.kategori === "Siswa"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.kategori}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-gray-500 italic bg-gray-50"
                      >
                        Tidak ada data untuk pencarian atau kategori ini
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
};

export default Dashboard;
