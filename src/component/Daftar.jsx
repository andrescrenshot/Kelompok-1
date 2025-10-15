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
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h3 className="text-xl font-bold text-gray-700">
              Daftar Guru, Siswa, dan Karyawan
            </h3>

            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="Semua">Semua</option>
                <option value="Guru">Guru</option>
                <option value="Siswa">Siswa</option>
                <option value="Karyawan">Karyawan</option>
              </select>

              <button
                onClick={() => navigate("/TambahData")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
              >
                + Tambah Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
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
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{item.nama}</td>
                      <td className="p-3">{item.jabatan}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3">{item.kategori}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => navigate(`/EditData/${item.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
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
    </div>
  );
}

export default Daftar;
