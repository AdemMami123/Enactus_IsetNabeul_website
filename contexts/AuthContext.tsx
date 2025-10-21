"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "admin" | "member";
export type AccountStatus = "pending" | "approved" | "rejected";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  displayName?: string;
  position?: string;
  bio?: string;
  phone?: string;
  photoURL?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          role: data.role || "member",
          accountStatus: data.accountStatus || "pending",
          displayName: data.displayName,
          position: data.position,
          bio: data.bio,
          phone: data.phone,
          photoURL: data.photoURL,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (
    uid: string,
    email: string,
    role: UserRole = "member"
  ) => {
    try {
      const userProfile: Omit<UserProfile, "uid"> = {
        email,
        role,
        accountStatus: "pending", // All new users start as pending
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", uid), userProfile);
      return { uid, ...userProfile };
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const profile = await fetchUserProfile(userCredential.user.uid);
      
      // Check if profile exists
      if (!profile) {
        await signOut(auth);
        throw new Error("User profile not found");
      }
      
      // Check account status
      if (profile.accountStatus === "pending") {
        await signOut(auth);
        throw new Error("Your account is pending approval. Please wait for an admin to approve your registration.");
      }
      
      if (profile.accountStatus === "rejected") {
        await signOut(auth);
        throw new Error("Your account has been rejected. Please contact an administrator.");
      }
      
      setUserProfile(profile);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  // Register new user
  const register = async (
    email: string,
    password: string,
    role: UserRole = "member"
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserProfile(
        userCredential.user.uid,
        email,
        role
      );
      
      // Sign out immediately after registration
      // User needs admin approval before they can login
      await signOut(auth);
      
      throw new Error("Registration successful! Your account is pending approval. An admin will review your request shortly.");
    } catch (error: any) {
      console.error("Registration error:", error);
      // Re-throw the success message or actual error
      throw new Error(error.message || "Failed to register");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw new Error(error.message || "Failed to send reset email");
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        
        if (profile) {
          // Always set the user and profile when Firebase user exists
          // The login function already handles approval checks
          setUser(firebaseUser);
          setUserProfile(profile);
        } else {
          // Profile not found
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAdmin: userProfile?.role === "admin",
    isMember: userProfile?.role === "member",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
