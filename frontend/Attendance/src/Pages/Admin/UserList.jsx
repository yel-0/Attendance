import React, { useState } from "react";
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
  const { data, error, isLoading } = useAccounts();
  const [selectedUser, setSelectedUser] = useState(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if data exists and has accounts
  const accounts = data?.accounts || [];

  return (
    <Table className="border bg-white shadow">
      <TableCaption>A list of users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="">Roll Number</TableHead>
          <TableHead className=" flex flex-row justify-center items-center">
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
            <TableCell>{account.roleNumber}</TableCell>
            <TableCell className="flex  justify-center items-center flex-row gap-4">
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
  );
};

export default UserList;
