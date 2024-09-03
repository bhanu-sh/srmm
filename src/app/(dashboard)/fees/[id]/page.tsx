/* eslint-disable @next/next/no-img-element */
"use client";
import Loader from "@/app/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";

export default function FeesPage({ params }: any) {
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [fee, setFee] = useState<any | null>(null);
  const [course, setCourse] = useState<any | null>(null);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/fee/getbyid`, {
        params: { id },
      });
      setFee(res.data.data);
      console.log(res.data);
    } catch (error: any) {
      setError(error);
      console.error("Error fetching fee details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async (id: string) => {
    try {
      const res = await axios.get(`/api/course/getbyid`, {
        params: { id },
      });
      setCourse(res.data.data);
      console.log(res.data);
    } catch (error: any) {
      setError(error);
      console.error("Error fetching course details:", error.message);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  useEffect(() => {
    if (fee) {
      fetchCourse(fee.student_id.course);
    }
  }, [fee]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen fixed inset-0 flex bg-white">
      {loading && <Loader />}
      {fee ? (
        <div className="bg-white p-8 w-full">
          <div className="flex flex-col items-center">
            <p className="bg-black text-white rounded-xl px-2">Receipt</p>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Shri Rajroop Memorial Mahavidyalaya
            </h1>

            <div className="text-center text-gray-500 mb-4">
              <span className="text-black font-semibold">Address:</span> Address
              - Pincode
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Receipt No:</span>
                <span>{fee.receipt_no}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Date:</span>
                <span>
                  {new Date(fee.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Student Name:</span>
                <span>
                  {fee.student_id?.f_name} {fee.student_id?.l_name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Course:</span>
                <span>{course?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Amount Paid:</span>
                <span>{formatCurrency(fee.amount)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">
          Invalid Fee ID
        </div>
      ) : null}
    </div>
  );
}
