import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import huh1 from "../../../public/kakangku.jpg";

export default function Presensi() {
  const [nomor, setNomor] = useState("");
  const [status, setStatus] = useState("Masuk");
  const [tanggal, setTanggal] = useState("");
  const [jam, setJam] = useState("");

  // JAM REALTIME
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      setTanggal(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );

      setJam(now.toLocaleTimeString("id-ID"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (!nomor) {
      Swal.fire("Peringatan", "Nomor RFID wajib diisi", "warning");
      return;
    }

    try {
      await axios.post("http://localhost:3000/presensi", {
        nomor,
        status,
      });

      Swal.fire("Berhasil", "Presensi berhasil", "success");
      setNomor("");
    } catch {
      Swal.fire("Gagal", "Terjadi kesalahan", "error");
    }
  };

  return (
    <div className="min-h-screen bg-sky-50">

      {/* ===== HEADER BESAR & TEGAS ===== */}
      <div className="text-center pt-10 pb-12">
        <h1 className="text-5xl font-extrabold tracking-wide">
          Presensi <span className="text-blue-600">SGK</span>
        </h1>

        <p className="mt-4 text-xl font-medium text-gray-700">
          {tanggal}
        </p>

        <p className="mt-1 text-3xl font-bold text-gray-900">
          {jam}
        </p>
      </div>

      {/* ===== CARD AREA ===== */}
      <div className="flex justify-center gap-10 flex-wrap pb-12">

        {/* CARD LOGO */}
        <div className="bg-white rounded-2xl shadow-xl p-10 flex items-center justify-center">
          <img src={huh1} alt="Logo" className="w-64" />
        </div>

        {/* CARD FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-10 w-[610px]">
          <label className="block font-semibold text-blue-600 mb-2 text-lg">
            Nomor RFID
          </label>

          <input
            type="text"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            placeholder="Masukkan nomor RFID"
            className="w-full border rounded-xl px-4 py-4 mb-8 text-lg focus:outline-blue-500"
            autoFocus
          />

          <div className="flex gap-8 mb-8 text-lg">
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

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
          >
            Submit Presensi
          </button>
        </div>

      </div>
    </div>
  );
}
