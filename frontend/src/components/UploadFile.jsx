import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UploadFile = () => {
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  // Upload file to backend and save history
  const uploadFileToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:3000/api/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ File uploaded successfully!");
    } catch (error) {
      console.error("❌ File upload failed:", error);
    }
  };

  const handleFile = async (file) => {
    if (file) {
      await uploadFileToServer(file); // Upload first
      navigate("/dashboard/chartcomponent", { state: { file } }); // Then navigate
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="flex justify-center items-center w-full h-[100%] p-8">
      <div className="h-[70%] w-[70%] max-w-2xl rounded-2xl shadow-xl bg-white p-8 flex flex-col items-center transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Upload Excel / CSV File</h2>
        <p className="text-gray-600 mb-8 text-center">
          Upload your Excel or CSV file to visualize and analyze the data in real-time.
        </p>

        <form
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out
            ${dragOver ? "border-sky-500 bg-sky-50 shadow-lg" : "border-gray-300 bg-gray-50 hover:border-sky-400 hover:bg-sky-50"}`}
        >
          <input type="file" id="file-input" hidden accept=".csv, .xlsx" onChange={handleChange} />
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center text-gray-600 transition-transform duration-200 hover:scale-105"
          >
            <div className="p-4 bg-sky-100 rounded-full mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V8m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-lg font-medium">
              Drag & Drop or <span className="text-sky-500 font-semibold">Browse</span>
            </p>
            <small className="text-gray-400 mt-2">Supports: .CSV, .XLSX</small>
          </label>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
