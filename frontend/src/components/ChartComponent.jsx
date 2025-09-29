import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [pieSize, setPieSize] = useState(70);
  const chartRef = useRef();

  const file = location.state?.file || null;

  useEffect(() => {
    if (!file) {
      navigate("/chartcomponent");
    } else {
      parseFile(file);
    }
  }, [file, navigate]);

  // Parse CSV or Excel
  const parseFile = (file) => {
    const reader = new FileReader();

    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.onload = (e) => {
        const result = Papa.parse(e.target.result, {
          header: true,
          dynamicTyping: true,
        });
        processParsedData(result.data);
      };
      reader.readAsText(file);
    } else if (file.name.toLowerCase().endsWith(".xlsx")) {
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          raw: true,
        });
        processParsedData(sheet);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format. Please upload CSV or XLSX.");
    }
  };

  // Store parsed data & columns
  const processParsedData = (data) => {
    const cleanData = data.filter((row) =>
      Object.values(row).some((val) => val !== null && val !== "")
    );
    setRawData(cleanData);
    if (cleanData.length > 0) {
      setColumns(Object.keys(cleanData[0]));
    }
  };

  // Create chartData when X & Y keys are selected
  useEffect(() => {
    if (!xKey || !yKey || rawData.length === 0) return;

    const labels = rawData.map((row) => row[xKey]);
    const values = rawData.map((row) =>
      typeof row[yKey] === "number" ? row[yKey] : 0
    );

    setChartData({
      labels,
      datasets: [
        {
          label: `${yKey} vs ${xKey}`,
          data: values,
          backgroundColor: [
            "#3b82f6",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
            "#84cc16",
          ],
          borderColor: "#111827",
          borderWidth: 1,
          barThickness: 25,
        },
      ],
    });
  }, [xKey, yKey, rawData]);

  const downloadAsImage = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "chart.jpg";
      link.href = canvas.toDataURL("image/jpeg");
      link.click();
    });
  };

  const downloadAsPDF = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
      pdf.save("chart.pdf");
    });
  };

  const renderChart = () => {
    if (!chartData) return <p className="text-gray-500">Please select X and Y axis</p>;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };

    const chartStyle = {
      height: "350px",
      width: "500px",
      margin: "0 auto",
    };

    switch (chartType) {
      case "line":
        return (
          <div style={chartStyle}>
            <Line data={chartData} options={commonOptions} />
          </div>
        );
      case "pie":
        return (
          <div style={{ ...chartStyle, width: "350px", height: "350px" }}>
            <Pie
              data={chartData}
              options={{
                ...commonOptions,
                plugins: {
                  legend: { position: "bottom" },
                },
                radius: `${pieSize}%`,
              }}
            />
          </div>
        );
      default:
        return (
          <div style={chartStyle}>
            <Bar
              data={chartData}
              options={{
                ...commonOptions,
                indexAxis: "x", // Always vertical
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full mt-30">
      {/* Axis selectors */}
      {columns.length > 0 && (
        <div className="mb-4 flex gap-4">
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select X-axis</option>
            {columns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>

          <select
            value={yKey}
            onChange={(e) => setYKey(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Y-axis</option>
            {columns.map((col, idx) => (
              <option key={idx} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chart Type Selector */}
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="pie">Pie Chart</option>
      </select>

      {/* Pie Size Slider */}
      {chartType === "pie" && (
        <div className="mb-4 flex flex-col items-center">
          <label>Pie Chart Size: {pieSize}%</label>
          <input
            type="range"
            min="30"
            max="100"
            value={pieSize}
            onChange={(e) => setPieSize(e.target.value)}
          />
        </div>
      )}

      {/* Chart Container */}
      <div ref={chartRef} className="bg-white p-4 shadow-lg rounded">
        {renderChart()}
      </div>

      {/* Download Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={downloadAsImage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download JPG
        </button>
        <button
          onClick={downloadAsPDF}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ChartComponent;
