export default function Pagination(props) {
  const { current, lastPage, onChange } = props;

  const pages = [];
  const range = 1;
  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= current - range && i <= current + range)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btnBase =
    "min-w-[36px] h-9 px-2 border-[3px] border-border-ink rounded font-black text-xs uppercase transition-all duration-100 flex items-center justify-center";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current <= 1}
        className={`${btnBase} bg-surface shadow-brutal-press cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-accent-green`}
      >
        ‹
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`e${idx}`}
            className="flex justify-center items-center min-w-9 h-9 font-black text-xs"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`${btnBase} ${page === current ? "bg-accent-pink shadow-brutal-press" : "bg-surface shadow-brutal-sm hover:bg-accent-green hover:shadow-brutal-press hover:translate-x-0.75 hover: translate-y-0.75"} cursor-pointer`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current >= lastPage}
        className={`${btnBase} bg-surface shadow-brutal-press cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:bg-accent-green`}
      >
        ›
      </button>
    </div>
  );
}
