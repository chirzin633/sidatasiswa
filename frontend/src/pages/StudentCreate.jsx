import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import StudentForm from "../components/students/StudentForm";

export default function StudentCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(values) {
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      await api.post("/students", values);
      navigate("/students");
    } catch (error) {
      const res = error.response;
      if (res?.status === 422) {
        setFieldErrors(res.data.errors || {});
        setError("Validasi gagal. Periksa kembali input anda.");
      } else {
        setError("Gagal menyimpan data siswa. Coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout title="Tambah Siswa">
      <div className="flex justify-center items-center">
        <div className="bg-surface shadow-brutal p-6 md:p-8 border-[3px] border-border-ink rounded w-200 max-w-200">
          <div className="mb-6 pb-4 border-border-ink border-b-[3px]">
            <h2 className="text-border-ink font-black text-xl uppercase">
              Form Siswa Baru
            </h2>
            <p className="mt-1 font-bold text-gray-600 text-sm">
              Isi data siswa dengan lengkap. Field bertanda{" "}
              <span className="text-error-text">*</span> wajib diisi.
            </p>
          </div>

          <StudentForm
            mode="create"
            submitting={submitting}
            error={error}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </AppLayout>
  );
}
