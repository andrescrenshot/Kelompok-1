import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function RekapPresensi() {
  const today = new Date().toISOString().split("T")[0];

  const [presensi, setPresensi] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER
  const [filterTanggal, setFilterTanggal] = useState(today);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [searchText, setSearchText] = useState("");

  const API_PRESENSI = "http://localhost:8080/api/presensi";

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    const [y, m, d] = tgl.split("-");
    return `${d}/${m}/${y}`;
  };

  const formatJam = (jam) => (jam ? jam.slice(0, 5) : "-");

  const renderStatus = (p) => {
    if (p.status === "Masuk") {
      return p.keteranganStatus === "Terlambat" ? (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
          Masuk (Terlambat)
        </span>
      ) : (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
          Masuk (Tepat Waktu)
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
        Pulang
      </span>
    );
  };

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

  // EDIT JAM MASUK/PULANG
  const handleEdit = async (data) => {
    const { value: form } = await Swal.fire({
      title: "Edit Jam Presensi",
      html: `
        <div style="display:flex;flex-direction:column;gap:12px">
          <label>Jam Masuk</label>
          <input type="time" id="jamMasuk" class="swal2-input"/>
          <label>Jam Pulang</label>
          <input type="time" id="jamPulang" class="swal2-input"/>
        </div>
      `,
      didOpen: () => {
        document.getElementById("jamMasuk").value = data.jamMasuk?.slice(0, 5) || "";
        document.getElementById("jamPulang").value = data.jamPulang?.slice(0, 5) || "";
      },
      showCancelButton: true,
      confirmButtonText: "Simpan",
      confirmButtonColor: "#2563eb",
      preConfirm: () => ({
        jamMasuk: document.getElementById("jamMasuk").value,
        jamPulang: document.getElementById("jamPulang").value,
      }),
    });

    if (!form) return;

    let keteranganStatus = data.keteranganStatus;
    if (form.jamMasuk) {
      keteranganStatus = form.jamMasuk <= "06:50" ? "Tepat Waktu" : "Terlambat";
    }

    await axios.put(`${API_PRESENSI}/${data.id}`, {
      ...data,
      jamMasuk: form.jamMasuk,
      jamPulang: form.jamPulang,
      keteranganStatus,
    });

    Swal.fire("Berhasil", "Data diperbarui", "success");
    getPresensi();
  };

  // HAPUS DATA
  const handleHapus = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Presensi?",
      text: "Data akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Hapus",
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`${API_PRESENSI}/${id}`);
    Swal.fire("Berhasil", "Data presensi dihapus", "success");
    getPresensi();
  };

  // FILTER DATA
  const filteredPresensi = useMemo(() => {
    return presensi.filter((p) => {
      const matchTanggal = filterTanggal ? p.tanggal === filterTanggal : true;
      const matchKategori = filterKategori === "Semua" ? true : p.kategori === filterKategori;
      const matchSearch = searchText
        ? String(p.nomorUnik).includes(searchText) ||
          p.nama?.toLowerCase().includes(searchText.toLowerCase())
        : true;
      return matchTanggal && matchKategori && matchSearch;
    });
  }, [presensi, filterTanggal, filterKategori, searchText]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Rekap Presensi</h2>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl mb-6 grid md:grid-cols-4 gap-4">
          <input type="date" value={filterTanggal} onChange={(e) => setFilterTanggal(e.target.value)} className="border rounded-xl px-3 py-2" />
          <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} className="border rounded-xl px-3 py-2">
            <option value="Semua">Semua</option>
            <option value="Siswa">Siswa</option>
            <option value="Guru">Guru</option>
            <option value="Karyawan">Karyawan</option>
          </select>
          <input type="text" placeholder="Cari nama / RFID" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="border rounded-xl px-3 py-2" />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : filteredPresensi.length === 0 ? (
            <div className="p-10 text-center text-slate-500">Tidak ada data</div>
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
                  <tr key={p.id} className={`border-t ${p.keteranganStatus === "Terlambat" ? "bg-red-50" : ""}`}>
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3 text-center">{p.nomorUnik}</td>
                    <td className="p-3 font-semibold">{p.nama}</td>
                    <td className="p-3 text-center">{p.kategori}</td>
                    <td className="p-3 text-center">{formatTanggal(p.tanggal)}</td>
                    <td className="p-3 text-center">{formatJam(p.jamMasuk)} / {formatJam(p.jamPulang)}</td>
                    <td className="p-3 text-center">{renderStatus(p)}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(p)} className="bg-blue-600 text-white px-3 py-1 rounded-lg">Edit</button>
                      <button onClick={() => handleHapus(p.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Hapus</button>
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
