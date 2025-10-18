"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CenterLogos() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 z-10"
    >
      {/* Enactus Logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className="relative w-48 h-48 md:w-64 md:h-64"
      >
        <div className="absolute inset-0 bg-[#FFD600] rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="relative w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center p-8 border-4 border-[#FFD600]">
          {/* Placeholder for Enactus Logo */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              ENACTUS
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              We see opportunity
            </p>
          </div>
        </div>
      </motion.div>

      {/* ISET Nabeul Logo */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ duration: 0.3 }}
        className="relative w-48 h-48 md:w-64 md:h-64"
      >
        <div className="absolute inset-0 bg-black rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="relative w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center p-8 border-4 border-black">
          {/* Placeholder for ISET Nabeul Logo */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              ISET
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-[#FFD600]">
              Nabeul
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
