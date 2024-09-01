"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AddStaff() {
  const { data: session } = useSession();

  const router = useRouter();
  const [staff, setStaff] = useState({
    f_name: "",
    l_name: "",
    phone: "",
    password: "123",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    college_id: session?.user.college_id,
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      console.log("college id", session?.user.college_id);
      setStaff({ ...staff, college_id: session?.user.college_id });
      const response = await axios.post("/api/user/staff/add", staff);
      console.log("Staff Added Successfully", response.data);
      toast.success("Staff Added");
      router.push("/dashboard");
    } catch (error: any) {
      console.log("Adding failed", error.response.data.error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      staff.f_name.length > 0 &&
      staff.l_name.length > 0 &&
      staff.phone.length > 0 &&
      staff.dob.length > 0 &&
      staff.address.length > 0 &&
      staff.city.length > 0 &&
      staff.state.length > 0 &&
      staff.pincode.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [staff]);

  return (
    <div className="flex flex-col w-96 mx-auto justify-center min-h-screen">
      <h1 className="text-4xl text-center font-bold mb-3">Add Staff</h1>
      <hr />
      <div className="flex justify-around items-center">
        <p>Add using Excel?</p>
        <Link className="" href={"/add/staff/bulk"}>
          <button className="p-2 border mt-3 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 hover:bg-gray-200">
            Bulk Add
          </button>
        </Link>
      </div>
      <br />
      <Button
        className="mt-5"
        onClick={() =>
          window.open(
            "https://docs.google.com/spreadsheets/d/1iYYLaiydt6fbggnx4WwARdwBoEJgkxHB/edit?usp=drive_link&ouid=104440024889944415834&rtpof=true&sd=true"
          )
        }
      >
        Download Sample File
      </Button>
      <hr />
      <label htmlFor="f_name">First Name</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="f_name"
        type="text"
        required
        value={staff.f_name}
        placeholder="First Name"
        onChange={(e) => {
          setStaff({ ...staff, f_name: e.target.value });
        }}
      />
      <label htmlFor="l_name">Last Name</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="l_name"
        type="text"
        required
        value={staff.l_name}
        placeholder="Last Name"
        onChange={(e) => {
          setStaff({ ...staff, l_name: e.target.value });
        }}
      />
      <label htmlFor="phone">Phone</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="phone"
        type="text"
        required
        value={staff.phone}
        placeholder="Phone"
        onChange={(e) => setStaff({ ...staff, phone: e.target.value })}
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-1 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        required
        value={staff.password}
        placeholder="Password"
        onChange={(e) => setStaff({ ...staff, password: e.target.value })}
      />
      <div className="flex items-center p-0">
        <label htmlFor="showPass">Show Password</label>
        <input
          className=" border border-gray-300 mt-4 ml-1 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="showPass"
          type="checkbox"
          onClick={(e: any) => {
            const pass = document.getElementById("password");
            if (pass) {
              pass.setAttribute("type", e.target.checked ? "text" : "password");
            }
          }}
        />
      </div>

      <label htmlFor="dob">Date of Birth</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="dob"
        type="date"
        required
        value={staff.dob}
        placeholder="Date of Birth"
        onChange={(e) => setStaff({ ...staff, dob: e.target.value })}
      />
      <label htmlFor="address">Address</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="address"
        type="text"
        required
        value={staff.address}
        placeholder="Address"
        onChange={(e) => setStaff({ ...staff, address: e.target.value })}
      />
      <label htmlFor="city">City</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="city"
        type="text"
        required
        value={staff.city}
        placeholder="City"
        onChange={(e) => setStaff({ ...staff, city: e.target.value })}
      />
      <label htmlFor="state">State</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="state"
        type="text"
        required
        value={staff.state}
        placeholder="State"
        onChange={(e) => setStaff({ ...staff, state: e.target.value })}
      />
      <label htmlFor="pincode">Pincode</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="pincode"
        type="text"
        required
        value={staff.pincode}
        placeholder="Pincode"
        onChange={(e) => setStaff({ ...staff, pincode: e.target.value })}
      />
      <hr />
      <button
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
        disabled={buttonDisabled || loading}
        onClick={onSignup}
      >
        Submit
      </button>
    </div>
  );
}
