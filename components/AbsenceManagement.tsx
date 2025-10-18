"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserCheck,
  UserX,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  displayName: string;
  position: string;
  role: string;
  absenceCount: number;
}

interface Absence {
  id: string;
  userId: string;
  userName: string;
  meetingDate: Date;
  reason?: string;
  markedBy: string;
  markedByName: string;
  createdAt: Date;
}

export default function AbsenceManagement() {
  const { userProfile, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMarkAbsence, setShowMarkAbsence] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [meetingDate, setMeetingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reason, setReason] = useState("");
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchAbsences()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData: User[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Count absences for this user
        const absencesQuery = query(
          collection(db, "absences"),
          where("userId", "==", userDoc.id)
        );
        const absencesSnapshot = await getDocs(absencesQuery);

        usersData.push({
          id: userDoc.id,
          email: userData.email,
          displayName: userData.displayName || "No Name",
          position: userData.position || "Member",
          role: userData.role,
          absenceCount: absencesSnapshot.size,
        });
      }

      setUsers(usersData.sort((a, b) => b.absenceCount - a.absenceCount));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchAbsences = async () => {
    try {
      const absencesQuery = query(
        collection(db, "absences"),
        orderBy("meetingDate", "desc")
      );
      const absencesSnapshot = await getDocs(absencesQuery);

      const absencesData: Absence[] = absencesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          meetingDate: data.meetingDate.toDate(),
          reason: data.reason,
          markedBy: data.markedBy,
          markedByName: data.markedByName,
          createdAt: data.createdAt.toDate(),
        };
      });

      setAbsences(absencesData);
    } catch (error) {
      console.error("Error fetching absences:", error);
    }
  };

  const handleMarkAbsence = async () => {
    if (!selectedUser || !isAdmin) return;

    try {
      await addDoc(collection(db, "absences"), {
        userId: selectedUser.id,
        userName: selectedUser.displayName,
        userEmail: selectedUser.email,
        userPosition: selectedUser.position,
        meetingDate: Timestamp.fromDate(new Date(meetingDate)),
        reason: reason || "No reason provided",
        markedBy: userProfile?.uid,
        markedByName: userProfile?.displayName || userProfile?.email,
        createdAt: Timestamp.now(),
      });

      setMessage({ type: "success", text: "Absence marked successfully!" });
      resetForm();
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to mark absence" });
    }
  };

  const handleUpdateAbsence = async () => {
    if (!editingAbsence || !isAdmin) return;

    try {
      await updateDoc(doc(db, "absences", editingAbsence.id), {
        meetingDate: Timestamp.fromDate(new Date(meetingDate)),
        reason: reason,
        updatedAt: Timestamp.now(),
        updatedBy: userProfile?.uid,
      });

      setMessage({ type: "success", text: "Absence updated successfully!" });
      resetForm();
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update absence" });
    }
  };

  const handleDeleteAbsence = async (absenceId: string) => {
    if (!isAdmin) return;
    if (!confirm("Are you sure you want to delete this absence record?")) return;

    try {
      await deleteDoc(doc(db, "absences", absenceId));
      setMessage({ type: "success", text: "Absence deleted successfully!" });
      fetchData();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to delete absence" });
    }
  };

  const startEdit = (absence: Absence) => {
    setEditingAbsence(absence);
    setMeetingDate(absence.meetingDate.toISOString().split("T")[0]);
    setReason(absence.reason || "");
    setShowMarkAbsence(true);
  };

  const resetForm = () => {
    setShowMarkAbsence(false);
    setSelectedUser(null);
    setEditingAbsence(null);
    setMeetingDate(new Date().toISOString().split("T")[0]);
    setReason("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
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
            <h1 className="text-3xl font-bold text-white">Absence Management</h1>
            <p className="text-gray-400">Track member attendance</p>
          </div>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setShowMarkAbsence(true)}
            className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Mark Absence
          </Button>
        )}
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

      {/* Mark/Edit Absence Modal */}
      {showMarkAbsence && isAdmin && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              {editingAbsence ? "Edit Absence" : "Mark Absence"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {!editingAbsence && (
              <div>
                <Label htmlFor="user" className="text-white">
                  Select Member
                </Label>
                <select
                  id="user"
                  value={selectedUser?.id || ""}
                  onChange={(e) => {
                    const user = users.find((u) => u.id === e.target.value);
                    setSelectedUser(user || null);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 mt-1"
                  required
                >
                  <option value="">Choose a member...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName} - {user.position} (Absences: {user.absenceCount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {editingAbsence && (
              <div>
                <Label className="text-white">Member</Label>
                <div className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 mt-1 text-white">
                  {editingAbsence.userName}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="date" className="text-white">
                Meeting Date
              </Label>
              <Input
                id="date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-white">
                Reason (Optional)
              </Label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why was this member absent?"
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={editingAbsence ? handleUpdateAbsence : handleMarkAbsence}
                disabled={!editingAbsence && !selectedUser}
                className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
              >
                {editingAbsence ? "Update" : "Mark Absent"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <UserX className="w-10 h-10 text-red-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Absences</p>
              <p className="text-2xl font-bold text-white">{absences.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-10 h-10 text-[#FFD600]" />
            <div>
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">
                {absences.filter((a) => {
                  const absenceMonth = a.meetingDate.getMonth();
                  const currentMonth = new Date().getMonth();
                  return absenceMonth === currentMonth;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members Absence Stats */}
      <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Member Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Position
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Role
                </th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">
                  Total Absences
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-white">{user.displayName}</td>
                  <td className="py-3 px-4 text-gray-300">{user.position}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        user.absenceCount === 0
                          ? "bg-green-500/20 text-green-400"
                          : user.absenceCount < 3
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.absenceCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Absences */}
      <div className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Absences</h2>
        <div className="space-y-3">
          {absences.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No absences recorded yet
            </p>
          ) : (
            absences.slice(0, 10).map((absence) => (
              <div
                key={absence.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <UserX className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-white font-semibold">
                        {absence.userName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {absence.meetingDate.toLocaleDateString()} •{" "}
                        {absence.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        Marked by: {absence.markedByName}
                      </p>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(absence)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAbsence(absence.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
