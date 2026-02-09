// src/pages/Tagihan.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Tagihan() {
  const [data, setData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    siswaId: "",
    nama: "",
    jenisTagihanId: "",
    jenisTagihanNama: "",
    jumlah: "",
    status: "Belum Lunas",
  });

  const API_TAGIHAN = "http://localhost:8080/tagihan";
  const API_JENIS = "http://localhost:8080/jenis-tagihan";
  const API_MASTER = "http://localhost:8080/api/master-data";

  /* ============== LOAD DATA ============== */
  const getData = async () => {
    try {
      const res = await axios.get(API_TAGIHAN);
      setData(res.data);
    } catch (err) {
      console.error("Gagal mengambil data tagihan:", err);
    }
  };

  const getJenisTagihan = async () => {
    try {
      const res = await axios.get(API_JENIS);
      setJenisTagihan(
        res.data.filter((j) => j.aktif === true || j.aktif === 1),
      );
    } catch (err) {
      console.error("Gagal mengambil jenis tagihan:", err);
    }
  };

  const getMasterData = async () => {
    try {
      const res = await axios.get(API_MASTER);
      const siswaList = res.data.filter(
        (item) => item.kategori?.toLowerCase() === "siswa",
      );
      setMasterData(siswaList || []);
    } catch (err) {
      console.error("Gagal mengambil master data:", err);
    }
  };

  useEffect(() => {
    getData();
    getJenisTagihan();
    getMasterData();
    setTimeout(() => setVisible(true), 200);
  }, []);

  const filteredData =
    filter === "Semua" ? data : data.filter((item) => item.status === filter);

  /* ============== FORMAT RUPIAH ============== */
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.round(num || 0));

  const formatInputRupiah = (num) => {
    if (!num) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(num));
  };

  /* ============== HANDLE FORM ============== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "jumlah") {
      const numeric = value.replace(/\D/g, "");
      setFormData({ ...formData, jumlah: numeric ? parseInt(numeric) : "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.siswaId ||
      !formData.nama ||
      !formData.jenisTagihanId ||
      !formData.jenisTagihanNama ||
      !formData.jumlah
    ) {
      return Swal.fire("Oops!", "Semua field wajib diisi", "warning");
    }

    setLoading(true);
    try {
      const payload = {
        siswaId: formData.siswaId,
        nama: formData.nama,
        jenisTagihanId: formData.jenisTagihanId,
        jenisTagihanNama: formData.jenisTagihanNama,
        jumlah: Number(formData.jumlah),
        status: formData.status,
      };

      if (formData.id) {
        await axios.put(`${API_TAGIHAN}/${formData.id}`, payload);
        Swal.fire("Berhasil!", "Tagihan berhasil diupdate", "success");
      } else {
        await axios.post(API_TAGIHAN, payload);
        Swal.fire("Berhasil!", "Tagihan berhasil ditambahkan", "success");
      }

      setShowForm(false);
      setFormData({
        id: null,
        siswaId: "",
        nama: "",
        jenisTagihanId: "",
        jenisTagihanNama: "",
        jumlah: "",
        status: "Belum Lunas",
      });
      getData();
    } catch (err) {
      console.error(err.response?.data);
      Swal.fire("Error!", "Gagal menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      siswaId: item.siswaId,
      nama: item.nama,
      jenisTagihanId: item.jenisTagihanId,
      jenisTagihanNama: item.jenisTagihanNama,
      jumlah: item.jumlah,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_TAGIHAN}/${id}/status`, { status: newStatus });
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item,
        ),
      );
      Swal.fire("Berhasil!", `Status diubah menjadi ${newStatus}`, "success");
    } catch {
      Swal.fire("Gagal!", "Tidak dapat mengubah status", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus tagihan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_TAGIHAN}/${id}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Berhasil!", "Tagihan dihapus", "success");
      } catch {
        Swal.fire("Gagal!", "Tidak dapat menghapus tagihan", "error");
      }
    }
  };

  /* ============== UI ============== */
  return (
    <div
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            TAGIHAN
          </h1>

          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Data Tagihan Pembayaran
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Semua">Semua</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  + Tambah Tagihan
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-center">No</th>
                    <th className="p-3 text-center">Nama</th>
                    <th className="p-3 text-center">Jenis Tagihan</th>
                    <th className="p-3 text-center">Jumlah</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length ? (
                    filteredData.map((item, i) => (
                      <tr
                        key={item.id}
                        className={`${i % 2 ? "bg-gray-50" : "bg-gray-100"} hover:bg-blue-50 transition`}
                      >
                        <td className="p-3 text-center">{i + 1}</td>
                        <td className="p-3">{item.nama}</td>
                        <td className="p-3">{item.jenisTagihanNama}</td>
                        <td className="p-3 text-right">
                          {formatRupiah(item.jumlah)}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === "Lunas" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-700"}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 flex justify-center gap-2 flex-wrap">
                          {item.status === "Belum Lunas" ? (
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "Lunas")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                            >
                              Lunas
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id, "Belum Lunas")
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                            >
                              Reset
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {formData.id ? "Edit Tagihan" : "Tambah Tagihan"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Siswa */}
              <select
                name="siswaId"
                value={formData.siswaId}
                onChange={(e) => {
                  const siswa = masterData.find((s) => s.id == e.target.value);
                  setFormData({
                    ...formData,
                    siswaId: siswa.id,
                    nama: siswa.nama,
                  });
                }}
                required
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                <option value="">-- Pilih Siswa --</option>
                {masterData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} ({item.kelas} - {item.jurusan})
                  </option>
                ))}
              </select>

              {/* Jenis Tagihan */}
              <select
                name="jenisTagihanId"
                value={formData.jenisTagihanId}
                onChange={(e) => {
                  const jenis = jenisTagihan.find(
                    (j) => j.id == e.target.value,
                  );
                  setFormData({
                    ...formData,
                    jenisTagihanId: jenis.id,
                    jenisTagihanNama: jenis.nama,
                  });
                }}
                required
                className="border border-gray-300 p-3 rounded-lg w-full"
              >
                <option value="">-- Pilih Jenis Tagihan --</option>
                {jenisTagihan.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="jumlah"
                placeholder="Jumlah (Rp)"
                value={formatInputRupiah(formData.jumlah)}
                onChange={handleChange}
                required
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition duration-200"
              />

              <div className="flex gap-4 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                >
                  {loading
                    ? "Menyimpan..."
                    : formData.id
                      ? "Simpan Perubahan"
                      : "Tambah Tagihan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
}

export default Tagihan;
