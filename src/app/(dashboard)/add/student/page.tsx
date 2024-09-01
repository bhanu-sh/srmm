/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function AddStudent() {
  const { data: session } = useSession();

  const router = useRouter();
  const [student, setStudent] = useState({
    name: "",
    father_name: "",
    mother_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    roll: "",
    aadhar: "",
    course: "",
    session: "",
  });
  const [collegeLock, setCollegeLock] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any[]>([]);

  const getCollegeLock = async () => {
    try {
      console.log("College ID", session?.user.college_id);
      const response = await axios.post("/api/college/getbyid", {
        college_id: session?.user.college_id,
      });
      console.log("College Lock", response.data);
      setCollegeLock(response.data.lock);
    } catch (error: any) {
      console.log("Getting lock failed", error.response);
    }
  };

  const getCourses = async () => {
    try {
      const response = await axios.get("/api/course/getall");
      console.log("Courses response:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setCourse(response.data.data);
        setStudent({ ...student, course: response.data.data[0]._id });
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
      console.log("Getting courses failed", error.response);
    }
  };

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/student/add", {
        college_id: session?.user.college_id,
        ...student,
      });
      console.log("Student Added Successfully", response.data);
      toast.success("Student Added");
      router.push("/");
    } catch (error: any) {
      console.log("Adding failed", error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      getCourses();
    }
  }, [session]);

  useEffect(() => {
    if (
      student.name.length > 0 &&
      student.phone.length > 0 &&
      student.course.length > 0 &&
      student.session.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [student]);

  useEffect(() => {
    if (session) {
      getCollegeLock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className="flex flex-col w-96 mx-auto justify-center min-h-screen">
      {collegeLock ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">College is locked!</strong>
          <span className="block sm:inline"> You can&apos;t add students.</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => router.push("/dashboard")}
          >
            <span className="text-red-700">X</span>
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl text-center font-bold mb-3">Add Student</h1>
          <hr />
          <div className="flex justify-around items-center">
            <p>Add using Excel?</p>
            <Link className="" href={"/add/student/bulk"}>
              <button className="p-2 border mt-3 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-200">
                Bulk Add
              </button>
            </Link>
          </div>
          <hr />
          <label htmlFor="name">Name</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="name"
            type="text"
            required
            value={student.name}
            placeholder="Name"
            onChange={(e) => {
              setStudent({ ...student, name: e.target.value });
            }}
          />
          <label htmlFor="father_name">Father&apos;s Name</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="father_name"
            type="text"
            required
            value={student.father_name}
            placeholder="Father's Name"
            onChange={(e) => {
              setStudent({ ...student, father_name: e.target.value });
            }}
          />
          <label htmlFor="mother_name">Mother&apos;s Name</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="mother_name"
            type="text"
            required
            value={student.mother_name}
            placeholder="Mother's Name"
            onChange={(e) => {
              setStudent({ ...student, mother_name: e.target.value });
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="email"
            type="email"
            required
            value={student.email}
            placeholder="Email"
            onChange={(e) => setStudent({ ...student, email: e.target.value })}
          />
          <label htmlFor="phone">Phone</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="phone"
            type="text"
            required
            value={student.phone}
            placeholder="Phone"
            onChange={(e) => setStudent({ ...student, phone: e.target.value })}
          />
          <label htmlFor="dob">Date of Birth</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="dob"
            type="date"
            required
            value={student.dob}
            placeholder="Date of Birth"
            onChange={(e) => setStudent({ ...student, dob: e.target.value })}
          />
          <label htmlFor="gender">Gender</label>
          <select
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="gender"
            required
            value={student.gender}
            onChange={(e) => setStudent({ ...student, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="address">Address</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="address"
            type="text"
            required
            value={student.address}
            placeholder="Address"
            onChange={(e) =>
              setStudent({ ...student, address: e.target.value })
            }
          />
          <label htmlFor="city">City</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="city"
            type="text"
            required
            value={student.city}
            placeholder="City"
            onChange={(e) => setStudent({ ...student, city: e.target.value })}
          />
          <label htmlFor="state">State</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="state"
            type="text"
            required
            value={student.state}
            placeholder="State"
            onChange={(e) => setStudent({ ...student, state: e.target.value })}
          />
          <label htmlFor="pincode">Pincode</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="pincode"
            type="text"
            required
            value={student.pincode}
            placeholder="Pincode"
            onChange={(e) =>
              setStudent({ ...student, pincode: e.target.value })
            }
          />
          <label htmlFor="roll">Roll Number</label>
          <div className="flex flex-row items-center rounded-md">
            <span className="font-bold pb-4 mr-1">SRMM</span>
            <input
              placeholder="Search Student"
              className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              value={student.roll}
              onChange={(e) => setStudent({ ...student, roll: e.target.value })}
            />
          </div>
          <label htmlFor="aadhar">Aadhar Number</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="aadhar"
            type="text"
            required
            value={student.aadhar}
            placeholder="Aadhar Number"
            onChange={(e) => setStudent({ ...student, aadhar: e.target.value })}
          />
          <label htmlFor="course">Course</label>
          <div className="flex flex-col">
            <label htmlFor="course">Select Course</label>
            {course.length > 0 && (
              <select
                name="course"
                id="course"
                className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400"
                onChange={(e) => {
                  setStudent({ ...student, course: e.target.value });
                  console.log("Selected Course ID:", e.target.value); // Log the selected course ID
                }}
              >
                {course.length > 0 ? (
                  course.map((course: any) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))
                ) : (
                  <option>No courses available</option>
                )}
              </select>
            )}
          </div>
          <label htmlFor="session">Session</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            id="session"
            type="text"
            required
            value={student.session}
            placeholder="Session Start Year"
            onChange={(e) =>
              setStudent({ ...student, session: e.target.value })
            }
          />
          <hr />
          <button
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
            disabled={buttonDisabled || loading}
            onClick={onSignup}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
