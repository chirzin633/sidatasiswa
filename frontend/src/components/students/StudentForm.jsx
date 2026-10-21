import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const initialValues = {
  nis: "",
  name: "",
  class: "",
  gender: "",
  birth_date: "",
  address: "",
};

export default function StudentForm(props) {
  const {
    mode = "create",
    initialData = null,
    submitting = false,
    error = "",
    fieldErrors = {},
    onSubmit,
  } = props;

  const navigate = useNavigate();
  const [values, setValues] = useState(initialData || initialValues);

  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    } else {
      setValues(initialValues);
    }
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-surface border-[3px] rounded font-sans font-bold text-sm text-border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue transition-colors duration-100 ${fieldErrors[field] ? "border-error-text bg-red-50" : "border-border-ink focus:border-accent-blue"}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Global Error */}
      {error && (
        <div className="bg-error shadow-brutal-error p-3 border-[3px] border-border-ink text-border-ink rounded font-bold text-sm">
          {error}
        </div>
      )}

      {/* Grid 2 kolom layar besar */}
      <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
        {/* NIS */}
        <div>
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            NIS <span className="text-error-text">*</span>
          </label>
          <input
            type="text"
            value={values.nis}
            onChange={handleChange("nis")}
            placeholder="20240001"
            className={inputClass("nis")}
          />
          <FieldError field={"nis"} fieldErrors={fieldErrors} />
        </div>

        {/* Nama */}
        <div>
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            Nama Lengkap <span className="text-error-text">*</span>
          </label>
          <input
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            placeholder="Nama lengkap"
            className={inputClass("name")}
          />
          <FieldError field={"name"} fieldErrors={fieldErrors} />
        </div>

        {/* Kelas */}
        <div>
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            Kelas <span className="text-error-text">*</span>
          </label>
          <input
            type="text"
            value={values.class}
            onChange={handleChange("class")}
            placeholder="XII IPS 1"
            className={inputClass("class")}
          />
          <FieldError field={"class"} fieldErrors={fieldErrors} />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            Jenis Kelamin <span className="text-error-text">*</span>
          </label>
          <div className="flex gap-3">
            {[
              {
                value: "L",
                label: "Laki-laki",
                bg: "bg-accent-blue text-white",
              },
              {
                value: "P",
                label: "Perempuan",
                bg: "bg-accent-pink",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValues((prev) => ({ ...prev, gender: opt.value }))
                }
                className={`flex-1 py-3 border-[3px] border-border-ink rounded font-black text-xs uppercase cursor-pointer transition-all duration-100 ${values.gender === opt.value ? `${opt.bg} shadow-brutal-press translate-x-0.75 translate-y-0.75` : "bg-surface shadow-brutal-sm hover:bg-bg-page"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <FieldError field={"gender"} fieldErrors={fieldErrors} />
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            Tanggal Lahir <span className="text-error-text">*</span>
          </label>
          <input
            type="date"
            value={values.birth_date}
            onChange={handleChange("birth_date")}
            max={new Date().toISOString().split("T")[0]}
            className={inputClass("birth_date")}
          />
          <FieldError field={"birth_date"} fieldErrors={fieldErrors} />
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
            Alamat
          </label>
          <textarea
            value={values.address}
            onChange={handleChange("address")}
            placeholder="Jl. Contoh No. 123, Bandung"
            rows={3}
            className={`${inputClass("address")} resize-none`}
          />
          <FieldError field={"address"} fieldErrors={fieldErrors} />
        </div>

        {/* Actions */}
        <div className="flex sm:flex-row flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/students")}
            disabled={submitting}
            className="flex-1 bg-surface disabled:opacity-50 shadow-brutal-press hover:shadow-none py-3.5 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 duration-100 cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex-1 disabled:opacity-60 shadow-brutal-sm hover:shadow-brutal-press active:shadow-none py-3.5 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-green cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting
              ? "Menyimpan..."
              : mode === "edit"
                ? "Update Siswa"
                : "Simpan Siswa"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FieldError({ field, fieldErrors }) {
  const msg = fieldErrors[field]?.[0];
  return msg ? (
    <span className="block mt-1 font-bold text-error text-xs">{msg}</span>
  ) : null;
}
