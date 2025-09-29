import React from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { IoBarChart } from "react-icons/io5";
import { RiFileUploadFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from 'react-router-dom';

export default function Sidebar() {

  
  return (
    <aside className="h-screen w-70 bg-sky-500 rounded-r-2xl p-4">
      <h1 className="text-2xl font-semibold text-white font-sans text-center py-3">
        Analytics Exl
      </h1>
      <hr className="text-white" />

      <nav className="flex flex-col gap-4 mt-10">
        <NavLink
          to="center"
          className={({ isActive }) =>
            `flex items-center gap-2 text-xl font-semibold pl-4 ${
              isActive ? 'text-black' : 'text-white hover:text-black'
            }`
          }
        >
          <MdSpaceDashboard /> Dashboard
        </NavLink>

        <NavLink
          to="uploadfile"
          className={({ isActive }) =>
            `flex items-center gap-2 text-xl font-semibold pl-4 ${
              isActive ? 'text-black' : 'text-white hover:text-black'
            }`
          }
        >
          <RiFileUploadFill /> Upload File
        </NavLink>

        <NavLink
          to="chartcomponent"
          className={({ isActive }) =>
            `flex items-center gap-2 text-xl font-semibold pl-4 ${
              isActive ? 'text-black' : 'text-white hover:text-black'
            }`
          }
        >
          <IoBarChart /> Analysis Excel
        </NavLink>

        <NavLink
          to="history"
          className={({ isActive }) =>
            `flex items-center gap-2 text-xl font-semibold pl-4 ${
              isActive ? 'text-black' : 'text-white hover:text-black'
            }`
          }
        >
          <FaHistory /> History
        </NavLink>

        <NavLink
          to="/"
          className="flex items-center gap-2 text-xl font-semibold pl-4 text-white hover:text-black"
        >
          <FiLogOut /> Logout
        </NavLink>
      </nav>
    </aside>
  );
}
