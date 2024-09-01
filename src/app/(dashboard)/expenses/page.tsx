/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface Expense {
  _id: string;
  name: string;
  description: string;
  amount: number;
  type: "sent" | "received";
  date: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Add index signature
}

interface AggregatedExpense {
  date: string;
  amount: number;
}

const fetchExpenses = async () => {
  try {
    const res = await axios.get("/api/expense/getall");
    console.log("Response data:", res.data);
    return res.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.error || "Failed to fetch expenses");
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const aggregateExpensesByDate = (expenses: Expense[]): AggregatedExpense[] => {
  const aggregated = expenses.reduce<Record<string, number>>((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString("en-CA");
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(aggregated)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const TableHeader: React.FC<{ onSort: (key: string) => void }> = ({
  onSort,
}) => (
  <thead>
    <tr className="border-b-2 border-black">
      <th
        className="px-4 py-2 bg-slate-300 cursor-pointer"
        onClick={() => onSort("date")}
      >
        Date
      </th>
      <th className="px-4 py-2">Name</th>
      <th className="px-4 py-2 bg-slate-300 cursor-pointer">Description</th>
      <th
        className="px-4 py-2  cursor-pointer"
        onClick={() => onSort("amount")}
      >
        Amount
      </th>
      <th className="px-4 py-2 bg-slate-300">Action</th>
    </tr>
  </thead>
);

const ExpensesPage: React.FC = () => {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredExpenses = React.useMemo(() => {
    if (selectedMonth === "all" && selectedYear === "all") {
      return expenses;
    }
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const isMonthMatch =
        selectedMonth === "all" || expenseDate.getMonth() + 1 === selectedMonth;
      const isYearMatch =
        selectedYear === "all" || expenseDate.getFullYear() === selectedYear;
      return isMonthMatch && isYearMatch;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const sortedExpenses = React.useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredExpenses, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const chartData = React.useMemo(() => {
    const aggregated = aggregateExpensesByDate(filteredExpenses);
    setTotalAmount(aggregated.reduce((total, item) => total + item.amount, 0));
    return aggregated;
  }, [filteredExpenses]);

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "#2563eb",
    },
  };

  const onDelete = async (expenseId: string) => {
    try {
      const res = await axios.post("/api/expense/delete", {
        expense_id: expenseId,
      });
      console.log("Response data:", res.data);
      fetchData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {session && (
        <>
          {session.user.role === "CollegeAdmin" ? (
            <>
              <h1 className="text-2xl font-semibold">Expenses</h1>
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
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
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
                  <div className="min-h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="amount"
                          fill={chartConfig.amount.color}
                          radius={4}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-lg font-semibold mt-4">
                    {selectedMonth === "all" && selectedYear === "all"
                      ? "Total for All Time"
                      : `Total for ${
                          selectedMonth !== "all"
                            ? new Date(
                                Number(selectedYear),
                                selectedMonth - 1
                              ).toLocaleString("default", { month: "long" }) +
                              " "
                            : ""
                        }${selectedYear !== "all" ? selectedYear : ""}`}
                    : {formatCurrency(totalAmount)}
                  </p>

                  <table className="w-full shadow-md my-3 rounded-sm">
                    <TableHeader onSort={handleSort} />
                    <tbody>
                      {sortedExpenses.map((expense) => (
                        <tr
                          className="border-b-2 border-gray-400"
                          key={expense._id}
                        >
                          <td className="px-4 py-2 bg-slate-300">
                            {new Date(expense.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-2">{expense.name}</td>
                          <td className="px-4 py-2 bg-slate-300">
                            {expense.description}
                          </td>
                          <td className="px-4 py-2">
                            {formatCurrency(expense.amount)}
                          </td>
                          <td className="px-4 py-2 bg-slate-300">
                            <button
                              onClick={() => onDelete(expense._id)}
                              disabled={loading}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <h1 className="text-2xl font-semibold text-gray-500 mb-5">
                Restricted
              </h1>
              <Link href="/dashboard">
                <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                  Dashboard
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpensesPage;
