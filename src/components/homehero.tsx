import { useState, useEffect } from "react";
import Image from "next/image";

export default function HomeHero() {
  const images = [
    "Image1.jpg",
    "Image2.jpg",
    "Image3.jpg",
    "Image4.jpg",
    "Image5.jpg",
    "Image6.jpg",
    "Image7.jpg",
    "Image8.jpg",
    "Image9.jpg",
    "Image10.jpg",
    "Image11.jpg",
  ]; // Add more images
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        const currentIndex = images.indexOf(prev);
        return images[(currentIndex + 1) % images.length]; // Loops through images
      });
    }, 4000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      className="relative flex  flex-col items-center justify-center min-h-screen w-full bg-cover bg-center transition-all duration-1000 overflow-hidden px-4"
      style={{ backgroundImage: `url("/HeroBG/${currentImage}")` }}
    >
      {/* Left Flower Image (Rotating) */}
      <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 -translate-x-1/4 w-40 md:w-72 lg:w-80 opacity-80 animate-rotate-slow">
        <Image
          src="/rtflower.png"
          alt="Left Flower"
          width={320}
          height={320}
          priority
        />
      </div>

      <div className="relative bg-gray-200/25 p-7 rounded-3xl z-10 flex flex-col items-center text-center space-y-6 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-950/75 leading-snug">
          <span className="text-orange-700/95 font-bold">KaaryaKram</span> – Your Sacred
          Needs, Delivered with Devotion
        </h1>

        <div className="bg-white shadow-md rounded-lg p-4 md:p-5 w-full max-w-lg flex flex-col space-y-4">
          <div className="flex items-center space-x-3 border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-orange-500 transition">
            <svg width="24" height="24" viewBox="0 0 18 23" fill="#FF5200">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.115 21.8122C12.4772 19.4062 17.7886 13.4751 17.7886 8.78883C17.7886 3.79647 13.9976 0 9.00526 0C4.0129 0 0.210938 3.79647 0.210938 8.78883C0.210938 13.4755 5.52998 19.4073 7.89476 21.8129C8.51149 22.4403 9.49871 22.44 10.115 21.8122ZM8.99988 12.7888C11.4269 12.7888 13.3943 10.8214 13.3943 8.39441C13.3943 5.96745 11.4269 4 8.99988 4C6.57292 4 4.60547 5.96745 4.60547 8.39441C4.60547 10.8214 6.57292 12.7888 8.99988 12.7888Z"
              />
            </svg>

            <input
              type="text"
              className="w-full bg-transparent text-gray-700 focus:outline-none"
              placeholder="Enter your delivery location"
              aria-label="Enter your delivery location"
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center w-full p-3 rounded-lg shadow-sm bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
          >
            Search for pooja, item, or more
          </button>
        </div>
      </div>

      <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 translate-x-1/4 w-40 md:w-72 lg:w-80 opacity-80 animate-rotate-slow">
        <Image
          src="/rtflower.png"
          alt="Right Flower"
          width={320}
          height={320}
          priority
        />
      </div>
    </div>
  );
}
