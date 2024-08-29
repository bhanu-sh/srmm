/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { excelToJson } from "@/helpers/excelToJson";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AddStudents() {
  const router = useRouter();
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [collegeLock, setCollegeLock] = useState(false);
  const [json, setJson] = useState<any>(null);
  const [preview, setPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<any[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

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
        setCourse(response.data.data);
        setCourseId(response.data.data[0]._id);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
      console.log("Getting courses failed", error.response);
    }
  };

  const handlePreview = async () => {
    if (file) {
      const json = await excelToJson(file);
      setJson(json);
      setPreview(true);
    }
  };

  useEffect(() => {
    if (session) {
      getCourses();
    }
  }, [session]);

  const handleUpload = async () => {
    if (file) {
      try {
        setLoading(true);
        toast.loading("Uploading Students...");
        const json = await excelToJson(file);

        // Convert phone numbers and passwords to strings
        const formattedJson = (json as any[]).map((student: any) => ({
          ...student,
          phone: "" + student.phone,
          password: "" + student.password,
        }));

        console.log("Converted JSON:", formattedJson); // Log the formatted JSON
        console.log("College ID:", session?.user.college_id);
        console.log("Selected Course ID:", courseId); // Log the selected course ID
        const res = await axios.post("/api/student/bulkadd", {
          user: formattedJson,
          college_id: session?.user.college_id,
          course_id: courseId,
        });

        if (res.status !== 200) {
          const errorData = res.data;
          console.error("Error:", errorData);
          return;
        }

        const data = res.data;
        console.log("Response data:", data); // Log the response data
        toast.remove();
        toast.success("Students uploaded successfully");
        router.push("/dashboard/students");
      } catch (error) {
        console.error("An error occurred:", error);
        toast.remove();
        toast.error("An error occurred while uploading Students");
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("No file selected");
      toast.error("No file selected");
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-red-500">
        Add Students
      </h1>
      <br />
      <Button
        className="mt-5"
        onClick={() =>
          window.open(
            "https://docs.google.com/spreadsheets/d/1nE6LGcSwYN-qvTeYbx3IW05ULtaqPtKF/edit?usp=drive_link&ouid=104440024889944415834&rtpof=true&sd=true"
          )
        }
      >
        Download Sample File
      </Button>
      {collegeLock && (
        <div className="mt-5">
          <p className="text-red-500">
            You cannot add students as the college is locked.
          </p>
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="course">Select Course</label>
        {course.length > 0 && (
          <select
            name="course"
            id="course"
            className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400"
            onChange={(e) => {
              setCourseId(e.target.value);
              console.log("Selected Course ID:", e.target.value); // Log the selected course ID
            }}
          >
            {course.length > 0 ? (
              course.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.name} (Year {course.duration})
                </option>
              ))
            ) : (
              <option>No courses available</option>
            )}
          </select>
        )}
      </div>
      <>
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
            disabled={collegeLock}
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
        {loading && <p className="mt-5">Loading...</p>}
        {json && (
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-red-500">Preview Data</h2>
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full mt-5">
                <thead className="bg-gray-200">
                  <tr className="text-left">
                    {Object.keys(json[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {json.map((user: any, index: number) => (
                    <tr key={index} className="border-b">
                      {Object.values(user).map((value: any, index: number) => (
                        <td key={index} className="p-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
