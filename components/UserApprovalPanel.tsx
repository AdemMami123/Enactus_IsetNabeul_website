"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  UserX,
  Clock,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AccountStatus } from "@/contexts/AuthContext";

interface PendingUser {
  uid: string;
  email: string;
  role: string;
  accountStatus: AccountStatus;
  createdAt: Date;
  displayName?: string;
}

export default function UserApprovalPanel() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData: PendingUser[] = [];

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          uid: doc.id,
          email: data.email,
          role: data.role,
          accountStatus: data.accountStatus || "approved", // Handle old accounts
          createdAt: data.createdAt?.toDate() || new Date(),
          displayName: data.displayName,
        });
      });

      // Sort by creation date (newest first)
      usersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setAllUsers(usersData);
      setPendingUsers(usersData.filter((u) => u.accountStatus === "pending"));
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid: string) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        accountStatus: "approved",
        approvedAt: Timestamp.now(),
      });

      setMessage({
        type: "success",
        text: "User approved successfully! They can now login.",
      });
      fetchUsers();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to approve user",
      });
    }
  };

  const handleReject = async (uid: string) => {
    if (!confirm("Are you sure you want to reject this user? They won't be able to login.")) {
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), {
        accountStatus: "rejected",
        rejectedAt: Timestamp.now(),
      });

      setMessage({
        type: "success",
        text: "User rejected. They will not be able to login.",
      });
      fetchUsers();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to reject user",
      });
    }
  };

  const getFilteredUsers = () => {
    if (filter === "all") return allUsers;
    return allUsers.filter((u) => u.accountStatus === filter);
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
    }
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-[#FFD600]" />
          <div>
            <h2 className="text-3xl font-bold text-white">User Approvals</h2>
            <p className="text-gray-400">Review and manage user registrations</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-500"
              : "bg-red-500/10 border border-red-500/50 text-red-500"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`bg-gray-800 border rounded-lg p-4 hover:border-[#FFD600]/40 transition-all text-left ${
            filter === "all" ? "border-[#FFD600]" : "border-[#FFD600]/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{allUsers.length}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`bg-gray-800 border rounded-lg p-4 hover:border-[#FFD600]/40 transition-all text-left ${
            filter === "pending" ? "border-[#FFD600]" : "border-[#FFD600]/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingUsers.length}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`bg-gray-800 border rounded-lg p-4 hover:border-[#FFD600]/40 transition-all text-left ${
            filter === "approved" ? "border-[#FFD600]" : "border-[#FFD600]/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">
                {allUsers.filter((u) => u.accountStatus === "approved").length}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`bg-gray-800 border rounded-lg p-4 hover:border-[#FFD600]/40 transition-all text-left ${
            filter === "rejected" ? "border-[#FFD600]" : "border-[#FFD600]/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-white">
                {allUsers.filter((u) => u.accountStatus === "rejected").length}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Users List */}
      <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {filter === "all" ? "All Users" : `${filter} Users`}
        </h3>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No {filter !== "all" && filter} users found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <p className="text-white font-semibold">{user.email}</p>
                    {getStatusBadge(user.accountStatus)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="capitalize">Role: {user.role}</span>
                    <span>
                      Registered: {user.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {user.accountStatus === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(user.uid)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(user.uid)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/20"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {user.accountStatus === "rejected" && (
                  <Button
                    onClick={() => handleApprove(user.uid)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Now
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
