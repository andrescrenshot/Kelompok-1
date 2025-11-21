import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const [showAll, setShowAll] = useState({
    Siswa: false,
    Guru: false,
    Karyawan: false,
  });

  const [searchTagihan, setSearchTagihan] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const API_USERS = "http://localhost:5001/Daftar";
  const API_TAGIHAN = "http://localhost:5001/tagihan";

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_USERS);
      setData(res.data.Daftar || res.data || []);
    } catch (err) {
      console.error("Gagal ambil data pengguna:", err);
    }
  };

  // Fetch Tagihan
  const fetchTagihan = async () => {
    try {
      const res = await axios.get(API_TAGIHAN);
      // Pastikan semua jumlah dibulatkan
      const cleanData = res.data.map((t) => ({
        ...t,
        jumlah: Math.round(t.jumlah || 0),
      }));
      setTagihan(cleanData);
    } catch (err) {
      console.error("Gagal ambil data tagihan:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTagihan();
    setTimeout(() => setVisible(true), 200);
  }, []);

  // Statistik Pengguna
  const totalGuru = data.filter((d) => (d.kategori || "").trim() === "Guru").length;
  const totalSiswa = data.filter((d) => (d.kategori || "").trim() === "Siswa").length;
  const totalKaryawan = data.filter((d) => (d.kategori || "").trim() === "Karyawan").length;
  const totalSemua = data.length;

  // Statistik Tagihan
  const totalTagihan = tagihan.length;
  const totalLunas = tagihan.filter((t) => (t.status || "").trim() === "Lunas").length;
  const totalBelumLunas = tagihan.filter((t) => (t.status || "").trim() === "Belum Lunas").length;
  const totalNominal = tagihan.reduce((sum, t) => sum + Math.round(t.jumlah || 0), 0);

  // Filter Siswa
  const filterSiswa = () =>
    data.filter((d) => {
      if ((d.kategori || "").trim() !== "Siswa") return false;
      return (
        (filterKelas === "Semua" || d.kelas === filterKelas) &&
        (filterJurusan === "Semua" || d.jurusan === filterJurusan) &&
        (d.nama || "").toLowerCase().includes(search.toLowerCase())
      );
    });

  const filterGuru = () =>
    data.filter(
      (d) =>
        (d.kategori || "").trim() === "Guru" &&
        (d.nama || "").toLowerCase().includes(search.toLowerCase())
    );

  const filterKaryawan = () =>
    data.filter(
      (d) =>
        (d.kategori || "").trim() === "Karyawan" &&
        (d.nama || "").toLowerCase().includes(search.toLowerCase())
    );

  // FILTER TAGIHAN
  const filterDataTagihan = () =>
    tagihan.filter((t) => {
      const nama = (t.nama || "").toLowerCase();
      const status = (t.status || "").trim();

      return (
        nama.includes(searchTagihan.toLowerCase()) &&
        (filterStatus === "Semua" || status === filterStatus)
      );
    });

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0, // **hapus desimal**
    }).format(Math.round(num || 0));

  const TableUsers = ({ title, kategori }) => {
    let filtered = [];
    if (kategori === "Siswa") filtered = filterSiswa();
    if (kategori === "Guru") filtered = filterGuru();
    if (kategori === "Karyawan") filtered = filterKaryawan();

    const isSiswa = kategori === "Siswa";
    const displayed = showAll[kategori] ? filtered : filtered.slice(0, 5);

    return (
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          {title}
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-inner">
          <table className="w-full border-collapse overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Nama</th>
                {isSiswa && <th className="p-3 text-left">Kelas</th>}
                {isSiswa && <th className="p-3 text-left">Jurusan</th>}
                <th className="p-3 text-left">Jabatan/Bagian</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Kategori</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length > 0 ? (
                displayed.map((item, i) => (
                  <tr
                    key={item.id || i}
                    className={`${i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-50 transition`}
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{item.nama}</td>
                    {isSiswa && <td className="p-3">{item.kelas}</td>}
                    {isSiswa && <td className="p-3">{item.jurusan}</td>}
                    <td className="p-3">{item.jabatan}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.kategori}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSiswa ? 7 : 5} className="p-4 text-center text-gray-500 italic">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 5 && (
          <div className="text-center mt-3">
            <button
              onClick={() => setShowAll((prev) => ({ ...prev, [kategori]: !prev[kategori] }))}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {showAll[kategori] ? "Tampilkan Lebih Sedikit" : "Lihat Selengkapnya"}
            </button>
          </div>
        )}
      </div>
    );
  };

  const TableTagihan = () => (
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
        Daftar Tagihan
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-inner">
        <table className="w-full border-collapse overflow-hidden">
          <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Jumlah</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterDataTagihan().length > 0 ? (
              filterDataTagihan().map((t, i) => (
                <tr
                  key={t.id || i}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-green-50 transition`}
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{t.nama}</td>
                  <td className="p-3 text-right">{formatRupiah(t.jumlah)}</td>
                  <td className="p-3 font-semibold text-center">
                    <span className={t.status === "Lunas" ? "text-green-600" : "text-red-600"}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                  Tidak ada data tagihan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">DASHBOARD</h1>

          {/* Statistik Pengguna */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{ label: "Total Semua", value: totalSemua }, { label: "Guru", value: totalGuru }, { label: "Siswa", value: totalSiswa }, { label: "Karyawan", value: totalKaryawan }].map((card, idx) => (
              <div key={idx} className="bg-white/90 p-5 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">{card.label}</h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Statistik Tagihan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{ label: "Total Tagihan", value: totalTagihan }, { label: "Lunas", value: totalLunas }, { label: "Belum Lunas", value: totalBelumLunas }, { label: "Total Nominal", value: formatRupiah(totalNominal) }].map((card, idx) => (
              <div key={idx} className="bg-white/90 p-5 rounded-2xl shadow-md text-center">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">{card.label}</h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* FILTER & TABEL */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <input type="text" placeholder="Cari nama pengguna..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300" />
            </div>

            <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white">
              <option value="Semua">Semua Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            <select value={filterJurusan} onChange={(e) => setFilterJurusan(e.target.value)} className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white">
              <option value="Semua">Semua Jurusan</option>
              <option value="TKJ">TKJ</option>
              <option value="TSM">TSM</option>
              <option value="AKUTANSI">AKUTANSI</option>
              <option value="TATA BUSANA">TATA BUSANA</option>
            </select>
          </div>

          <TableUsers title="Daftar Siswa" kategori="Siswa" />
          <TableUsers title="Daftar Guru" kategori="Guru" />
          <TableUsers title="Daftar Karyawan" kategori="Karyawan" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6 mt-10">
            <div className="relative w-full md:w-64">
              <input type="text" placeholder="Cari nama tagihan..." value={searchTagihan} onChange={(e) => setSearchTagihan(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300" />
            </div>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white">
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
            </select>
          </div>

          <TableTagihan />
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm pt-6">© {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙</p>
    </div>
  );
};

export default Dashboard;
