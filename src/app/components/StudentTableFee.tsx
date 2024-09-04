"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { jsonToExcel } from "@/helpers/jsonToExcel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function StudentTableFee({
  collegeId,
  role,
  lock,
  courseId,
}: {
  collegeId: string;
  role: string;
  lock: boolean;
  courseId: string;
}) {
  const [user, setUser] = useState([]);
  const [fee, setFee] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [totalFee, setTotalFee] = useState(0);
  const [dueFee, setDueFee] = useState(0);
  const [newFee, setNewFee] = useState<any>({
    name: "",
    amount: 0,
  });

  const getStudents = async () => {
    try {
      console.log(collegeId);
      const response = await axios.get(`/api/student/getall`);
      console.log(response.data.data);
      const filteredUser = response.data.data.filter(
        (user: any) => user.course._id === courseId
      );

      setUser(filteredUser);
      setSearchResults(filteredUser);
      console.log(filteredUser);
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(`/api/course/getall`);
      const course = response.data.data.find(
        (course: any) => course._id === courseId
      );
      getStudents();
      console.log(course);
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const getFee = async () => {
    try {
      const response = await axios.get(`/api/fee/getall`);
      var total = 0;
      var paid = 0;
      response.data.data.forEach((item: any) => {
        if (item.type === "fee") {
          total += item.amount;
        } else {
          paid += item.amount;
        }
      });
      setTotalFee(total);
      setDueFee(total - paid);
      setFee(response.data.data);
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const addFee = async () => {
    try {
      const response = await axios.post(`/api/fee/addbycourse`, {
        course: name,
        college_id: collegeId,
        ...newFee,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        getFee();
      }
    } catch (error: any) {
      console.log("Error", error.response?.data?.error);
    }
  };

  const exportToExcel = () => {
    const data = searchResults.map((item: any) => ({
      "First Name": item.f_name,
      "Last Name": item.l_name,
      Phone: item.phone,
      Email: item.email,
      Course: item.course,
      Session: item.session_start_year,
      "Roll No": item.roll_no,
    }));
    jsonToExcel(data, `students - ${new Date().toLocaleDateString()}`);
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await axios.post("/api/student/delete", {
        user: [userId], // Send the single ID as an array
      });
      if (res.status === 200) {
        toast.success("User deleted successfully");
        getStudents();
      } else {
        toast.error("Failed to delete User");
      }
    } catch (error) {
      console.error(
        "Delete error:",
        (error as any).response
          ? (error as any).response.data
          : (error as any).message
      );
      toast.error("Failed to delete User");
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      const res = await axios.post("/api/student/delete", {
        user: selected,
      });
      if (res.status === 200) {
        toast.success("Users deleted successfully");
        getStudents();
        setSelected([]);
      } else {
        toast.error("Failed to delete Users");
      }
    } catch (error) {
      console.error(
        "Delete error:",
        (error as any).response
          ? (error as any).response.data
          : (error as any).message
      );
      toast.error("Failed to delete Users");
    }
  };

  const searchUser = (query: string) => {
    const results = user.filter((user: any) => {
      return (
        user.name?.toLowerCase().includes(query.toLowerCase()) ||
        user.phone?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.session_start_year?.toString().includes(query.toLowerCase()) ||
        user.roll_no?.toLowerCase().includes(query.toLowerCase())
      );
    });

    setSearchResults(results);
  };

  const sortData = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedData = [...searchResults].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSearchResults(sortedData);
  };

  useEffect(() => {
    getCourses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    searchUser(search);
    getFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Students
        </h1>
        <div className="flex justify-between mb-4">
          <Dialog>
            <DialogTrigger>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400">
                Add Fee
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-2 justify-center">
                    <Label htmlFor="name">Fee Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter fee name"
                      onChange={(e) => {
                        setNewFee({ ...newFee, name: e.target.value });
                      }}
                    />
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter fee amount"
                      onChange={(e) => {
                        setNewFee({ ...newFee, amount: e.target.value });
                      }}
                    />
                    <Button variant="info" onClick={addFee}>
                      Add
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
          {(role === "CollegeAdmin" || role === "Admin") && (
            <AlertDialog>
              <AlertDialogTrigger>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md ml-2 disabled:opacity-50"
                  disabled={selected.length === 0 || lock}
                >
                  Delete Selected
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this student and remove all related data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteSelectedUsers}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="relative text-gray-600 focus-within:text-gray-400 my-3">
          <input
            type="search"
            name="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
            className="py-2 text-sm border-2 rounded-l-lg rounded-r-none text-gray-900 bg-white rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search..."
            autoComplete="off"
          />
          <span className="">
            <button
              type="submit"
              onClick={() => searchUser(search)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg rounded-l-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Search
            </button>
          </span>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase">
              <tr className="border-b text-center">
                <th scope="col" className="py-3">
                  Select
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(user.map((user: any) => user._id));
                      } else {
                        setSelected([]);
                      }
                    }}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("roll_no")}
                >
                  Roll No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData("name")}
                >
                  Name
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer bg-gray-50">
                  Father&apos;s Name
                </th>

                <th scope="col" className="px-6 py-3 cursor-pointer">
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("session_start_year")}
                >
                  Session
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer">
                  Total Fee
                </th>
                <th scope="col" className="px-6 py-3 cursor-pointer bg-gray-50">
                  Due Fee
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((user: any) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-2 py-4 text-center">
                    <input
                      type="checkbox"
                      value={user._id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected([...selected, user._id]);
                        } else {
                          setSelected(selected.filter((id) => id !== user._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 bg-gray-50">{user.roll_no}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 bg-gray-50">{user.father_name}</td>
                  <td className="px-6 py-4">{user.phone}</td>
                  <td className="px-6 py-4 bg-gray-50">
                    {user.course.session_start} - {user.course.session_end}
                  </td>
                  <td className="px-6 py-4">
                    {fee
                      .filter((fee: any) => fee.student_id._id === user._id)
                      .reduce(
                        (acc: number, curr: any) =>
                          curr.type === "fee" ? acc + curr.amount : acc,
                        0
                      )}
                  </td>
                  <td className="px-6 py-4 bg-gray-50">
                    {
                      //reduced received fee from total fee
                      fee
                        .filter((fee: any) => fee.student_id._id === user._id)
                        .reduce(
                          (acc: number, curr: any) =>
                            curr.type === "fee" ? acc + curr.amount : acc,
                          0
                        ) -
                        fee
                          .filter((fee: any) => fee.student_id._id === user._id)
                          .reduce(
                            (acc: number, curr: any) =>
                              curr.type === "received"
                                ? acc + curr.amount
                                : acc,
                            0
                          )
                    }
                  </td>

                  <td className="px-6 py-3 flex flex-col">
                    <Link className="mb-2" href={`/students/${user._id}`}>
                      <button className="bg-green-500 w-full hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400">
                        View
                      </button>
                    </Link>
                    {(role === "CollegeAdmin" || role === "Admin") && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <button
                              disabled={lock}
                              className="bg-red-500 w-full hover:bg-red-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:bg-red-500"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this student and remove all
                                related data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteUser(user._id);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="font-semibold text-2xl mt-2 mb-4">
            Total Fee: {totalFee} | Due Fee: {dueFee}
          </h2>
        </div>
      </div>
    </>
  );
}
