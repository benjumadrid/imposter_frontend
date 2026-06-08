// src/pages/RetrieveConfirmation.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "../assets/co.jpg"; // ✅ background image

export default function RetrieveConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, book, book_id, quantity, price } = location.state || {};

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        No confirmation data found. Please go back.
      </p>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{
        backgroundImage: `url(${Image})`, // ✅ background photo
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white/90 rounded-3xl p-12 max-w-2xl w-full text-center shadow-5xl overflow-hidden backdrop-blur-sm"
      >
        {/* Glowing border animation */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-4 border-transparent"
          style={{
            background: "linear-gradient(135deg, #9333ea, #ec4899, #f43f5e)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />

        {/* Card content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          {/* ✅ Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
            className="mx-auto mb-6"
          >
            <CheckCircle2 className="w-28 h-28 text-green-500 drop-shadow-xl" />
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-gray-800 mb-6"
          >
            Retrieval Successful 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600 mb-8 text-lg"
          >
            You have successfully retrieved the following book:
          </motion.p>

          {/* ✅ Book Details */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-2xl p-8 text-left mb-8 shadow-lg border-l-4 border-pink-500"
          >
            <p className="text-lg">
              <span className="font-semibold">Book ID:</span> {book_id}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Book Name:</span> {book}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Quantity:</span> {quantity}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Price:</span> ${price}
            </p>
          </motion.div>

          {/* ✅ Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white text-lg font-semibold shadow-xl transform hover:scale-105 transition-all hover:shadow-2xl"
            >
              Go Home
            </button>
            <button
              onClick={() => navigate("/history", { state: { user } })}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white text-lg font-semibold shadow-xl transform hover:scale-105 transition-all hover:shadow-2xl"
            >
              View Orders
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
