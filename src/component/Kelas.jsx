// src/pages/Kelas.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Kelas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ kelas: "", jurusan: "" });
  const [editId, setEditId] = useState(null);
  const [visible, setVisible] = useState(false);

  const API_URL = "http://localhost:5001/Kelas";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setData(res.data || []);
    } catch (error) {
      Swal.fire("Gagal", "Tidak bisa mengambil data kelas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kelas || !formData.jurusan) {
      Swal.fire("Peringatan", "Kelas dan Jurusan harus diisi", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        Swal.fire("Berhasil", "Data kelas diperbarui", "success");
      } else {
        await axios.post(API_URL, formData);
        Swal.fire("Berhasil", "Data kelas ditambahkan", "success");
      }
      setFormData({ kelas: "", jurusan: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      Swal.fire("Gagal", "Tidak bisa menyimpan data kelas", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setData(data.filter((d) => d.id !== id));
        Swal.fire("Berhasil", "Data dihapus", "success");
      } catch (error) {
        Swal.fire("Gagal", "Tidak bisa menghapus data", "error");
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({ kelas: item.kelas, jurusan: item.jurusan });
    setEditId(item.id);
  };

  const handleCancelEdit = () => {
    setFormData({ kelas: "", jurusan: "" });
    setEditId(null);
  };

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl space-y-8">

          {/* Header */}
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            Data Kelas
          </h1>

          {/* Form */}
          <form className="flex flex-col sm:flex-row gap-2 mb-6" onSubmit={handleSubmit}>
            <input
              placeholder="Kelas (X / XI / XII)"
              value={formData.kelas}
              onChange={(e) =>
                setFormData({ ...formData, kelas: e.target.value })
              }
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <input
              placeholder="Jurusan"
              value={formData.jurusan}
              onChange={(e) =>
                setFormData({ ...formData, jurusan: e.target.value })
              }
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <button
              type="submit"
              className={`${
                editId
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300`}
            >
              {editId ? "💾 Update" : "+ Tambah Kelas"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
              >
                Batal
              </button>
            )}
          </form>

          {/* Tabel */}
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="w-full border-collapse overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Kelas</th>
                  <th className="p-3 text-left">Jurusan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  [...data].map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{item.kelas}</td>
                      <td className="p-3">{item.jurusan}</td>

                      <td className="p-3 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500 italic bg-gray-50"
                    >
                      Tidak ada data kelas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm pt-6">
            © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
          </p>
        </div>
      </div>
    </div>
  );
}

export default Kelas;
