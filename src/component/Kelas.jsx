// src/pages/Kelas.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Kelas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nama: "", jurusan: "" });
  const [editId, setEditId] = useState(null);
  const [visible, setVisible] = useState(false);

  const API_URL = "http://localhost:8080/api/kelas";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch {
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

    if (!formData.nama || !formData.jurusan) {
      Swal.fire("Peringatan", "Nama & Jurusan wajib diisi", "warning");
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

      setFormData({ nama: "", jurusan: "" });
      setEditId(null);
      fetchData();
    } catch {
      Swal.fire("Gagal", "Tidak bisa menyimpan data kelas", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
      Swal.fire("Berhasil", "Data dihapus", "success");
    } catch {
      Swal.fire("Gagal", "Tidak bisa menghapus data", "error");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      jurusan: item.jurusan,
    });
    setEditId(item.id);
  };

  const handleCancelEdit = () => {
    setFormData({ nama: "", jurusan: "" });
    setEditId(null);
  };

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-4xl font-extrabold text-center">Data Kelas</h1>

          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              placeholder="Kelas"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="flex-1 p-3 border rounded-lg"
            />
            <input
              placeholder="Jurusan"
              value={formData.jurusan}
              onChange={(e) =>
                setFormData({ ...formData, jurusan: e.target.value })
              }
              className="flex-1 p-3 border rounded-lg"
            />
            <button className="bg-blue-600 text-white px-6 rounded-lg">
              {editId ? "Update" : "Tambah"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 px-6 rounded-lg"
              >
                Batal
              </button>
            )}
          </form>

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
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500 italic bg-gray-50"
                    >
                      Tidak ada data kelas
                    </td>
                  </tr>
                ) : (
                  data.map((d, i) => (
                    <tr key={d.id}>
                      <td>{i + 1}</td>
                      <td>{d.nama}</td>
                      <td>{d.jurusan}</td>
                      <td className="p-3 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleEdit(d)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kelas;
