import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function RekapPresensi() {
  const today = new Date().toISOString().split("T")[0];

  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterTanggal, setFilterTanggal] = useState(today);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [searchText, setSearchText] = useState("");

  const API_PRESENSI = "http://localhost:5001/presensi";

  /* ================= UTIL ================= */
  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const [y, m, d] = tgl.split("-");
    return `${d}/${m}/${y}`;
  };

  /* ================= FETCH ================= */
  const getPresensi = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PRESENSI);
      setPresensi(res.data || []);
    } catch {
      Swal.fire("Error", "Gagal mengambil data presensi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPresensi();
  }, []);

  /* ================= DELETE ================= */
  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Presensi?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`${API_PRESENSI}/${id}`);
    Swal.fire("Berhasil", "Presensi dihapus", "success");
    getPresensi();
  };

  /* ================= EDIT ================= */
  const handleEdit = async (data) => {
    const { value: form } = await Swal.fire({
      title: "Edit Presensi",
      html: `
        <select id="statusMasuk" class="swal2-input">
          <option value="Tepat Waktu">Masuk Tepat Waktu</option>
          <option value="Terlambat">Terlambat</option>
          <option value="Izin">Izin</option>
        </select>

        <input type="time" id="jamMasuk" class="swal2-input" />

        <input
          id="keterangan"
          class="swal2-input"
          placeholder="Keterangan Izin"
          style="display:none"
        />
      `,
      focusConfirm: false,

      didOpen: () => {
        const status = document.getElementById("statusMasuk");
        const jamMasuk = document.getElementById("jamMasuk");
        const ket = document.getElementById("keterangan");

        status.value =
          data.statusMasuk || data.status || "Masuk Tepat Waktu";
        jamMasuk.value = data.jamMasuk || "";
        ket.value = data.keteranganIzin || "";

        if (status.value === "Izin") ket.style.display = "block";

        status.addEventListener("change", () => {
          if (status.value === "Izin") {
            ket.style.display = "block";
          } else {
            ket.style.display = "none";
            ket.value = "";
          }
        });
      },

      preConfirm: () => {
        const statusMasuk = document.getElementById("statusMasuk").value;
        const jamMasuk = document.getElementById("jamMasuk").value;
        const keteranganIzin = document.getElementById("keterangan").value;

        if (statusMasuk === "Izin" && !keteranganIzin) {
          Swal.showValidationMessage(
            "Keterangan wajib diisi jika status Izin"
          );
          return false;
        }

        return { statusMasuk, jamMasuk, keteranganIzin };
      },
    });

    if (!form) return;

    await axios.put(`${API_PRESENSI}/${data.id}`, {
      ...data,
      statusMasuk: form.statusMasuk,
      jamMasuk: form.jamMasuk || data.jamMasuk,
      keteranganIzin: form.keteranganIzin,
    });

    Swal.fire("Berhasil", "Data presensi diperbarui", "success");
    getPresensi();
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredPresensi = useMemo(() => {
    return presensi.filter((p) => {
      const matchTanggal = filterTanggal
        ? p.tanggal === filterTanggal
        : true;

      const matchKategori =
        filterKategori === "Semua" ? true : p.kategori === filterKategori;

      const matchSearch = searchText
        ? String(p.nomorUnik).includes(searchText) ||
          p.nama?.toLowerCase().includes(searchText.toLowerCase())
        : true;

      return matchTanggal && matchKategori && matchSearch;
    });
  }, [presensi, filterTanggal, filterKategori, searchText]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Rekap Presensi</h2>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl mb-6 grid md:grid-cols-4 gap-4">
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />

          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="border rounded-xl px-3 py-2"
          >
            <option value="Semua">Semua</option>
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>

          <input
            type="text"
            placeholder="Cari nama / nomor unik"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded-xl px-3 py-2"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : filteredPresensi.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Tidak ada data
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Nomor</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Jam Masuk</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPresensi.map((p, i) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{p.nomorUnik}</td>
                    <td className="p-3 font-semibold">{p.nama}</td>
                    <td className="p-3">{p.kategori}</td>
                    <td className="p-3">{formatTanggal(p.tanggal)}</td>
                    <td className="p-3">{p.jamMasuk || "-"}</td>
                    <td className="p-3">{p.statusMasuk || p.status}</td>
                    <td className="p-3">{p.keteranganIzin || "-"}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleHapus(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
