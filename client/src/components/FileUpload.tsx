import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { AlertCircle, Upload, CheckCircle } from "lucide-react";

interface FileUploadProps {
  user: {
    id: string;
    username: string;
  } | null;
  isLoggedIn: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ user, isLoggedIn }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null); // Preview the selected file
    setError(null); // Clear any previous errors
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextPrompt(event.target.value);
    setError(null); // Clear any previous prompt errors
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    if (!textPrompt.trim()) {
      setError("Please enter a text prompt.");
      return;
    }

    if (!isLoggedIn || !user) {
      setError("You must be logged in to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("prompt", textPrompt);

    setProcessing(true);
    setUploadStatus("Uploading and processing...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Server response:", response.data);

      if (response.data.generatedImage) {
        const imageUrl = `http://localhost:5000${response.data.generatedImage}`;
        setGeneratedImage(imageUrl);
        setUploadStatus("Processing complete!");
      } else {
        setError("Error processing image. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "File upload failed.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setProcessing(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-yellow-400">
          <AlertCircle className="inline-block mr-2" size={20} />
          Please log in to upload and visualize your designs
        </div>
      )}

      <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Design Visualizer
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Upload Your Design Sketch
            </label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="bg-gray-700 text-white border-gray-600"
              disabled={processing || !isLoggedIn}
            />
          </div>

          {previewImage && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 text-gray-300">Preview:</p>
              <div className="relative w-full h-64 overflow-hidden rounded-lg">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Describe Your Design Vision
            </label>
            <Input
              type="text"
              value={textPrompt}
              onChange={handleTextChange}
              placeholder="e.g., 'A summer dress with floral pattern'"
              className="bg-gray-700 text-white border-gray-600"
              disabled={processing || !isLoggedIn}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={processing || !isLoggedIn}
          >
            {processing ? (
              <span className="flex items-center">
                Processing...{" "}
                <div className="ml-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2" size={18} /> Visualize Design
              </span>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
              <AlertCircle className="inline-block mr-2" size={18} />
              {typeof error === "string" ? error : "An unknown error occurred."}
            </div>
          )}

          {uploadStatus && (
            <p className="mt-4 text-green-600 font-semibold">{uploadStatus}</p>
          )}
        </form>

        {generatedImage && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Your Visualized Design
            </h3>
            <div className="relative w-full h-96 overflow-hidden rounded-lg border border-gray-600">
              <img
                src={generatedImage}
                alt="Visualized Design"
                className="object-contain w-full h-full"
              />
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center">
              Your fashion design has been visualized! You can download this
              image or continue experimenting.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FileUpload;
