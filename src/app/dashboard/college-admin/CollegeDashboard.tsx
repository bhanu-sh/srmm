"use client";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import CountCard from "@/app/components/CountCard";
import ExpenseCard from "@/app/components/ExpenseCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/app/components/Loader";
import toast from "react-hot-toast";
import Link from "next/link";

interface College {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  slug: string;
  detailsLocked: boolean;
  feesLocked: boolean;
}

const initialExpenseState = {
  name: "",
  description: "",
  amount: 0,
  type: "sent",
  date: new Date(),
};

export default function CollegeDashboard() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [course, setCourse] = useState([]);
  const [StudentLoading, setStudentLoading] = useState(false);
  const [StaffLoading, setStaffLoading] = useState(false);
  const [CourseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingFees, setPendingFees] = useState(0);
  const [receivedFees, setReceivedFees] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [newExpense, setNewExpense] = useState(initialExpenseState);

  const handleFetchData = async () => {
    setStudentLoading(true);
    setStaffLoading(true);
    setCourseLoading(true);
    try {
      const [studentsRes, feesRes, staffsRes, expensesRes, courseRes] =
        await Promise.all([
          axios.get(`/api/student/getall`),
          axios.get(`/api/fee/getall`),
          axios.get(`/api/user/staff/getall`),
          axios.get(`/api/expense/getall`),
          axios.get(`/api/course/getall`),
        ]);
      setStudents(studentsRes.data.data);
      setStaffs(staffsRes.data.data);
      setCourse(courseRes.data.data);

      const totalFees = feesRes.data.data.reduce(
        (acc: number, fee: any) =>
          acc + (fee.type === "fee" ? fee.amount : -fee.amount),
        0
      );
      setPendingFees(totalFees);

      const totalReceivedFees = feesRes.data.data.reduce(
        (acc: number, fee: any) =>
          acc + (fee.type === "received" ? fee.amount : 0),
        0
      );
      setReceivedFees(totalReceivedFees);

      const totalExpenses = expensesRes.data.data.reduce(
        (acc: number, expense: any) =>
          acc + (expense.type === "sent" ? expense.amount : 0),
        0
      );
      setExpenses(totalExpenses);
    } catch (error: any) {
      setError(error.response.data.error);
      console.log("Error", error.response.data.error);
    }
    setStudentLoading(false);
    setStaffLoading(false);
    setCourseLoading(false);
  };

  const handleAddExpense = async () => {
    try {
      await axios.post(`/api/expense/add`, {
        ...newExpense,
      });
      toast.success("Expense Added Successfully");
      setNewExpense(initialExpenseState);
      handleFetchData(); // Refresh data after adding new expense
    } catch (error: any) {
      console.log("Adding failed", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    setDisabled(!(newExpense.name && newExpense.amount > 0));
  }, [newExpense]);

  return (
    <div>
      {!session ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-2xl text-center font-semibold">
            Welcome, {`${session.user.name}`}
          </h1>
          <h1 className="text-lg text-center font-semibold text-red-600">
            SHRI RAJROOP MEMORIAL MAHAVIDYALAYA
          </h1>
          <div className="flex flex-col justify-center py-5 border-y-2 border-gray-300">
            <h2 className="text-3xl font-bold text-center">Stats:</h2>
            <div className="flex flex-wrap justify-around">
              <CountCard
                title="Students"
                count={students.length}
                isLoading={StudentLoading}
                link="/students"
              />
              <CountCard
                title="Courses"
                count={course.length}
                link="/courses"
                isLoading={CourseLoading}
              />
              <CountCard
                title="Staffs"
                count={staffs.length}
                link="/staffs"
                isLoading={StaffLoading}
              />
            </div>
          </div>
          <hr />
          <div className="flex justify-center gap-8 items-end py-5 border-b-2 border-gray-300">
            <h2 className="text-3xl font-bold">Lock Status:</h2>
          </div>
          <hr />
          <div className="flex flex-col justify-center py-5 border-b-2 border-gray-300">
            <h2 className="text-3xl font-bold text-center">Finance:</h2>
            <div className="flex flex-col gap-2 mx-auto mt-3">
              <Dialog onOpenChange={() => setNewExpense(initialExpenseState)}>
                <DialogTrigger>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400">
                    Add Expense
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col gap-2 justify-center">
                        <Label htmlFor="name">Expense Name *</Label>
                        <Input
                          placeholder="Expense Name"
                          required
                          value={newExpense.name}
                          onChange={(e) =>
                            setNewExpense((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                        <Label htmlFor="description">Description</Label>
                        <Input
                          placeholder="Description"
                          value={newExpense.description}
                          onChange={(e) =>
                            setNewExpense((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                          type="number"
                          placeholder="Amount"
                          required
                          value={newExpense.amount}
                          onChange={(e) =>
                            setNewExpense((prev) => ({
                              ...prev,
                              amount: Number(e.target.value),
                            }))
                          }
                        />
                        <Label htmlFor="date">Date</Label>
                        <Input
                          type="date"
                          value={newExpense.date.toISOString().substring(0, 10)}
                          onChange={(e) =>
                            setNewExpense((prev) => ({
                              ...prev,
                              date: new Date(e.target.value),
                            }))
                          }
                        />
                        <Button
                          disabled={disabled}
                          variant="info"
                          onClick={handleAddExpense}
                        >
                          Add
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Link className="mx-auto" href="/fees/pay">
                <Button>Pay Fee</Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-around">
              <ExpenseCard
                title="Spent"
                amount={formatCurrency(expenses)}
                link="/expenses"
              />
              <ExpenseCard
                title="Pending Fees"
                amount={formatCurrency(pendingFees)}
                link="/fees/pending"
              />
              <ExpenseCard
                title="Received Fees"
                amount={formatCurrency(receivedFees)}
                link="/fees"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
