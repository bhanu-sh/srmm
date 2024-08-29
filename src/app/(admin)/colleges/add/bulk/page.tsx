"use client";

import React from "react";
import { excelToJson } from "@/helpers/excelToJson";
import toast from "react-hot-toast";
import axios from "axios";

export default function BulkCollegeAdd() {
  const [file, setFile] = React.useState<File | null>(null);
  const [json, setJson] = React.useState<any>(null);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

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

  //convert to json then upload to mongodb using api
  // const handleUpload = async () => {
  //   if (file) {
  //     try {
  //       setLoading(true);
  //       toast.loading("Uploading Colleges...");
  //       const json = await excelToJson(file);

  //       // Convert phone and pincode numbers to strings
  //       const formattedJson = (json as any[]).map((college: any) => ({
  //         ...college,
  //         phone: college.phone.toString(),
  //         pincode: college.pincode.toString(),
  //       }));

  //       console.log("Converted JSON:", formattedJson); // Log the formatted JSON

  //       const res = await fetch("/api/college/bulkadd", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ colleges: formattedJson }), // Ensure the structure matches server expectations
  //       });

  //       if (!res.ok) {
  //         const errorData = await res.json();
  //         console.error("Error:", errorData);
  //         // Handle error, possibly update state to reflect the error
  //         return;
  //       }

  //       const data = await res.json();
  //       console.log("Response data:", data); // Log the response data
  //       toast.remove();
  //       toast.success("Colleges added successfully");
  //       // Handle success, possibly update state to reflect successful upload
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //       // Handle error, possibly update state to reflect the error
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     console.warn("No file selected");
  //     // Handle case where no file is selected
  //   }
  // };

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true);
        toast.loading("Uploading Colleges...");
        const json = await excelToJson(file);

        // Convert phone and pincode numbers to strings
        const formattedJson = (json as any[]).map((college: any) => ({
          ...college,
          phone: college.phone.toString(),
          pincode: college.pincode.toString(),
        }));

        console.log("Converted JSON:", formattedJson); // Log the formatted JSON

        const res = await axios.post("/api/college/bulkadd", {
          colleges: formattedJson,
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
        toast.success("Colleges added successfully");
        // Handle success, possibly update state to reflect successful upload
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle error, possibly update state to reflect the error
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No file selected");
      // Handle case where no file is selected
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-red-500">Test Page</h1>
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
          <pre>{JSON.stringify(json, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
