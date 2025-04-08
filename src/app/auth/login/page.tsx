"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, LucideMoveLeft, ChevronLeft } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const response = await axios.post(endpoint, formData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <div className="relative w-full overflow-hidden">
          <motion.div
            animate={{ x: isLogin ? "0%" : "-50%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex w-[200%]"
          >
            {/* Login Form */}
            <div className="w-1/2 px-4">
              <h2 className="text-4xl font-bold text-orange-400 text-center mb-4">
                Login
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Mail className="text-orange-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Lock className="text-orange-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                >
                  Login
                </button>
              </form>
              <p className="mt-4 text-center text-gray-400">
                Don't have an account?
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-orange-400 ml-1"
                >
                  Register
                </button>
              </p>
              <div className="flex pt-5 text-sm justify-end items-center  text-orange-500 hover:text-orange-600 transition">
                <ChevronLeft size={24} />
                <Link href={"/"} className="font-thin">
                  Home
                </Link>
              </div>
            </div>
            {/* Register Form */}
            <div className="w-1/2 px-4">
              <h2 className="text-4xl font-bold text-orange-400 text-center mb-4">
                Register
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <User className="text-orange-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Mail className="text-orange-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Lock className="text-orange-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                >
                  Register
                </button>
              </form>
              <p className="mt-4 text-center text-gray-400">
                Already have an account?
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-orange-400 ml-1"
                >
                  Login
                </button>
              </p>
              <div className="flex pt-5 text-sm justify-end items-center  text-orange-500 hover:text-orange-600 transition">
                <ChevronLeft size={24} />
                <Link href={"/"} className="font-thin">
                  Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
