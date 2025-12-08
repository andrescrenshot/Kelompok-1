import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Presensi() {
  const [nomor, setNomor] = useState("");
  const [loading, setLoading] = useState(false);
  const [siswaInfo, setSiswaInfo] = useState(null);
  const [rekapHariIni, setRekapHariIni] = useState([]);
  const [tipePresensi, setTipePresensi] = useState("Masuk"); // default Masuk

  const API_SISWA = "http://localhost:5001/Daftar";
  const API_PRESENSI = "http://localhost:5001/presensi";

  // ======================================
  // GET REKAP HARI INI
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
  // AUTO LOAD SISWA SAAT KETIK NOMOR
  // ======================================
  useEffect(() => {
    const loadSiswa = async () => {
      if (nomor.length < 4) {
        setSiswaInfo(null);
        return;
      }

      try {
        const res = await axios.get(`${API_SISWA}?nomorUnik=${nomor}`);
        if (res.data.length > 0) setSiswaInfo(res.data[0]);
        else setSiswaInfo(null);
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
    if (!siswaInfo)
      return Swal.fire("Error", "Siswa tidak ditemukan!", "error");

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

      // Ambil data presensi hari ini
      let resPresensi = await axios.get(`${API_PRESENSI}?nomorUnik=${nomor}`);
      resPresensi = resPresensi.data.filter((p) => p.tanggal === today);

      if (tipePresensi === "Masuk") {
        if (resPresensi.length > 0) {
          Swal.fire("Info", "Anda sudah presensi masuk hari ini.", "info");
        } else {
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

            Swal.fire(
              "Berhasil",
              `Presensi Masuk dicatat (${statusMasuk})`,
              "success"
            );
            getRekapHariIni();
          } else {
            Swal.fire(
              "Info",
              "Waktu presensi masuk hanya 05:00 - 13:00",
              "info"
            );
          }
        }
      } else if (tipePresensi === "Pulang") {
        if (resPresensi.length === 0) {
          Swal.fire("Info", "Belum presensi masuk, tidak bisa pulang.", "info");
        } else {
          const dataHariIni = resPresensi[0];
          if (dataHariIni.jamPulang) {
            Swal.fire("Info", "Anda sudah presensi pulang hari ini.", "info");
          } else {
            if (totalMenit >= 840 && totalMenit <= 900) {
              const statusPulang =
                totalMenit < 900 ? "Tepat Waktu" : "Pulang Cepat";

              await axios.patch(`${API_PRESENSI}/${dataHariIni.id}`, {
                jamPulang: jamDigital,
                statusPulang,
              });

              Swal.fire(
                "Berhasil",
                `Presensi Pulang dicatat (${statusPulang})`,
                "success"
              );
              getRekapHariIni();
            } else {
              Swal.fire("Info", "Belum waktunya pulang.", "info");
            }
          }
        }
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
    <div
      className="min-h-screen flex flex-col items-center p-8 
                    bg-gradient-to-br from-gray-100 to-blue-200"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
        Presensi SGK
      </h2>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <img
          className="rounded-full mx-auto mb-5 w-28 h-28 shadow-md border-4 border-white"
          src="https://i.pinimg.com/236x/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg"
          alt=""
        />
        {/* Pilih Tipe Presensi */}
        <select
          value={tipePresensi}
          onChange={(e) => setTipePresensi(e.target.value)}
          className="border px-3 py-2 w-full rounded-lg mb-4 shadow-sm
             focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="Masuk">Presensi Masuk</option>
          <option value="Pulang">Presensi Pulang</option>
        </select>

        {/* Input Nomor */}
        <input
          type="text"
          className="border px-3 py-2 w-full rounded-lg mb-4 shadow-sm 
                     focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Masukkan Nomor Unik"
          value={nomor}
          onChange={(e) => setNomor(e.target.value.toUpperCase())}
        />

        {/* Tombol Submit */}
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 w-full rounded-lg 
                     hover:bg-blue-700 transition shadow-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Memproses...
            </div>
          ) : (
            "Submit"
          )}
        </button>

        {/* Informasi Siswa */}
        {siswaInfo && (
          <div
            className="mt-6 p-4 rounded-xl shadow-md bg-gradient-to-r 
                          from-blue-50 to-indigo-100 animate-fadeIn"
          >
            <h3 className="text-lg font-bold mb-2 text-gray-800">
              Informasi SGK
            </h3>

            <p>
              <strong>Nomor Unik:</strong> {siswaInfo.nomorUnik}
            </p>
            <p>
              <strong>Nama:</strong> {siswaInfo.nama}
            </p>
            <p>
              <strong>Kategori:</strong> {siswaInfo.kategori}
            </p>

            {siswaInfo.kelas !== "-" && (
              <p>
                <strong>Kelas:</strong> {siswaInfo.kelas}
              </p>
            )}
            {siswaInfo.jurusan !== "-" && (
              <p>
                <strong>Jurusan:</strong> {siswaInfo.jurusan}
              </p>
            )}
            {siswaInfo.jabatan && (
              <p>
                <strong>Jabatan:</strong> {siswaInfo.jabatan}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ANIMASI CSS */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn .4s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Presensi;
