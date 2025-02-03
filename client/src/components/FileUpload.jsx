import React, { useState } from "react";
import axios from "axios";
// import "../App.css"; // Import your CSS file

const FileUpload = ({ user, isLoggedIn }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null); // Use URL.createObjectURL
    setError(null); // Clear any previous file errors
  };

  const handleTextChange = (event) => {
    setTextPrompt(event.target.value);
    setError(null); // Clear any previous prompt errors
  };

  const handleUpload = async (e) => {
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
    formData.append("image", selectedFile, selectedFile.name); // Include filename
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
      console.log("Server response:", response.data); // Debugging

      if (response.data.generatedImage) {
        const imageUrl = `http://localhost:5000/${response.data.generatedImage}`;
        console.log("Generated Image URL:", imageUrl);

        setGeneratedImage(imageUrl);
        setUploadStatus("Processing complete!");
        console.log("Image processed and log saved successfully (on backend)"); // Log success
      } else {
        console.error("Unexpected response from server:", response.data);
        setError("Error processing image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.error || "File upload failed.");
    } finally {
      setProcessing(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="file-upload-container max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-center text-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold mb-6">
        Upload Your Sketch and Add a Prompt
      </h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input block mx-auto mb-6 p-2 border rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
      />

      {/* Image Preview and Generated Image */}
      {previewImage && (
        <div
          className={`image-container flex justify-center items-center gap-4 mb-6 transition-all duration-500 ${
            generatedImage ? "opacity-100" : "opacity-100"
          }`}
        >
          <img
            src={previewImage}
            alt="Original"
            className="preview-image w-56 h-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg"
          />
          {generatedImage && (
            <span className="arrow text-4xl text-blue-600 dark:text-blue-400">
              →
            </span>
          )}
          {generatedImage && (
            <img
              src={generatedImage}
              alt="Generated Design"
              className="generated-image w-56 h-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg"
            />
          )}
        </div>
      )}

      {/* Text Area and Submit Button */}
      <form onSubmit={handleUpload} className="space-y-4">
        <textarea
          placeholder="Describe your clothing design..."
          value={textPrompt}
          onChange={handleTextChange}
          rows="5"
          cols="50"
          className="prompt-textarea w-full max-w-3xl p-4 border rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={processing}
          className={`upload-button w-full max-w-xs mx-auto py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform ${
            processing ? "scale-95" : "scale-100"
          }`}
        >
          {processing ? (
            <div className="spinner border-t-4 border-b-4 border-white border-solid w-6 h-6 rounded-full animate-spin mx-auto" />
          ) : (
            "Upload"
          )}
        </button>
      </form>

      {/* Error and Status Messages */}
      {error && (
        <p className="error-message text-red-500 text-sm mt-4">{error}</p>
      )}
      <p className="upload-status text-green-600 font-semibold mt-4">
        {uploadStatus}
      </p>
    </div>
  );
};
export default FileUpload;
