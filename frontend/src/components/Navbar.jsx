import React from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRight, LogIn, Plus } from "lucide-react";
import Dropdown from "./Dropdown";
import dropdownLinks from "../constants/index.js";

const Navbar = ({ link, linkName }) => {
  const location = useLocation();
  const isLoggedIn = location.pathname === "/home";

  return (
    <header className="bg-base-300 border-b border-base-content/10 w-full max-sm:min-w-[300px]">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-nowrap items-center justify-between gap-4">
          {/* Logo / Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-mono tracking-tight whitespace-nowrap">
            Thinkboard
          </h1>

          {/* Button(s) and Dropdown */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to={`/${link}`}
              className="btn btn-primary btn-sm sm:btn-md whitespace-nowrap"
            >
              {link === "create" ? (
                <Plus className="size-5" />
              ) : link === "login" ? (
                <LogIn className="size-5" />
              ) : (
                <ArrowUpRight className="size-5" />
              )}
              <span className="ml-1">{linkName}</span>
            </Link>

            {isLoggedIn && (
              <Dropdown dropdownLinks={dropdownLinks} className="z-50" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
