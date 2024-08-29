"use client";
import { useSession } from "next-auth/react";
import StaffTable from "@/app/components/StaffTable";
import { useState, useEffect } from "react";
import axios from "axios";

export default function StaffsPage() {
  const { data: session, status } = useSession();
  const [college, setCollege] = useState<any>(null);

  const fetchCollege = async () => {
    try {
      const response = await axios.post(`/api/college/getbyid`, {
        college_id: session?.user.college_id,
      });
      setCollege(response.data);
      console.log("College", response.data);
    } catch (error: any) {
      console.log("Error", error.response?.data?.error);
    }
  };

  useEffect(() => {
    if (session?.user.college_id) {
      fetchCollege();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status === "loading") {
    return <div>loading...</div>;
  }

  return (
    <>
      {session && (
        <StaffTable
          collegeId={String(session.user.college_id)}
          role={String(session.user.role)}
          lock={college?.lock}
        />
      )}
    </>
  );
}
