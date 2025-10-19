"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  User,
  Users,
  Calendar,
  Settings,
  BarChart,
  Shield,
  UserCheck,
  PartyPopper,
} from "lucide-react";

export default function DashboardPage() {
  const { userProfile, isAdmin } = useAuth();
  const [teamMembersCount, setTeamMembersCount] = useState<number>(0);
  const [eventsThisMonth, setEventsThisMonth] = useState<number>(0);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userProfile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch team members count
      const membersRef = collection(db, "members");
      const membersSnapshot = await getDocs(membersRef);
      setTeamMembersCount(membersSnapshot.size);

      // Fetch events this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const firstDay = firstDayOfMonth.toISOString().split("T")[0];
      const lastDay = lastDayOfMonth.toISOString().split("T")[0];

      const eventsRef = collection(db, "events");
      const eventsQuery = query(
        eventsRef,
        where("date", ">=", firstDay),
        where("date", "<=", lastDay)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      setEventsThisMonth(eventsSnapshot.size);

      // Calculate profile completion
      if (userProfile) {
        let completionScore = 0;
        const fields = [
          userProfile.displayName,
          userProfile.email,
          userProfile.position,
          userProfile.bio,
          userProfile.phone,
          userProfile.photoURL,
        ];
        const filledFields = fields.filter(field => field && field.trim() !== "").length;
        completionScore = Math.round((filledFields / fields.length) * 100);
        setProfileCompletion(completionScore);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Profile Completion",
      value: loading ? "..." : `${profileCompletion}%`,
      icon: User,
      color: "text-blue-400",
    },
    {
      label: "Team Members",
      value: loading ? "..." : `${teamMembersCount}+`,
      icon: Users,
      color: "text-green-400",
    },
    {
      label: "Events This Month",
      value: loading ? "..." : `${eventsThisMonth}`,
      icon: Calendar,
      color: "text-purple-400",
    },
    {
      label: "Your Role",
      value: isAdmin ? "Admin" : "Member",
      icon: Shield,
      color: "text-[#FFD600]",
    },
  ];

  const quickLinks = [
    {
      title: "Edit Profile",
      description: "Update your information",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Manage Agenda",
      description: "View events and tasks",
      href: "/dashboard/agenda",
      icon: Calendar,
    },
    {
      title: "Create Post",
      description: "Share news and achievements",
      href: "/dashboard/posts",
      icon: PartyPopper,
    },
    {
      title: "Absence List",
      description: "View attendance records",
      href: "/dashboard/absence",
      icon: UserCheck,
    },
    {
      title: "View Team",
      description: "See all Enactus members",
      href: "/",
      icon: Users,
    },
    ...(isAdmin
      ? [
          {
            title: "Admin Panel",
            description: "Manage users and settings",
            href: "/admin",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10 text-center lg:text-left"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Welcome back,{" "}
              <span className="text-[#FFD600]">
                {userProfile?.displayName || "Member"}
              </span>
              !
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your Enactus profile and stay connected with the team.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-5 sm:p-6 hover:border-[#FFD600]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 sm:mb-6 flex items-center justify-center lg:justify-start gap-3">
              <BarChart className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD600]" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
              {quickLinks.map((link, index) => (
                <Link key={link.title} href={link.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-5 sm:p-6 hover:border-[#FFD600] hover:shadow-lg hover:shadow-[#FFD600]/20 transition-all cursor-pointer group h-full"
                  >
                    <link.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD600] mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      {link.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{link.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
