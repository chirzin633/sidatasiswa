import { useEffect } from "react";

export default function DeleteModal(props) {
  const { student, deleting, onCancel, onConfirm } = props;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !deleting) {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleting, onCancel]);

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/40 p-6"
      onClick={deleting ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface shadow-brutal p-6 border-[3px] border-border-ink rounded w-full max-w-100"
      >
        <div className="flex justify-center items-center bg-error mb-4 border-[3px] border-border-ink rounded w-14 h-14 text-2xl">
          ⚠️
        </div>
        <h3 className="mb-2 text-border-ink font-black text-xl uppercase">
          Hapus Siswa?
        </h3>
        <p className="mb-6 font-bold text-gray-600 text-sm">
          Data Siswa <span className="text-border-ink">{student.name}</span>{" "}
          (NIS: {student.nis}) akan dihapus permanen. Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 bg-surface disabled:opacity-50 shadow-brutal-press hover:shadow-none py-3 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 duration-100 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-error disabled:opacity-50 shadow-brutal-press hover:shadow-none py-3 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 duration-100 cursor-pointer"
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
