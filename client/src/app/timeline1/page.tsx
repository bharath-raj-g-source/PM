"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
// Import the newly created mutation hook
import { useUploadFileMutation } from "@/state/api"; 
import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone"; 

// Component Name Change (from Timeline to UploadPage)
const UploadPage = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  // State for file handling
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // RTK Query Mutation Hook
  const [uploadFile, { isLoading, isError, error }] = useUploadFileMutation();

  // --- Drag and Drop Logic ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Basic file validation
    const validFiles = acceptedFiles.filter(file => 
      file.type.match(/(text\/csv|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)/i)
    );
    
    if (validFiles.length > 0) {
      setFiles([validFiles[0]]);
      setUploadMessage(`File loaded: ${validFiles[0].name}. Click 'Upload & Process' to continue.`);
    } else if (acceptedFiles.length > 0) {
      setUploadMessage("Error: Only CSV and Excel files are accepted.");
      setFiles([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false, // Ensure only one file can be dragged/selected
    accept: {
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    }
  });
  
  // --- Handle Click/Upload Logic ---
  const handleFileUpload = async () => {
    if (files.length === 0) {
      setUploadMessage("Please select a file first.");
      return;
    }

    try {
      setUploadMessage("Uploading and processing file...");
      
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('file', files[0]);

      // Call the RTK Query Mutation function on click
      const result = await uploadFile(formData).unwrap();
      
      // Handle success
      setUploadMessage(`Success! ${result.message} - Processed ${result.count} records.`);
      setFiles([]); // Clear file state on successful upload

    } catch (err: any) {
      // Handle server/network error
      const errorMessage = err.data?.message || "An unknown error occurred during file upload.";
      setUploadMessage(`Upload Failed: ${errorMessage}`);
    }
  };
  // ---------------------------------

  const filePreview = useMemo(() => {
    if (files.length === 0) return null;
    const file = files[0];
    return (
      <div className="mt-4 p-3 border rounded border-gray-300 dark:border-dark-border">
        <p className="font-semibold">{file.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>
        <span className="text-green-500">✅ File Staged</span>
      </div>
    );
  }, [files]);
  
  // Combined Loading/Error state check
  if (isLoading) return <div>Uploading and Processing Data...</div>;


  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Upload Data for Quality Checks" />
        
        {/* Button now triggers the mutation onClick */}
        <button
          onClick={handleFileUpload}
          disabled={files.length === 0 || isLoading}
          className={`focus:shadow-outline rounded px-4 py-2 font-bold shadow transition-colors focus:outline-none 
            ${files.length > 0 && !isLoading
              ? 'bg-blue-500 hover:bg-blue-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isLoading ? 'Processing...' : 'Upload & Process Data'}
        </button>
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white p-6 min-h-[500px]">
        
        {/* Drag and Drop Area */}
        <div 
          {...getRootProps()} 
          className={`h-64 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors duration-200 
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-dark-accent/10' 
              : 'border-gray-300 dark:border-dark-border hover:border-gray-500 dark:hover:border-dark-accent'
            }`
          }
        >
          <input {...getInputProps()} />
          <p className="text-lg font-medium mb-2">
            {isDragActive 
              ? "Drop the file here..." 
              : "Drag 'n' drop your CSV or Excel file here, or click to select file"
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supported formats: .csv, .xls, .xlsx
          </p>
          
        </div>

        {/* File Display and Message Area */}
        {filePreview}
        {uploadMessage && (
            <div className={`mt-4 p-3 rounded ${uploadMessage.startsWith("Success") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {uploadMessage}
            </div>
        )}
        
        <h3 className="mt-8 text-xl font-semibold border-t pt-4 dark:border-dark-border">Data Preview</h3>
        <p className="text-gray-500 dark:text-gray-400">
            Once processed, the data will be displayed here in a tabular format.
        </p>
      </div>
    </div>
  );
};

export default UploadPage;