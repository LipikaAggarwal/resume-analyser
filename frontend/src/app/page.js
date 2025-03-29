
"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDropFileUpload = () => {
  const [files, setFiles] = useState([]);

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
  
    try {
      const response = await fetch("http://localhost:5001/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (data.fileUrl) {
        setFiles([...files, { name: acceptedFiles[0].name, url: data.fileUrl }]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [] 
    },
    multiple: true, 
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        {...getRootProps({
          className: `w-96 h-40 border-2 border-dashed rounded-lg p-4 flex items-center justify-center transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-400 bg-white"
          }`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 font-medium">Drop the files here...</p>
        ) : (
          <p className="text-gray-500 font-medium">Drag & drop files here, or click to select files (Images, PDFs, DOCX)</p>
        )}
      </div>

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mt-4 w-96 text-gray-400">
          <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
          <ul className="space-y-2 border-background">
            {files.map((file, index) => (
              <li key={index} className="flex items-center space-x-4">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-600">{file.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragDropFileUpload;

