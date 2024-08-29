"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "./dashboard/admin/AdminDashboard";
import StaffDashboard from "./dashboard/staff/StaffDashboard";
import CollegeDashboard from "./dashboard/college-admin/CollegeDashboard";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-40 top-0 left-0">
        <div className="absolute top-0 right-0 md:right-40 md:top-32 z-1">
          <Image
            className="h-auto w-auto"
            src="/assets/college.png"
            width={500}
            priority
            height={500}
            alt="logo"
          />
        </div>
        <div className="flex flex-col justify-center mt-72 md:mt-40 z-0">
          <h1 className="text-5xl font-bold">
            Simplify your college management with ease!
          </h1>
          <p className="text-lg my-5">
            Access important features easily for a smoother experience
          </p>
          <div className="flex justify-around md:justify-start mt-5 items-center">
            <Link href="/sign-in">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-semibold text-center mb-10">Our Services</h1>
      <div className="flex flex-wrap justify-around">
        <div className="w-64 bg-white rounded-md shadow-xl mb-6">
          <div className="flex flex-col justify-center items-center p-4">
            <h1 className="text-xl font-bold text-balance mb-2">
              Student Management
            </h1>
            <p className="text-gray-600 text-justify">
              Manage student records, track attendance, and handle grades
              efficiently.
            </p>
          </div>
        </div>
        <div className="w-64 bg-white rounded-md shadow-xl mb-6">
          <div className="flex flex-col justify-center items-center p-4">
            <h1 className="text-xl font-bold text-balance mb-2">
              Faculty Management
            </h1>
            <p className="text-gray-600 text-justify">
              Organize faculty information, schedules, and performance
              evaluations.
            </p>
          </div>
        </div>
        <div className="w-64 bg-white rounded-md shadow-xl mb-6">
          <div className="flex flex-col justify-center items-center p-4">
            <h1 className="text-xl font-bold text-balance mb-2">
              Course Management
            </h1>
            <p className="text-gray-600 text-justify">
              Create and manage courses, assign teachers, and track student
              progress.
            </p>
          </div>
        </div>
      </div> */}

      {session?.user?.role === "Admin" && <AdminDashboard />}
      {session?.user?.role === "Staff" && <StaffDashboard />}
      {session?.user?.role === "CollegeAdmin" && <CollegeDashboard />}
    </div>
  );
}
