"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  User as UserIcon,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  position: string;
  role: string;
  photoURL: string;
  bio: string;
  phone: string;
}

export default function TeamView() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, roleFilter, members]);

  const fetchTeamMembers = async () => {
    try {
      // Fetch all users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const teamData: TeamMember[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Only show approved users
        if (userData.accountStatus === "approved") {
          teamData.push({
            id: userDoc.id,
            userId: userDoc.id,
            name: userData.displayName || "No Name",
            email: userData.email || "",
            position: userData.position || "Member",
            role: userData.role || "member",
            photoURL: userData.photoURL || "",
            bio: userData.bio || "No bio available",
            phone: userData.phone || "",
          });
        }
      }

      // Sort by role (admins first) then by name
      teamData.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return a.name.localeCompare(b.name);
      });

      setMembers(teamData);
      setFilteredMembers(teamData);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = [...members];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((member) => member.role === roleFilter);
    }

    setFilteredMembers(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center gap-3 mb-4"
        >
          <Users className="w-10 h-10 text-[#FFD600]" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-[#FFD600]">Team</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Meet the passionate members of Enactus ISET Nabeul
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#FFD600] font-semibold mt-2"
        >
          {filteredMembers.length} {filteredMembers.length === 1 ? "Member" : "Members"}
        </motion.p>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#FFD600]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                roleFilter === "all"
                  ? "bg-[#FFD600] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              <Filter className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                roleFilter === "admin"
                  ? "bg-[#FFD600] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setRoleFilter("member")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                roleFilter === "member"
                  ? "bg-[#FFD600] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Members
            </button>
          </div>
        </div>
      </motion.div>

      {/* Team Grid */}
      {filteredMembers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-gray-800 border border-gray-700 rounded-lg"
        >
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No members found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => setSelectedMember(member)}
              className="bg-gray-800 border border-[#FFD600]/20 rounded-lg overflow-hidden hover:border-[#FFD600]/60 transition-all cursor-pointer group"
            >
              {/* Photo Section */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-700 to-gray-900">
                {member.photoURL ? (
                  <Image
                    src={member.photoURL}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    quality={85}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                
                {/* Role Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.role === "admin"
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {member.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-[#FFD600] transition-colors line-clamp-1">
                  {member.name}
                </h3>
                
                <div className="flex items-center gap-1 text-[#FFD600] mb-2">
                  <Briefcase className="w-3 h-3 flex-shrink-0" />
                  <p className="text-xs font-medium line-clamp-1">{member.position}</p>
                </div>

                <p className="text-gray-400 text-xs mb-2 line-clamp-2 min-h-[2rem]">
                  {member.bio}
                </p>

                {/* Contact Info - Compact */}
                <div className="space-y-1 mb-2">
                  {member.email && (
                    <div className="flex items-center gap-1 text-gray-300 text-xs">
                      <Mail className="w-3 h-3 text-[#FFD600] flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-1 text-gray-300 text-xs">
                      <Phone className="w-3 h-3 text-[#FFD600] flex-shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <button className="w-full bg-gray-700 hover:bg-[#FFD600] text-white hover:text-black py-1.5 rounded text-xs font-medium transition-all">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-[#FFD600]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header with Photo */}
              <div className="relative h-96 bg-gradient-to-br from-gray-700 to-gray-900">
                {selectedMember.photoURL ? (
                  <Image
                    src={selectedMember.photoURL}
                    alt={selectedMember.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-contain"
                    quality={95}
                    priority
                    unoptimized={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-32 h-32 text-gray-600" />
                  </div>
                )}
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Role Badge */}
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      selectedMember.role === "admin"
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {selectedMember.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedMember.name}
                </h2>
                
                <div className="flex items-center gap-2 text-[#FFD600] mb-6">
                  <Briefcase className="w-5 h-5" />
                  <p className="text-lg font-medium">{selectedMember.position}</p>
                </div>

                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      About
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {selectedMember.bio}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {selectedMember.email && (
                        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                          <Mail className="w-5 h-5 text-[#FFD600]" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <a
                              href={`mailto:${selectedMember.email}`}
                              className="text-white hover:text-[#FFD600] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {selectedMember.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedMember.phone && (
                        <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                          <Phone className="w-5 h-5 text-[#FFD600]" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <a
                              href={`tel:${selectedMember.phone}`}
                              className="text-white hover:text-[#FFD600] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {selectedMember.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
