"use client";

import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import AbsenceManagement from "@/components/AbsenceManagement";

export default function AbsencePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AbsenceManagement />
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
