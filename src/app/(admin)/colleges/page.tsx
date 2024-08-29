"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { jsonToExcel } from "@/helpers/jsonToExcel";

interface College {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  slug: string;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState([] as College[]);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: session } = useSession();

  const getColleges = async () => {
    try {
      const res = await axios.get("/api/college/getall");
      setColleges(res.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const deleteCollege = async (collegeId: string) => {
    try {
      const res = await axios.post("/api/college/delete", {
        college: [collegeId], // Send the single ID as an array
      });
      if (res.status === 200) {
        toast.success("College deleted successfully");
        getColleges();
      } else {
        toast.error("Failed to delete college");
      }
    } catch (error) {
      console.error(
        "Delete error:",
        (error as any).response
          ? (error as any).response.data
          : (error as any).message
      );
      toast.error("Failed to delete college");
    }
  };

  const deleteSelectedColleges = async () => {
    try {
      const res = await axios.post("/api/college/delete", {
        college: selected,
      });
      if (res.status === 200) {
        toast.success("Colleges deleted successfully");
        getColleges();
      } else {
        toast.error("Failed to delete colleges");
      }
    } catch (error) {
      console.error(
        "Delete error:",
        (error as any).response
          ? (error as any).response.data
          : (error as any).message
      );
      toast.error("Failed to delete colleges");
    }
  };

  const exportToExcel = () => {
    const data = colleges.map((college) => ({
      Name: college.name,
      Email: college.email,
      Phone: college.phone,
      Address: college.address,
      City: college.city,
      State: college.state,
      Pincode: college.pincode,
      Slug: college.slug,
    }));
    jsonToExcel(data, "colleges");
  };

  useEffect(() => {
    getColleges();
  }, []);

  useEffect(() => {
    console.log("Selected:", selected);
  }, [selected]);

  return (
    <div>
      <h1 className="text-4xl text-center font-bold mb-3">Colleges</h1>
      <hr />
      <div className="flex justify-around items-center my-3">
        <Link href="/colleges/add">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            Add College
          </button>
        </Link>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
        {session && session.user?.role === "Admin" && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => {
              setSelected([]);
              deleteSelectedColleges();
            }}
          >
            Delete Selected
          </button>
        )}
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Pincode
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              {session && session.user?.role === "Admin" && (
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {colleges.map((college: any) => (
              <tr key={college._id}>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    value={college._id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected([...selected, e.target.value]);
                      } else {
                        setSelected(
                          selected.filter((id) => id !== e.target.value)
                        );
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  <Link href={`mailto:${college.email}`}>{college.email}</Link>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  <Link href={`tel:${college.phone}`}>{college.phone}</Link>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.address}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.city}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.state}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.pincode}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                  {college.slug}
                </td>
                {session && session.user?.role === "Admin" && (
                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500 flex flex-col">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 mb-2">
                      <Link href={`/colleges/${college.slug}`}>View</Link>
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2">
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                      onClick={() => {
                        deleteCollege(college._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
