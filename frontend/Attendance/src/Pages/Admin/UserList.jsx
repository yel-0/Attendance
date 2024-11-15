import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAccounts from "@/Hooks/Accounts/useAccounts";
import { Button } from "@/components/ui/button";
import DeleteAccountDialog from "@/Design/components/DeleteAccountDialog";
import UpdateAccountDialog from "@/Design/components/UpdateAccountDialog";

const UserList = () => {
  const [role, setRole] = useState(""); // Role filter
  const [rollNumber, setRollNumber] = useState(""); // Roll Number filter
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1); // Page number
  const { data, error, isLoading } = useAccounts(role, rollNumber, page);

  // Handle pagination change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle role filter change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1); // Reset to first page when role changes
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setRollNumber(inputValue); // Set rollNumber only when the button is clicked
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Extract accounts and pagination data from the API response
  const accounts = data?.accounts || [];
  const totalAccounts = data?.total || 0;
  const currentPage = data?.current_page || 1;
  const lastPage = data?.last_page || 1;

  return (
    <div className="h-auto">
      {/* Filter by Role */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Filter by Role:</label>
          <select
            value={role}
            onChange={handleRoleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {/* Filter by Roll Number */}
        <div>
          <label className="mr-2">Filter by Roll Number:</label>
          <input
            type="text"
            value={inputValue} // Use the temporary input value
            onChange={handleInputChange} // Update input value while typing
            className="px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter Roll Number"
          />
          <button
            onClick={handleFilterClick} // Set rollNumber when button is clicked
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <Table className="border bg-white shadow w-full">
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead className="flex flex-row justify-center items-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.id}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.role}</TableCell>
              <TableCell>{account.rollNumber}</TableCell>
              <TableCell className="flex justify-center items-center flex-row gap-4">
                <UpdateAccountDialog account={account} />
                <DeleteAccountDialog
                  accountName={account.name}
                  accountId={account.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          {/* First Button */}
          <Button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-600"
          >
            First
          </Button>

          {/* Previous Button */}
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-600"
          >
            Prev
          </Button>

          {/* Page Number Buttons */}
          {currentPage > 1 && (
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 text-white bg-blue-400 rounded-md"
            >
              {currentPage - 1}
            </Button>
          )}

          <Button className="px-4 py-2 text-white bg-blue-600 rounded-md">
            {currentPage}
          </Button>

          {currentPage < lastPage && (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 text-white bg-blue-400 rounded-md"
            >
              {currentPage + 1}
            </Button>
          )}

          {/* Next Button */}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-600"
          >
            Next
          </Button>

          {/* Last Button */}
          <Button
            onClick={() => handlePageChange(lastPage)}
            disabled={currentPage === lastPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-600"
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
