import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white w-full  py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          {/* Logo or Brand Name */}
          <div className="text-lg font-semibold mb-4 md:mb-0">
            <Link to="/" className="text-gray-800 hover:text-gray-600">
              Attendance Management System
            </Link>
          </div>

          {/* Contact Information */}
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            <p>
              Email:{" "}
              <a
                href="mailto:info@example.com"
                className="text-blue-500 hover:underline"
              >
                info@example.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-500 hover:underline"
              >
                +1 (234) 567-890
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-300">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Attendance Management System. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
