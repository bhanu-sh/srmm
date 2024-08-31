"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./dashboard/admin/AdminDashboard";
import StaffDashboard from "./dashboard/staff/StaffDashboard";
import CollegeDashboard from "./dashboard/college-admin/CollegeDashboard";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div>
      {session?.user?.role === "Admin" && <AdminDashboard />}
      {session?.user?.role === "Staff" && <StaffDashboard />}
      {session?.user?.role === "CollegeAdmin" && <CollegeDashboard />}
    </div>
  );
}
