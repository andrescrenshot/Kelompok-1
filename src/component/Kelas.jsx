import { useState, useEffect } from "react";
import axios from "axios";

function Kelas() {
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState("X");
  const [jurusan, setJurusan] = useState("");
  const API_URL = "http://localhost:5001/Daftar";

  const getSiswa = async () => {
    try {
      const res = await axios.get(API_URL);
      const filtered = res.data.filter(
        (d) =>
          d.kategori === "Siswa" &&
          d.kelas === kelas &&
          (jurusan === "" || d.jurusan === jurusan) 
      );
      setSiswa(filtered);
    } catch (err) {
      console.error("Gagal mengambil data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getSiswa();
  }, [kelas, jurusan]); 

  return (
    <div className="p-8 min-h-screen bg-gray-50 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Daftar Siswa Kelas {kelas}</h1>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Pilih Kelas:</label>
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Pilih Jurusan:</label>
          <select
            value={jurusan}
            onChange={(e) => setJurusan(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Semua Jurusan</option>
            <option value="TKJ">TKJ</option>
            <option value="TSM">TSM</option>
            <option value="AKUTANSI">AKUTANSI</option>
            <option value="TATA BUSANA">TATA BUSANA</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">No</th>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {siswa.length > 0 ? (
            siswa.map((item, index) => (
              <tr
                key={item.id}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.nama}</td>
                <td className="p-3">{item.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                Tidak ada siswa di kelas ini
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Kelas;
