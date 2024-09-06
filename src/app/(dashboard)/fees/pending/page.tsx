"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Fee {
  _id: string;
  student_id?: {
    _id: string;
    name: string;
    roll_no?: string;
    course?: {
      name: string;
    };
  };
  amount: number;
  college_id: string;
  date: string;
  type: "fee" | "received";
}

interface StudentPendingFee {
  student_id: string;
  name: string;
  roll_no?: string;
  course?: string;
  pendingAmount: number;
}

const fetchFees = async () => {
  try {
    const res = await axios.get("/api/fee/getall");
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
        className="px-4 py-2 bg-blue-100 cursor-pointer"
        onClick={() => onSort("roll_no")}
      >
        Ledger Number
      </th>
      <th className="px-4 py-2 bg-white">Student Name</th>
      <th className="px-4 py-2 bg-blue-100 cursor-pointer">Course</th>
      <th
        className="px-4 py-2 cursor-pointer bg-white"
        onClick={() => onSort("pendingAmount")}
      >
        Pending Amount
      </th>
      <th className="px-4 py-2 bg-blue-100">Action</th>
    </tr>
  </thead>
);

const PendingFeesPage: React.FC = () => {
  const { data: session } = useSession();
  const [studentsPendingFees, setStudentsPendingFees] = useState<
    StudentPendingFee[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "pendingAmount", direction: "desc" });

  const fetchData = useCallback(async () => {
    if (session) {
      try {
        const fees: Fee[] = await fetchFees();

        const pendingFeesMap: Record<string, StudentPendingFee> = {};

        fees.forEach((fee) => {
          if (fee.student_id) {
            const studentId = fee.student_id._id;
            if (!pendingFeesMap[studentId]) {
              pendingFeesMap[studentId] = {
                student_id: studentId,
                name: fee.student_id.name,
                roll_no: fee.student_id.roll_no,
                course: fee.student_id.course?.name,
                pendingAmount: 0,
              };
            }
            if (fee.type === "fee") {
              pendingFeesMap[studentId].pendingAmount += fee.amount;
            } else if (fee.type === "received") {
              pendingFeesMap[studentId].pendingAmount -= fee.amount;
            }
          }
        });

        const filteredStudentsPendingFees = Object.values(
          pendingFeesMap
        ).filter((student) => student.pendingAmount > 0);

        setStudentsPendingFees(filteredStudentsPendingFees);
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

  const sortedStudentsPendingFees = React.useMemo(() => {
    return [...studentsPendingFees].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof StudentPendingFee] ?? 0;
      const bValue = b[sortConfig.key as keyof StudentPendingFee] ?? 0;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [studentsPendingFees, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-2xl font-semibold">Pending Fees</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <table className="w-full shadow-md my-3 rounded-sm">
            <TableHeader onSort={handleSort} />
            <tbody>
              {sortedStudentsPendingFees.map((student) => (
                <tr
                  className="border-b-2 border-b-gray-400"
                  key={student.student_id}
                >
                  <td className="px-4 py-2 bg-blue-100 ">{student.roll_no}</td>
                  <td className="px-4 py-2 bg-white">
                    <Link
                      className="mb-2"
                      href={`/students/${student.student_id}`}
                    >
                      <button>{student.name}</button>
                    </Link>
                  </td>
                  <td className="px-4 py-2 bg-blue-100 ">{student.course}</td>
                  <td className="px-4 py-2 bg-white">
                    {formatCurrency(student.pendingAmount)}
                  </td>
                  <td className="px-4 py-2 bg-blue-100">
                    <Link href={`/students/${student.student_id}`}>
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

export default PendingFeesPage;
