import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, FileImage, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
interface User {
  id: string;
}

interface Log {
  id: number;
  userId: number;
  createdAt: string;
  prompt: string;
  originalImage: string;
  generatedImage: string;
}

interface UserLogsProps {
  user: User | null;
}

const UserLogs: React.FC<UserLogsProps> = ({ user }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ logs: Log[] }>(
        `http://localhost:5000/api/logs/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched logs:", response.data);
      setLogs(response.data.logs);
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch your activity logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const deleteLog = async (logId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this log?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/logs/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
    } catch (err) {
      console.error("Error deleting log:", err);
      alert("Failed to delete log. Try again.");
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchLogs();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Design Activity</h1>
        <Button
          onClick={fetchLogs}
          className="flex items-center bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          <RefreshCw className="mr-2" size={16} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 mb-6">
          <AlertCircle className="inline-block mr-2" size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="ml-3 text-gray-300">Loading your activity logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileImage className="text-gray-500 h-16 w-16 mb-4" />
            <p className="text-xl text-gray-400">No design activity yet</p>
            <p className="text-gray-500 mt-2">
              Upload a design to start visualizing your fashion ideas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logs.map((log) => (
            <Card
              key={log.createdAt}
              className="bg-gray-800 border-gray-700 shadow-lg overflow-hidden"
            >
              <CardHeader className="bg-gray-700/50 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">
                    Design Visualization
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatDate(log.createdAt)}
                    <button
                      onClick={() => deleteLog(log.id)} // <-- change to log.id if using id
                      className="ml-3 hover:text-red-500 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {log.prompt && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-300">
                      Description:
                    </p>
                    <p className="text-sm text-gray-400">{log.prompt}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {log.originalImage && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Original Design
                      </p>
                      <div className="h-32 rounded-md overflow-hidden border border-gray-700">
                        <img
                          src={log.originalImage}
                          alt="Original Design"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {log.generatedImage && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Visualized Result
                      </p>
                      <div className="h-32 rounded-md overflow-hidden border border-gray-700">
                        <img
                          src={log.generatedImage}
                          alt="Visualized Design"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLogs;
