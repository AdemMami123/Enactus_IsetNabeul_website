"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shield, Users, Search } from "lucide-react";
import { BureauRole } from "@/contexts/AuthContext";
import BureauRoleManager from "@/components/BureauRoleManager";

interface Member {
  uid: string;
  email: string;
  displayName?: string;
  bureauRole: BureauRole;
  photoURL?: string;
}

const BUREAU_ROLES: BureauRole[] = [
  "Team Leader",
  "Co-Leader",
  "Partnerships Manager",
  "Finance Manager",
  "R&D Manager",
  "HR Manager",
  "Operations Manager",
  "Marketing & Media Manager",
  "Project Manager",
  "Basic Member",
];

export default function BureauRoleAssignment() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, roleFilter, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Fetch only approved members
      const q = query(
        collection(db, "users"),
        where("accountStatus", "==", "approved")
      );
      const membersSnapshot = await getDocs(q);
      const membersData: Member[] = [];

      membersSnapshot.forEach((doc) => {
        const data = doc.data();
        membersData.push({
          uid: doc.id,
          email: data.email,
          displayName: data.displayName || data.email.split("@")[0],
          bureauRole: data.bureauRole || "Basic Member",
          photoURL: data.photoURL,
        });
      });

      // Sort by bureau role hierarchy, then by name
      membersData.sort((a, b) => {
        const roleOrder = BUREAU_ROLES.indexOf(a.bureauRole) - BUREAU_ROLES.indexOf(b.bureauRole);
        if (roleOrder !== 0) return roleOrder;
        return (a.displayName || "").localeCompare(b.displayName || "");
      });

      setMembers(membersData);
      setFilteredMembers(membersData);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by bureau role
    if (roleFilter !== "all") {
      filtered = filtered.filter((m) => m.bureauRole === roleFilter);
    }

    setFilteredMembers(filtered);
  };

  const getRoleBadgeColor = (role: BureauRole) => {
    switch (role) {
      case "Team Leader":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "Co-Leader":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/50";
      case "Partnerships Manager":
      case "Finance Manager":
      case "R&D Manager":
      case "HR Manager":
      case "Operations Manager":
      case "Marketing & Media Manager":
      case "Project Manager":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Basic Member":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#FFD600]" />
          <div>
            <h2 className="text-3xl font-bold text-white">Bureau Role Management</h2>
            <p className="text-gray-400">Assign organizational positions to approved members</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Leadership</p>
              <p className="text-2xl font-bold text-white">
                {members.filter((m) => m.bureauRole === "Team Leader" || m.bureauRole === "Co-Leader").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Managers</p>
              <p className="text-2xl font-bold text-white">
                {members.filter((m) => m.bureauRole.includes("Manager")).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Search Members</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
            >
              <option value="all">All Roles ({members.length})</option>
              {BUREAU_ROLES.map((role) => {
                const count = members.filter((m) => m.bureauRole === role).length;
                return (
                  <option key={role} value={role}>
                    {role} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          {roleFilter !== "all" ? `${roleFilter} Members` : "All Members"} ({filteredMembers.length})
        </h3>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Member Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {member.photoURL && (
                      <img
                        src={member.photoURL}
                        alt={member.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {member.displayName}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Bureau Role Manager */}
                  <div className="flex-shrink-0">
                    <BureauRoleManager
                      userId={member.uid}
                      currentRole={member.bureauRole}
                      onUpdate={fetchMembers}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
