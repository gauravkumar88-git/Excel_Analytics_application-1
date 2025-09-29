import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/upload", { withCredentials: true });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[93%] mt-14">
      <div className="h-[70%] w-[70%] max-w-3xl rounded-3xl shadow-2xl bg-white/90 p-8 flex flex-col hover:scale-[1.01] transition-transform duration-300">
        <h2 className="text-3xl font-bold mb-6">📜 My History</h2>
        <div className="flex-1 overflow-y-auto">
          {history.length > 0 ? history.map((item) => (
            <div key={item._id} className="p-4 mb-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl">
              <a
                href={`http://localhost:3000/api/upload/download/${item._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sky-500 underline"
              >
                {item.fileName}
              </a>
              <p className="text-sm text-gray-500">
                {item.date ? new Date(item.date).toLocaleString() : "Unknown date"}
              </p>
            </div>
          )) : (
            <div className="text-center text-gray-400 mt-10">No history yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
