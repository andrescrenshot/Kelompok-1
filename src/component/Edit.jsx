// src/pages/EditData.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function EditData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_DAFTAR = "http://localhost:5001/Daftar";
  const API_KATEGORI = "http://localhost:5001/Kategori";
  const API_KELAS = "http://localhost:5001/Kelas";

  const [formData, setFormData] = useState({ nama: "", kelas: "", jurusan: "", jabatan: "", email: "", kategori: "Siswa", nomorUnik: "" });
  const [kategoriAktif, setKategoriAktif] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [jurusanList, setJurusanList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getKategoriAktif = async () => {
    try {
      const res = await axios.get(API_KATEGORI);
      setKategoriAktif(res.data.filter(k => k.aktif).map(k => k.kategori_nama));
    } catch (err) { console.error(err); }
  };

  const getKelasList = async () => {
    try {
      const res = await axios.get(API_KELAS);
      setKelasList(res.data || []);
    } catch (err) { console.error(err); }
  };

  const getUserData = async () => {
    try {
      const res = await axios.get(`${API_DAFTAR}/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKategoriAktif();
    getKelasList();
    getUserData();
  }, [id]);

  useEffect(() => {
    if (!kelasList.length) return;
    if (!formData.kelas) { setJurusanList([]); return; }
    const jurusanFiltered = [...new Set(kelasList.filter(k=>k.kelas===formData.kelas).map(k=>k.jurusan).filter(Boolean))];
    setJurusanList(jurusanFiltered);
    if (!jurusanFiltered.includes(formData.jurusan)) {
      setFormData(prev => ({ ...prev, jurusan: "" }));
    }
  }, [formData.kelas, kelasList]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    Swal.fire({
      title: "Simpan perubahan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then(async (result)=>{
      if(result.isConfirmed){
        try{
          const dataToSubmit = { ...formData, jabatan: formData.jabatan.trim() || "Belum ada jabatan/bagian" };
          await axios.put(`${API_DAFTAR}/${id}`, dataToSubmit);
          Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
          navigate("/Daftar");
        }catch(err){
          console.error(err);
          Swal.fire("Error", "Gagal mengupdate data!", "error");
        }
      }
    });
  };

  if (loading) return <p className="text-center pt-20">Memuat data...</p>;

  const isSiswa = formData.kategori.toLowerCase().includes("siswa");
  const kelasUniqueList = [...new Set(kelasList.map(k=>k.kelas).filter(Boolean))];

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm mt-20">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Data</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nomor Unik</label>
            <input type="text" value={formData.nomorUnik} className="w-full border p-2 rounded bg-gray-200" disabled />
          </div>
          <div>
            <label>Nama</label>
            <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label>Jabatan/Bagian</label>
            <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label>Kategori</label>
            <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full border p-2 rounded">
              {kategoriAktif.map((k,i)=><option key={i} value={k}>{k}</option>)}
            </select>
          </div>

          {isSiswa && (
            <div className="space-y-3">
              <div>
                <label>Kelas</label>
                <select name="kelas" value={formData.kelas} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="">Pilih Kelas</option>
                  {kelasUniqueList.map((k,i)=><option key={i} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label>Jurusan</label>
                <select name="jurusan" value={formData.jurusan} onChange={handleChange} className="w-full border p-2 rounded" disabled={!jurusanList.length}>
                  <option value="">Pilih Jurusan</option>
                  {jurusanList.map((j,i)=><option key={i} value={j}>{j}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Simpan</button>
            <button type="button" onClick={()=>navigate("/Daftar")} className="bg-gray-500 text-white px-4 py-2 rounded w-full">Kembali</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditData;
