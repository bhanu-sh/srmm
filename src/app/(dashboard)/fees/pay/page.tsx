"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";

export default function PayFeePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [payFee, setPayFee] = useState({
    name: "Fee Payment",
    amount: "",
    method: "cash",
    student_id: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/student/getall`);
      setStudents(res.data.data);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students");
    }
  };

  const fetchFees = async () => {
    try {
      const res = await axios.get(`/api/fee/getall`);
      setFees(res.data.data);
      console.log("Fees", res.data.data);
    } catch (error: any) {
      console.error("Error fetching fees:", error);
      toast.error("Error fetching fees");
    }
  };

  const payingFee = async (studentId: string) => {
    try {
      const updatedPayFee = {
        ...payFee,
        student_id: studentId,
      };
      setPayFee(updatedPayFee);
      console.log("Paying Fee", updatedPayFee);
      const res = await axios.post("/api/fee/pay", updatedPayFee);
      console.log("Fee Paid", res.data);
      toast.success("Fee Paid");
      fetchFees();
      setPayFee({ ...payFee, amount: "" });
    } catch (error: any) {
      console.error("Error paying fee:", error);
      toast.error("Error paying fee");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center font-semibold">Pay Fee</h1>
      <div className="flex flex-col gap-2 justify-center">
        <p className="text-2xl">Search for Student</p>
        <div className="flex items-center border-2 border-gray-300 rounded-md px-2">
          <span className="font-bold">SRMM</span>
          <Input
            placeholder="Search Student"
            className="border-0 active:ring-0 focus:ring-0 focus:outline-none active:outline-none focus:border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:border-transparent focus-visible:ring-transparent"
            value={search.toUpperCase()}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <div className="flex flex-col gap-2">
          {search &&
            students
              .filter((student: any) =>
                student?.roll_no?.toLowerCase().startsWith("srmm" + search)
              )
              .map((student: any) => (
                <div key={student._id} className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">Name: </span>
                        {student.name}
                      </p>
                      <p>
                        <span className="font-bold">Course: </span>
                        <span>{student.course?.name}</span>
                      </p>
                      <p>
                        <span className="font-bold">Roll No: </span>
                        {student.roll_no}
                      </p>
                      <p>
                        <span className="font-bold">Pending Fees: </span>{" "}
                        &#8377;
                        {
                          //reduced received fee from total fee
                          (
                            fees
                              .filter(
                                (fee: any) => fee.student_id._id === student._id
                              )
                              .reduce(
                                (acc: number, curr: any) =>
                                  curr.type === "fee" ? acc + curr.amount : acc,
                                0
                              ) -
                            fees
                              .filter(
                                (fee: any) => fee.student_id._id === student._id
                              )
                              .reduce(
                                (acc: number, curr: any) =>
                                  curr.type === "received"
                                    ? acc + curr.amount
                                    : acc,
                                0
                              )
                          ).toFixed(2)
                        }
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger>
                        <Button variant={"success"}>Pay Fee</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pay Fees</DialogTitle>
                          <DialogDescription>
                            <p>
                              <span className="font-bold">Name: </span>
                              {student.name}
                            </p>
                            <p>
                              <span className="font-bold">Course: </span>
                              <span>{student.course?.name}</span>
                            </p>
                            <div className="mt-2 flex flex-col gap-2 justify-center">
                              <Select
                                onValueChange={(value) =>
                                  setPayFee({
                                    ...payFee,
                                    method: value,
                                  })
                                }
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Method of Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="cheque">Cheque</SelectItem>
                                  <SelectItem value="online">Online</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Amount"
                                onChange={(e) =>
                                  setPayFee({
                                    ...payFee,
                                    amount: e.target.value,
                                  })
                                }
                              />
                              <DialogClose className="w-6 mx-auto">
                                <Button
                                  variant={"info"}
                                  onClick={() => {
                                    payingFee(student._id);
                                  }}
                                >
                                  Pay Fee
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <hr className="h-0.5 my-2 border-0 rounded bg-gray-300" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
