// src/pages/Presensi.js
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function Presensi() {
  const [nomor, setNomor] = useState("");
  const [nama, setNama] = useState("-");
  const [status, setStatus] = useState("Masuk");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [siswaInfo, setSiswaInfo] = useState(null);
  const [daftar, setDaftar] = useState([]);
  const inputRef = useRef();

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_PRESENSI = "http://localhost:5001/presensi";

  // Ambil master data
  const getDaftar = async () => {
    try {
      const res = await axios.get(API_DAFTAR);
      setDaftar(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDaftar();

    const timer = setInterval(() => {
      const now = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      setTanggal(now.toLocaleDateString("id-ID", options));
      setJam(now.toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Lookup siswa otomatis
  useEffect(() => {
    if (!nomor) {
      setNama("-");
      setSiswaInfo(null);
      return;
    }

    const siswa = daftar.find((d) => d.nomorUnik === nomor.trim());
    if (siswa) {
      setNama(siswa.nama);
      setSiswaInfo(siswa);
    } else {
      setNama("-");
      setSiswaInfo(null);
    }
  }, [nomor, daftar]);

  const handleSubmit = async () => {
    if (!nomor || !siswaInfo) {
      return Swal.fire("Error", "Nomor unik tidak valid!", "error");
    }

    const today = new Date().toISOString().split("T")[0];
    let presensiHariIni = [];
    try {
      const res = await axios.get(`${API_PRESENSI}?nomorUnik=${siswaInfo.nomorUnik}`);
      presensiHariIni = res.data.filter((p) => p.tanggal === today);
    } catch (err) {
      console.error("Gagal ambil presensi hari ini:", err);
    }

    const now = new Date();
    const jamSekarang = now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");

    // Logika Masuk
    if (status === "Masuk") {
      const sudahMasuk = presensiHariIni.some((p) => p.status === "Masuk");
      if (sudahMasuk) {
        return Swal.fire("Error", "Anda sudah presensi Masuk hari ini!", "error");
      }
      const jamMasukMulai = new Date();
      jamMasukMulai.setHours(5, 0, 0);
      const jamMasukAkhir = new Date();
      jamMasukAkhir.setHours(6, 50, 0);

      let statusMasuk = "Masuk";
      if (now < jamMasukMulai || now > jamMasukAkhir) {
        statusMasuk = "Terlambat";
      }

      const presensiData = {
        nomorUnik: siswaInfo.nomorUnik,
        nama: siswaInfo.nama,
        kelas: siswaInfo.kelas,
        jurusan: siswaInfo.jurusan,
        kategori: siswaInfo.kategori,
        status: "Masuk",
        tanggal: today,
        jam: jamSekarang,
        statusMasuk: statusMasuk,
        jamMasuk: jamSekarang,
      };

      try {
        await axios.post(API_PRESENSI, presensiData);
        Swal.fire("Berhasil", `Presensi Masuk berhasil (${statusMasuk})`, "success");
        setNomor("");
        setNama("-");
        setSiswaInfo(null);
        inputRef.current?.focus();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal melakukan presensi!", "", "error");
      }
    }

    // Logika Pulang
    if (status === "Pulang") {
      const sudahMasuk = presensiHariIni.some((p) => p.status === "Masuk");
      const sudahPulang = presensiHariIni.some((p) => p.status === "Pulang");

      if (sudahPulang) {
        return Swal.fire("Error", "Anda sudah presensi Pulang hari ini!", "error");
      }

      if (!sudahMasuk) {
        // Siswa belum presensi Masuk → lakukan dua kali presensi
        const konfirmasi = await Swal.fire({
          title: "Belum presensi Masuk!",
          text: "Anda belum presensi Masuk. Sistem akan melakukan presensi Masuk otomatis sebelum Pulang.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Lanjutkan",
        });
        if (!konfirmasi.isConfirmed) return;

        // Presensi Masuk otomatis (Terlambat jika jam >06:50)
        let statusMasuk = "Masuk";
        const jamMasukAkhir = new Date();
        jamMasukAkhir.setHours(6, 50, 0);
        if (now > jamMasukAkhir) statusMasuk = "Terlambat";

        const presensiMasuk = {
          nomorUnik: siswaInfo.nomorUnik,
          nama: siswaInfo.nama,
          kelas: siswaInfo.kelas,
          jurusan: siswaInfo.jurusan,
          kategori: siswaInfo.kategori,
          status: "Masuk",
          tanggal: today,
          jam: jamSekarang,
          statusMasuk: statusMasuk,
          jamMasuk: jamSekarang,
        };
        try {
          await axios.post(API_PRESENSI, presensiMasuk);
        } catch (err) {
          console.error(err);
        }
      }

      // Cek jam Pulang
      if (now.getHours() < 15) {
        return Swal.fire(
          "Error",
          "Belum waktunya pulang",
          "error"
        );
      }

      const presensiPulang = {
        nomorUnik: siswaInfo.nomorUnik,
        nama: siswaInfo.nama,
        kelas: siswaInfo.kelas,
        jurusan: siswaInfo.jurusan,
        kategori: siswaInfo.kategori,
        status: "Pulang",
        tanggal: today,
        jam: jamSekarang,
        statusPulang: "Pulang",
        jamPulang: jamSekarang,
      };

      try {
        await axios.post(API_PRESENSI, presensiPulang);
        Swal.fire("Berhasil", `Presensi Pulang berhasil`, "success");
        setNomor("");
        setNama("-");
        setSiswaInfo(null);
        inputRef.current?.focus();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal melakukan presensi!", "", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-5">
      <div className="w-full max-w-2xl bg-blue-100/80 border border-blue-400 rounded-3xl p-8 flex flex-col md:flex-row gap-6 shadow-lg backdrop-blur-md">

        {/* Foto Placeholder */}
        <div className="md:w-1/3 bg-blue-200/50 flex items-center justify-center rounded-2xl p-4">
          <div className="w-32 h-32 bg-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold animate-pulse">
            ?
          </div>
        </div>

        {/* Form */}
        <div className="md:w-2/3 flex flex-col gap-4">
          <div>
            <label className="text-blue-800 font-semibold">Nomor Unik</label>
            <input
              type="text"
              ref={inputRef}
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
              placeholder="Masukkan Nomor Unik"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-blue-800 font-semibold">Nama</label>
            <input
              type="text"
              value={nama}
              readOnly
              className="w-full mt-1 px-4 py-3 rounded-xl bg-blue-100 text-blue-900"
            />
          </div>

          {/* Info siswa di bawah nama */}
          {siswaInfo && (
            <div className="p-4 bg-blue-200 rounded-xl text-blue-900 font-medium shadow-inner">
              <p><strong>Kelas:</strong> {siswaInfo.kelas}</p>
              <p><strong>Jurusan:</strong> {siswaInfo.jurusan}</p>
              <p><strong>Kategori:</strong> {siswaInfo.kategori}</p>
            </div>
          )}

          <div className="flex items-center gap-6 mt-2">
            <label className="text-blue-800 font-semibold">Status Presensi</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-blue-900">
                <input
                  type="radio"
                  name="status"
                  value="Masuk"
                  checked={status === "Masuk"}
                  onChange={() => setStatus("Masuk")}
                  className="accent-blue-500"
                />
                Masuk
              </label>
              <label className="flex items-center gap-1 text-blue-900">
                <input
                  type="radio"
                  name="status"
                  value="Pulang"
                  checked={status === "Pulang"}
                  onChange={() => setStatus("Pulang")}
                  className="accent-blue-500"
                />
                Pulang
              </label>
            </div>
          </div>

          <div className="mt-2 p-4 bg-blue-100 rounded-xl text-blue-900 font-medium shadow-inner flex justify-between">
            <span>{tanggal}</span>
            <span>{jam}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 py-4 rounded-2xl bg-blue-400 hover:bg-blue-500 text-blue-900 font-bold text-lg shadow-md transition transform active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Presensi;
