"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Fee {
  _id: string;
  student_id?: {
    _id: any;
    f_name: string;
    l_name: string;
    course: string;
  };
  amount: number;
  college_id: string;
  date: string;
  type: "received";
  [key: string]: any;
}

const fetchFees = async (collegeId: string) => {
  try {
    const res = await axios.post("/api/fee/getbycollege", {
      college_id: collegeId,
    });
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.error || "Failed to fetch fees");
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const TableHeader: React.FC<{ onSort: (key: string) => void }> = ({
  onSort,
}) => (
  <thead className="border-b-2 border-b-black">
    <tr>
      <th
        className="px-4 py-2 bg-blue-100  cursor-pointer"
        onClick={() => onSort("date")}
      >
        Date
      </th>
      <th className="px-4 py-2 bg-white">Student Name</th>
      <th className="px-4 py-2 bg-blue-100 cursor-pointer">Method</th>
      <th
        className="px-4 py-2 cursor-pointer bg-white"
        onClick={() => onSort("amount")}
      >
        Amount
      </th>
      <th className="px-4 py-2 bg-blue-100">Action</th>
    </tr>
  </thead>
);

const FeesPage: React.FC = () => {
  const { data: session } = useSession();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [selectedMonth, setSelectedMonth] = useState<number | "all">(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number | "all">(
    new Date().getFullYear()
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (session?.user.college_id) {
      try {
        const data = await fetchFees(session.user.college_id);
        setFees(data.filter((fee: Fee) => fee.type === "received"));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredFees = React.useMemo(() => {
    if (selectedMonth === "all" && selectedYear === "all") {
      return fees;
    }
    return fees.filter((fee) => {
      const feeDate = new Date(fee.date);
      const isMonthMatch =
        selectedMonth === "all" || feeDate.getMonth() + 1 === selectedMonth;
      const isYearMatch =
        selectedYear === "all" || feeDate.getFullYear() === selectedYear;
      return isMonthMatch && isYearMatch;
    });
  }, [fees, selectedMonth, selectedYear]);

  const sortedFees = React.useMemo(() => {
    return [...filteredFees].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredFees, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-2xl font-semibold">Fees</h1>
      <div className="flex gap-4 my-4">
        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="border p-2"
        >
          <option value="all">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="border p-2"
        >
          <option value="all">All Years</option>
          {Array.from(
            { length: 10 },
            (_, i) => new Date().getFullYear() - i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-lg font-semibold mt-4">
            {selectedMonth === "all" && selectedYear === "all"
              ? "Total for All Time"
              : `Total for ${
                  selectedMonth !== "all"
                    ? new Date(
                        Number(selectedYear),
                        selectedMonth - 1
                      ).toLocaleString("default", { month: "long" }) + " "
                    : ""
                }${selectedYear !== "all" ? selectedYear : ""}`}
            : {formatCurrency(totalAmount)}
          </p>

          <table className="w-full shadow-md my-3 rounded-sm">
            <TableHeader onSort={handleSort} />
            <tbody>
              {sortedFees.map((fee) => (
                <tr className="border-b-2 border-b-gray-400" key={fee._id}>
                  <td className="px-4 py-2 bg-blue-100 ">
                    {new Date(fee.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 bg-white">
                    <Link
                      className="mb-2"
                      href={`/dashboard/students/${fee.student_id?._id}`}
                    >
                      <button>
                        {fee.student_id?.f_name} {fee.student_id?.l_name}
                      </button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 bg-blue-100 ">{fee.method}</td>
                  <td className="px-4 py-2 bg-white">
                    {formatCurrency(fee.amount)}
                  </td>
                  <td className="px-4 py-2 bg-blue-100">
                    <Link href={`/dashboard/fees/${fee._id}`}>
                      <Button variant={"link"}>View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FeesPage;
