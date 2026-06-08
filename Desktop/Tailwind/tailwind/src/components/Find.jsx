// src/components/Find.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./PhoneInputCustom.module.css";

export default function Find() {
  const navigate = useNavigate(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!phone) {
      setPhoneError("Phone number is required.");
      hasError = true;
    } else setPhoneError("");

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else setPasswordError("");

    if (hasError) return;

    try {
      let normalizedPhone = phone.startsWith("+251")
        ? "0" + phone.slice(4)
        : phone;

      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.user) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.removeItem("user");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          role: data.user.role,
        })
      );

      if (data.user.role !== "admin") {
        navigate("/home", { replace: true });
      } else {
        navigate("/admin", { state: { user: data.user }, replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left */}
        <div className="hidden md:flex flex-col justify-center items-start rounded-3xl p-8 bg-gradient-to-br from-pink-50 via-pink-100 to-white shadow-inner">
          <div className="bg-white/40 rounded-full p-3 mb-6">
            <svg
              className="w-10 h-10 text-pink-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 2L15 8H9L12 2Z" fill="#E6007E" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">
            Welcome back!
          </h2>
          <p className="text-sm text-gray-600">
            Sign in to manage your books, favorites and orders.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-gray-700">
            <li>✅ Quick access to your library</li>
            <li>🔒 Secure sessions</li>
            <li>⚡ Fast recommendations</li>
          </ul>
        </div>

        {/* Right */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-gray-100 p-6 md:p-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Sign in to your account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Use your phone number to sign in securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div
                className={`flex items-center rounded-2xl px-3 py-2 transition-colors ${
                  phoneError
                    ? "border-4 border-red-500"
                    : "border-4 border-gray-200"
                } focus-within:ring-2 focus-within:ring-pink-200`}
              >
                <PhoneInput
                  international
                  defaultCountry="ET"
                  value={phone}
                  onChange={(value) => {
                    setPhone(value);
                    setPhoneError("");
                  }}
                  placeholder="9XXXXXXXX"
                  className={`${styles.phoneInput} w-full text-sm bg-transparent`}
                  autoComplete="username"
                />
              </div>
              {phoneError && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {phoneError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot"
                  className="text-sm text-pink-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <div
                className={`relative flex items-center rounded-2xl px-3 py-2 ${
                  passwordError
                    ? "border-4 border-red-500"
                    : "border-4 border-gray-200"
                } focus-within:ring-2 focus-within:ring-pink-200`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm outline-none pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-xs text-red-600 font-medium">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl font-semibold text-white bg-[#E6007E] hover:bg-pink-700 transition"
            >
              Sign In
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
