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
import toast from "react-hot-toast";

export default function CoursesPage() {
  const { data: session } = useSession();

  const [courses, setCourses] = useState([]);
  const [updatedCourse, setUpdatedCourse] = useState({
    _id: "",
    name: "",
    session_start: 0,
    session_end: 0,
    course_fee: 0,
  });
  const [addedCourse, setAddedCourse] = useState({
    name: "",
    session_start: 0,
    session_end: 0,
    course_fee: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/course/getall`);
      setCourses(res.data.data);
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
        session_start: addedCourse.session_start,
        session_end: addedCourse.session_end,
      });
      handleFetchData();
      toast.success("Course added successfully");
    } catch (error: any) {
      console.log("Adding course failed", error.response);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/course/edit`, updatedCourse);
      handleFetchData();
      toast.success("Course updated successfully");
    } catch (error: any) {
      console.log("Updating course failed", error.response);
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

  const handleEditClick = (course: any) => {
    setUpdatedCourse({
      _id: course._id,
      name: course.name,
      session_start: course.session_start,
      session_end: course.session_end,
      course_fee: course.course_fee,
    });
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
                <h1 className="text-4xl font-semibold">{course.name}</h1>
                <h2 className="text-xl font-semibold">
                  Session: {course.session_start} - {course.session_end}
                </h2>
                <div className="flex justify-between items-center mt-4">
                  <Link href={`/courses/${course._id}`}>
                    <Button variant="default">View</Button>
                  </Link>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="info"
                        onClick={() => handleEditClick(course)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-col gap-2 justify-center">
                            <Input
                              placeholder="Course Name"
                              value={updatedCourse.name}
                              onChange={(e) =>
                                setUpdatedCourse({
                                  ...updatedCourse,
                                  name: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="Session Start Year"
                              type="number"
                              value={updatedCourse.session_start}
                              onChange={(e) =>
                                setUpdatedCourse({
                                  ...updatedCourse,
                                  session_start: parseInt(e.target.value),
                                })
                              }
                            />
                            <Input
                              placeholder="Session End Year"
                              type="number"
                              value={updatedCourse.session_end}
                              onChange={(e) =>
                                setUpdatedCourse({
                                  ...updatedCourse,
                                  session_end: parseInt(e.target.value),
                                })
                              }
                            />
                            <Input
                              placeholder="Course Fee"
                              type="number"
                              value={updatedCourse.course_fee}
                              onChange={(e) =>
                                setUpdatedCourse({
                                  ...updatedCourse,
                                  course_fee: parseInt(e.target.value),
                                })
                              }
                            />
                            <Button variant="info" onClick={updateCourse}>
                              Update Course
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

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
                  placeholder="Session Start Year"
                  type="number"
                  onChange={(e) =>
                    setAddedCourse({
                      ...addedCourse,
                      session_start: parseInt(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Session End Year"
                  type="number"
                  onChange={(e) =>
                    setAddedCourse({
                      ...addedCourse,
                      session_end: parseInt(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Course Fee"
                  type="number"
                  onChange={(e) =>
                    setAddedCourse({
                      ...addedCourse,
                      course_fee: parseInt(e.target.value),
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
    </div>
  );
}
