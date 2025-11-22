// src/pages/Kelas.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Kelas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ kelas: "", jurusan: "" });
  const [editId, setEditId] = useState(null); // id yang sedang diedit
  const [visible, setVisible] = useState(false);

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
    setTimeout(() => setVisible(true), 200);
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
        await axios.put(`${API_URL}/${editId}`, formData);
        Swal.fire("Berhasil", "Data kelas berhasil diperbarui", "success");
      } else {
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

  const handleEdit = (item) => {
    setFormData({ kelas: item.kelas, jurusan: item.jurusan });
    setEditId(item.id);
  };

  const handleCancelEdit = () => {
    setFormData({ kelas: "", jurusan: "" });
    setEditId(null);
  };

  return (
    <div className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Data Kelas</h1>

          {/* Form Tambah / Edit Kelas */}
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6">
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
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Jurusan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4">Memuat data...</td>
                  </tr>
                ) : data.length > 0 ? (
                  [...data].sort((a,b)=>a.id-b.id).map((item,index)=>(
                    <tr key={item.id} className={`${index%2===0?"bg-gray-50":"bg-gray-100"} hover:bg-blue-50`}>
                      <td className="p-3">{index+1}</td>
                      <td className="p-3">{item.kelas}</td>
                      <td className="p-3">{item.jurusan}</td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button onClick={()=>handleEdit(item)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                        <button onClick={()=>handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Hapus</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500 italic">Belum ada data kelas</td>
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
    </div>
  );
}

export default Kelas;
