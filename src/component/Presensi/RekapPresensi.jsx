import { useState, useEffect } from "react";
import axios from "axios";

function RekapPresensi() {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const API_PRESENSI = "http://localhost:5001/presensi";

  // ================================
  // GET DATA PRESENSI
  // ================================
  const getPresensi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PRESENSI);
      setPresensi(res.data);
    } catch (err) {
      console.error("Gagal fetch presensi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPresensi();
  }, []);

  // ================================
  // FILTER DATA
  // ================================
  const filteredPresensi = presensi.filter((p) => {
    const matchTanggal =
      filterTanggal ? p.tanggal === filterTanggal : true;

    const matchKategori =
      filterKategori === "Semua" ? true : p.kategori === filterKategori;

    return matchTanggal && matchKategori;
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-blue-200 animate-fadeIn">

      <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
        Rekap Presensi
      </h2>

      {/* FILTER CARD */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-wrap items-center gap-4">

        <div>
          <label className="font-semibold text-sm">Filter Tanggal</label>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="border px-3 py-2 rounded-lg block mt-1 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="font-semibold text-sm">Filter Kategori</label>
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="border px-3 py-2 rounded-lg block mt-1 shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="Semua">Semua</option>
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilterTanggal("");
            setFilterKategori("Semua");
          }}
          className="ml-auto bg-gray-300 px-4 py-2 mt-5 rounded-lg text-sm hover:bg-gray-400 shadow"
        >
          Reset Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPresensi.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Tidak ada data presensi.
          </p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 border">No</th>
                <th className="p-3 border">Nomor Unik</th>
                <th className="p-3 border">Nama</th>
                <th className="p-3 border">Kategori</th>
                <th className="p-3 border">Kelas</th>
                <th className="p-3 border">Jurusan</th>
                <th className="p-3 border">Tanggal</th>
                <th className="p-3 border">Jam Masuk</th>
                <th className="p-3 border">Jam Pulang</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPresensi.map((p, idx) => {
                // ================================
                // STATUS PRESENSI
                // ================================

                let statusFinal = "-";
                let color = "";

                if (!p.jamMasuk && !p.jamPulang) {
                  statusFinal = "Belum Presensi";
                  color = "text-gray-500";
                } else if (p.jamMasuk && !p.jamPulang) {
                  statusFinal = p.statusMasuk || "Masuk";
                  color =
                    statusFinal === "Terlambat"
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold";
                } else if (p.jamMasuk && p.jamPulang) {
                  statusFinal = `${p.statusMasuk || ""} / ${p.statusPulang || ""}`;
                  color = "text-blue-700 font-semibold";
                }

                return (
                  <tr
                    key={p.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border">{p.nomorUnik}</td>
                    <td className="p-2 border font-semibold">{p.nama}</td>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.kelas}</td>
                    <td className="p-2 border">{p.jurusan}</td>
                    <td className="p-2 border">{p.tanggal}</td>
                    <td className="p-2 border">{p.jamMasuk || "-"}</td>
                    <td className="p-2 border">{p.jamPulang || "-"}</td>
                    <td className={`p-2 border ${color}`}>{statusFinal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Fade Animation */}
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn .5s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}

export default RekapPresensi;
