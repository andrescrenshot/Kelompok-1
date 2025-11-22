import React, { useEffect, useState } from "react";
import axios from "axios";

// Memoized Table Users
const TableUsers = React.memo(
  ({
    title,
    kategori,
    data,
    showAll,
    setShowAll,
    filterKelas,
    filterJurusan,
    search,
  }) => {
    let filtered = [];
    if (kategori === "Siswa")
      filtered = data.filter(
        (d) =>
          (d.kategori || "").trim() === "Siswa" &&
          (filterKelas === "Semua" || d.kelas === filterKelas) &&
          (filterJurusan === "Semua" || d.jurusan === filterJurusan) &&
          (d.nama || "").toLowerCase().includes(search.toLowerCase())
      );
    if (kategori === "Guru")
      filtered = data.filter(
        (d) =>
          (d.kategori || "").trim() === "Guru" &&
          (d.nama || "").toLowerCase().includes(search.toLowerCase())
      );
    if (kategori === "Karyawan")
      filtered = data.filter(
        (d) =>
          (d.kategori || "").trim() === "Karyawan" &&
          (d.nama || "").toLowerCase().includes(search.toLowerCase())
      );

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
                <th className="p-3 text-center">No</th>
                <th className="p-3 text-center">Nama</th>
                {isSiswa && <th className="p-3 text-center">Kelas</th>}
                {isSiswa && <th className="p-3 text-center">Jurusan</th>}
                <th className="p-3 text-center">Jabatan/Bagian</th>
                <th className="p-3 text-center">Email</th>
                <th className="p-3 text-center">Kategori</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length > 0 ? (
                displayed.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3 text-center">{item.nama}</td>
                    {isSiswa && (
                      <td className="p-3 text-center">{item.kelas}</td>
                    )}
                    {isSiswa && (
                      <td className="p-3 text-center">{item.jurusan}</td>
                    )}
                    <td className="p-3 text-center">{item.jabatan}</td>
                    <td className="p-3 text-center">{item.email}</td>
                    <td className="p-3 text-center">{item.kategori}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={isSiswa ? 7 : 5}
                    className="p-4 text-center text-gray-500 italic"
                  >
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
              onClick={() =>
                setShowAll((prev) => ({ ...prev, [kategori]: !prev[kategori] }))
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {showAll[kategori]
                ? "Tampilkan Lebih Sedikit"
                : "Lihat Selengkapnya"}
            </button>
          </div>
        )}
      </div>
    );
  }
);

