import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/Provider/AuthProvider";
const Logout = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-red-500 w-[80%] text-white p-1 text-sm rounded-md hover:bg-red-600">
          Logout
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently log you out and
            remove your session data.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Confirm Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Logout;
