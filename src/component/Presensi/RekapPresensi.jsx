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

  const formatJam = (jam) => {
    if (!jam) return "-";
    return jam.slice(0, 5); // HH:mm
  };

  const renderStatus = (p) => {
    if (p.status === "Masuk") {
      return p.keteranganStatus === "Terlambat"
        ? "Masuk (Terlambat)"
        : "Masuk (Tepat Waktu)";
    }
    if (p.status === "Pulang") return "Pulang";
    if (p.status === "Izin") return "Izin";
    return p.status;
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

  /* ================= EDIT JAM (CENTER) ================= */
  const handleEdit = async (data) => {
    const { value: form } = await Swal.fire({
      title: `<div style="text-align:center;font-size:20px;font-weight:600">
                Edit Jam Presensi
              </div>`,
      html: `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
          margin-top:10px;
        ">
          <label style="font-weight:600">Jam Masuk</label>
          <input
            type="time"
            id="jamMasuk"
            style="
              text-align:center;
              padding:10px;
              border-radius:10px;
              border:1px solid #cbd5e1;
              width:200px;
            "
          />

          <label style="font-weight:600;margin-top:6px">
            Jam Pulang
          </label>
          <input
            type="time"
            id="jamPulang"
            style="
              text-align:center;
              padding:10px;
              border-radius:10px;
              border:1px solid #cbd5e1;
              width:200px;
            "
          />
        </div>
      `,
      didOpen: () => {
        document.getElementById("jamMasuk").value =
          data.jamMasuk || "";
        document.getElementById("jamPulang").value =
          data.jamPulang || "";
      },
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb", // biru
      cancelButtonColor: "#94a3b8",
      focusConfirm: false,
      preConfirm: () => {
        const jamMasuk =
          document.getElementById("jamMasuk").value;
        const jamPulang =
          document.getElementById("jamPulang").value;

        if (!jamMasuk && !jamPulang) {
          Swal.showValidationMessage(
            "Minimal salah satu jam harus diisi"
          );
          return false;
        }

        return { jamMasuk, jamPulang };
      },
    });

    if (!form) return;

    try {
      await axios.put(`${API_PRESENSI}/${data.id}`, {
        ...data,
        jamMasuk: form.jamMasuk || data.jamMasuk,
        jamPulang: form.jamPulang || data.jamPulang,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jam presensi berhasil diperbarui",
        confirmButtonColor: "#2563eb",
      });

      getPresensi();
    } catch {
      Swal.fire("Error", "Gagal update jam", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Presensi?",
      text: "Data akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#1e3a8a",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`${API_PRESENSI}/${id}`);
    Swal.fire("Berhasil", "Presensi dihapus", "success");
    getPresensi();
  };

  /* ================= FILTER ================= */
  const filteredPresensi = useMemo(() => {
    return presensi.filter((p) => {
      const matchTanggal = filterTanggal
        ? p.tanggal === filterTanggal
        : true;

      const matchKategori =
        filterKategori === "Semua"
          ? true
          : p.kategori === filterKategori;

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
        <h2 className="text-3xl font-bold mb-6 text-blue-700">
          Rekap Presensi
        </h2>

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
            placeholder="Cari nama / RFID"
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
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">RFID</th>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Jam</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPresensi.map((p, i) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3 text-center">{p.nomorUnik}</td>
                    <td className="p-3 font-semibold">{p.nama}</td>
                    <td className="p-3 text-center">{p.kategori}</td>
                    <td className="p-3 text-center">
                      {formatTanggal(p.tanggal)}
                    </td>
                    <td className="p-3 text-center">
                      {formatJam(p.jamMasuk)} /{" "}
                      {formatJam(p.jamPulang)}
                    </td>
                    <td className="p-3 text-center font-semibold text-blue-600">
                      {renderStatus(p)}
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleHapus(p.id)}
                        className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-lg"
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
