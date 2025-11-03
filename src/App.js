import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import "./App.css";

export default function AttendanceTracker() {
  const [totalClasses, setTotalClasses] = useState("");
  const [attendedClasses, setAttendedClasses] = useState("");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [warning, setWarning] = useState("");

  // ✅ Handle input and prevent negative numbers
  const handleInputChange = (setter, value, fieldName) => {
    const num = Number(value);
    if (num < 0) {
      setWarning(`⚠️ ${fieldName} cannot be negative`);
      return;
    } else {
      setWarning("");
    }
    setter(value);
  };

  // ✅ Calculate attendance logic
  const calculateAttendance = () => {
    const total = Number(totalClasses);
    const attended = Number(attendedClasses);

    if (isNaN(total) || isNaN(attended)) {
      setResult("⚠️ Please enter valid numbers");
      return;
    }
    if (total <= 0) {
      setResult("⚠️ Total classes must be greater than 0");
      return;
    }
    if (attended > total) {
      setResult("⚠️ Attended classes cannot exceed total classes");
      return;
    }

    let attendancePercentage = (attended / total) * 100;
    let requiredClasses = 0;
    let maxLeaves = 0;
    let message = "";

    if (attendancePercentage < 75) {
      requiredClasses = Math.ceil((0.75 * total - attended) / 0.25);
      message = `⚠️ Your attendance is ${attendancePercentage.toFixed(
        2
      )}%. You need to attend ${requiredClasses} more class${
        requiredClasses !== 1 ? "es" : ""
      } to reach 75%.`;
    } else {
      maxLeaves = Math.floor((attended - 0.75 * total) / 0.75);
      message = `✅ Your attendance is ${attendancePercentage.toFixed(
        2
      )}%. You can take ${maxLeaves} more leave${
        maxLeaves !== 1 ? "s" : ""
      } and still maintain 75%.`;
    }

    setResult(message);
    setChartData([
      { name: "Total Classes", value: total },
      { name: "Attended", value: attended },
      { name: "Required for 75%", value: requiredClasses },
      { name: "Max Leaves", value: maxLeaves },
    ]);
  };

  // ✅ Reset all data
  const resetData = () => {
    setTotalClasses("");
    setAttendedClasses("");
    setResult(null);
    setWarning("");
    setChartData([]);
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">🎓 Attendance Tracker</h1>

        <input
          type="number"
          min="0"
          placeholder="Total Classes Held"
          className="input-box"
          value={totalClasses}
          onChange={(e) =>
            handleInputChange(setTotalClasses, e.target.value, "Total Classes")
          }
        />

        <input
          type="number"
          min="0"
          placeholder="Classes Attended"
          className="input-box"
          value={attendedClasses}
          onChange={(e) =>
            handleInputChange(
              setAttendedClasses,
              e.target.value,
              "Attended Classes"
            )
          }
        />

        {warning && <div className="warning-box">{warning}</div>}

        <div className="button-group">
          <button className="btn" onClick={calculateAttendance}>
            Calculate
          </button>
          <button className="btn reset" onClick={resetData}>
            Reset
          </button>
        </div>

        {result && (
          <div
            className={`result-box ${
              result.includes("✅")
                ? "good"
                : result.includes("⚠️")
                ? "bad"
                : ""
            }`}
          >
            {result}
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="chart-section">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <ReferenceLine
                y={75}
                stroke="red"
                strokeDasharray="3 3"
                label="75%"
              />
              <Bar dataKey="value" fill="#6366F1" radius={[10, 10, 0, 0]}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
