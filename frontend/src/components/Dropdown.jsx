import { CircleUserRound } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

const Dropdown = ({ dropdownLinks }) => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  return (
    <div className="dropdown dropdown-left">
      <div tabIndex={0} role="button" className="btn m-1">
        <CircleUserRound className="size-5" /> {username}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm "
      >
        {dropdownLinks.map(({ id, path, linkName, icon: Icon, onClick }) => (
          <div
            onClick={() => (onClick ? onClick(navigate) : navigate(path))}
            key={id}
            className=""
          >
            <li>
              <a>
                {Icon && <Icon className="size-5" />}
                {linkName}
              </a>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
