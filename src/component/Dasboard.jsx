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
            <i className="ri-dashboard-line text-4xl text-blue-500 animate-bounce"></i>
            DASHBOARD
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 cursor-pointer">
              <h2 className="text-lg font-semibold mb-2"> Total Semua</h2>
              <p className="text-2xl font-bold">{totalSemua}</p>
            </div>
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">Total Guru</h2>
              <p className="text-2xl font-bold">{totalGuru}</p>
            </div>
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">Total Siswa</h2>
              <p className="text-2xl font-bold">{totalSiswa}</p>
            </div>
            <div className="bg-gray-900 text-white p-5 rounded-lg shadow text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800 cursor-pointer">
              <h2 className="text-lg font-semibold mb-2">Total Karyawan</h2>
              <p className="text-2xl font-bold">{totalKaryawan}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 p-2"
            >
              <option value="Semua">Semua</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Karyawan">Karyawan</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg ">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Daftar Data Terbaru
            </h2>
            <table className="w-full border border-gray-200 rounded-lg ">
              <thead className="bg-gray-200 text-gray-700">
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
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3">{item.jabatan}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.kategori}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-4 text-center text-gray-500 italic"
                    >
                      Tidak ada data untuk kategori ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
