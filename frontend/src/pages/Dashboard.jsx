import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContect";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";

function StatCard({ label, value, bg, loading }) {
  return (
    <div
      className={`${bg} border-[3px] border-border-ink rounded p-5 shadow-brutal`}
    >
      <p className="mb-2 text-border-ink/70 font-black text-[11px] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-border-ink font-black text-4xl leading-none">
        {loading ? "-" : value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await api.get("/students?per_page=50");
        setStudents(res.data.data.data || []);
      } catch (error) {
        console.error("Gagal ambil data siswa");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Hitung statistik
  const stats = useMemo(() => {
    const total = students.length;
    const male = students.filter((student) => student.gender === "L").length;
    const female = students.filter((student) => student.gender === "P").length;
    const classes = [...new Set(students.map((student) => student.class))];
    return { total, male, female, classCount: classes.length, classes };
  }, [students]);

  // Distribusi per kelas
  const classDistribution = useMemo(() => {
    const map = {};
    students.forEach((student) => {
      map[student.class] = (map[student.class] || 0) + 1;
    });

    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // 5 Siswa terbaru
  const recentStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [students]);

  return (
    <AppLayout title="Dashboard">
      {/* {Welcome} */}
      <div className="bg-surface shadow-brutal mb-8 p-6 border-[3px] border-border-ink rounded">
        <h3 className="text-border-ink font-black text-xl uppercase">
          Halo, {user?.name}
        </h3>
        <p className="mt-1 font-bold text-gray-600 text-sm">
          Selamat datang di panel SiSiswa. Berikut ringkasan data siswa saat
          ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          loading={loading}
          label={"Total Siswa"}
          value={stats.total}
          bg={"bg-accent-pink"}
        />

        <StatCard
          loading={loading}
          label={"Laki-laki"}
          value={stats.male}
          bg={"bg-accent-blue text-white"}
        />

        <StatCard
          loading={loading}
          label={"Perempuan"}
          value={stats.female}
          bg={"bg-accent-green"}
        />

        <StatCard
          loading={loading}
          label={"Jumlah Kelas"}
          value={stats.classCount}
          bg={"bg-surface"}
        />
      </div>

      {/* Two columns */}
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        {/* Distribusi Kelas */}
        <div className="bg-surface shadow-brutal p-6 border-[3px] border-border-ink rounded">
          <h3 className="mb-4 pb-3 border-border-ink text-border-ink border-b-[3px] font-black text-base uppercase">
            Distribusi Kelas
          </h3>
          {loading ? (
            <p className="font-bold text-gray-500 text-sm">Memuat data...</p>
          ) : classDistribution.length === 0 ? (
            <p className="font-bold text-gray-500 text-sm">
              Belum ada data siswa.
            </p>
          ) : (
            <ul>
              {classDistribution.map((c) => (
                <li
                  key={c.name}
                  className="flex justify-between items-center bg-bg-page px-4 py-2.5 border-[3px] border-border-ink rounded"
                >
                  <span className="text-border-ink font-bold text-sm uppercase">
                    {c.name}
                  </span>
                  <span className="px-2.5 py-0.5 border-2 border-border-ink rounded font-black text-sm bg-accent-pink">
                    {c.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Students */}
        <div className="bg-surface shadow-brutal p-6 border-[3px] border-border-ink rounded">
          <h3 className="mb-4 pb-3 border-border-ink text-border-ink border-b-[3px] font-black text-base uppercase">
            Siswa Terbaru
          </h3>
          {loading ? (
            <p className="font-bold text-gray-500 text-sm">Memuat data...</p>
          ) : recentStudents.length === 0 ? (
            <p className="font-bold text-gray-500 text-sm">
              Belum ada data siswa.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentStudents.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 bg-bg-page px-3 py-2.5 border-[3px] border-border-ink rounded"
                >
                  <div className="flex justify-center items-center border-[3px] border-border-ink rounded w-9 h-9 font-black text-sm bg-accent-green shrink-0">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-border-ink font-bold text-sm truncate">
                      {s.name}
                    </p>
                    <p className="font-bold text-[11px] text-gray-500 uppercase">
                      {s.nis} - {s.class}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-border-ink rounded shrink-0 ${s.gender === "L" ? "bg-accent-blue text-white" : "bg-accent-pink"}`}
                  >
                    {s.gender}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={() => navigate("/students")}
          className="shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-6 py-3.5 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 duration-100 bg-accent-green cursor-pointer"
        >
          Lihat Semua Siswa
        </button>
        <button
          onClick={() => navigate("/students/create")}
          className="shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-6 py-3.5 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 duration-100 bg-accent-pink cursor-pointer"
        >
          + Tambah Siswa
        </button>
      </div>
    </AppLayout>
  );
}
