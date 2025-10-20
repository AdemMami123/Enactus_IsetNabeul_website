"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  LayoutDashboard,
  User,
  UserCheck,
  Shield,
  Menu,
  X,
  LogOut,
  PartyPopper,
  Calendar,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { userProfile, logout, isAdmin } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      adminOnly: false,
    },
    {
      name: "Agenda",
      href: "/dashboard/agenda",
      icon: Calendar,
      adminOnly: false,
    },
    {
      name: "Posts",
      href: "/dashboard/posts",
      icon: PartyPopper,
      adminOnly: false,
    },
    {
      name: "Absence List",
      href: "/dashboard/absence",
      icon: UserCheck,
      adminOnly: false,
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      adminOnly: false,
    },
    {
      name: "Admin Panel",
      href: "/admin",
      icon: Shield,
      adminOnly: true,
    },
  ];

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
        }}
        className="fixed top-0 left-0 z-50 h-full w-64 bg-gray-800/95 backdrop-blur-sm border-r border-[#FFD600]/20 lg:translate-x-0 transition-transform duration-300"
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-[#FFD600]">Enactus</h2>
            <p className="text-xs text-gray-400">ISET Nabeul</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD600] flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userProfile?.displayName || userProfile?.email}
              </p>
              <p className="text-xs text-[#FFD600] capitalize">
                {userProfile?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#FFD600] text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-[#FFD600] font-bold">Enactus Dashboard</div>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen p-0">{children}</main>
      </div>
    </div>
  );
}
