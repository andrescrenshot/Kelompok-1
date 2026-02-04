import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../../../public/kakangku.jpg";

export default function Presensi() {
  const [nomor, setNomor] = useState("");
  const [nama, setNama] = useState("-");
  const [tanggalView, setTanggalView] = useState("");
  const [jamView, setJamView] = useState("");

  // Path backend yang fix
  const API_DAFTAR = "http://localhost:8080/api/master-data";
  const API_PRESENSI = "http://localhost:8080/api/presensi";

  // ================= JAM REALTIME =================
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
      setJamView(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= SCAN RFID =================
  const handleChangeNomor = async (value) => {
    setNomor(value);
    setNama("-");

    if (!value.trim()) return;

    try {
      const res = await axios.get(API_DAFTAR);
      console.log("Data master:", res.data);

      const user = res.data.find(
        (d) => String(d.nomorUnik).trim() === value.trim()
      );

      if (!user) {
        setNama("RFID tidak terdaftar");
        return;
      }

      setNama(user.nama);

      // otomatis presensi
      await handleSubmit(user);
    } catch (err) {
      console.error(err);
      setNama("Server error");
    }
  };

  // ================= PRESENSI OTOMATIS =================
  const handleSubmit = async (user) => {
    const now = new Date();
    const tanggal = now.toISOString().split("T")[0];
    const jamFull = now.toTimeString().split(" ")[0];

    try {
      const resPresensi = await axios.get(API_PRESENSI);
      const todayData = resPresensi.data.filter(
        (p) => p.nomorUnik === user.nomorUnik && p.tanggal === tanggal
      );

      const dataMasuk = todayData.find((p) => p.status === "Masuk");
      const dataPulang = todayData.find((p) => p.status === "Pulang");

      let presensiStatus = "";

      if (!dataMasuk) presensiStatus = "Masuk";
      else if (!dataPulang) presensiStatus = "Pulang";
      else {
        Swal.fire({
          icon: "error",
          title: "Sudah presensi lengkap hari ini",
        });
        return;
      }

      // ================= TERLAMBAT =================
      let keteranganStatus = "";
      let isTerlambat = false;

      if (presensiStatus === "Masuk") {
        if (jamFull <= "06:50:00") keteranganStatus = "Tepat Waktu";
        else {
          keteranganStatus = "Terlambat";
          isTerlambat = true;
        }
      }

      // ================= SIMPAN PRESENSI =================
      if (presensiStatus === "Masuk") {
        await axios.post(API_PRESENSI, {
          daftarId: user.id,
          nomorUnik: user.nomorUnik,
          nama: user.nama,
          kategori: user.kategori,
          kelas: user.kelas,
          jurusan: user.jurusan,
          tanggal,
          jamMasuk: jamFull,
          jamPulang: "",
          status: "Masuk",
          keteranganStatus,
        });
      } else if (presensiStatus === "Pulang") {
        await axios.put(`${API_PRESENSI}/${dataMasuk.id}`, {
          ...dataMasuk,
          jamPulang: jamFull,
          status: "Pulang",
        });
      }

      Swal.fire({
        icon: isTerlambat
          ? "warning"
          : presensiStatus === "Pulang"
          ? "success"
          : "success",
        title:
          presensiStatus === "Pulang"
            ? "Pulang Berhasil"
            : isTerlambat
            ? "Datang Terlambat"
            : "Presensi Berhasil",
        text: `${user.nama} • ${jamFull}`,
      });

      setNomor("");
      setNama("-");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Server Bermasalah" });
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-sky-50">
      <div className="text-center pt-10 pb-12">
        <h1 className="text-5xl font-extrabold">
          Presensi <span className="text-blue-600">S.G.K</span>
        </h1>
        <p className="mt-4 text-2xl">{tanggalView}</p>
        <p className="mt-1 text-4xl font-bold">{jamView}</p>
      </div>

      <div className="flex justify-center gap-10 flex-wrap pb-12">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <img src={logo} alt="Logo" className="w-64" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 w-[610px]">
          <label className="font-semibold mb-2 text-lg block">
            Nomor RFID
          </label>
          <input
            value={nomor}
            onChange={(e) => handleChangeNomor(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 mb-4 text-lg"
            autoFocus
          />
          <p className="text-center text-3xl font-bold mb-6 text-blue-600">
            {nama}
          </p>
        </div>
      </div>
    </div>
  );
}
