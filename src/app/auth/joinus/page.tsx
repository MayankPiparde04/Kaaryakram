"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Truck, Briefcase, Check } from "lucide-react";
import axios from "axios";

export default function JoinUs() {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: "",
    poojasOffered: "",
    owner: "",
    location: "",
    vehicleType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `/api/join/${role}`;
      const response = await axios.post(endpoint, formData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4">
      {!role ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Join Us</h2>
          <p className="text-gray-400 mb-6">Choose your role to proceed</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Pandit", icon: Briefcase },
              { label: "Delivery Partner", icon: Truck },
              { label: "Dark Store", icon: MapPin },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setRole(label.toLowerCase().replace(" ", ""))}
                className="flex items-center justify-center bg-orange-500 p-4 rounded-lg w-40 text-lg font-semibold hover:bg-orange-600 transition"
              >
                <Icon size={24} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4 capitalize">Join as {role}</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
              <User className="text-orange-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full outline-none px-2 bg-transparent text-white"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
              <Phone className="text-orange-400" size={20} />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full outline-none px-2 bg-transparent text-white"
                onChange={handleChange}
              />
            </div>
            {role === "pandit" && (
              <>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Check className="text-orange-400" size={20} />
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <Check className="text-orange-400" size={20} />
                  <input
                    type="text"
                    name="poojasOffered"
                    placeholder="Poojas Offered"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {role === "darkstore" && (
              <>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <User className="text-orange-400" size={20} />
                  <input
                    type="text"
                    name="owner"
                    placeholder="Owner Name"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                  <MapPin className="text-orange-400" size={20} />
                  <input
                    type="text"
                    name="location"
                    placeholder="Store Location"
                    className="w-full outline-none px-2 bg-transparent text-white"
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {role === "deliverypartner" && (
              <div className="flex items-center border border-orange-400 rounded-lg p-3 bg-gray-700">
                <Truck className="text-orange-400" size={20} />
                <input
                  type="text"
                  name="vehicleType"
                  placeholder="Vehicle Type"
                  className="w-full outline-none px-2 bg-transparent text-white"
                  onChange={handleChange}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Submit Application
            </button>
          </form>
          <button
            onClick={() => setRole(null)}
            className="mt-4 text-gray-400 hover:text-orange-400 transition"
          >
            ← Back to role selection
          </button>
        </motion.div>
      )}
    </div>
  );
}
