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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PayFeePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [payFee, setPayFee] = useState({
    name: "Fee Payment",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
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
      setPayFee({
        name: "Fee Payment",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        method: "cash",
        student_id: "",
      });
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
      <hr className="h-0.5 my-2 border-0 rounded bg-gray-300" />
      <Link href="/fees/pay/bulk">
        <Button variant={"link"}>Bulk Pay Fee</Button>
      </Link>
      <div className="flex flex-col gap-2 justify-center">
        <p className="text-2xl">Search for Student</p>
        <div className="flex items-center border-2 border-gray-300 rounded-md px-2">
          <span className="font-bold">SRMM</span>
          <Input
            placeholder="Search by Ledger Number, Name, or Phone"
            className="border-0 active:ring-0 focus:ring-0 focus:outline-none active:outline-none focus:border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent focus-visible:border-transparent focus-visible:ring-transparent"
            value={search.toUpperCase()}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <div className="flex flex-col gap-2">
          {search &&
            students
              .filter((student: any) => {
                const searchText = search.toLowerCase();
                return (
                  student?.roll_no
                    ?.toLowerCase()
                    .startsWith("srmm" + searchText) ||
                  student?.name?.toLowerCase().includes(searchText) ||
                  student?.phone?.toLowerCase().includes(searchText)
                );
              })
              .map((student: any) => (
                <div key={student._id} className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">Ledger No: </span>
                        {student.roll_no}
                      </p>
                      <p>
                        <span className="font-bold">Course: </span>
                        {student.course?.name}
                      </p>
                      <p>
                        <span className="font-bold">Student Name: </span>
                        {student.name}
                      </p>
                      <p>
                        <span className="font-bold">Father Name: </span>
                        {student.father_name}
                      </p>
                      <p>
                        <span className="font-bold">Phone: </span>
                        {student.phone}
                      </p>
                      <p>
                        <span className="font-bold">Date of Admission: </span>
                        {student.date_of_admission
                          ? new Date(student.date_of_admission).toDateString()
                          : ""}
                      </p>
                      <p>
                        <span className="font-bold">Pending Fees: </span>{" "}
                        &#8377;
                        {(
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
                        ).toFixed(2)}
                      </p>
                      <div>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <p className="font-bold">Previous Payments:</p>
                            </AccordionTrigger>
                            <AccordionContent>
                              {fees
                                .filter(
                                  (fee: any) =>
                                    fee.student_id._id === student._id &&
                                    fee.type === "received"
                                )
                                .map((fee: any, index: number) => (
                                  <div className="mb-4" key={index}>
                                    <p>
                                      Date: {new Date(fee.date).toDateString()}
                                    </p>
                                    <p>Amount: &#8377;{fee.amount}</p>
                                    <p>Method: {fee.method}</p>
                                    {fee.description && (
                                      <p>Description: {fee.description}</p>
                                    )}
                                  </div>
                                ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
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
                                placeholder="Description"
                                onChange={(e) =>
                                  setPayFee({
                                    ...payFee,
                                    description: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="Date"
                                type="date"
                                value={payFee.date}
                                onChange={(e) =>
                                  setPayFee({
                                    ...payFee,
                                    date: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="Amount"
                                onChange={(e) =>
                                  setPayFee({
                                    ...payFee,
                                    amount: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    payingFee(student._id);
                                  }
                                }}
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
