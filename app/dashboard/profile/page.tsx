"use client";

import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileSection from "@/components/ProfileSection";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4 justify-center lg:justify-start">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFD600]" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">My Profile</h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg text-center lg:text-left">
              Update your personal information and profile picture
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ProfileSection />
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
