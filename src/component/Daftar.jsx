import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Daftar() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/Daftar";

  const getData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Yakin hapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire("Dihapus!", "", "success");
          getData();
        } catch (err) {
          console.error("Gagal hapus:", err.response?.data || err.message);
          Swal.fire("Gagal hapus data!", "", "error");
        }
      }
    });
  };

  const filteredData =
    filter === "Semua" ? data : data.filter((d) => d.kategori === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-8 flex justify-center rounded-lg">
      <div className="w-full max-w-6xl space-y-8">
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Daftar Guru, Siswa, dan Karyawan
            </h3>

            <div className="flex gap-3">
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

              <button
                onClick={() => navigate("/TambahData")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
              >
                + Tambah Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="w-full border-collapse overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Jabatan/Kelas/Bagian</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Kategori</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-50"
                          : "bg-gray-100"
                      } hover:bg-blue-100 transition duration-200`}
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
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          className="flex items-center gap-1 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                          onClick={() => navigate(`/EditData/${item.id}`)}
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          <i className="ri-delete-bin-line"></i> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-4 text-center text-gray-500 italic bg-gray-50"
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
    </div>
  );
}

export default Daftar;
