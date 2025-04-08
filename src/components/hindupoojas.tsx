import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const poojas = [
  {
    name: "Ganesh Chaturthi Pooja",
    description:
      "Dedicated to Lord Ganesha, celebrated with devotion and grandeur.",
    image: "/poojas/Ganesh-pooja.png",
    samagri: [
      "Ganesh idol",
      "Modaks",
      "Dhoop",
      "Coconut",
      "Betel leaves",
      "Flowers",
      "Panchamrit",
    ],
  },
  {
    name: "Lakshmi Pooja (Diwali Pooja)",
    description:
      "Performed on Diwali night to invite Goddess Lakshmi for prosperity and wealth.",
    image: "/poojas/Lakshmi_pooja.png",
    samagri: [
      "Lakshmi idol",
      "Gold coin",
      "Diya",
      "Flowers",
      "Kumkum",
      "Panchamrit",
      "Sweets",
    ],
  },
  {
    name: "Satyanarayan Katha",
    description:
      "A sacred ritual dedicated to Lord Vishnu, performed during auspicious occasions.",
    image: "/poojas/Satyanarayan_pooja.png",
    samagri: [
      "Satyanarayan Swami idol",
      "Panchamrit",
      "Tulsi leaves",
      "Aarti thali",
      "Incense sticks",
      "Sweets",
    ],
  },
  {
    name: "Griha Pravesh Pooja",
    description:
      "A housewarming ritual to seek blessings before entering a new home.",
    image: "/poojas/Griha-pravesh.png",
    samagri: [
      "Kalash",
      "Holy water",
      "Turmeric",
      "Flowers",
      "Incense sticks",
      "Panchamrit",
    ],
  },
];

const COLORS = ["red-200", "blue-200", "green-200", "yellow-200"];
const ITEMS_PER_VIEW = 3;

export default function HinduPoojas() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const totalPages = Math.ceil(poojas.length / ITEMS_PER_VIEW);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Hindu Poojas
      </h1>

      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={prevSlide}
          className={`absolute left-0 p-3 rounded-full bg-gray-700 text-white shadow-md transition-all ${
            currentIndex === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-600"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-6 w-full max-w-5xl">
          {poojas
            .slice(
              currentIndex * ITEMS_PER_VIEW,
              (currentIndex + 1) * ITEMS_PER_VIEW
            )
            .map((pooja, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`flex-none w-full border-blue-400 sm:w-80 p-5 rounded-xl shadow-md border-l-4 bg-${
                  COLORS[index % COLORS.length]
                }`}
              >
                <img
                  src={pooja.image}
                  alt={pooja.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg text-orange-800 font-semibold">
                  {pooja.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {pooja.description}
                </p>

                <button
                  className="mt-3 bg-indigo-500 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-600 transition"
                  onClick={() =>
                    setOpenDropdown(openDropdown === index ? null : index)
                  }
                >
                  {openDropdown === index ? "Hide Samagri" : "Show Samagri"}
                </button>
                <AnimatePresence>
                  {openDropdown === index && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-white p-3 rounded-md shadow-md text-sm text-gray-700"
                    >
                      {pooja.samagri.map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>

        <button
          onClick={nextSlide}
          className={`absolute right-0 p-3 rounded-full bg-gray-700 text-white shadow-md transition-all ${
            currentIndex === totalPages - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-600"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
