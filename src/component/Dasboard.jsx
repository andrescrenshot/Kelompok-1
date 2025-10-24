import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Semua");
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
    setTimeout(() => setVisible(true), 100);
  }, []);

  const totalGuru = data.filter((d) => d.kategori === "Guru").length;
  const totalSiswa = data.filter((d) => d.kategori === "Siswa").length;
  const totalKaryawan = data.filter((d) => d.kategori === "Karyawan").length;
  const totalSemua = data.length;

  const filteredData =
    filter === "Semua" ? data : data.filter((d) => d.kategori === filter);

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <i className="ri-dashboard-line text-4xl text-blue-500 animate-spin"></i>
            DASHBOARD
          </h1>

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{ label: "Total Semua", value: totalSemua },
              { label: "Total Guru", value: totalGuru },
              { label: "Total Siswa", value: totalSiswa },
              { label: "Total Karyawan", value: totalKaryawan }].map((card, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-lg p-5 rounded-2xl shadow-2xl border border-gray-200 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-white cursor-pointer"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-800">{card.label}</h2>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex justify-end">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>

          {/* Tabel Data */}
          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Daftar Data Terbaru
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
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
                        } hover:bg-blue-100 transition duration-200`}
                      >
                        <td className="p-3 font-medium text-gray-700">{index + 1}</td>
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
                      <td colSpan="5" className="p-4 text-center text-gray-500 italic bg-gray-50">
                        Tidak ada data untuk kategori ini
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
