"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function StudentPage({ params }: any) {
  const { data: session } = useSession();
  const { id } = params;
  const router = useRouter();

  const [staff, setStaff] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getStaff = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/getbyid`, {
        params: { id },
      });
      const fetchedStudent = res.data.data;
      setStaff(fetchedStudent);
    } catch (error: any) {
      console.error("Error fetching student:", error);
      console.log(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaff(id);
  }, [id]);

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-3xl font-semibold text-center mt-8">Staff Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching student</p>}
      {staff && (
        <>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col mt-12">
              <p className="py-2 text-1xl">
                Name: {staff.f_name} {staff.l_name}
              </p>
              <p className="py-2 text-1xl">Father Name: {staff.father_name}</p>
              <p className="py-2 text-1xl">Mother Name: {staff.mother_name}</p>
              <div className="flex">
                <p className="py-2 text-1xl">Contact:</p>

                <div className="pl-12 pt-1 text-1xl flex flex-col">
                  <Link href={`mailto:${staff.email}`} className="py-2">
                    Email: {staff.email}
                  </Link>
                  <Link href={`tel:${staff.phone}`} className="py-2">
                    Phone: {staff.phone}
                  </Link>
                  <p className="py-2">
                    Address: {staff.address}, {staff.city}, {staff.state} (
                    {staff.pincode})
                  </p>
                </div>
              </div>
            </div>
            <div className="md:flex flex-col mt-12 hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width={200}
                height={200}
                src={staff.avatar}
                alt="profile-pic"
                className="w-48 h-48 rounded-full"
              />
            </div>
          </div>
          {(session?.user.role === "Admin" || session?.user.role === "CollegeAdmin") && (
            <div className="flex justify-around mt-20">
              <button
                onClick={() => toast.error("Coming Soon")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
