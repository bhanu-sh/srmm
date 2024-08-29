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

export default function StaffTable({
  role,
  collegeId,
  lock,
}: {
  role: string;
  collegeId: string;
  lock: boolean;
}) {
  const [user, setUser] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const getStaffs = async () => {
    try {
      console.log(collegeId);
      const response = await axios.post(`/api/user/staff/getbycollege`, {
        college_id: collegeId,
      });
      setUser(response.data.data);
      setSearchResults(response.data.data); // Initialize search results with all staff
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const res = await axios.post("/api/user/delete", {
        user: [userId], // Send the single ID as an array
      });
      if (res.status === 200) {
        toast.success("User deleted successfully");
        getStaffs();
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
      const res = await axios.post("/api/user/delete", {
        user: selected,
      });
      if (res.status === 200) {
        toast.success("Users deleted successfully");
        getStaffs();
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

  const exportToExcel = () => {
    const data = searchResults.map((item: any) => ({
      Name: item.f_name + " " + item.l_name,
      Phone: item.phone,
      "Date of Birth": item.dob,
      Address:
        item.address +
        ", " +
        item.city +
        ", " +
        item.state +
        " (" +
        item.pincode +
        ")",
    }));
    jsonToExcel(data, `staffs - ${new Date().toLocaleDateString()}`);
  };

  const searchUser = (query: string) => {
    const results = user.filter((user: any) => {
      return (
        user.f_name.toLowerCase().includes(query.toLowerCase()) ||
        user.l_name.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.toLowerCase().includes(query.toLowerCase()) ||
        user.dob.toLowerCase().includes(query.toLowerCase()) ||
        user.address.toLowerCase().includes(query.toLowerCase())
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
    getStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    searchUser(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-700 text-center">Staffs</h1>
        <div className="flex justify-between">
          <Link href="/dashboard/add/staff">
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md">
              Add Staff
            </button>
          </Link>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr className="border-b text-center">
                <th scope="col" className="py-3">
                  Select
                </th>
                <th
                  onClick={() => sortData("f_name")}
                  scope="col"
                  className="px-6 py-3 bg-gray-50 "
                >
                  First Name
                </th>
                <th
                  onClick={() => sortData("l_name")}
                  scope="col"
                  className="px-6 py-3"
                >
                  Last Name
                </th>
                <th
                  onClick={() => sortData("phone")}
                  scope="col"
                  className="px-6 py-3 bg-gray-50 "
                >
                  Phone
                </th>
                <th
                  onClick={() => sortData("dob")}
                  scope="col"
                  className="px-6 py-3"
                >
                  DOB
                </th>
                <th
                  onClick={() => sortData("address")}
                  scope="col"
                  className="px-6 py-3 bg-gray-50"
                >
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {searchResults.map((user: any) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-2 py-4 text-center ">
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
                  <td className="px-6 py-4 bg-gray-50 ">{user.f_name}</td>
                  <td className="px-6 py-4  ">{user.l_name}</td>
                  <td className="px-6 py-4 bg-gray-50 ">{user.phone}</td>
                  <td className="px-6 py-4 ">
                    {new Date(user.dob).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 bg-gray-50 ">
                    {user.address +
                      ", " +
                      user.city +
                      ", " +
                      user.state +
                      " (" +
                      user.pincode +
                      ")"}
                  </td>
                  <td className="px-6 py-3 flex flex-col">
                    <Link className="mb-2" href={`/dashboard/staffs/${user._id}`}>
                      <button className="bg-green-500 w-full hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400">
                        View
                      </button>
                    </Link>
                    {(role === "CollegeAdmin" || role === "Admin") && (
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
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
