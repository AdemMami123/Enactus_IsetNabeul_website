"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Check if user account is approved
    if (requireAuth && userProfile && userProfile.accountStatus !== "approved") {
      router.push(redirectTo);
      return;
    }

    // If specific roles are required, check if user has the right role
    if (allowedRoles && userProfile) {
      if (!allowedRoles.includes(userProfile.role)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, userProfile, loading, requireAuth, allowedRoles, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD600]"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated when required, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If account is not approved, don't render children
  if (requireAuth && userProfile && userProfile.accountStatus !== "approved") {
    return null;
  }

  // If role check fails, don't render children
  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return null;
  }

  return <>{children}</>;
}
