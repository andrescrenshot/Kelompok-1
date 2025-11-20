// src/pages/Kelas.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Kelas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ kelas: "", jurusan: "" });
  const [editId, setEditId] = useState(null); // id yang sedang diedit

  const API_URL = "http://localhost:5001/Kelas";

  // Ambil data kelas
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setData(res.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire("Gagal", "Tidak bisa mengambil data kelas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah / Update data kelas
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kelas || !formData.jurusan) {
      Swal.fire("Peringatan", "Kelas dan Jurusan harus diisi", "warning");
      return;
    }

    try {
      if (editId) {
        // Update
        await axios.put(`${API_URL}/${editId}`, formData);
        Swal.fire("Berhasil", "Data kelas berhasil diperbarui", "success");
      } else {
        // Tambah
        await axios.post(API_URL, formData);
        Swal.fire("Berhasil", "Data kelas berhasil ditambahkan", "success");
      }

      setFormData({ kelas: "", jurusan: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire("Gagal", "Tidak bisa menyimpan data kelas", "error");
    }
  };

  // Hapus data kelas
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setData(prev => prev.filter(d => d.id !== id));
        Swal.fire("Berhasil", "Data berhasil dihapus", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Gagal", "Tidak bisa menghapus data", "error");
      }
    }
  };

  // Edit data
  const handleEdit = (item) => {
    setFormData({ kelas: item.kelas, jurusan: item.jurusan });
    setEditId(item.id);
  };

  // Batalkan edit
  const handleCancelEdit = () => {
    setFormData({ kelas: "", jurusan: "" });
    setEditId(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Data Kelas</h1>

        {/* Form Tambah / Edit Kelas */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            placeholder="Kelas (X/XI/XII)"
            value={formData.kelas}
            onChange={e => setFormData({ ...formData, kelas: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <input
            placeholder="Jurusan"
            value={formData.jurusan}
            onChange={e => setFormData({ ...formData, jurusan: e.target.value })}
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className={`px-4 rounded ${editId ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            {editId ? "Update" : "Tambah"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Batal
            </button>
          )}
        </form>

        {/* Table Kelas */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2">Kelas</th>
                <th className="p-2">Jurusan</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center p-4">Memuat data...</td>
                </tr>
              ) : data.length > 0 ? (
                data.map(item => (
                  <tr key={item.id} className="even:bg-gray-50">
                    <td className="p-2">{item.kelas}</td>
                    <td className="p-2">{item.jurusan}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    Belum ada data kelas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         <p className="text-center text-gray-500 text-sm pt-6">
            © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
          </p>
      </div>
    </div>
  );
}

export default Kelas;
