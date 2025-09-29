import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';


const Center = () => {
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
  return (
    <div className="flex-1 p-8 min-h-screen flex items-center justify-center ">
      <div className="bg-white p-10 shadow-xl rounded-2xl max-w-2xl w-full text-center transform transition-all hover:scale-[1.02] duration-300">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800">
          Excel Analytics <span className="text-sky-500">Dashboard</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mt-4 text-lg">
          Welcome, <span className="font-semibold text-cyan-500">{name|| "Loading"} </span>  
           Your loan analytics, prediction results, and uploaded datasets will appear here.
        </p>

        {/* Upload Button */}
        <div className="mt-8">
          <button className="bg-sky-500 hover:bg-sky-600 font-semibold text-white px-8 py-3 rounded-lg shadow-md transition duration-200 ease-in-out hover:shadow-lg">
            Welcome
          </button>
        </div>
      </div>
    </div>
  );
};

export default Center;
