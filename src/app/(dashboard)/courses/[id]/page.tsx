/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import StudentTableFee from "@/app/components/StudentTableFee";

export default function CourseStudentPage({ params }: any) {
  const { id } = params;

  const { data: session } = useSession();
  const [college, setCollege] = useState<any>(null);

  const fetchCollege = async () => {
    try {
      const response = await axios.post(`/api/college/getbyid`, {
        college_id: session?.user.college_id,
      });
      setCollege(response.data);
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
  return (
    <>
      {session && (
        <>
          <StudentTableFee
            collegeId={String(session.user.college_id)}
            role={String(session.user.role)}
            lock={college?.lock}
            courseId={id}
          />
        </>
      )}
    </>
  );
}
