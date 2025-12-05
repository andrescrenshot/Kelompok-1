import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Presensi() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [siswaInfo, setSiswaInfo] = useState(null);
  const [rekapHariIni, setRekapHariIni] = useState([]);

  const API_SISWA = "http://localhost:5001/Daftar";
  const API_PRESENSI = "http://localhost:5001/presensi";

  // ======================================
  // Ambil rekap harian
  // ======================================
  const getRekapHariIni = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await axios.get(`${API_PRESENSI}?tanggal=${today}`);
      setRekapHariIni(res.data);
    } catch (err) {
      console.error("Error rekap:", err);
    }
  };

  useEffect(() => {
    getRekapHariIni();
  }, []);

  // ======================================
  // AUTO LOAD DATA SISWA SAAT NOMOR DIKETIK
  // ======================================
  useEffect(() => {
    const loadSiswa = async () => {
      if (nomor.length < 4) {
        setSiswaInfo(null);
        return;
      }

      try {
        const res = await axios.get(`${API_SISWA}?nomorUnik=${nomor}`);
        if (res.data.length > 0) {
          setSiswaInfo(res.data[0]);
        } else {
          setSiswaInfo(null);
        }
      } catch (error) {
        console.log("Error auto load:", error);
      }
    };

    loadSiswa();
  }, [nomor]);

  // ======================================
  // HANDLE SUBMIT PRESENSI
  // ======================================
  const handleSubmit = async () => {
    if (!nomor) return Swal.fire("Oops", "Nomor unik wajib diisi!", "warning");
    if (!siswaInfo) return Swal.fire("Error", "Siswa tidak ditemukan!", "error");

    setLoading(true);

    try {
      const siswa = siswaInfo;
      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const jamDigital = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const totalMenit = now.getHours() * 60 + now.getMinutes();

      // Cek presensi hari ini
      let resPresensi = await axios.get(`${API_PRESENSI}?nomorUnik=${nomor}`);
      resPresensi = resPresensi.data.filter((p) => p.tanggal === today);

      // PRESENSI MASUK
      if (resPresensi.length === 0) {
        if (totalMenit >= 300 && totalMenit <= 780) {
          const statusMasuk = totalMenit > 420 ? "Terlambat" : "Tepat Waktu";

          await axios.post(API_PRESENSI, {
            nomorUnik: siswa.nomorUnik,
            nama: siswa.nama,
            kategori: siswa.kategori,
            kelas: siswa.kelas,
            jurusan: siswa.jurusan,
            jabatan: siswa.jabatan || "",
            tanggal: today,
            jamMasuk: jamDigital,
            jamPulang: "",
            statusMasuk,
            statusPulang: "",
          });

          Swal.fire("Berhasil", `Presensi Masuk dicatat (${statusMasuk})`, "success");
          getRekapHariIni();
        } else {
          Swal.fire("Info", "Waktu presensi masuk hanya 05:00 - 13:00", "info");
        }

        setLoading(false);
        setNomor("");
        setSiswaInfo(null);
        return;
      }

      // PRESENSI PULANG
      const dataHariIni = resPresensi[0];

      if (dataHariIni.jamPulang) {
        Swal.fire("Info", "Anda sudah presensi pulang hari ini.", "info");
        setLoading(false);
        setNomor("");
        setSiswaInfo(null);
        return;
      }

      if (totalMenit >= 840 && totalMenit <= 900) {
        const statusPulang = totalMenit < 900 ? "Tepat Waktu" : "Pulang Cepat";

        await axios.patch(`${API_PRESENSI}/${dataHariIni.id}`, {
          jamPulang: jamDigital,
          statusPulang,
        });

        Swal.fire("Berhasil", `Presensi Pulang dicatat (${statusPulang})`, "success");
        getRekapHariIni();
      } else {
        Swal.fire("Info", "Belum waktunya pulang.", "info");
      }
    } catch (error) {
      console.error("Error presensi:", error);
      Swal.fire("Error", "Terjadi kesalahan saat presensi", "error");
    }

    setLoading(false);
    setNomor("");
    setSiswaInfo(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Presensi Siswa / Karyawan</h2>

      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Masukkan Nomor Unik (contoh: SIS-0980)"
          value={nomor}
          onChange={(e) => setNomor(e.target.value.toUpperCase())}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 w-full rounded hover:bg-blue-600 transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Submit"}
        </button>

        {/* Informasi Siswa */}
        {siswaInfo && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            <h3 className="font-bold mb-2">Informasi SGK</h3>
            <p><strong>Nomor Unik:</strong> {siswaInfo.nomorUnik}</p>
            <p><strong>Nama:</strong> {siswaInfo.nama}</p>
            <p><strong>Kategori:</strong> {siswaInfo.kategori}</p>
            {siswaInfo.kelas !== "-" && <p><strong>Kelas:</strong> {siswaInfo.kelas}</p>}
            {siswaInfo.jurusan !== "-" && <p><strong>Jurusan:</strong> {siswaInfo.jurusan}</p>}
            {siswaInfo.jabatan && <p><strong>Jabatan:</strong> {siswaInfo.jabatan}</p>}
          </div>
        )}
      </div>

      {/* Rekap Hari Ini */}
      <div className="w-full max-w-3xl mt-10 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Rekap Presensi Hari Ini</h3>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Masuk</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Pulang</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {rekapHariIni.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-3">
                    Belum ada presensi hari ini
                  </td>
                </tr>
              ) : (
                rekapHariIni.map((r) => (
                  <tr key={r.id} className="text-center">
                    <td className="border p-2">{r.nama}</td>
                    <td className="border p-2">{r.jamMasuk}</td>
                    <td className="border p-2">{r.statusMasuk}</td>
                    <td className="border p-2">{r.jamPulang || "-"}</td>
                    <td className="border p-2">{r.statusPulang || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Presensi;
