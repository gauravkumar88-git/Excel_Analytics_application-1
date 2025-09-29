import React, { useEffect, useState } from 'react';
import { BsPerson } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [name,setName]= useState('');

  useEffect(()=>{
    const fetchUser=async ()=>{
      try {
        const res =await axios.get('http://localhost:3000/api/auth/me',{withCredentials:true});
        setName(res.data.name);
      } catch (error) {
        console.error("Could not fetch user info",error);
        setName("Guest");
      }
    };
    fetchUser();
  },[]);

  const logout = async () => {
  try {
    await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });
    localStorage.removeItem("jwt");
    console.log("Logout Successfully");
    navigate("/", { replace: true }); 
  } catch (error) {
    console.log("Error logging out", error);
  }
};


  return (
    <div className="h-14 px-4 flex items-center justify-end gap-4 fixed top-0 right-0 z-40 ml-50">
      <h1 className="text-lg font-semibold flex items-center gap-3 text-sky-700">
       <BsPerson className='text-xl' /> {name|| "Loading"}
      </h1>
      <button
        onClick={logout}
        className="px-3 py-2 bg-sky-400 text-white rounded hover:bg-sky-600 text-lg font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
