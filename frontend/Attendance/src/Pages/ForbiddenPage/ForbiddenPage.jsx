import React from "react";

const ForbiddenPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-600">403 Forbidden</h1>
        <p className="mt-4 text-gray-700">
          You do not have permission to access this page.
        </p>
        <p className="mt-2 text-gray-500">
          If you think this is a mistake, please contact the administrator.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default ForbiddenPage;
