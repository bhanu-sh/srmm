"use client";

import React from "react";
import { excelToJson } from "@/helpers/excelToJson";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "lucide-react";

export default function AddStaffs() {
  const { data: session } = useSession();

  const [file, setFile] = React.useState<File | null>(null);
  const [json, setJson] = React.useState<any>(null);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePreview = async () => {
    if (file) {
      const json = await excelToJson(file);
      setJson(json);
      setPreview(true);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true);
        toast.loading("Uploading staff members...");
        const json = await excelToJson(file);

        // Convert phone numbers and passwords to strings
        const formattedJson = (json as any[]).map((staffMember: any) => ({
          ...staffMember,
          phone: "" + staffMember.phone,
          password: "" + staffMember.password,
        }));

        console.log("Converted JSON:", formattedJson); // Log the formatted JSON

        const res = await axios.post("/api/user/staff/bulkadd", {
          staff: formattedJson,
          college_id: session?.user.college_id,
        });

        if (res.status !== 200) {
          const errorData = res.data;
          console.error("Error:", errorData);
          // Handle error, possibly update state to reflect the error
          return;
        }

        const data = res.data;
        console.log("Response data:", data); // Log the response data
        toast.remove();
        toast.success("Staff members uploaded successfully");
        router.push("/dashboard/staffs");
        // Handle success, possibly update state to reflect successful upload
      } catch (error) {
        console.error("An error occurred:", error);
        toast.remove();
        toast.error("An error occurred while uploading staff members");
        // Handle error, possibly update state to reflect the error
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No file selected");
      toast.error("No file selected");
      // Handle case where no file is selected
    }
  };

  return (
    <div>
      {session && (session.user.role === "CollegeAdmin" || session.user.role === "Admin") ? (
        <div>
          <h1 className="text-4xl font-bold text-center text-red-500">
        Add Staffs
      </h1>
      <div className="grid w-full max-w-xs items-center gap-1.5">
        <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Upload File
        </label>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium file:cursor-pointer"
          id="file_input"
          type="file"
          onChange={handleInput}
        />
      </div>

      <div className="mt-5">
        <button
          className="ml p-2 bg-slate-800 rounded-lg text-white"
          id="preview_button"
          onClick={handlePreview}
        >
          Preview
        </button>
        <button
          className="ml-5 p-2 bg-green-700 rounded-lg text-white"
          id="upload_button"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      {loading && <p className="mt-5">Loading...</p>}
      {json && (
        <div className="mt-5">
          <h2 className="text-2xl font-bold text-red-500">JSON Data</h2>
          <table className="table-auto w-full mt-5">
            <thead className="bg-gray-200">
              <tr className="text-left">
                {Object.keys(json[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {json.map((staff: any, index: number) => (
                <tr key={index} className="border-b">
                  {Object.values(staff).map((value: any, index: number) => (
                    <td key={index} className="p-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>
        ): 
        (
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
        )

      }
    </div>
  );
}
