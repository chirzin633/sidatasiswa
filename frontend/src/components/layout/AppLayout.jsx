import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContect";

export default function AppLayout(props) {
  const { children, title } = props;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/students", label: "Data Siswa" },
  ];

  return (
    <div className="flex bg-bg-page min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="flex flex-col bg-surface border-border-ink border-r-[3px] w-60">
        {/* Logo */}
        <div className="p-6 border-border-ink border-b-[3px]">
          <h1 className="text-border-ink font-black text-2xl uppercase tracking-tight">
            SiSiswa
          </h1>
          <p className="mt-1 font-bold text-[10px] text-gray-500 uppercase">
            Sistem Data Siswa
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col flex-1 gap-2 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 border-[3px] border-border-ink rounded font-bold text-sm uppercase transition-all duration-100 ${isActive ? "bg-accent-pink shadow-brutal-press translate-x-0.75 translate-y-0.75" : "bg-surface shadow-brutal-sm hover:bg-accent-green hover:shadow-brutal-press hover:translate-x-0.75 hover:translate-y-0.75"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-border-ink border-t-[3px]">
          <div className="mb-3">
            <p className="font-black text-gray-500 text-xs uppercase">
              Masuk sebagai
            </p>
            <p className="text-border-ink font-black text-sm truncate">
              {user?.name}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 border-2 border-border-ink font-black text-[10px] uppercase bg-accent-green">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-error shadow-brutal-press hover:shadow-none py-2.5 border-[3px] border-border-ink text-border-ink rounded w-full font-sans font-black text-xs uppercase transition-all hover:translate-x-0.75 hover:translate-y-0.75 duration-100 cursor-pointer bg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <header className="top-0 z-10 sticky flex justify-between items-center bg-surface px-8 py-5 border-border-ink border-b-[3px]">
          <h2 className="text-border-ink font-black text-2xl uppercase tracking-tight">
            {title}
          </h2>
          <span className="font-bold text-gray-500 text-xs uppercase">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
