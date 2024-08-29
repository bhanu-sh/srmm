"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface College {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  slug: string;
}

export default function CollegePage({ params }: any) {
  const { slug } = params;

  const router = useRouter();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffs, setStaffs] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(false);

  const getCollege = async (slug: string) => {
    setLoading(true);
    try {
      const collegeRes = await axios.get(`/api/college/getbyslug`, {
        params: { slug },
      });
      const fetchedCollege = collegeRes.data.data;
      setCollege(fetchedCollege);

      try {
        const staffRes = await axios.post("/api/user/staff/getbycollege", {
          college_id: fetchedCollege?._id,
        });
        const staffs = staffRes.data.data;
        setStaffs(staffs);
      } catch (error: any) {
        console.error("Error fetching staffs:", error);
        console.log(error.message);
      }
    } catch (error: any) {
      console.error("Error fetching college:", error);
      console.log(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async () => {
    try {
      const res = await axios.get("/api/student/getall");
      setStudents(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCollege(slug);
    getStudents();
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen mt-4">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">College not found</h1>
              <button
                onClick={() => router.push("/colleges")}
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go back to colleges
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold">{college?.name}</h1>
              <p>
                <span className="font-bold">Address: </span>
                {college?.address}, {college?.city}, {college?.state} -{" "}
                {college?.pincode}
              </p>
              <p>
                <span className="font-bold">Email: </span>
                {college?.email}
              </p>
              <p>
                <span className="font-bold">Phone: </span>
                {college?.phone}
              </p>
              <div className="w-80 p-4 bg-white rounded-lg shadow-md my-5">
                <div className="p-4 text-center">
                  <h2 className="text-xl  font-semibold">Total Staffs</h2>
                  <h1 className="text-4xl">{staffs.length}</h1>
                  <div className="flex justify-between items-center mt-4 ">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 mx-auto focus:ring-blue-400">
                      <Link href={`/dashboard/staffs/${college?.slug}`}>View</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
