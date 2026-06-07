// src/components/Loading.jsx
import { motion, AnimatePresence } from "framer-motion";

export default function Loading({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-md z-50"
        >
          {/* Brand text */}
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="text-3xl font-bold text-[#1A237E] tracking-wide"
          >
            Cheche Mini Market
          </motion.h1>

          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
            className="mt-5 w-16 h-16 border-4 border-t-transparent rounded-full shadow-lg"
            style={{
              borderTopColor: "#FFD700", // gold
              borderRightColor: "#1A237E", // deep blue
              borderBottomColor: "#FFD700",
              borderLeftColor: "#1A237E",
              boxShadow: "0 0 25px rgba(255, 215, 0, 1.8)",
            }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
