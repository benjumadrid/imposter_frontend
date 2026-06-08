// src/pages/Home.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "../assets/back.jpg";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely get user from location.state or localStorage
  let user = null;
  try {
    user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        No user info found. Please log in.
      </p>
    );
  }

  // Store in localStorage to persist across reloads
  localStorage.setItem("user", JSON.stringify(user));

  // Redirect admin automatically
  if (user.role === "admin") {
    navigate("/admin");
    return null; // Prevent rendering for a split second
  }

  const cards = [
    {
      title: "About Us",
      description: "Learn more about Cheche Book Center and how to reach us.",
      button: "About Us",
      onClick: () => navigate("/about", { state: { user } }),
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Get & Order Books",
      description: "Browse available books and place your order.",
      button: "Get Books",
      onClick: () => navigate("/books", { state: { user } }),
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Your Order History",
      description: "See the books you’ve ordered before.",
      button: "See History",
      onClick: () => navigate("/history", { state: { user } }),
      color: "bg-pink-600 hover:bg-pink-700",
    },
    {
      title: "Retrieve Books",
      description: "Retrieve the books you didn’t like before.",
      button: "Retrieve",
      onClick: () => navigate("/retrieve", { state: { user } }),
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <div
      className="flex justify-center items-start min-h-screen p-6"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl p-10 shadow-2xl border border-white/30 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-gray-700 mb-8 text-lg">
          Choose what you want to do next.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.2 + index * 0.15,
                type: "spring",
                stiffness: 100,
                duration: 0.3,
              }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
              </div>
              <button
                onClick={card.onClick}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${card.color}`}
              >
                {card.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
