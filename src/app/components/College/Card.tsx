"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CollegeCard() {
  const [admins, setAdmins] = useState([]);

  const getAdmins = async () => {
    try {
      const res = await axios.get("/api/college/getall");
      setAdmins(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);
  
  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-md my-5">
          <div className="p-4 text-center">
            <h2 className="text-xl  font-semibold">Total Colleges</h2>
            <h1 className="text-4xl">
              {admins.length}
            </h1>
            <div className="flex justify-between items-center mt-4 ">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 mx-auto focus:ring-blue-400">
                <Link href="/colleges">
                    Learn More
                </Link>
              </button>
            </div>
          </div>
        </div>
    );
}