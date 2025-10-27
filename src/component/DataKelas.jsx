import React, { useState, useEffect } from "react";
import axios from "axios";

const DataKelas = () => {
  const [kelasData, setKelasData] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [visible, setVisible] = useState(false);

  const API_URL = "http://localhost:5001/Kelas";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setKelasData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleKelasClick = (kelas) => {
    setSelectedKelas(selectedKelas === kelas.id ? null : kelas.id);
  };

  return (
    <div
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="min-h-screen p-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <i className="ri-school-line text-4xl text-blue-500 animate-bounce"></i>
            Data Kelas
          </h1>

          <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6"> 
            Daftar Kelas dan Murid
            </h3>

            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="w-full border-collapse overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Nama Kelas</th>
                    <th className="p-3 text-left">Wali Kelas</th>
                    <th className="p-3 text-left">Jumlah Murid</th>
                  </tr>
                </thead>
                <tbody>
                  {kelasData.length > 0 ? (
                    kelasData.map((kelas, index) => (
                      <React.Fragment key={kelas.id}>
                        <tr
                          onClick={() => handleKelasClick(kelas)}
                          className={`cursor-pointer transition duration-200 ${
                            index % 2 === 0
                              ? "bg-gray-50 hover:bg-blue-50"
                              : "bg-gray-100 hover:bg-blue-100"
                          }`}
                        >
                          <td className="p-3 font-medium text-gray-700">
                            {index + 1}
                          </td>
                          <td className="p-3 text-gray-800 font-semibold">
                            {kelas.namaKelas}
                          </td>
                          <td className="p-3 text-gray-700">{kelas.waliKelas}</td>
                          <td className="p-3 text-gray-700">
                            {kelas.murid.length}
                          </td>
                        </tr>

                        {selectedKelas === kelas.id && (
                          <tr>
                            <td colSpan="4" className="p-5 bg-gray-50">
                              <div className="border-l-4 border-blue-400 pl-4">
                                <h4 className="text-lg font-semibold mb-2">
                                  Wali Kelas: {kelas.waliKelas}
                                </h4>
                                <h5 className="text-base font-medium mb-2">
                                  Daftar Murid Nama Murid:
                                </h5>
                                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                                  {kelas.murid.map((murid, i) => (
                                    <li key={i}>{murid}</li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500 italic bg-gray-50"
                      >
                        Tidak ada data kelas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm pt-6">
            © {new Date().getFullYear()} Dashboard Sekolah — dibuat dengan 💙
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataKelas;
