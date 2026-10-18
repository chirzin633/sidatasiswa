export default function StudentRow(props) {
  const { student, onEdit, onDelete } = props;

  return (
    <tr className="hover:bg-bg-page border border-border-ink border-b-2 last:border-b-0 transition-colors duration-75">
      <td className="px-4 py-3 text-border-ink font-bold text-sm whitespace-nowrap">
        {student.nis}
      </td>
      <td className="px-4 py-3 text-border-ink font-bold text-sm">
        {student.name}
      </td>
      <td className="px-4 py-3 text-border-ink font-bold text-sm whitespace-nowrap">
        {student.class}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block px-2.5 py-0.5 border-2 border-border-ink rounded font-black text-[10px] uppercase ${student.gender === "L" ? "bg-accent-blue text-white" : "bg-accent-pink"}`}
        >
          {student.gender === "L" ? "Laki-laki" : "Perempuan"}
        </span>
      </td>
      <td className="px-4 py-3 text-border-ink font-bold text-sm whitespace-nowrap">
        {formatDate(student.birth_date)}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onEdit(student.id)}
            className="shadow-[2px_2px_0_#000] hover:shadow-none px-3 py-1.5 border-2 border-border-ink rounded font-black text-[10px] uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 duration-100 bg-accent-green cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(student)}
            className="bg-error shadow-[2px_2px_0_#000] hover:shadow-none px-3 py-1.5 border-2 border-border-ink rounded font-black text-[10px] uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 duration-100 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
