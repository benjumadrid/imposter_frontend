import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Face() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-gray-100 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="w-full max-w-7xl bg-white text-gray-900 rounded-[36px] shadow-[0_60px_140px_rgba(0,0,0,0.6)] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        >
          {/* LEFT SIDE */}
          <div className="p-12 flex flex-col gap-7">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-12 w-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">Cheche</span>
                <span className="text-xs text-gray-400 block -mt-1 font-medium tracking-widest uppercase">Mini Market</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                Smart POS System
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Run Your Store
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-400">
                  Smarter & Faster
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 text-base max-w-md leading-relaxed"
            >
              Manage inventory, daily sales, supplier purchases, and customer
              loans with speed and accuracy — all in one place.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { icon: "📦", label: "Unlimited Items" },
                { icon: "💰", label: "Buying & Selling" },
                { icon: "📉", label: "Auto Stock Deduction" },
                { icon: "🧾", label: "Sales History" },
                { icon: "🤝", label: "Loan Management" },
                { icon: "📊", label: "Daily Reports" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-zinc-100 transition"
                >
                  <span className="text-base">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </motion.div>

            {/* Login Button only */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-zinc-900 text-white font-bold text-base hover:bg-zinc-700 active:scale-95 transition-all shadow-xl shadow-zinc-900/30 flex items-center gap-2 justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Your Account
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Authorized personnel only • Secure access
              </p>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-10 text-white flex flex-col gap-6 relative overflow-hidden">

            {/* Decorative circle */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-extrabold leading-snug">
                Built for High-Volume
                <br />
                <span className="text-zinc-400">Retail Stores</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">
                Handle hundreds of products, continuous transactions, and
                real-time stock updates without slowdown.
              </p>
            </motion.div>

            {/* Images grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-2.5"
            >
              {[
                "https://images.unsplash.com/photo-1582719478250-f8e4a8b8b33e?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop",
              ].map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt="market"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="h-28 w-full object-cover rounded-2xl opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                />
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-auto grid grid-cols-3 gap-3"
            >
              {[
                { value: "1000+", label: "Items" },
                { value: "Fast", label: "Checkout" },
                { value: "Live", label: "Stock" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center hover:bg-white/10 transition"
                >
                  <div className="text-xl font-extrabold">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}