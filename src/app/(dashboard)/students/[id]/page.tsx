/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSession } from "next-auth/react";
import Loader from "@/app/components/Loader";

export default function StudentPage({ params }: any) {
  const { id } = params;
  const router = useRouter();

  const { data: session } = useSession();

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState<Number>(0);
  const [paidFee, setPaidFee] = useState<Number>(0);
  const [feeData, setFeeData] = useState<any | null>(null);
  const [courses, setCourses] = useState<any | null>(null);
  const [changedFee, setChangedFee] = useState({
    name: "",
    description: "",
    amount: "",
    student_id: id,
    college_id: "",
  });
  const [addedFee, setAddedFee] = useState({
    name: "",
    description: "",
    amount: "",
    type: "fee",
    student_id: id,
    college_id: "",
  });
  const [payFee, setPayFee] = useState({
    name: "Fee Payment",
    amount: "",
    method: "cash",
    student_id: id,
    college_id: "",
  });

  const getCourses = async () => {
    try {
      if (!session?.user?.college_id) {
        console.warn("No college ID found in session.");
        return;
      }

      const response = await axios.post("/api/course/getbycollege", {
        college_id: session.user.college_id,
      });
      console.log("Courses response:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
      console.log("Getting courses failed", error.response);
    }
  };

  const getFeeData = async () => {
    try {
      const res = await axios.post("/api/fee/getbystudent", { student_id: id });
      setFeeData(res.data.data);
      let total = 0;
      let paid = 0;
      res.data.data.forEach((fee: any) => {
        if (fee.type === "fee") {
          total += fee.amount;
        } else {
          paid += fee.amount;
        }
      });
      setTotal(total);
      setPaidFee(paid);
    } catch (error: any) {
      console.error("Error fetching fee data:", error);
    }
  };

  const getStudent = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/student/getbyid`, {
        params: { id },
      });
      const fetchedStudent = res.data.data;
      const formattedDob = new Date(fetchedStudent.dob).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      fetchedStudent.dob = formattedDob;
      setStudent(fetchedStudent);

      console.log("Student", res.data);
    } catch (error: any) {
      console.error("Error fetching student:", error);
      console.log(error.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await axios.put(`/api/student/edit`, student);
      console.log("Student Updated", res.data);
      toast.success("Profile Updated");
      getStudent(id);
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast.error("Error updating profile");
    }
  };

  const editFee = async (feeId: string) => {
    try {
      const res = await axios.put(`/api/fee/edit`, {
        _id: feeId,
        ...changedFee,
      });
      console.log("Fee Updated", res.data);
      toast.success("Fee Updated");
      getFeeData();
    } catch (error: any) {
      console.error("Error updating fee:", error);
      toast.error("Error updating fee");
    }
  };

  const addFee = async () => {
    try {
      const updatedFee = { ...addedFee, college_id: student.college_id };
      setAddedFee(updatedFee);
      console.log("Added Fee", updatedFee);
      const res = await axios.post("/api/fee/add", updatedFee);
      console.log("Fee Added", res.data);
      toast.success("Fee Added");
      setAddedFee({ ...addedFee, name: "", description: "", amount: "" });
      getFeeData();
    } catch (error: any) {
      console.error("Error adding fee:", error);
      toast.error("Error adding fee");
    }
  };

  const payingFee = async () => {
    try {
      const updatedPayFee = { ...payFee, college_id: student.college_id };
      setPayFee(updatedPayFee);
      console.log("Paying Fee", updatedPayFee);
      const res = await axios.post("/api/fee/pay", updatedPayFee);
      console.log("Fee Paid", res.data);
      toast.success("Fee Paid");
      setPayFee({ ...payFee, amount: "" });
      getFeeData();
    } catch (error: any) {
      console.error("Error paying fee:", error);
      toast.error("Error paying fee");
    }
  };

  useEffect(() => {
    getStudent(id);
    getFeeData();
  }, [id]);

  useEffect(() => {
    if (session) {
      getCourses();
    }
  }, [session]);

  return (
    <>
      {loading && <Loader />}
      {error && <p>Error fetching student</p>}
      {session && student && (
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-center mt-8">
            Student Profile
          </h1>
          {loading && <p>Loading...</p>}
          {error && <p>Error fetching student</p>}
          {student && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <div className="md:flex flex-col mt-12 justify-center">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant={"link"}>
                        <img
                          src={student.avatar}
                          alt="profile-pic"
                          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogDescription>
                          <img
                            src={student.avatar}
                            className="w-full h-full"
                            alt="avatar"
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <div className="flex justify-around mt-20">
                    <Sheet>
                      <SheetTrigger asChild>
                        {!student.college_id.lock &&
                          session.user.role === "CollegeAdmin" && (
                            <Button variant={"warning"}>Edit</Button>
                          )}
                      </SheetTrigger>
                      <SheetContent className="overflow-y-auto max-h-full">
                        <SheetHeader>
                          <SheetTitle>Edit profile</SheetTitle>
                          <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="f_name" className="text-right">
                              First Name
                            </Label>
                            <Input
                              id="f_name"
                              value={student.f_name}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  f_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="l_name" className="text-right">
                              Last Name
                            </Label>
                            <Input
                              id="l_name"
                              value={student.l_name}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  l_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roll_no" className="text-right">
                              Roll No
                            </Label>
                            <Input
                              id="roll_no"
                              value={student.roll_no}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  roll_no: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="course" className="text-right">
                              Course
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                setStudent({ ...student, course: value })
                              }
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Course" />
                              </SelectTrigger>
                              <SelectContent>
                                {courses &&
                                  courses.map((course: any) => (
                                    <SelectItem key={course._id} value={course}>
                                      {course.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="session_start_year"
                              className="text-right"
                            >
                              Session Start
                            </Label>
                            <Input
                              id="session_start_year"
                              value={student.session_start_year}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  session_start_year: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="session_end_year"
                              className="text-right"
                            >
                              Session End
                            </Label>
                            <Input
                              id="session_end_year"
                              value={student.session_end_year}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  session_end_year: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="father_name" className="text-right">
                              Father Name
                            </Label>
                            <Input
                              id="father_name"
                              value={student.father_name}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  father_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mother_name" className="text-right">
                              Mother Name
                            </Label>
                            <Input
                              id="mother_name"
                              value={student.mother_name}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  mother_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={student.email}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Phone
                            </Label>
                            <Input
                              id="phone"
                              value={student.phone}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dob" className="text-right">
                              Date of Birth
                            </Label>
                            <Input
                              id="dob"
                              type="date"
                              value={student.dob}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({ ...student, dob: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                              Address
                            </Label>
                            <Input
                              id="address"
                              value={student.address}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                              City
                            </Label>
                            <Input
                              id="city"
                              value={student.city}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({ ...student, city: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="state" className="text-right">
                              State
                            </Label>
                            <Input
                              id="state"
                              value={student.state}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  state: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="pincode" className="text-right">
                              Pincode
                            </Label>
                            <Input
                              id="pincode"
                              value={student.pincode}
                              className="col-span-3"
                              onChange={(e) =>
                                setStudent({
                                  ...student,
                                  pincode: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button variant={"success"} onClick={updateProfile}>
                              Save changes
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                    <Dialog>
                      <DialogTrigger>
                        {!student.college_id.lock && (
                          <Button variant={"info"}>Add Fee</Button>
                        )}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Fees</DialogTitle>
                          <DialogDescription>
                            <div className="flex flex-col gap-2 justify-center">
                              <Input
                                placeholder="Fee Name"
                                value={addedFee.name}
                                onChange={(e) =>
                                  setAddedFee({
                                    ...addedFee,
                                    name: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="Description"
                                value={addedFee.description}
                                onChange={(e) =>
                                  setAddedFee({
                                    ...addedFee,
                                    description: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="Amount"
                                value={addedFee.amount}
                                onChange={(e) =>
                                  setAddedFee({
                                    ...addedFee,
                                    amount: e.target.value,
                                  })
                                }
                              />
                              <DialogClose>
                                <Button
                                  variant={"info"}
                                  onClick={() => {
                                    addFee();
                                  }}
                                >
                                  Add Fee
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger>
                        <Button variant={"success"}>Pay Fee</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pay Fees</DialogTitle>
                          <DialogDescription>
                            <div className="flex flex-col gap-2 justify-center">
                              <Select
                                onValueChange={(value) =>
                                  setPayFee({ ...payFee, method: value })
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
                              <DialogClose>
                                <Button
                                  variant={"info"}
                                  onClick={() => {
                                    payingFee();
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
                </div>
                <div className="flex flex-col border-b-2 sm:border-b-0 sm:border-r-2 p-4 rounded-t-md sm:rounded-l-md shadow-lg bg-white">
                  <h1 className="text-2xl font-semibold underline text-center">
                    Student Details
                  </h1>
                  <p className="py-2 text-1xl">
                    Name: {student.f_name} {student.l_name}
                  </p>
                  <p className="py-2 text-1xl">DOB: {student.dob}</p>
                  <p className="py-2 text-1xl">Roll No: {student.roll_no}</p>
                  <p className="py-2 text-1xl">
                    Course: {student.course?.name} | Year:{" "}
                    {student.course?.duration}
                  </p>
                  <p className="py-2 text-1xl">
                    Session: {student.session_start_year} -{" "}
                    {student.session_end_year}
                  </p>
                  <p className="py-2 text-1xl">
                    Father Name: {student.father_name}
                  </p>
                  <p className="py-2 text-1xl">
                    Mother Name: {student.mother_name}
                  </p>
                  <div className="flex">
                    <p className="py-2 text-1xl">Contact:</p>

                    <div className="pl-12 pt-1 text-1xl flex flex-col">
                      <Link href={`mailto:${student.email}`} className="py-2">
                        Email: {student.email}
                      </Link>
                      <Link href={`tel:${student.phone}`} className="py-2">
                        Phone: {student.phone}
                      </Link>
                      <p className="py-2">
                        Address: {student.address}, {student.city},{" "}
                        {student.state} ({student.pincode})
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white shadow-lg rounded-b-md sm:rounded-r-md">
                  <div className="flex flex-col mt-4">
                    <h1 className="text-2xl font-semibold underline text-center">
                      Fee Details
                    </h1>
                    {feeData && (
                      <>
                        {feeData.map((fee: any) => (
                          <>
                            {fee.type === "fee" && (
                              <p className="py-2 text-1xl" key={fee._id}>
                                {fee.name}: &#8377; {fee.amount}{" "}
                                {!student.college_id.lock &&
                                  session.user.role === "CollegeAdmin" && (
                                    <span>
                                      <Dialog>
                                        <DialogTrigger>
                                          <Button variant={"link"}>Edit</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Edit {fee.name}
                                            </DialogTitle>
                                            <DialogDescription>
                                              <p className="my-2 text-orange-500">
                                                Only fill the fields you want to
                                                edit
                                              </p>
                                              <div className="flex flex-col gap-2 justify-center">
                                                <Label htmlFor="name">
                                                  Fee Name
                                                </Label>
                                                <Input
                                                  placeholder={fee.name}
                                                  onChange={(e) =>
                                                    setChangedFee({
                                                      ...changedFee,
                                                      name: e.target.value,
                                                    })
                                                  }
                                                />
                                                <Label htmlFor="description">
                                                  Description
                                                </Label>
                                                <Input
                                                  placeholder={fee.description}
                                                  onChange={(e) =>
                                                    setChangedFee({
                                                      ...changedFee,
                                                      description:
                                                        e.target.value,
                                                    })
                                                  }
                                                />
                                                <Label htmlFor="amount">
                                                  Amount
                                                </Label>
                                                <Input
                                                  placeholder={fee.amount}
                                                  onChange={(e) =>
                                                    setChangedFee({
                                                      ...changedFee,
                                                      amount: e.target.value,
                                                    })
                                                  }
                                                />

                                                <DialogClose>
                                                  <Button
                                                    variant={"info"}
                                                    onClick={() => {
                                                      editFee(fee._id);
                                                    }}
                                                  >
                                                    Edit
                                                  </Button>
                                                </DialogClose>
                                              </div>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                      </Dialog>
                                    </span>
                                  )}
                              </p>
                            )}
                          </>
                        ))}
                      </>
                    )}
                    <hr />
                    <p className="py-2 text-1xl font-semibold">
                      Total Fee: &#8377; {Number(total)}
                    </p>
                    <p className="py-2 text-1xl text-green-600 font-semibold">
                      Paid Fee: &#8377; {Number(paidFee)}
                    </p>
                    <p className="py-2 text-1xl text-red-600 font-bold">
                      Remaining Fee: &#8377; {Number(total) - Number(paidFee)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
