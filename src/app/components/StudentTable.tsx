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

export default function StudentTable({
  role,
  lock,
}: {
  role: string;
  lock: boolean;
}) {
  const [user, setUser] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const getStudents = async () => {
    try {
      const response = await axios.get("/api/student/getall");
      setUser(response.data.data);
      console.log("Students", response.data.data);
      setSearchResults(response.data.data); // Initialize search results with all students
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const exportToExcel = () => {
    const data = searchResults.map((item: any) => ({
      "Name": item.name,
      Phone: item.phone,
      Email: item.email,
      Course: item.course?.name,
      Session: `${item.course?.session_start} - ${item.course?.session_end}`,
      "Ledger No": item.roll_no,
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
        user.course?.name?.toLowerCase().includes(query.toLowerCase()) ||
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
    getStudents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchUser(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Students
        </h1>
        <div className="flex justify-between mb-4">
          <Link href="/add/student">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              Add Student
            </button>
          </Link>
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
                  onClick={() => sortData("f_name")}
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData("dob")}
                >
                  DOB
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("phone")}
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData("email")}
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("course")}
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => sortData("session_start_year")}
                >
                  Session
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("roll_no")}
                >
                  Ledger No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer bg-gray-50"
                  onClick={() => sortData("roll_no")}
                >
                  Date of Admission
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
                  <td className="px-6 py-4 bg-gray-50">{user.name}</td>
                  <td className="px-6 py-4 text-center">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="px-6 py-4 bg-gray-50">{user.phone}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 bg-gray-50">{user.course?.name}</td>
                  <td className="px-6 py-4">
                    {user.course?.session_start} - {user.course?.session_end}
                  </td>
                  <td className="px-6 py-4 bg-gray-50">{user.roll_no}</td>
                  <td className="px-6 py-4">
                    {user.date_of_admission
                      ? new Date(user.date_of_admission).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
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
        </div>
      </div>
    </>
  );
}
