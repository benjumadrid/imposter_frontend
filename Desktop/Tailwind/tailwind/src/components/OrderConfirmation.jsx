// src/pages/OrderConfirmation.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EthiopianCalendar from "gize-bet";
import Image from "../assets/orders.jpg"; // imported order image

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedArray = [], user = {} } = location.state || {};

  // Ethiopian date/time
  const calendar = new EthiopianCalendar();
  const now = new Date();
  const ethiopianDateTime = calendar.getEthiopianDateTime(now);

  return (
    <div
      className="flex justify-center items-center min-h-screen p-6"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        // ⬇️ Partially maximized container
        className="bg-white/90 w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-white/40 backdrop-blur-md"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center shadow-lg">
            <span className="text-green-600 text-4xl">📚</span>
          </div>
        </motion.div>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3 drop-shadow-md">
          Order Confirmed!
        </h2>
        <p className="text-center text-gray-600 mb-3 text-lg">
          Hello <span className="font-semibold">{user.name}</span>, your order has been placed successfully!
        </p>

        {/* Ethiopian Date & Time */}
        <p className="text-center text-base text-gray-500 mb-6">
          📅 {ethiopianDateTime.ethiopianDate} <br />
          ⏰ {ethiopianDateTime.stringTime}
        </p>

        {/* Order Summary */}
        <div className="space-y-5">
          {selectedArray.map((item, index) => (
            <motion.div
              key={item.bookId}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/95 rounded-2xl p-5 flex justify-between items-center shadow-md hover:shadow-xl transition backdrop-blur-sm"
            >
              <div>
                <p className="font-medium text-gray-800 text-lg">{item.bookName}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-pink-600 text-lg">${item.totalPrice.toFixed(2)}</p>
            </motion.div>
          ))}

          {/* Grand Total */}
          <div className="flex justify-between border-t border-gray-300 pt-5 text-lg">
            <span className="text-gray-700 font-semibold">Grand Total</span>
            <span className="text-pink-600 font-bold">
              ${selectedArray.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Thank You */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-green-600 font-medium mt-8 drop-shadow-sm text-lg"
        >
          ✅ Thank you for shopping with us!
        </motion.p>

        {/* Back Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => navigate("/books", { state: { user } })}
          className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-800 transition text-lg shadow-md"
        >
          Back to Books
        </motion.button>
      </motion.div>
    </div>
  );
}
