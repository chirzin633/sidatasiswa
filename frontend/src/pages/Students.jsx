import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import SearchBar from "../components/students/SearchBar";
import StudentTable from "../components/students/StudentTable";
import Pagination from "../components/students/Pagination";
import DeleteModal from "../components/students/DeleteModal";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch data
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page,
        per_page: perPage,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const res = await api.get(`/students?${params.toString()}`);
      setStudents(res.data.data.data || []);
      setMeta(res.data.data);
    } catch (error) {
      setError("Gagal memuat data siswa");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, sortBy, sortDir, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Toggle sort
  function handleSort(col) {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
    setPage(1);
  }

  // Toggle delete
  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/students/${deleteTarget.id}`);
      setToast(`Siswa ${deleteTarget.name} berhasil dihapus`);
      setDeleteTarget(null);
      fetchStudents();
    } catch (error) {
      setToast("Gagal menghapus siswa");
    } finally {
      setDeleting(false);
      setTimeout(() => {
        setToast("");
      }, 3000);
    }
  }

  const showingInfo = useMemo(() => {
    if (!meta) {
      return "";
    }

    return `Menampilkan ${meta.from ?? 0}-${meta.to ?? 0} dari ${meta.total} siswa`;
  }, [meta]);

  return (
    <AppLayout title="Data Siswa">
      {/* Toast */}
      {toast && (
        <div className="top-0 right-6 z-50 fixed shadow-brutal px-5 py-3 border-[3px] border-t-border-ink rounded font-black text-sm uppercase bg-accent-green">
          {toast}
        </div>
      )}

      {/* Header aksi */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <button
          onClick={() => navigate("/students/create")}
          className="shadow-brutal-sm hover:shadow-brutal-press active:shadow-none px-6 py-3 border-[3px] border-border-ink text-border-ink rounded font-sans font-black text-sm uppercase transition-all hover:translate-0.75 hover:translate-x-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-pink cursor-pointer"
        >
          + Tambah Siswa
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error shadow-brutal-error mb-4 p-3 border-[3px] border-border-ink text-border-ink rounded font-bold text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface shadow-brutal border-[3px] border-border-ink rounded overflow-hidden">
        <StudentTable
          students={students}
          loading={loading}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={(id) => navigate(`/students/${id}/edit`)}
          onDelete={(student) => setDeleteTarget(student)}
        />
      </div>

      {/* Footer: info + pagination */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mt-6">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-600 text-xs uppercase">
            {showingInfo}
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="bg-surface px-3 py-2 border-[3px] border-border-ink rounded font-bold text-xs uppercase cursor-pointer"
          >
            {[5, 10, 15, 25, 50].map((n) => (
              <option value={n} key={n}>
                {n} / hal
              </option>
            ))}
          </select>
        </div>
        <Pagination
          current={meta?.current_page ?? 1}
          lastPage={meta?.last_page ?? 1}
          onChange={setPage}
        />
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </AppLayout>
  );
}
