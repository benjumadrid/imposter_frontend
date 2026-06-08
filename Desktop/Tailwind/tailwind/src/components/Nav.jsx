import { Link } from "react-router-dom";

export default function Nav() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }

  return (
    <div className="w-full h-[173px] bg-[#E6007E] shadow-lg text-white flex flex-col items-center justify-center font-bold rounded-b-2xl">
      <div className="text-4xl">KIOT</div>
      <div className="text-base font-normal mt-1">BOOKS CENTER</div>
      <div className="mt-3 flex gap-4">
        <Link to="/books" className="hover:underline">Books</Link>
        <Link to="/favorites" className="hover:underline">My Favorites</Link>
        {user?.role === "admin" && <Link to="/admin" className="hover:underline text-yellow-300 font-semibold">Admin Dashboard</Link>}
      </div>
    </div>
  );
}
