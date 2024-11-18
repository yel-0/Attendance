import { useState } from "react";
import { useMutation } from "react-query";
import axiosInstance from "@/api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Adjust based on your UI library

const ImportStudentClassDialog = () => {
  const [file, setFile] = useState(null);

  // React Query mutation for file upload
  const importMutation = useMutation(
    async (formData) => {
      return axiosInstance.post("/import-student-classes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: (data) => {
        alert(data.message || "Student classes imported successfully!"); // Success feedback
      },
      onError: (error) => {
        alert(
          error.response?.data?.message || "An error occurred while importing."
        );
      },
    }
  );

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    importMutation.mutate(formData); // Trigger the mutation
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Import Student Classes</Button>
      </DialogTrigger>
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
