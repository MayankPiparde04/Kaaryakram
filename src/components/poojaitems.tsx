"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const poojaItemsList = [
  { id: 1, name: "Agarbatti", image: "/poojaitems/agarbatti.png" },
  { id: 2, name: "Akshat Rice", image: "/poojaitems/akshat-rice.png" },
  { id: 3, name: "Cotton Wicks", image: "/poojaitems/cotton-wicks.png" },
  { id: 4, name: "Dhoopbatti", image: "/poojaitems/dhoopbatti.png" },
  { id: 5, name: "Diya", image: "/poojaitems/diya.png" },
  { id: 6, name: "Ghee", image: "/poojaitems/ghee.png" },
  { id: 7, name: "Haldi Powder", image: "/poojaitems/haldi-powder.png" },
  { id: 8, name: "Kapoor (Camphor)", image: "/poojaitems/kapoor.png" },
  { id: 9, name: "Mala (Garland)", image: "/poojaitems/mala.png" },
  {
    id: 10,
    name: "Sandalwood Powder",
    image: "/poojaitems/sandalwood&powder.png",
  },
];

const ITEMS_PER_PAGE = 5;

export default function PoojaItems() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(poojaItemsList.length / ITEMS_PER_PAGE);

  const paginatedItems = poojaItemsList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col items-center px-4 py-6 w-full">
      <h1 className="text-2xl sm:text-4xl text-gray-900 font-bold text-center mb-6">
        Pooja's Items
      </h1>

      {/* Horizontal Scroll Container */}
      <div className="relative flex items-center w-full max-w-4xl">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className={`absolute left-0 p-2 rounded-full bg-gray-800 text-white shadow-md transition-all ${
            currentPage === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-700"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Items Container */}
        <div className=" w-full">
          <Link
            href="/auth/login"
            // className="flex overflow-x-auto"
            // style={{ scrollSnapType: "x mandatory" }}
          >
            <motion.div
              key={currentPage}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center gap-4"
            >
              {paginatedItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="shadow-md rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-transform bg-white w-20 sm:w-24 md:w-28 lg:w-32"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
                  />
                  <h3 className="text-xs sm:text-sm text-black font-medium mt-2">
                    {item.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </Link>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className={`absolute right-0 p-2 rounded-full bg-gray-800 text-white shadow-md transition-all ${
            currentPage === totalPages - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-700"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="mt-4 flex space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <motion.span
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
              currentPage === index ? "bg-gray-800 w-4" : "bg-gray-400"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          ></motion.span>
        ))}
      </div>
    </div>
  );
}
