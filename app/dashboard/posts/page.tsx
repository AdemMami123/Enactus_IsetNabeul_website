"use client";

import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PostManager from "@/components/PostManager";
import { PartyPopper } from "lucide-react";

export default function PostsPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PostManager />
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
