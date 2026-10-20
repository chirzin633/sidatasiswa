export default function SearchBar(props) {
  const { value, onChange } = props;
  return (
    <div className="relative w-full sm:max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari NIS, nama, atau kelas..."
        className="bg-surface py-3 pr-4 pl-11 border-[3px] border-border-ink text-border-ink focus:border-accent-blue rounded focus-visible:outline-none focus-visible:ring-2 w-full font-sans font-bold text-sm transition-colors duration-100 focus-visible:ring-accent-blue"
      />
      <span className="top-1/2 left-3 absolute text-lg -translate-y-1/2">
        🔍
      </span>
      {value && (
        <button
          onClick={() => onChange("")}
          className="top-1/2 right-2 absolute flex justify-center items-center bg-error border-2 border-border-ink rounded w-7 h-7 font-black text-xs -translate-y-1/2 cursor-pointer"
        >
          x
        </button>
      )}
    </div>
  );
}
