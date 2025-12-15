import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import huh1 from "../../../public/kakangku.jpg";

function Presensi() {
  const [nomor, setNomor] = useState("");
  const [nama, setNama] = useState("-");
  const [status, setStatus] = useState("Masuk");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");
  const [siswaInfo, setSiswaInfo] = useState(null);
  const [daftar, setDaftar] = useState([]);
  const [keteranganIzin, setKeteranganIzin] = useState("");

  const inputRef = useRef(null);

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_PRESENSI = "http://localhost:5001/presensi";

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    axios
      .get(API_DAFTAR)
      .then((res) => setDaftar(res.data))
      .catch(() => setDaftar([]));

    const timer = setInterval(() => {
      const now = new Date();
      setTanggal(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setJam(now.toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);

    inputRef.current?.focus();
    return () => clearInterval(timer);
  }, []);

  /* ================= LOOKUP SISWA ================= */
  useEffect(() => {
    if (!nomor.trim()) {
      setNama("-");
      setSiswaInfo(null);
      return;
    }

    const siswa = daftar.find(
      (d) => String(d.nomorUnik) === String(nomor.trim())
    );

    if (siswa) {
      setNama(siswa.nama);
      setSiswaInfo(siswa);
    } else {
      setNama("-");
      setSiswaInfo(null);
    }
  }, [nomor, daftar]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!nomor.trim() || !siswaInfo) {
      Swal.fire("Error", "Nomor unik tidak valid!", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const jamSekarang =
      now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");

    let presensiHariIni = [];

    try {
      const res = await axios.get(
        `${API_PRESENSI}?nomorUnik=${siswaInfo.nomorUnik}&tanggal=${today}`
      );
      presensiHariIni = res.data;
    } catch {
      presensiHariIni = [];
    }

    const sudahMasuk = presensiHariIni.some((p) => p.status === "Masuk");
    const sudahPulang = presensiHariIni.some((p) => p.status === "Pulang");
    const sudahIzin = presensiHariIni.some((p) => p.status === "Izin");

    /* ================= IZIN ================= */
    if (status === "Izin") {
      if (sudahMasuk || sudahPulang) {
        Swal.fire(
          "Ditolak",
          "Tidak bisa Izin karena sudah presensi Masuk/Pulang hari ini!",
          "warning"
        );
        return;
      }

      if (sudahIzin) {
        Swal.fire("Error", "Sudah Izin hari ini!", "error");
        return;
      }

      if (!keteranganIzin.trim()) {
        Swal.fire("Error", "Keterangan izin wajib diisi!", "error");
        return;
      }

      await axios.post(API_PRESENSI, {
        nomorUnik: siswaInfo.nomorUnik,
        nama: siswaInfo.nama,
        kelas: siswaInfo.kelas,
        jurusan: siswaInfo.jurusan,
        kategori: siswaInfo.kategori,
        status: "Izin",
        tanggal: today,
        jam: jamSekarang,
        keteranganIzin,
      });

      Swal.fire("Berhasil", "Izin berhasil dicatat", "success");
    }

    /* ================= MASUK ================= */
    if (status === "Masuk") {
      if (sudahIzin) {
        Swal.fire(
          "Ditolak",
          "Sudah Izin hari ini. Presensi Masuk hanya bisa besok.",
          "warning"
        );
        return;
      }

      if (sudahMasuk) {
        Swal.fire("Error", "Sudah presensi Masuk hari ini!", "error");
        return;
      }

      const batas = new Date();
      batas.setHours(6, 50, 0);
      const statusMasuk = now > batas ? "Terlambat" : "Tepat Waktu";

      await axios.post(API_PRESENSI, {
        nomorUnik: siswaInfo.nomorUnik,
        nama: siswaInfo.nama,
        kelas: siswaInfo.kelas,
        jurusan: siswaInfo.jurusan,
        kategori: siswaInfo.kategori,
        status: "Masuk",
        tanggal: today,
        jam: jamSekarang,
        jamMasuk: jamSekarang,
        statusMasuk,
      });

      Swal.fire("Berhasil", `Masuk (${statusMasuk})`, "success");
    }

    /* ================= PULANG ================= */
    if (status === "Pulang") {
      if (sudahIzin) {
        Swal.fire(
          "Ditolak",
          "Sudah Izin hari ini. Presensi Pulang hanya bisa besok.",
          "warning"
        );
        return;
      }

      if (!sudahMasuk) {
        Swal.fire("Error", "Belum presensi Masuk!", "error");
        return;
      }

      if (sudahPulang) {
        Swal.fire("Error", "Sudah presensi Pulang hari ini!", "error");
        return;
      }

      if (now.getHours() < 15) {
        Swal.fire("Error", "Belum waktunya pulang!", "error");
        return;
      }

      await axios.post(API_PRESENSI, {
        nomorUnik: siswaInfo.nomorUnik,
        nama: siswaInfo.nama,
        kelas: siswaInfo.kelas,
        jurusan: siswaInfo.jurusan,
        kategori: siswaInfo.kategori,
        status: "Pulang",
        tanggal: today,
        jam: jamSekarang,
        jamPulang: jamSekarang,
      });

      Swal.fire("Berhasil", "Presensi Pulang berhasil", "success");
    }

    setNomor("");
    setNama("-");
    setSiswaInfo(null);
    setKeteranganIzin("");
    setStatus("Masuk");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        {/* FOTO */}
        <div className="md:w-1/3 bg-white rounded-3xl shadow-xl p-6 flex items-center justify-center h-[460px]">
          <img
            src={huh1}
            alt="Profil"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* FORM */}
        <div className="md:w-2/3 bg-white rounded-3xl shadow-xl p-8">
          {/* JUDUL */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-extrabold">
              <span className="text-black">Presensi </span>
              <span className="text-blue-600">SGK</span>
            </h1>
          </div>

          {/* TANGGAL & JAM */}
          <div className="text-center mb-6 text-sm text-gray-600">
            <div>{tanggal}</div>
            <div className="font-semibold">{jam}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-blue-800">
                Nomor RFID
              </label>
              <input
                ref={inputRef}
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400"
                placeholder="Masukkan nomor RFID"
              />
            </div>

            <div>
              <label className="font-semibold text-blue-800">Nama</label>
              <input
                value={nama}
                readOnly
                className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-100"
              />
            </div>

            {siswaInfo && (
              <div className="text-sm text-blue-800 border-t pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="font-semibold">{siswaInfo.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kelas</span>
                  <span className="font-semibold">{siswaInfo.kelas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jurusan</span>
                  <span className="font-semibold">{siswaInfo.jurusan}</span>
                </div>
              </div>
            )}

            {/* STATUS */}
            <div className="flex gap-6 items-center">
              <label className="font-semibold text-blue-800">Status</label>
              {["Masuk", "Pulang", "Izin"].map((s) => (
                <label key={s} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={status === s}
                    onChange={() => setStatus(s)}
                  />
                  {s}
                </label>
              ))}
            </div>

            {status === "Izin" && (
              <textarea
                value={keteranganIzin}
                onChange={(e) => setKeteranganIzin(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400"
                placeholder="Keterangan izin"
              />
            )}

            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition"
            >
              Submit Presensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Presensi;
