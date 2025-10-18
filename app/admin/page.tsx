"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import UserApprovalPanel from "@/components/UserApprovalPanel";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function AdminPage() {
  const { userProfile } = useAuth();

  return (
    <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD600]" />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm sm:text-base text-gray-400 mt-1">
                  Manage user registrations and approvals
                </p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-[#FFD600]/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-[#FFD600] font-semibold text-sm sm:text-base">
                🎉 Welcome, Administrator!
              </p>
              <p className="text-gray-300 mt-2 text-xs sm:text-sm">
                Review pending user registrations below. Approve members to grant access to the platform.
              </p>
            </div>

            <UserApprovalPanel />
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
