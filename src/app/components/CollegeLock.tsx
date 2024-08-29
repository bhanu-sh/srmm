import React, { use, useEffect, useState } from "react";
import axios from "axios";

export default function CollegeLock({ collegeId }: { collegeId: string }) {
  const [college, setCollege] = useState<any>(null);

  const fetchCollege = async () => {
    try {
      const response = await axios.post(`/api/college/getbyid`, {
        college_id: collegeId,
      });
      setCollege(response.data);
      console.log("College", response.data);
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    }
  };

  const lockDetails = async () => {
    try {
      const response = await axios.post(`/api/college/lock`, {
        college_id: collegeId,
      });
      console.log("Details Locked", response.data);
    } catch (error: any) {
      console.log("Error", error.response.data.error);
    } finally {
      fetchCollege();
    }
  };

  useEffect(() => {
    fetchCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {college ? (
        <>
          {!college?.lock ? (
            <button
              onClick={() => lockDetails()}
              className="bg-green-500 text-white px-2 mb-2 hover:bg-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200"
            >
              Unlocked
            </button>
          ) : (
            <button
              onClick={() => lockDetails()}
              className="bg-red-500 text-white px-2 mb-2 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 transition ease-in-out duration-200"
            >
              Locked
            </button>
          )}
        </>
      ) : (
        <button
          onClick={() => lockDetails()}
          className="bg-gray-400 text-white px-2 mb-2 rounded-md transition ease-in-out duration-200"
        >
          Loading..
        </button>
      )}
    </div>
  );
}
