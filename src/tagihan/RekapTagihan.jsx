import { useEffect, useState } from "react";
import axios from "axios";

function RekapTagihan() {
  const [tagihan, setTagihan] = useState([]);
  const [visible, setVisible] = useState(false);

  const API_TAGIHAN = "http://localhost:5001/tagihan";

  const getTagihan = async () => {
    try {
      const res = await axios.get(API_TAGIHAN);
      setTagihan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTagihan();
    setTimeout(() => setVisible(true), 200);
  }, []);

  // Hitung total
  const totalLunas = tagihan
    .filter((t) => t.status === "Lunas")
    .reduce((a, b) => a + b.jumlah, 0);
  const totalBelum = tagihan
    .filter((t) => t.status === "Belum Lunas")
    .reduce((a, b) => a + b.jumlah, 0);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
            Rekap Tagihan
          </h1>

          {/* Ringkasan */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700">Total Lunas</h2>
              <p className="text-2xl font-bold text-green-600">
                Rp {totalLunas.toLocaleString()}
              </p>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Total Belum Lunas
              </h2>
              <p className="text-2xl font-bold text-red-600">
                Rp {totalBelum.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="w-full border-collapse overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Jenis Tagihan</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {tagihan.length > 0 ? (
                  tagihan.map((t, idx) => (
                    <tr
                      key={t.id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{t.nama}</td>
                      <td className="p-3">{t.jenis_tagihan}</td>
                      <td className="p-3 text-right">Rp {t.jumlah.toLocaleString()}</td>
                      <td className="text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            t.status === "Lunas"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-4 text-center text-gray-500 italic bg-gray-50"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-center text-gray-500 text-sm pt-6">
            © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
          </p>
        </div>
      </div>
    </div>
  );
}

export default RekapTagihan;
