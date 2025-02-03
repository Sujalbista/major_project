import React, { useState, useEffect } from "react";
import axios from "axios";

const UserLogs = ({ user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/logs/${user.id}`,
          {
            // Fetch logs for the specific user
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token
            },
          }
        );
        setLogs(response.data.logs);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(err.response?.data?.message || "Error fetching logs");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      // Check if user and user.id exist
      fetchLogs();
    } else {
      setLoading(false); // Important: stop loading if no user
    }
  }, [user]);

  if (loading) {
    return <div>Loading logs...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">My Image Generation Logs</h2>
      {logs.length === 0 ? (
        <p className="text-gray-400">No logs found.</p>
      ) : (
        logs.map((log) => (
          <div
            key={log.timestamp}
            className="flex items-center gap-5 border border-gray-700 p-4 my-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <p className="text-sm text-gray-400 w-32">
              {new Date(log.timestamp).toLocaleString()}
            </p>
            <p
              className="font-semibold text-sm w-48 truncate"
              title={log.prompt} // Show full text on hover
            >
              {log.prompt}
            </p>

            <div className="flex items-center gap-4">
              <img
                src={log.originalImage}
                alt="Original"
                className="max-w-xs h-auto rounded-lg border-2 border-gray-500"
              />
              <span className="text-3xl font-bold text-blue-500">➡️</span>
              <img
                src={log.generatedImage}
                alt="Generated"
                className="max-w-xs h-auto rounded-lg border-2 border-gray-500"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserLogs;
