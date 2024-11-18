import React, { useState } from "react";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/Design/components/FileUpload";
import { registerUser } from "@/api/accounts";

const Register = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
    roleNumber: "",
  });

  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation(
    registerUser,
    {
      onSuccess: (data) => {
        toast({
          title: "Account Created",
          description: `The account for ${data.account.name} has been successfully registered.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Registration Failed",
          description:
            "We couldn't complete your registration. Please check your details and try again. If the issue persists, contact support.",
          variant: "destructive",
        });
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Passwords do not match" });
      return;
    }
    if (activeTab === "student" && !formData.roleNumber) {
      setErrors({ roleNumber: "Roll Number is required for students" });
      return;
    }
    console.log(formData);

    setErrors({});
    mutate(formData);
  };

  const [errors, setErrors] = useState({});

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <Tabs
          defaultValue="student"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            setFormData((prev) => ({
              ...prev,
              role: value === "teacher/admin" ? "teacher" : value,
              roleNumber: value === "student" ? prev.roleNumber : "",
            }));
          }}
        >
          <div className="w-full flex flex-row justify-center items-center">
            <TabsList className="">
              <TabsTrigger value="student">Student Registration</TabsTrigger>
              <TabsTrigger value="teacher/admin">
                Teacher/Admin Registration
              </TabsTrigger>
              <TabsTrigger value="File">File Registration</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="student">
            <form onSubmit={handleSubmit}>
              <CommonFields
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
              <div className="mb-4">
                <label htmlFor="roleNumber" className="block text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  id="roleNumber"
                  name="roleNumber"
                  value={formData.roleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={activeTab === "student"}
                />
                {errors.roleNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.roleNumber}
                  </p>
                )}
              </div>
              <SubmitButton isLoading={isLoading} />
            </form>
          </TabsContent>

          <TabsContent value="teacher/admin">
            <form onSubmit={handleSubmit}>
              <CommonFields
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <SubmitButton isLoading={isLoading} />
            </form>
          </TabsContent>
          <TabsContent value="File">
            <FileUpload />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const CommonFields = ({ formData, handleChange, errors }) => (
  <>
    <div className="mb-4">
      <label htmlFor="name" className="block text-gray-700">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {errors.name && (
        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
      )}
    </div>
    <div className="mb-4">
      <label htmlFor="email" className="block text-gray-700">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="block text-gray-700">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
      )}
    </div>
    <div className="mb-4">
      <label htmlFor="password_confirmation" className="block text-gray-700">
        Confirm Password
      </label>
      <input
        type="password"
        id="password_confirmation"
        name="password_confirmation"
        value={formData.password_confirmation}
        onChange={handleChange}
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {errors.password_confirmation && (
        <p className="text-red-500 text-sm mt-1">
          {errors.password_confirmation}
        </p>
      )}
    </div>
  </>
);

const SubmitButton = ({ isLoading }) => (
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
    disabled={isLoading}
  >
    {isLoading ? "Registering..." : "Register"}
  </button>
);

export default Register;
