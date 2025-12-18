import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import huh1 from "../../../public/kakangku.jpg";

export default function Presensi() {
  const [nomor, setNomor] = useState("");
  const [status, setStatus] = useState("Masuk");
  const [keterangan, setKeterangan] = useState("");
  const [tanggalView, setTanggalView] = useState("");
  const [jamView, setJamView] = useState("");

  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_PRESENSI = "http://localhost:5001/presensi";

  /* ================= JAM REALTIME ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTanggalView(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
      setJamView(now.toLocaleTimeString("id-ID"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const rfid = nomor.trim();
    if (!rfid) {
      Swal.fire("Peringatan", "Nomor RFID wajib diisi", "warning");
      return;
    }

    if (status === "Izin" && !keterangan.trim()) {
      Swal.fire("Peringatan", "Keterangan izin wajib diisi", "warning");
      return;
    }

    try {
      /* === CEK MASTER DATA === */
      const resUser = await axios.get(API_DAFTAR);
      const user = resUser.data.find(
        (d) => String(d.nomorUnik).trim() === rfid
      );

      if (!user) {
        Swal.fire("Gagal", "RFID tidak terdaftar", "error");
        return;
      }

      const now = new Date();
      const tanggal = now.toISOString().split("T")[0];
      const jam = now.toTimeString().split(" ")[0];
      const jamMenit = jam.slice(0, 5); // HH:mm

      /* === CEK PRESENSI HARI INI === */
      const resPresensi = await axios.get(API_PRESENSI);
      const todayData = resPresensi.data.filter(
        (p) =>
          p.nomorUnik === user.nomorUnik &&
          p.tanggal === tanggal
      );

      const sudahMasuk = todayData.find((p) => p.status === "Masuk");
      const sudahPulang = todayData.find((p) => p.status === "Pulang");

      /* ================= VALIDASI ================= */

      // MASUK
      if (status === "Masuk" && sudahMasuk) {
        Swal.fire("Ditolak", "Anda sudah presensi Masuk hari ini", "error");
        return;
      }

      // PULANG
      if (status === "Pulang") {
        if (!sudahMasuk) {
          Swal.fire("Ditolak", "Belum presensi Masuk", "error");
          return;
        }
        if (sudahPulang) {
          Swal.fire("Ditolak", "Anda sudah presensi Pulang", "error");
          return;
        }
        if (jamMenit < "15:00") {
          Swal.fire(
            "Ditolak",
            "Presensi Pulang hanya bisa setelah jam 15:00",
            "warning"
          );
          return;
        }
      }

      // IZIN
      if (status === "Izin" && todayData.length > 0) {
        Swal.fire("Ditolak", "Presensi hari ini sudah ada", "error");
        return;
      }

      /* ================= STATUS TERLAMBAT ================= */
      let keteranganStatus = "";
      if (status === "Masuk") {
        keteranganStatus =
          jamMenit <= "06:50" ? "Tepat Waktu" : "Terlambat";
      }

      /* ================= SIMPAN ================= */
      await axios.post(API_PRESENSI, {
        daftarId: user.id,
        nomorUnik: user.nomorUnik,
        nama: user.nama,
        kategori: user.kategori,
        kelas: user.kelas,
        jurusan: user.jurusan,

        tanggal,
        jamMasuk: jam,
        status,
        keteranganIzin: status === "Izin" ? keterangan : "",
        keteranganStatus,
      });

      Swal.fire(
        "Berhasil",
        `Presensi ${user.nama} (${status})`,
        "success"
      );

      setNomor("");
      setStatus("Masuk");
      setKeterangan("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server bermasalah", "error");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* HEADER */}
      <div className="text-center pt-10 pb-12">
        <h1 className="text-5xl font-extrabold">
          Presensi <span className="text-blue-600">SGK</span>
        </h1>
        <p className="mt-4 text-xl">{tanggalView}</p>
        <p className="mt-1 text-3xl font-bold">{jamView}</p>
      </div>

      {/* CARD */}
      <div className="flex justify-center gap-10 flex-wrap pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <img src={huh1} alt="Logo" className="w-64" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 w-[610px]">
          <label className="block font-semibold mb-2 text-lg">
            Nomor RFID
          </label>

          <input
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border rounded-xl px-4 py-4 mb-6 text-lg"
            autoFocus
          />

          <div className="flex gap-8 mb-6 text-lg">
            {["Masuk", "Pulang", "Izin"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={status === item}
                  onChange={() => setStatus(item)}
                />
                {item}
              </label>
            ))}
          </div>

          {/* IZIN */}
          {status === "Izin" && (
            <textarea
              placeholder="Masukkan keterangan izin..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-6"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            Submit Presensi
          </button>
        </div>
      </div>
    </div>
  );
}
