"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import UserApprovalPanel from "@/components/UserApprovalPanel";
import BureauRoleAssignment from "@/components/BureauRoleAssignment";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";

export default function AdminPage() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"approvals" | "roles">("approvals");

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
                  Manage users, approvals, and bureau roles
                </p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-[#FFD600]/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <p className="text-[#FFD600] font-semibold text-sm sm:text-base">
                🎉 Welcome, Administrator!
              </p>
              <p className="text-gray-300 mt-2 text-xs sm:text-sm">
                Manage user registrations, approvals, and assign bureau roles to team members.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab("approvals")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "approvals"
                    ? "text-[#FFD600] border-b-2 border-[#FFD600]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Approvals
                </div>
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === "roles"
                    ? "text-[#FFD600] border-b-2 border-[#FFD600]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Bureau Roles
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "approvals" && <UserApprovalPanel />}
              {activeTab === "roles" && <BureauRoleAssignment />}
            </motion.div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
