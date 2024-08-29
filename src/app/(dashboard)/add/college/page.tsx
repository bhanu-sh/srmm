"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";

export default function AddCollege() {
  const { data: session } = useSession();

  const router = useRouter();
  const [college, setCollege] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    userId: session?.user._id,
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      console.log("user id", session?.user._id);
      setCollege({ ...college, userId: session?.user._id });
      console.log("college", college.userId);
      const response = await axios.post("/api/college/add", college);
      console.log("College Added Successfully", response.data);
      signOut();
      toast.success("College Added");
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
      college.name.length > 0 &&
      college.email.length > 0 &&
      college.phone.length > 0 &&
      college.address.length > 0 &&
      college.city.length > 0 &&
      college.state.length > 0 &&
      college.pincode.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [college]);

  return (
    <>
      {session && (
        <>
          {session?.user.role === "CollegeAdmin" && (
            <div className="flex flex-col w-96 mx-auto justify-center min-h-screen">
              <h1 className="text-4xl text-center font-bold mb-3">
                Add College
              </h1>
              <hr />
              <label htmlFor="name">Name</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="name"
                type="text"
                required
                value={college.name}
                placeholder="Name"
                onChange={(e) => {
                  setCollege({ ...college, name: e.target.value });
                }}
              />
              <label htmlFor="email">Email</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="email"
                required
                value={college.email}
                placeholder="Email"
                onChange={(e) =>
                  setCollege({ ...college, email: e.target.value })
                }
              />
              <label htmlFor="phone">Phone</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="phone"
                type="text"
                required
                value={college.phone}
                placeholder="Phone"
                onChange={(e) =>
                  setCollege({ ...college, phone: e.target.value })
                }
              />
              <label htmlFor="address">Address</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="address"
                type="text"
                required
                value={college.address}
                placeholder="Address"
                onChange={(e) =>
                  setCollege({ ...college, address: e.target.value })
                }
              />
              <label htmlFor="city">City</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="city"
                type="text"
                required
                value={college.city}
                placeholder="City"
                onChange={(e) =>
                  setCollege({ ...college, city: e.target.value })
                }
              />
              <label htmlFor="state">State</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="state"
                type="text"
                required
                value={college.state}
                placeholder="State"
                onChange={(e) =>
                  setCollege({ ...college, state: e.target.value })
                }
              />
              <label htmlFor="pincode">Pincode</label>
              <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="pincode"
                type="text"
                required
                value={college.pincode}
                placeholder="Pincode"
                onChange={(e) =>
                  setCollege({ ...college, pincode: e.target.value })
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
            </div>
          )}
        </>
      )}
    </>
  );
}
