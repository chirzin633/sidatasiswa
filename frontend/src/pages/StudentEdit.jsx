import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import StudentForm from "../components/students/StudentForm";
import { getApiMessage } from "../utils/apiMessage";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setInitialData(null);
    setNotFound(false);
    setError("");
    setFieldErrors({});
    setLoading(true);

    async function fetchStudent() {
      try {
        const res = await api.get(`/students/${id}`);
        const s = res.data.data;
        setInitialData({
          nis: s.nis,
          name: s.name,
          class: s.class,
          gender: s.gender,
          birth_date: s.birth_date ? s.birth_date.substring(0, 10) : "",
          address: s.address || "",
        });
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

  async function handleSubmit(values) {
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await api.put(`/students/${id}`, values);
      navigate("/students", {
        state: { toast: getApiMessage(res, "Siswa berhasil diupdate.") },
      });
    } catch (error) {
      const res = error.response;
      if (res?.status === 422) {
        setFieldErrors(res.data.errors || {});
        setError(
          res.data.message || "Validasi gagal. Periksa kembali input Anda.",
        );
      } else if (res?.status === 404) {
        setError("Data siswa tidak ditemukan");
      } else {
        setError(res?.data?.message || "Gagal menyimpan perubahan. Coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout title="Edit Siswa">
      <div className="bg-surface shadow-brutal p-6 md:p-8 border-[3px] border-border-ink rounded max-w-200">
        <div className="mb-6 pb-4 border-border-ink border-b-[3px]">
          <h2 className="text-border-ink font-black text-xl uppercase">
            Edit Data Siswa
          </h2>
          <p className="mt-1 font-bold text-gray-600 text-sm">
            Perbarui data siswa. NIS harus tetap unik
          </p>
        </div>
        {loading ? (
          <p className="font-bold text-gray-500 text-sm">Memuat data...</p>
        ) : notFound ? (
          <div className="bg-error shadow-brutal-error p-4 border-[3px] border-border-ink text-border-ink rounded font-bold text-sm">
            Data siswa dengan ID {id} tidak ditemukan.{" "}
            <button
              onClick={() => navigate("/students")}
              className="font-black underline"
            >
              Kembali ke daftar
            </button>
          </div>
        ) : (
          <StudentForm
            mode="edit"
            initialData={initialData}
            submitting={submitting}
            error={error}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AppLayout>
  );
}
