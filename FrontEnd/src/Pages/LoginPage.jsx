import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaFacebook,
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const images = [
  "https://nira.gov.so/_next/static/media/residence-id.e57faa24.jpg",
  "https://pbs.twimg.com/media/F6IguNlWUAACGyE.jpg:large",
  "https://d1sr9z1pdl3mb7.cloudfront.net/wp-content/uploads/2024/08/19150604/somalia-NIRA-national-digial-ID.png",
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      navigate("/dashboard");
      return;
    }

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [navigate, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.onLine) {
      setIsSuccess(false);
      setMessage(" Please connect to the Internet.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(email, password);

      if (result.success) {
        setIsSuccess(true);
        setMessage(" " + result.message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(" " + result.message);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(" Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Message alert */}
      {message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
            isSuccess ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaTimesCircle className="text-xl" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side with slideshow */}
        <div className="md:w-1/2 w-full h-[300px] md:h-auto">
          <img
            src={images[imageIndex]}
            alt="Slideshow"
            className="w-full h-full object-cover transition-all duration-1000"
          />
        </div>

        {/* Right side with form */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-50 px-6 py-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl space-y-6 animate-fade-in-up"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Welcome to NIRA ID Verification - Somalia
            </h2>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <span
                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Registration Link */}
            {/* <div className='text-center'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='text-blue-600 hover:text-blue-700 font-semibold'
                >
                  Register here
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 flex justify-center gap-6 items-center text-sm md:text-base">
        <p>Developed by Sadam Hussein Mohamed</p>
        <a
          href="https://www.facebook.com/share/v/1ASXmgEYcK/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-2xl hover:text-blue-400" />
        </a>
        <a href="tel:+252619818501">
          <FaPhone className="text-2xl hover:text-green-400" />
        </a>
        <a href="https://nira.gov.so" target="_blank" rel="noopener noreferrer">
          <FaGlobe className="text-2xl hover:text-yellow-400" />
        </a>
      </footer>
    </div>
  );
}

export default LoginPage;