// Memoized Table Tagihan
const TableTagihan = React.memo(
  ({ tagihan, searchTagihan, filterStatus, filterJenisTagihan }) => {
    const filtered = tagihan.filter((t) => {
      const nama = (t.nama || "").toLowerCase();
      const status = (t.status || "").trim();
      const jenis = (t.jenis_tagihan || "").trim();
      return (
        nama.includes(searchTagihan.toLowerCase()) &&
        (filterStatus === "Semua" || status === filterStatus) &&
        (filterJenisTagihan === "Semua" || jenis === filterJenisTagihan)
      );
    });

    const formatRupiah = (num) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(Math.round(num || 0));

    return (
      <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          Daftar Tagihan
        </h2>

        <div className="overflow-x-auto rounded-lg shadow-inner">
          <table className="w-full border-collapse overflow-hidden">
            <thead className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <tr>
                <th className="p-3 text-center">No</th>
                <th className="p-3 text-center">Nama Siswa</th>
                <th className="p-3 text-center">Jenis Tagihan</th>
                <th className="p-3 text-center">Jumlah</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-green-50 transition`}
                  >
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3 text-center">{t.nama}</td>
                    <td className="p-3 text-center">{t.jenis_tagihan}</td>
                    <td className="p-3 text-right">{formatRupiah(t.jumlah)}</td>
                    <td className="p-3 font-semibold text-center">
                      <span
                        className={
                          t.status === "Lunas"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500 italic"
                  >
                    Tidak ada data tagihan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

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
  const [filterJenisTagihan, setFilterJenisTagihan] = useState("Semua");
  const [jenisTagihanOptions, setJenisTagihanOptions] = useState([]);

  const API_USERS = "http://localhost:5001/Daftar";
  const API_TAGIHAN = "http://localhost:5001/tagihan";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_USERS);
      setData(res.data.Daftar || res.data || []);
    } catch (err) {
      console.error("Gagal ambil data pengguna:", err);
    }
  };

  const fetchTagihan = async () => {
    try {
      const res = await axios.get(API_TAGIHAN);
      const cleanData = res.data.map((t) => ({
        ...t,
        jumlah: Math.round(t.jumlah || 0),
      }));
      setTagihan(cleanData);
      const jenisUnik = [...new Set(cleanData.map((t) => t.jenis_tagihan))];
      setJenisTagihanOptions(jenisUnik);
    } catch (err) {
      console.error("Gagal ambil data tagihan:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTagihan();
    setTimeout(() => setVisible(true), 200);
  }, []);

  // Statistik
  const totalGuru = data.filter(
    (d) => (d.kategori || "").trim() === "Guru"
  ).length;
  const totalSiswa = data.filter(
    (d) => (d.kategori || "").trim() === "Siswa"
  ).length;
  const totalKaryawan = data.filter(
    (d) => (d.kategori || "").trim() === "Karyawan"
  ).length;
  const totalSemua = data.length;

  const totalTagihan = tagihan.length;
  const totalLunas = tagihan.filter(
    (t) => (t.status || "").trim() === "Lunas"
  ).length;
  const totalBelumLunas = tagihan.filter(
    (t) => (t.status || "").trim() === "Belum Lunas"
  ).length;
  const totalNominal = tagihan.reduce(
    (sum, t) => sum + Math.round(t.jumlah || 0),
    0
  );
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num || 0));

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            DASHBOARD
          </h1>

          {/* Statistik Pengguna */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Semua", value: totalSemua },
              { label: "Guru", value: totalGuru },
              { label: "Siswa", value: totalSiswa },
              { label: "Karyawan", value: totalKaryawan },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-5 rounded-2xl shadow-md text-center"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  {card.label}
                </h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Statistik Tagihan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Tagihan", value: totalTagihan },
              { label: "Lunas", value: totalLunas },
              { label: "Belum Lunas", value: totalBelumLunas },
              { label: "Total Nominal", value: formatRupiah(totalNominal) },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-5 rounded-2xl shadow-md text-center"
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  {card.label}
                </h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* FILTER & TABEL */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>

            <select
              value={filterJurusan}
              onChange={(e) => setFilterJurusan(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white"
            >
              <option value="Semua">Semua Jurusan</option>
              <option value="TKJ">TKJ</option>
              <option value="TSM">TSM</option>
              <option value="AKUTANSI">AKUTANSI</option>
              <option value="TATA BUSANA">TATA BUSANA</option>
            </select>
          </div>

          <TableUsers
            title="Daftar Siswa"
            kategori="Siswa"
            data={data}
            showAll={showAll}
            setShowAll={setShowAll}
            filterKelas={filterKelas}
            filterJurusan={filterJurusan}
            search={search}
          />
          <TableUsers
            title="Daftar Guru"
            kategori="Guru"
            data={data}
            showAll={showAll}
            setShowAll={setShowAll}
            search={search}
          />
          <TableUsers
            title="Daftar Karyawan"
            kategori="Karyawan"
            data={data}
            showAll={showAll}
            setShowAll={setShowAll}
            search={search}
          />

          {/* Search Tagihan */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTagihan}
              onChange={(e) => setSearchTagihan(e.target.value)}
              className="w-full md:w-64 pl-3 py-2 rounded-lg border border-gray-300"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
            </select>
            <select
              value={filterJenisTagihan}
              onChange={(e) => setFilterJenisTagihan(e.target.value)}
              className="w-full md:w-48 py-2 px-3 rounded-lg border border-gray-300 bg-white"
            >
              <option value="Semua">Semua Jenis Tagihan</option>
              {jenisTagihanOptions.map((jenis, idx) => (
                <option key={idx} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          <TableTagihan
            tagihan={tagihan}
            searchTagihan={searchTagihan}
            filterStatus={filterStatus}
            filterJenisTagihan={filterJenisTagihan}
          />
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
};

export default Dashboard;
