"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/EnactusISETNabeul",
    color: "#1877F2",
    hoverColor: "#4267B2",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/enactusisetnabeul?igsh=MTRiZzd3cGFtdzV2Yg==",
    color: "#E4405F",
    hoverColor: "#C13584",
  },
  
  {
    name: "Email",
    icon: Mail,
    url: "mailto:enactusisetnabeul26@gmail.com",
    color: "#FFD600",
    hoverColor: "#FFC700",
  },
];

export default function SocialMediaBar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-1/2 left-6 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4"
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target={social.name !== "Email" ? "_blank" : undefined}
          rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
          whileHover={{
            scale: 1.15,
            x: 5,
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative"
        >
          {/* Background Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{ backgroundColor: social.color }}
          />

          {/* Icon Container */}
          <div
            className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-sm border-2 border-gray-700 group-hover:border-[#FFD600] transition-all duration-300 shadow-lg"
          >
            <social.icon
              className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300"
              strokeWidth={2}
            />
          </div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-[#FFD600]/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            <p className="text-white text-sm font-medium">{social.name}</p>
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px] w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-[#FFD600]/50"></div>
          </motion.div>
        </motion.a>
      ))}

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[2px] h-16 bg-gradient-to-b from-[#FFD600] to-transparent origin-top"
      />
    </motion.div>
  );
}
