import React, { useState } from "react";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast"; // Adjust this import for your toast system
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { importStudentClasses } from "@/api/studentClass";
const ImportStudentClassDialog = () => {
  const [file, setFile] = useState(null);
  const { toast } = useToast(); // Initialize toast

  // React Query mutation using the API function
  const importMutation = useMutation(importStudentClasses, {
    onSuccess: (data) => {
      toast({
        title: "Import Successful",
        description:
          data.message || "Student classes have been imported successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while importing the student classes. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload before proceeding.",
        variant: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    importMutation.mutate(formData);
  };

  return (
    <Dialog>
      <DialogTrigger>Import Student Classes</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Student Classes</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import student-class data into the system.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Native file input */}
          <input
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <Button
            onClick={handleSubmit}
            disabled={importMutation.isLoading}
            className="bg-white text-black border border-black hover:bg-black hover:text-white"
          >
            {importMutation.isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentClassDialog;
