import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function Daftar() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    jabatan: "",
    kategori: "Guru",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.jabatan) {
      Swal.fire("Lengkapi data!", "", "warning");
      return;
    }

    try {
      const payload = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        kategori: formData.kategori,
      };

      if (formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, payload);
        Swal.fire("Data diperbarui!", "", "success");
      } else {
        await axios.post(API_URL, payload);
        Swal.fire("Data ditambahkan!", "", "success");
      }

      setFormData({ id: null, nama: "", jabatan: "", kategori: "Guru" });
      getData();
    } catch (err) {
      console.error("Gagal menyimpan:", err.response?.data || err.message);
      Swal.fire("Gagal menyimpan data!", err.response?.data?.message || "", "error");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id, 
      nama: item.nama || "",
      jabatan: item.jabatan || "",
      kategori: item.kategori || "Guru",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
            {formData.id ? "Edit Data" : "Tambah Data"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Nama</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Jabatan/Kelas/Bagian</label>
              <input
                type="text"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                placeholder="Masukkan jabatan/kelas/bagian"
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Kategori</label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
              >
                <option value="Guru">Guru</option>
                <option value="Siswa">Siswa</option>
                <option value="Karyawan">Karyawan</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-center mt-2">
              <button
                type="submit"
                className={`${
                  formData.id ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold px-6 py-2 rounded`}
              >
                {formData.id ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-700">Daftar Guru, Siswa, dan Karyawan</h3>
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Jabatan/Kelas/Bagian</th>
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
                      <td className="p-3">{item.kategori}</td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
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
                    <td colSpan="5" className="p-4 text-center text-gray-500 italic">
                      Tidak ada data untuk kategori ini (ini chat gpt)
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
