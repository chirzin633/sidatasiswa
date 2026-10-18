import StudentRow from "../students/StudentRow";

const columns = [
  { key: "nis", label: "NIS" },
  { key: "name", label: "Nama" },
  { key: "class", label: "Kelas" },
  { key: "gender", label: "Gender" },
  { key: "birth_date", label: "Tanggal Lahir" },
];

export default function StudentTable(props) {
  const { students, loading, sortBy, sortDir, onSort, onEdit, onDelete } =
    props;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-border-ink border-b-[3px] bg-accent-pink">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => onSort(column.key)}
                className="px-4 py-3 text-border-ink font-black text-[11px] text-left uppercase tracking-wide whitespace-nowrap hover:bg-accent-pink/70 cursor-pointer select-none"
              >
                {column.label}
                {sortBy === column.key && (
                  <span className="ml-1.5">
                    {sortDir === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
            <th className="px-4 py-3 text-border-ink font-black text-[11px] text-center uppercase tracking-wide">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 font-bold text-gray-500 text-sm text-center"
              >
                Memuat data...
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-10 font-bold text-gray-500 text-sm text-center"
              >
                Data siswa tidak ditemukan.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
