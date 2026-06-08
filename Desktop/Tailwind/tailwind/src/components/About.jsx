/* eslint-disable */
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Image from "../assets/about.jpg";

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-6 py-12 overflow-hidden" style={{ backgroundColor: "#09090b" }}>

      <div className="absolute inset-0" style={{ backgroundImage: `url(${Image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />

      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.85) 100%)" }} />

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ backgroundColor: "rgba(250,204,21,0.08)", filter: "blur(100px)" }} />

      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none" style={{ backgroundColor: "rgba(250,204,21,0.05)", filter: "blur(100px)" }} />

      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full" style={{ maxWidth: "900px" }}>

        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#facc15" }}>
            <span style={{ color: "#09090b", fontSize: "18px", fontWeight: 900 }}>K</span>
          </div>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "15px" }}>Kiot Book System</span>
        </div>

        <div className="mb-12">
          <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, marginBottom: "16px" }}>
            About <span style={{ color: "#facc15" }}>Kiot Book Center</span>
          </h1>
          <div style={{ width: "48px", height: "3px", backgroundColor: "#facc15", borderRadius: "999px" }} />
        </div>

        <div className="rounded-2xl p-8 mb-10" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 style={{ color: "#facc15", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Who We Are</h3>
              <p style={{ color: "#d4d4d8", fontSize: "15px", lineHeight: "1.8" }}>
                Kiot Book Center is your go-to place to discover, browse, and order books. We make buying books simple, fast, and accessible for everyone in Ethiopia.
              </p>
            </div>
            <div>
              <h3 style={{ color: "#facc15", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Our Mission</h3>
              <p style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: "1.8" }}>
                From students to professionals to passionate readers — we carry a wide variety of titles for every kind of mind. Our mission is to connect readers across Ethiopia with the books they love.
              </p>
            </div>
          </div>
        </div>

        <p style={{ color: "#71717a", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>Contact Us</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">

          <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "rgba(250,204,21,0.15)" }}>📞</div>
            <div>
              <p style={{ color: "#71717a", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Phone</p>
              <p style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: 500 }}>+251 983 030 998</p>
              <p style={{ color: "#a1a1aa", fontSize: "13px" }}>+251 921 951 592</p>
            </div>
          </div>

          <a href="mailto:benjaminhabatamu341@gmail.com" className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "rgba(250,204,21,0.15)" }}>📧</div>
            <div className="overflow-hidden">
              <p style={{ color: "#71717a", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Email</p>
              <p style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>benjaminhabatamu341@gmail.com</p>
            </div>
          </a>

          <a href="https://web.facebook.com/benjamin.habtamu.2025" target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "rgba(250,204,21,0.15)" }}>📘</div>
            <div className="overflow-hidden">
              <p style={{ color: "#71717a", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Facebook</p>
              <p style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>benjamin.habtamu.2025</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-xl px-5 py-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: "rgba(250,204,21,0.15)" }}>📍</div>
            <div>
              <p style={{ color: "#71717a", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Address</p>
              <p style={{ color: "#e4e4e7", fontSize: "14px", fontWeight: 500 }}>Addis Ababa, Ethiopia</p>
              <p style={{ color: "#a1a1aa", fontSize: "13px" }}>P.O. Box 123</p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/home", { state: { user } })}
            className="flex-1 text-center rounded-xl"
            style={{ padding: "15px 24px", border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa", fontSize: "14px", fontWeight: 600, backgroundColor: "transparent", cursor: "pointer" }}
          >
            ← Back
          </button>
          <button
            onClick={() => navigate("/books", { state: { user } })}
            className="flex-1 text-center rounded-xl"
            style={{ padding: "15px 24px", backgroundColor: "#facc15", color: "#09090b", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            Browse Books →
          </button>
        </div>

      </motion.div>
    </div>
  );
}