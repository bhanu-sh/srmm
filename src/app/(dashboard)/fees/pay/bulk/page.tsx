"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";

interface Student {
  _id: string;
  roll_no: string;
  name: string;
  course: { name: string };
}

interface FeeEntry {
  roll_no: string;
  student: Student | null;
  amount: string;
  description: string;
  date: string;
  method: string;
}

export default function BulkPayFeePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [entries, setEntries] = useState<FeeEntry[]>([
    {
      roll_no: "",
      student: null,
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      method: "cash",
    },
  ]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/student/getall`);
      setStudents(res.data.data);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error("Error fetching students");
    }
  };

  const handleRollNoChange = (index: number, roll_no: string) => {
    const updatedEntries = [...entries];
    const student = students.find(
      (student: Student) =>
        student.roll_no.toLowerCase() === roll_no.toLowerCase()
    );
    updatedEntries[index] = { ...updatedEntries[index], roll_no, student: student || null };
    setEntries(updatedEntries);
  };

  const handleFieldChange = (
    index: number,
    field: keyof FeeEntry,
    value: string
  ) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        roll_no: "",
        student: null,
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        method: "cash",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const payFees = async () => {
    // Prepare the data for bulk payment
    const bulkData = entries.map((entry) => ({
      name: "Fee Payment",
      amount: parseFloat(entry.amount),
      description: entry.description,
      date: entry.date,
      method: entry.method,
      student_id: entry.student?._id,
    }));

    // Validate the bulk data
    for (let i = 0; i < bulkData.length; i++) {
      const entry = bulkData[i];
      if (!entry.student_id) {
        toast.error(`Student not found for entry ${i + 1}.`);
        return;
      }
      if (!entry.amount || isNaN(entry.amount) || entry.amount <= 0) {
        toast.error(`Invalid amount for entry ${i + 1}.`);
        return;
      }
      if (!entry.date) {
        toast.error(`Date is required for entry ${i + 1}.`);
        return;
      }
      if (!entry.method) {
        toast.error(`Method is required for entry ${i + 1}.`);
        return;
      }
    }

    try {
      const res = await axios.post("/api/fee/paybulk", bulkData);
      if (res.data.success) {
        toast.success("Bulk fees paid successfully.");
        // Reset the entries
        setEntries([
          {
            roll_no: "",
            student: null,
            amount: "",
            description: "",
            date: new Date().toISOString().split("T")[0],
            method: "cash",
          },
        ]);
      } else {
        toast.error("Bulk fee payment failed.");
      }
    } catch (error: any) {
      console.error("Error paying bulk fees:", error);
      toast.error(error.response?.data?.error || "Error paying bulk fees.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center font-semibold">Bulk Pay Fee</h1>
      <div className="flex flex-col gap-4">
        {entries.map((entry, index) => (
          <div key={index} className="border p-4 rounded-md space-y-2">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Enter Roll Number"
                value={entry.roll_no}
                onChange={(e) => handleRollNoChange(index, e.target.value)}
              />
              {entry.student && (
                <p className="font-bold">
                  {entry.student.name} ({entry.student.course?.name})
                </p>
              )}
              <Button
                variant="destructive"
                onClick={() => removeEntry(index)}
                disabled={entries.length === 1}
              >
                Remove
              </Button>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Amount"
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  handleFieldChange(index, "amount", e.target.value)
                }
              />
              <Input
                placeholder="Description"
                value={entry.description}
                onChange={(e) =>
                  handleFieldChange(index, "description", e.target.value)
                }
              />
              <Input
                type="date"
                value={entry.date}
                onChange={(e) =>
                  handleFieldChange(index, "date", e.target.value)
                }
              />
              <Input
                placeholder="Method"
                value={entry.method}
                onChange={(e) =>
                  handleFieldChange(index, "method", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <Button onClick={addEntry} variant="info">
          Add Entry
        </Button>
        <Button onClick={payFees} variant="success">
          Pay Fees
        </Button>
      </div>
    </div>
  );
}
