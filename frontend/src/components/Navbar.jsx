import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ArrowUpRight, LogIn, Plus } from "lucide-react";
import { handleLogout } from "../lib/utils";
const Navbar = ({ link, linkName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Check if we are on the /home route
  const showLogout = location.pathname === "/home";
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl  p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            Thinkboard
          </h1>
          <div className="flex items-center gap-4">
            <Link to={`/${link}`} className="btn btn-primary">
              {link === "create" ? (
                <Plus className="size-5" />
              ) : link === "login" ? (
                <LogIn className="size-5" />
              ) : (
                <ArrowUpRight className="size-5" />
              )}

              <span>{linkName}</span>
            </Link>
            {showLogout && (
              <button
                className="btn btn-ghost hover:bg-white/30 hover:border-white/0"
                onClick={() => handleLogout(navigate)}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
