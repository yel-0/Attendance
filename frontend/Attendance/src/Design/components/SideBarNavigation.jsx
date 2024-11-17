import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Clipboard,
  User,
  Users,
  FileText,
  ArrowBigDown,
} from "lucide-react";
import { useTeacherClassrooms } from "@/Hooks/Classrooms/useTeacherClassrooms ";
import { useClassroomsByAuthStudent } from "@/Hooks/StudentClasses/useClassroomsByAuthStudent";
import { Triangle } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/Provider/AuthProvider";
const SideBarNavigation = () => {
  const { data, isLoading: userLoading } = useAuth();
  const user = data?.user;
  const role = user?.role;

  const {
    data: teacherClassrooms,
    isError,
    isLoading,
  } = useTeacherClassrooms(role === "teacher");

  const [isClassesOpen, setIsClassesOpen] = useState(false);

  const {
    data: studentClass,
    isLoading: studentClassLoading,
    isError: studentClassError,
  } = useClassroomsByAuthStudent(role === "student");

  return (
    <div className="h-screen   w-[300px] bg-[#1c2434] text-white flex flex-col">
      <div className="flex h-[80px] flex-row justify-center items-center ">
        <div className="text-2xl">
          <Link
            to="/"
            className="flex flex-row justify-center items-center gap-3 "
          >
            <Triangle /> Attendance System
          </Link>
        </div>
      </div>
      <nav className="w-full mt-[20px]  p-2">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex flex-row rounded-sm hover:bg-[#333a48] p-2 "
            >
              <Home className="mr-3 ml-3 w-[20px] " />
              <span>Home</span>
            </Link>
          </li>
          {isLoading ? <div>Loading...</div> : null}

          {/* Show Classes if role is Teacher */}
          {role === "teacher" && (
            <>
              <li>
                <button
                  className="flex flex-row rounded-sm hover:bg-[#333a48] w-full  p-2 "
                  onClick={() => setIsClassesOpen(!isClassesOpen)}
                >
                  <Clipboard className="mx-3 w-[20px]" />
                  Classes
                </button>
                {isClassesOpen && (
                  <ul className="ml-8  space-y-2 mt-2">
                    {teacherClassrooms?.map((classItem) => (
                      <li key={classItem.id}>
                        <Link
                          to={`/attendance/${classItem.id}`}
                          className="flex flex-row rounded-sm opacity-[.5]  hover:opacity-[1] p-2 "
                        >
                          {/* <FileText className="mr-2 w-[20px]" /> */}
                          {classItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </>
          )}

          {/* Show additional items if role is Admin */}
          {role === "admin" && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="flex flex-row rounded-sm hover:bg-[#333a48]  p-2 "
                >
                  <Users className="mr-3 ml-3 w-[20px]" />
                  Manage Users
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/classes"
                  className="flex flex-row rounded-sm hover:bg-[#333a48]  p-2 "
                >
                  <Clipboard className="mx-3 w-[20px]" />
                  Classes
                </Link>
              </li>
              {/* Add more admin-specific links here */}
            </>
          )}

          {/* Show only Home if role is Student */}
          {role === "student" && (
            <li>
              <button
                className="flex flex-row rounded-sm hover:bg-[#333a48] w-full  p-2 "
                onClick={() => setIsClassesOpen(!isClassesOpen)}
              >
                <Clipboard className="mx-3 w-[20px]" />
                Classes
              </button>
              {isClassesOpen && (
                <ul className="ml-8 space-y-2 mt-2">
                  {studentClass?.map((classItem) => (
                    <li key={classItem.id}>
                      <Link
                        to={`/view/attendances/student/${classItem.id}`}
                        className="flex flex-row rounded-sm opacity-[.5]  hover:opacity-[1] p-2 "
                      >
                        {/* <FileText className="mr-2" /> */}
                        {classItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideBarNavigation;
