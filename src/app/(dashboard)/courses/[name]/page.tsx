/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Select } from "@/components/ui/select";

export default function CoursesPage() {
  const { data: session } = useSession();

  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [addedCourse, setAddedCourse] = useState({
    name: "",
    duration: 0,
  });
  const [addedSession, setAddedSession] = useState({
    start: "",
    end: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/course/getall`);
      console.log(res.data.data);
      setCourses(res.data.data);
      //set fisrt course as default
      if (res.data.data.length > 0) {
        setAddedSession({
          ...addedSession,
          course: res.data.data[0]._id,
        });
      }
    } catch (error: any) {
      console.log("Getting courses failed", error.response);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/course/add`, {
        name: addedCourse.name,
        duration: addedCourse.duration,
      });
      handleFetchData();
    } catch (error: any) {
      console.log("Adding course failed", error.response);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/session/add`, {
        start: addedSession.start,
        end: addedSession.end,
        course: addedSession.course,
      });
      handleFetchData();
    } catch (error: any) {
      console.log("Adding session failed", error.response);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (course_id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/course/delete`, {
        data: {
          course_id,
        },
      });
      handleFetchData();
    } catch (error: any) {
      console.log("Deleting course failed", error.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      handleFetchData();
    }
  }, [session]);

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-wrap justify-around">
        {courses.length > 0 ? (
          <>
            {courses.map((course: any) => (
              <div
                key={course._id}
                className="w-80 p-4 bg-green-100 rounded-lg shadow-md my-5"
              >
                <h2 className="text-xl font-semibold">
                  {course.name} (Year {course.duration})
                </h2>
                <h1 className="text-4xl text-red-500 font-semibold">
                  {course.students?.length} Students
                </h1>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/dashboard/courses/${course.name}-${course.duration}`}
                  >
                    <Button variant="default">View</Button>
                  </Link>
                  {session?.user.role === "CollegeAdmin" && (
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this Course from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCourse(course._id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-gray-500 mb-5">
            No Courses Added
          </h1>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-block">
            <Button variant="info">Add Course</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2 justify-center">
                <Input
                  placeholder="Course Name"
                  value={addedCourse.name}
                  onChange={(e) =>
                    setAddedCourse({ ...addedCourse, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Year"
                  type="number"
                  value={addedCourse.duration}
                  onChange={(e) =>
                    setAddedCourse({
                      ...addedCourse,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
                <Button variant="info" onClick={addCourse}>
                  Add Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-block">
            <Button variant="info">Add Session</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Session</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-2 justify-center">
                <Input
                  placeholder="Start Date"
                  value={addedSession.start}
                  onChange={(e) =>
                    setAddedSession({ ...addedSession, start: e.target.value })
                  }
                />
                <Input
                  placeholder="End Date"
                  value={addedSession.end}
                  onChange={(e) =>
                    setAddedSession({ ...addedSession, end: e.target.value })
                  }
                />
                <div className="flex flex-col">
                  <label htmlFor="course">Select Course</label>
                  {courses.length > 0 && (
                    <select
                      name="course"
                      id="course"
                      className="w-full h-10 rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400"
                      value={addedSession.course}
                      onChange={(e) =>
                        setAddedSession({
                          ...addedSession,
                          course: e.target.value,
                        })
                      }
                    >
                      {courses.length > 0 ? (
                        courses.map((course: any) => (
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
                {/* <Input
                  placeholder="Course"
                  value={addedSession.course}
                  onChange={(e) =>
                    setAddedSession({ ...addedSession, course: e.target.value })
                  }
                /> */}
                <Button variant="info" onClick={addSession}>
                  Add Session
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
