import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:5001/Kategori";

function Dataktegori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [nama, setNama] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const getKategori = async () => {
    try {
      const res = await axios.get(API_URL);
      setKategoriList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getKategori();
    setTimeout(() => setVisible(true), 200);
  }, []);

  // Tambah atau Edit kategori
  const simpanKategori = async () => {
    if (!nama.trim()) {
      Swal.fire("Isi nama kategori dulu!");
      return;
    }

    setLoading(true);
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, {
          ...editing,
          kategori_nama: nama,
        });
        Swal.fire("Data berhasil diperbarui!");
      } else {
        const newData = {
          id: `k${Date.now()}`,
          kategori_nama: nama,
          aktif: true,
        };
        await axios.post(API_URL, newData);
        Swal.fire("Berhasil ditambahkan!");
      }
      setNama("");
      setEditing(null);
      getKategori();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  const hapusKategori = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire("Data dihapus!");
        getKategori();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal menghapus data!");
      }
    }
  };

  const editKategori = (item) => {
    setEditing(item);
    setNama(item.kategori_nama);
  };

  const toggleAktif = async (item) => {
    try {
      await axios.put(`${API_URL}/${item.id}`, {
        ...item,
        aktif: !item.aktif,
      });
      Swal.fire(
        `Kategori ${item.aktif ? "dinonaktifkan" : "diaktifkan"}!`
      );
      getKategori();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal mengubah status!");
    }
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
            Kategori Data
          </h1>

          {/* Form Tambah/Edit */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
            <input
              type="text"
              placeholder="Nama Kategori"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              disabled={loading || !nama}
              onClick={simpanKategori}
              className={`${
                loading || !nama
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300`}
            >
              {loading
                ? "Menyimpan..."
                : editing
                ? "💾 Simpan Perubahan"
                : "+ Tambah Kategori"}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setNama("");
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
              >
                Batal
              </button>
            )}
          </div>

          {/* Tabel Data */}
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="w-full border-collapse overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama Kategori</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriList.length > 0 ? (
                  kategoriList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{item.kategori_nama}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.aktif
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {item.aktif ? "Aktif" : "Non-Aktif"}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => editKategori(item)}
                          className="flex items-center gap-1 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button
                          onClick={() => hapusKategori(item.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          <i className="ri-delete-bin-line"></i> Hapus
                        </button>
                        <button
                          onClick={() => toggleAktif(item)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg shadow text-white ${
                            item.aktif
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          } transition duration-300`}
                        >
                          {item.aktif ? "Non-Aktifkan" : "Aktifkan"}
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
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm pt-6">
        © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
      </p>
    </div>
  );
}

export default Dataktegori;
