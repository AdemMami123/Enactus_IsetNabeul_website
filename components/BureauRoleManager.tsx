"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { BureauRole } from "@/contexts/AuthContext";
import { Shield, Save, X } from "lucide-react";

interface BureauRoleManagerProps {
  userId: string;
  currentRole: BureauRole;
  onUpdate: () => void;
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

export default function BureauRoleManager({
  userId,
  currentRole,
  onUpdate,
}: BureauRoleManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<BureauRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    if (selectedRole === currentRole) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updateDoc(doc(db, "users", userId), {
        bureauRole: selectedRole,
        bureauRoleUpdatedAt: new Date(),
      });

      setMessage({ type: "success", text: "Bureau role updated successfully!" });
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating bureau role:", error);
      setMessage({ type: "error", text: "Failed to update bureau role" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRole(currentRole);
    setIsEditing(false);
    setMessage(null);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
            currentRole
          )}`}
        >
          <Shield className="w-3 h-3" />
          {currentRole}
        </span>
        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          size="sm"
          className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-2"
    >
      {message && (
        <div
          className={`text-xs p-2 rounded ${
            message.type === "success"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as BureauRole)}
          className="flex-1 px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
          disabled={loading}
        >
          {BUREAU_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <Button
          onClick={handleSave}
          disabled={loading}
          size="sm"
          className="bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
        >
          <Save className="w-3 h-3" />
        </Button>

        <Button
          onClick={handleCancel}
          disabled={loading}
          size="sm"
          variant="outline"
          className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}
