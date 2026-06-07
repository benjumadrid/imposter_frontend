import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiBox,
  FiTrendingUp,
  FiFileText,
  FiClock,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { Link } from "react-router-dom";
import mark from "../assets/mark.jpg";

export default function Welcome() {
  const dashboards = [
    {
      name: "Buying Items 🛒",
      desc: "Add and manage items you want to buy in the super market.",
      icon: <FiShoppingCart size={48} />,
      link: "/buying-items",
    },
    {
      name: "Buying History ⏳",
      desc: "Check the history of items you have bought.",
      icon: <FiClock size={48} />,
      link: "/buying-history",
    },
    {
      name: "Sales Items 💰",
      desc: "View and manage items that are available for sale.",
      icon: <FiTrendingUp size={48} />,
      link: "/sales-items",
    },
    {
      name: "Sales History 📊",
      desc: "Track what you sold, and see daily/weekly/monthly income.",
      icon: <FiFileText size={48} />,
      link: "/sales-history",
    },
    {
      name: "Inventory / Stock 📦",
      desc: "Check available stock, track low inventory and restock items.",
      icon: <FiBox size={48} />,
      link: "/inventory",
    },
    {
      name: "Reports / Analytics 📑",
      desc: "View detailed reports, sales trends and top-selling items.",
      icon: <FiTrendingUp size={48} />,
      link: "/reports",
    },
    {
      name: "Manage Loans 💳",
      desc: "Add and manage customer loans efficiently.",
      icon: <FiFileText size={48} />,
      link: "/loan",
    },
    {
      name: "Loan History 📑",
      desc: "Check the loans history effectively.",
      icon: <FiFileText size={48} />,
      link: "/loan-history",
    },
  ];

  const contacts = [
    {
      label: "Email",
      text: "benjaminhabtamu@gmail.com",
      icon: <FiMail size={28} className="text-red-400" />,
      href: "mailto:benjaminhabtamu@gmail.com",
    },
    {
      label: "Phone",
      text: "0983030998",
      icon: <FiPhone size={28} className="text-green-400" />,
      href: "tel:0983030998",
    },
    {
      label: "Facebook",
      text: "Benjamin Habtamu",
      icon: <FaFacebook size={28} className="text-blue-500" />,
      href: "https://web.facebook.com/benjamin.habtamu.2025",
    },
    {
      label: "Telegram",
      text: "@Benju_Madridsta",
      icon: <FaTelegram size={28} className="text-sky-400" />,
      href: "https://t.me/Benju_Madridsta",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-12 gap-10">
      {/* Dashboard Cards */}
      {dashboards.map((item, i) => {
        const content = (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8 + i * 0.25,
              duration: 0.9,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }}
            className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 flex items-start gap-6 cursor-pointer hover:shadow-3xl transition-all"
          >
            <div className="text-gray-700">{item.icon}</div>
            <div>
              <h2 className="text-3xl font-bold mb-3">{item.name}</h2>
              <p className="text-xl text-gray-600">{item.desc}</p>
            </div>
          </motion.div>
        );

        return item.link ? (
          <Link key={i} to={item.link} className="w-full max-w-3xl">
            {content}
          </Link>
        ) : (
          content
        );
      })}

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: dashboards.length * 0.35, duration: 1 }}
        className="w-full relative overflow-hidden"
      >
        <img
          src={mark}
          alt="About Background"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <div className="relative z-20 py-20 px-8 flex flex-col items-center gap-6 text-white text-center max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-3">📌 About This System</h2>
          <p className="text-2xl mb-6 leading-relaxed">
            This system helps manage mini market items, sales, and inventory
            for efficient daily use. It's designed especially for you ❤️
          </p>
          <p className="text-2xl mb-6 font-semibold">Contact Benjamin:</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {contacts.map((contact, i) => (
              <motion.a
                key={i}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: dashboards.length * 0.35 + 0.6 + i * 0.2,
                  duration: 0.6,
                }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-6 font-semibold text-lg hover:scale-105 transition-all flex flex-col items-center gap-3 cursor-pointer hover:bg-white/30"
              >
                {contact.icon}
                <span className="text-sm text-white/70">{contact.label}</span>
                <span className="text-sm">{contact.text}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}