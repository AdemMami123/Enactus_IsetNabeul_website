"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Camera, Save, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface MemberProfile {
  displayName: string;
  bio: string;
  photoURL: string;
  position: string;
  phone: string;
}

export default function ProfileSection() {
  const { user, userProfile } = useAuth();
  const [profile, setProfile] = useState<MemberProfile>({
    displayName: "",
    bio: "",
    photoURL: "",
    position: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user!.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile({
          displayName: data.displayName || "",
          bio: data.bio || "",
          photoURL: data.photoURL || "",
          position: data.position || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "enactus_members");
    formData.append("folder", "members");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setProfile({ ...profile, photoURL: imageUrl });
      setMessage({ type: "success", text: "Image uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "Failed to upload image. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, "users", user!.uid), {
        displayName: profile.displayName,
        bio: profile.bio,
        photoURL: profile.photoURL,
        position: profile.position,
        phone: profile.phone,
        updatedAt: new Date(),
      });

      // Update or create member profile (for homepage display)
      const memberData = {
        userId: user!.uid,
        name: profile.displayName,
        email: userProfile?.email,
        photoURL: profile.photoURL,
        position: profile.position,
        role: userProfile?.role,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "members", user!.uid), memberData, { merge: true });

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-[#FFD600]/20 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-[#FFD600]" />
        Your Profile
      </h2>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-500"
              : "bg-red-500/10 border border-red-500/50 text-red-500"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-[#FFD600]">
              {profile.photoURL ? (
                <Image
                  src={profile.photoURL}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-[#FFD600] text-black p-2 rounded-full cursor-pointer hover:bg-[#FFD600]/90 transition-all shadow-lg"
            >
              <Camera className="w-5 h-5" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {uploading && (
            <p className="text-sm text-[#FFD600]">Uploading image...</p>
          )}
        </div>

        {/* Account Info (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              value={userProfile?.email || ""}
              disabled
              className="bg-gray-700 border-gray-600 text-gray-400 mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Role
            </Label>
            <Input
              value={userProfile?.role || ""}
              disabled
              className="bg-gray-700 border-gray-600 text-gray-400 mt-1 capitalize"
            />
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName" className="text-white">
              Display Name *
            </Label>
            <Input
              id="displayName"
              value={profile.displayName}
              onChange={(e) =>
                setProfile({ ...profile, displayName: e.target.value })
              }
              placeholder="Your full name"
              className="bg-gray-700 border-gray-600 text-white mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="position" className="text-white">
              Position
            </Label>
            <Input
              id="position"
              value={profile.position}
              onChange={(e) =>
                setProfile({ ...profile, position: e.target.value })
              }
              placeholder="e.g., President, Vice President, Member"
              className="bg-gray-700 border-gray-600 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="+216 XX XXX XXX"
              className="bg-gray-700 border-gray-600 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#FFD600]"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-[#FFD600] text-black hover:bg-[#FFD600]/90 font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </motion.div>
  );
}
