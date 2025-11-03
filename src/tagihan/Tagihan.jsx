import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Tagihan() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/tagihan";

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
    setTimeout(() => setVisible(true), 200);
  }, []);

  const filteredData =
    filter === "Semua" ? data : data.filter((item) => item.status === filter);

  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  const handleBayar = (id) => {
    Swal.fire({
      title: "Konfirmasi Pembayaran",
      text: "Apakah tagihan ini sudah dibayar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, tandai lunas",
      cancelButtonText: "Batal",
      confirmButtonColor: "#16a34a",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`${API_URL}/${id}`, { status: "Lunas" });
          Swal.fire("Berhasil!", "Tagihan ditandai sebagai lunas.", "success");
          getData();
        } catch {
          Swal.fire("Gagal!", "Tidak dapat memperbarui status.", "error");
        }
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus tagihan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire("Berhasil!", "Tagihan dihapus.", "success");
          getData();
        } catch {
          Swal.fire("Gagal!", "Tidak dapat menghapus tagihan.", "error");
        }
      }
    });
  };

  return (
    <div className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-gray-800">
            <i className="ri-wallet-2-line text-4xl text-blue-500 animate-pulse"></i> TAGIHAN
          </h1>

          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Data Tagihan Pembayaran</h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 py-2 px-3 rounded-lg text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition duration-200"
                >
                  <option value="Semua">Semua</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>

                <button
                  onClick={() => navigate("/TambahTagihan")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
                >
                  + Tambah Tagihan
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left">Jenis Tagihan</th>
                    <th className="p-3 text-left">Jumlah</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-50 hover:border-l-4 hover:border-blue-500 transition duration-300`}>
                        <td className="p-3 font-medium text-gray-700">{index + 1}</td>
                        <td className="p-3 text-gray-800">{item.nama_pelanggan}</td>
                        <td className="p-3 text-gray-700">{item.jenis_tagihan}</td>
                        <td className="p-3 text-gray-700">{formatRupiah(item.jumlah)}</td>
                        <td className="p-3 text-gray-600">{item.tanggal_jatuh_tempo}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === "Lunas" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 flex flex-wrap justify-center gap-2">
                          {item.status === "Belum Lunas" && (
                            <button onClick={() => handleBayar(item.id)} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow transition duration-300">
                              <i className="ri-check-line"></i> Lunas
                            </button>
                          )}
                          <button onClick={() => navigate(`/EditTagihan/${item.id}`)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition duration-300">
                            <i className="ri-edit-line"></i> Edit
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition duration-300">
                            <i className="ri-delete-bin-line"></i> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500 italic bg-gray-50">
                        Tidak ada data tagihan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm pt-6">© {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙</p>
    </div>
  );
}

export default Tagihan;
