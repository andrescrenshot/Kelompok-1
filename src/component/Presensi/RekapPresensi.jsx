import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function RekapPresensi() {
  const today = new Date().toISOString().split("T")[0];
  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState(today);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [searchNomor, setSearchNomor] = useState("");

  const API_PRESENSI = "http://localhost:5001/presensi";

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const [y, m, d] = tgl.split("-");
    return `${d}/${m}/${y}`;
  };

  const getPresensi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PRESENSI);
      setPresensi(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Gagal mengambil data presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPresensi();
  }, []);

  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Presensi?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    await axios.delete(`${API_PRESENSI}/${id}`);
    Swal.fire("Berhasil", "Presensi dihapus", "success");
    getPresensi();
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredPresensi = useMemo(() => {
    return presensi.filter((p) => {
      const matchTanggal = filterTanggal ? p.tanggal === filterTanggal : true;
      const matchKategori =
        filterKategori === "Semua" ? true : p.kategori === filterKategori;
      const matchNomor = searchNomor
        ? String(p.nomorUnik).includes(searchNomor)
        : true;

      return matchTanggal && matchKategori && matchNomor;
    });
  }, [presensi, filterTanggal, filterKategori, searchNomor]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          Rekap Presensi
        </h2>

        {/* FILTER */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* TANGGAL */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Tanggal
              </label>
              <input
                type="date"
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Kategori
              </label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
                <option value="Karyawan">Karyawan</option>
              </select>
            </div>

            {/* SEARCH NOMOR */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Cari Nomor RFID Siswa
              </label>
              <input
                type="text"
                value={searchNomor}
                onChange={(e) => setSearchNomor(e.target.value)}
                placeholder="Contoh: 1023"
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex gap-2 md:justify-end">
              <button
                onClick={() => {
                  setFilterTanggal(today);
                  setFilterKategori("Semua");
                  setSearchNomor("");
                }}
                className="rounded-xl border px-4 py-2 hover:bg-slate-100"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredPresensi.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Tidak ada data presensi
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-400 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nomor</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Kategori</th>
                    <th className="p-3 text-left">Kelas</th>
                    <th className="p-3 text-left">Jurusan</th>
                    <th className="p-3 text-left">Tanggal</th>
                    <th className="p-3 text-left">Masuk</th>
                    <th className="p-3 text-left">Pulang</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Keterangan</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPresensi.map((p, i) => (
                    <tr key={p.id} className="border-t hover:bg-slate-50">
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{p.nomorUnik}</td>
                      <td className="p-3 font-semibold">{p.nama}</td>
                      <td className="p-3">{p.kategori}</td>
                      <td className="p-3">{p.kelas || "-"}</td>
                      <td className="p-3">{p.jurusan || "-"}</td>
                      <td className="p-3">{formatTanggal(p.tanggal)}</td>
                      <td className="p-3">{p.jamMasuk || "-"}</td>
                      <td className="p-3">{p.jamPulang || "-"}</td>
                      <td className="p-3">{p.statusMasuk || p.status}</td>
                      <td className="p-3">{p.keteranganIzin || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleHapus(p.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
