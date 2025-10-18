"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto gap-3">
          {/* Left side - User info (when logged in) */}
          {user && userProfile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2 sm:gap-3 bg-gray-800/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-[#FFD600]/20"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFD600] flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <div className="text-white">
                <p className="text-xs sm:text-sm font-semibold truncate max-w-[120px] sm:max-w-none">{userProfile.email}</p>
                <p className="text-[10px] sm:text-xs text-[#FFD600] capitalize">
                  {userProfile.role}
                </p>
              </div>
            </motion.div>
          )}

          {/* Right side - Auth buttons */}
          <div className="ml-auto flex gap-2 sm:gap-3">
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard">
                    <Button
                      variant="default"
                      size="default"
                      className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90 font-semibold shadow-lg transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
                    >
                      <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="default"
                    className="bg-gray-800 text-white border-[#FFD600]/50 hover:bg-gray-700 hover:text-[#FFD600] font-semibold shadow-lg transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="default"
                  size="default"
                  className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-4 sm:px-6"
                >
                  Login
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
