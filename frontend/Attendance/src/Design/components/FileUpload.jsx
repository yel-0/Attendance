import React, { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  // Mutation for uploading file
  const uploadMutation = useMutation(
    (formData) =>
      axios.post("http://localhost:8000/api/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onSuccess: (response) => {
        alert("success");
      },
      onError: (error) => {
        alert("error");
      },
    }
  );

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadMutation.mutate(formData);
  };

  return (
    <div className=" flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Excel File
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Select Excel File
            </label>
            <input
              type="file"
              id="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={uploadMutation.isLoading}
            className={`w-full px-4 py-2 rounded-md text-white ${
              uploadMutation.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {uploadMutation.isLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
