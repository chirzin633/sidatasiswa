import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import DeleteModal from "../components/students/DeleteModal";

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setStudent(null);
    setNotFound(false);
    setError("");
    setLoading(true);

    async function fetchStudent() {
      setLoading(true);

      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Gagal memuat data siswa");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/students/${id}`);
      navigate("/students", { replace: true });
    } catch (error) {
      setError("Gagal menghapus siswa.");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Detail Siswa">
        <div className="bg-surface shadow-brutal p-10 border-[3px] border-border-ink rounded font-bold text-gray-500 text-sm text-center">
          Memuat data...
        </div>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout title="Detail Siswa">
        <div className="bg-surface shadow-brutal p-10 border-[3px] border-border-ink rounded text-center">
          <p className="mb-4 text-5xl">🔍</p>

          <h2 className="mb-2 text-border-ink font-black text-xl uppercase">
            Siswa tidak ditemukan
          </h2>

          <p className="mb-6 font-bold text-gray-600 text-sm">
            Data siswa dengan {id} tidak ada atau sudah dihapus.
          </p>

          <button
            onClick={() => navigate("/students")}
            className="shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-6 py-3 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-green cursor-pointer"
          >
            ← Kembali ke Daftar
          </button>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Detail Siswa">
        <div className="bg-error shadow-brutal-error p-10 border-[3px] border-border-ink rounded font-bold text-sm text-center">
          {error}
        </div>
      </AppLayout>
    );
  }

  const age = calculateAge(student.birth_date);

  return (
    <AppLayout title="Detail Siswa">
      {/* Error banner */}
      {error && (
        <div className="bg-error shadow-brutal-error mb-4 p-3 border-[3px] border-border-ink text-border-ink rounded font-bold text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6 max-w-225">
        {/* Hero Card */}
        <div className="bg-surface shadow-brutal border-[3px] border-border-ink rounded overflow-hidden">
          {/* Header Accent */}
          <div className="flex flex-wrap justify-between items-center gap-3 px-6 py-4 border-border-ink border-b-[3px] bg-accent-pink">
            <button
              onClick={() => navigate("/students")}
              className="bg-surface shadow-brutal-press hover:shadow-none px-3 py-1.5 border-[3px] border-border-ink rounded font-black text-xs uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 duration-100 cursor-pointer"
            >
              ← Kembali
            </button>
            <span className="text-border-ink font-black text-[10px] uppercase tracking-wider">
              ID: #{student.id}
            </span>
          </div>

          {/* Body */}
          <div className="flex sm:flex-row flex-col items-start gap-6 p-6 md:p-8">
            {/* Avatar */}
            <div className="flex justify-center items-center shadow-brutal-press border-[3px] border-border-ink text-border-ink rounded w-24 h-24 font-black text-4xl bg-accent-green shrink-0">
              {student.name.charAt(0).toUpperCase()}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <h1 className="text-border-ink font-black text-3xl wrap-break-word uppercase leading-tight">
                {student.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="px-2.5 py-0.5 border-2 border-border-ink rounded font-black text-[10px] text-white uppercase bg-accent-blue">
                  NIS: {student.nis}
                </span>

                <span
                  className={`border-2 border-border-ink rounded px-2.5 py-0.5 font-black text-[10px] uppercase ${student.gender === "L" ? "bg-accent-blue text-white" : "bg-accent-pink"}`}
                >
                  {student.gender === "L" ? "Laki-laki" : "Perempuan"}
                </span>

                <span className="bg-bg-page px-2.5 py-0.5 border-2 border-border-ink rounded font-black text-[10px] uppercase">
                  {student.class}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => navigate(`/students/${student.id}/edit`)}
                className="flex-1 sm:flex-none shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-5 py-2.5 border-[3px] border-border-ink rounded font-black text-xs uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-green cursor-pointer"
              >
                ✎ Edit
              </button>

              <button
                onClick={() => setShowDelete(true)}
                className="flex-1 sm:flex-none bg-error shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-5 py-2.5 border-[3px] border-border-ink rounded font-black text-xs uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 cursor-pointer"
              >
                🗑 Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-surface shadow-brutal p-6 border-[3px] border-border-ink rounded">
          <h3 className="mb-4 pb-3 border-border-ink text-border-ink border-b-[3px] font-black text-base uppercase">
            Informasi Siswa
          </h3>

          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="NIS" value={student.nis} icon={"🔢"} />
            <InfoItem label="Kelas" value={student.class} icon={"🏫"} />
            <InfoItem
              label="Jenis Kelamin"
              value={student.gender === "L" ? "Laki-laki" : "Perempuan"}
              icon={student.gender === "L" ? "♂" : "♀"}
            />
            <InfoItem
              label="Tanggal Lahir"
              value={formatDate(student.birth_date)}
              icon={"🎂"}
            />
            <InfoItem
              label="Umur"
              value={age !== null ? `${age} tahun` : "—"}
              icon={"🎂📅"}
            />
            <InfoItem label="Alamat" value={student.address} icon={"📍"} />
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-surface shadow-brutal p-6 border-[3px] border-border-ink rounded">
          <h3 className="mb-4 pb-3 border-border-ink text-border-ink border-b-[3px] font-black text-base uppercase">
            Metadata
          </h3>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <InfoItem
              label="Ditambahkan"
              value={formatDateTime(student.created_at)}
              icon={"➕"}
            />
            <InfoItem
              label="Terakhir Diperbaharui"
              value={formatDateTime(student.updated_at)}
              icon={"🔄"}
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <DeleteModal
          student={student}
          deleting={deleting}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </AppLayout>
  );
}

function InfoItem(props) {
  const { label, value, icon } = props;

  return (
    <div className="bg-bg-page p-4 border-[3px] border-border-ink rounded">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <p className="font-black text-[10px] text-gray-600 uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="text-border-ink font-black text-sm wrap-break-word">
        {value || "-"}
      </p>
    </div>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateAge(birthDate) {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);
  if (isNaN(birth)) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
