// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// ============================
// Table Users
// ============================
const TableUsers = ({
  title,
  kategori,
  data,
  filterKelas,
  filterJurusan,
  search,
}) => {
  const isSiswa = kategori === "Siswa";

  const filtered = (data || []).filter((d) => {
    const nama = d?.nama?.toLowerCase() || "";
    const kelas = d?.kelas || "";
    const jurusan = d?.jurusan || "";
    const kategoriItem = d?.kategori || "";

    return (
      kategoriItem === kategori &&
      nama.includes(search.toLowerCase()) &&
      (filterKelas === "Semua" || kelas === filterKelas) &&
      (filterJurusan === "Semua" || jurusan === filterJurusan)
    );
  });

  return (
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
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
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <tr
                  key={item.id || i}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-50 transition`}
                >
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3">{item.nama || "-"}</td>
                  {isSiswa && <td className="p-3">{item.kelas || "-"}</td>}
                  {isSiswa && <td className="p-3">{item.jurusan || "-"}</td>}
                  <td className="p-3">{item.jabatan || "-"}</td>
                  <td className="p-3">{item.email || "-"}</td>
                  <td className="p-3">{item.kategori || "-"}</td>
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
    </div>
  );
};

// ============================
// Table Tagihan
// ============================
const TableTagihan = ({ tagihan }) => {
  const filtered = tagihan || [];

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num || 0));

  return (
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
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
                  key={t.id || i}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-green-50 transition`}
                >
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3">{t.nama || "-"}</td>
                  <td className="p-3">{t.jenis_tagihan || "-"}</td>
                  <td className="p-3 text-right">{formatRupiah(t.jumlah)}</td>
                  <td className="p-3 text-center">{t.status || "-"}</td>
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
};

// ============================
// Dashboard
// ============================
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [tagihan, setTagihan] = useState([]);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterJurusan, setFilterJurusan] = useState("Semua");
  const [visible, setVisible] = useState(false);

  const API_USERS = "http://localhost:8080/api/master-data";
  const API_TAGIHAN = "http://localhost:8080/tagihan";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tagihanRes] = await Promise.all([
          axios.get(API_USERS),
          axios.get(API_TAGIHAN),
        ]);
        const users = usersRes.data || [];
        const tagihanRaw = tagihanRes.data || [];

        // Buat map untuk pencarian cepat
        const usersMap = users.reduce((acc, u) => {
          acc[Number(u.id)] = u;
          return acc;
        }, {});

        const tagihanClean = tagihanRaw.map((t) => {
          const siswa = usersMap[Number(t.siswaId)];
          return {
            ...t,
            nama: siswa?.nama || "-",
            kelas: siswa?.kelas || "-",
            jurusan: siswa?.jurusan || "-",
            jenis_tagihan: t.jenisTagihanNama || "-", // sesuaikan dengan backend
            jumlah: Math.round(t.jumlah || 0),
            status: t.status || "-",
          };
        });

        setData(users);
        setTagihan(tagihanClean);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };
    fetchData();
    setTimeout(() => setVisible(true), 200);
  }, []);

  // Statistik
  const totalGuru = data.filter((d) => d.kategori === "Guru").length;
  const totalSiswa = data.filter((d) => d.kategori === "Siswa").length;
  const totalKaryawan = data.filter((d) => d.kategori === "Karyawan").length;
  const totalSemua = data.length;

  const totalTagihan = tagihan.length;
  const totalLunas = tagihan.filter((t) => t.status === "Lunas").length;
  const totalBelumLunas = tagihan.filter(
    (t) => t.status === "Belum Lunas",
  ).length;
  const totalNominal = tagihan.reduce((sum, t) => sum + t.jumlah, 0);

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num || 0));

  return (
    <div
      className={`transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            DASHBOARD
          </h1>

          {/* Statistik */}
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

          {/* Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-3 py-2 rounded-lg border border-gray-300"
            />
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

          {/* Tables */}
          <TableUsers
            title="Daftar Siswa"
            kategori="Siswa"
            data={data}
            filterKelas={filterKelas}
            filterJurusan={filterJurusan}
            search={search}
          />
          <TableUsers
            title="Daftar Guru"
            kategori="Guru"
            data={data}
            search={search}
          />
          <TableUsers
            title="Daftar Karyawan"
            kategori="Karyawan"
            data={data}
            search={search}
          />
          <TableTagihan tagihan={tagihan} />
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
};

export default Dashboard;
