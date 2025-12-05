import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function RekapPresensi() {
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const API_PRESENSI = "http://localhost:5001/presensi";

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

  // Filter berdasarkan tanggal dan kategori
  const filteredPresensi = presensi.filter(p => {
    const matchTanggal = filterTanggal ? p.tanggal === filterTanggal : true;
    const matchKategori = filterKategori === "Semua" ? true : p.kategori === filterKategori;
    return matchTanggal && matchKategori;
  });

  // Fungsi untuk menandai telat
  const checkTelat = (jamMasuk) => {
    if (!jamMasuk) return false;
    const [jam, menit] = jamMasuk.split(":").map(Number);
    const totalMenit = jam * 60 + menit;
    return totalMenit > 480; // 08:00 = 480 menit
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Rekap Presensi</h2>

      <div className="mb-4 flex gap-2 items-center">
        <label className="font-semibold">Filter Tanggal:</label>
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        
        <button
          onClick={() => {
            setFilterTanggal("");
            setFilterKategori("Semua");
          }}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>

        <label className="font-semibold">Filter Kategori:</label>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="Semua">Semua</option>
          <option value="Siswa">Siswa</option>
          <option value="Guru">Guru</option>
          <option value="Karyawan">Karyawan</option>
        </select>

      </div>

      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : filteredPresensi.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada data presensi</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Nomor Unik</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Kelas</th>
                <th className="p-2 border">Jurusan</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Jam Masuk</th>
                <th className="p-2 border">Jam Pulang</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPresensi.map((p, idx) => {
                let status = "";
                if (!p.jamMasuk && p.jamPulang) {
                  status = "Presensi di jam pulang, harus dicatat masuk juga";
                } else if (checkTelat(p.jamMasuk)) {
                  status = "Telat Masuk";
                } else if (!p.jamMasuk) {
                  status = "Belum Presensi";
                } else {
                  status = "Tepat Waktu";
                }

                return (
                  <tr key={p.id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}>
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">{p.nomorUnik}</td>
                    <td className="p-2 border">{p.nama}</td>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.kelas}</td>
                    <td className="p-2 border">{p.jurusan}</td>
                    <td className="p-2 border">{p.tanggal}</td>
                    <td className={`p-2 border ${checkTelat(p.jamMasuk) ? "text-red-600" : ""}`}>
                      {p.jamMasuk || "-"}
                    </td>
                    <td className="p-2 border">{p.jamPulang || "-"}</td>
                    <td className="p-2 border font-semibold">{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RekapPresensi;
