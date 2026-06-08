import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Welcome from "./components/Welcome";
import Container from "./components/Container";
import InnerContainer from "./components/InnerContainer";
import Find from "./components/Find";
import Register from "./components/Register"; // ✅ Import Register
import Profile from "./components/Profile";
import Books from "./components/Books";
import OrderConfirmation from "./components/OrderConfirmation";
import Home from "./components/Home";
import About from "./components/About";
import History from "./components/History";
import Retrieve from "./components/Retrieve";
import RetrieveConfirmation from "./components/RetrieveConfirmation";
import BookDetails from "./components/BookDetails";
import FavoriteButton from "./components/FavoriteButton";
import Favorites from "./components/Favorites";
import AdminDashboard from "./components/AdminDashboard";
import Face from "./components/Face";

// Layouts
function MainLayout() {
  return (
    <>
      <Nav />
      <Welcome />
      <Container>
        <InnerContainer>
          <Outlet />
        </InnerContainer>
      </Container>
    </>
  );
}

function NavOnlyLayout() {
  return (
    <>
      <Nav />
      <Container>
        <InnerContainer>
          <Outlet />
        </InnerContainer>
      </Container>
    </>
  );
}

export default function App() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* FIRST PAGE: Face.jsx */}
        <Route path="/" element={<Face />} />

        {/* Login, Register & Profile */}
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Find />} />
          <Route path="/register" element={<Register />} /> {/* ✅ Register route added */}
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Nav only */}
        <Route element={<NavOnlyLayout />}>
          <Route path="/about" element={<About />} />
        </Route>

        {/* Full screen routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/history" element={<History />} />
        <Route path="/books" element={<Books />} />
        <Route path="/retrieve" element={<Retrieve />} />
        <Route path="/retrieve/confirmation" element={<RetrieveConfirmation />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/books/:id/favorite" element={<FavoriteButton />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
