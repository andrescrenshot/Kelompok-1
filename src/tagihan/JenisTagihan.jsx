import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function JenisTagihan() {
  const [jenisTagihan, setJenisTagihan] = useState([]);
  const [nama, setNama] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5001/JenisTagihan";

  const getJenisTagihan = async () => {
    try {
      const res = await axios.get(API_URL);
      setJenisTagihan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getJenisTagihan();
    setTimeout(() => setVisible(true), 200);
  }, []);

  const tambahJenisTagihan = async () => {
    if (!nama) {
      Swal.fire("Isi nama dulu!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_URL, {
        id: `j${Date.now()}`,
        no: jenisTagihan.length + 1,
        nama,
        aktif: true, // default aktif
      });
      Swal.fire("Berhasil ditambahkan!");
      setNama("");
      getJenisTagihan();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal menambahkan data!", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const hapusJenisTagihan = async (id) => {
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
        getJenisTagihan();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal menghapus data!");
      }
    }
  };

  const editJenisTagihan = async (item) => {
    const { value: namaBaru } = await Swal.fire({
      title: "Edit Jenis Tagihan",
      input: "text",
      inputLabel: "Nama",
      inputValue: item.nama,
      showCancelButton: true,
      preConfirm: (value) => value,
    });
    if (namaBaru) {
      try {
        await axios.put(`${API_URL}/${item.id}`, {
          ...item,
          nama: namaBaru,
        });
        Swal.fire("Data berhasil diperbarui!");
        getJenisTagihan();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal memperbarui data!");
      }
    }
  };

  const toggleAktif = async (item) => {
    try {
      await axios.put(`${API_URL}/${item.id}`, {
        ...item,
        aktif: !item.aktif,
      });
      Swal.fire(
        `Jenis Tagihan ${item.aktif ? "dinonaktifkan" : "diaktifkan"}!`
      );
      getJenisTagihan();
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
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            Kategori Tagihan
          </h1>

          <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full">
            <input
              type="text"
              placeholder="Nama Kategori Tagihan"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              disabled={loading || !nama}
              onClick={tambahJenisTagihan}
              className={`${
                loading || !nama
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300`}
            >
              {loading ? "Menyimpan..." : "+ Tambah Kategori Tagihan"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="w-full border-collapse overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-center">Nama</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jenisTagihan.length > 0 ? (
                  jenisTagihan.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{item.nama}</td>
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
                          onClick={() => editJenisTagihan(item)}
                          className="flex items-center gap-1 bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-lg shadow transition duration-300"
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button
                          onClick={() => hapusJenisTagihan(item.id)}
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

export default JenisTagihan;
