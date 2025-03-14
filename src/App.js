import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState({
    excel: null,
    pdf: null
  });
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const excelInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
  // Maximum file size in bytes (20MB)
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const handleExcelUploadClick = () => {
    setError(null);
    excelInputRef.current.click();
  };

  const handlePdfUploadClick = () => {
    setError(null);
    pdfInputRef.current.click();
  };

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large, maximum allowed size is 20 MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      return false;
    }
    return true;
  };

  const handleExcelFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file extension
      if (!file.name.endsWith('.xlsx')) {
        setError('Please select an Excel (.xlsx) file');
        event.target.value = null;
        return;
      }
      
      // Validate file size
      if (!validateFileSize(file)) {
        event.target.value = null;
        return;
      }
      
      setSelectedFiles(prev => ({
        ...prev,
        excel: file
      }));
      setError(null);
    }
  };

  const handlePdfFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file extension
      if (!file.name.endsWith('.pdf')) {
        setError('Please select a PDF (.pdf) file');
        event.target.value = null;
        return;
      }
      
      // Validate file size
      if (!validateFileSize(file)) {
        event.target.value = null;
        return;
      }
      
      setSelectedFiles(prev => ({
        ...prev,
        pdf: file
      }));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    // Validate that both files are selected
    if (!selectedFiles.excel || !selectedFiles.pdf) {
      setError('Please select both Excel and PDF files before submitting');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadStatus(null);

    // Create FormData object to send files
    const formData = new FormData();
    formData.append('excel', selectedFiles.excel);
    formData.append('pdf', selectedFiles.pdf);

    try {
      // In a real application, replace with your actual API endpoint
      // const response = await fetch('https://your-api-endpoint/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      // if (response.ok) {
      setUploadStatus({
        success: true,
        message: 'Files uploaded successfully!'
      });
      // } else {
      //   throw new Error(`Server responded with status: ${response.status}`);
      // }
    } catch (err) {
      setUploadStatus({
        success: false,
        message: `Upload failed: ${err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Manifest Sale Highlighter</h1>
        
        <div className="upload-buttons">
          <button 
            className="upload-button"
            aria-label="Upload Excel File"
            onClick={handleExcelUploadClick}
            disabled={isUploading}
          >
            Upload Excel File
          </button>
          
          <button 
            className="upload-button"
            aria-label="Upload PDF Manifest"
            onClick={handlePdfUploadClick}
            disabled={isUploading}
          >
            Upload PDF Manifest
          </button>
        </div>
        
        <input
          type="file"
          ref={excelInputRef}
          onChange={handleExcelFileChange}
          accept=".xlsx"
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        
        <input
          type="file"
          ref={pdfInputRef}
          onChange={handlePdfFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="selected-files">
          {selectedFiles.excel && (
            <div className="file-info">
              <p>Selected Excel file: {selectedFiles.excel.name}</p>
              <p className="file-size">Size: {(selectedFiles.excel.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
          
          {selectedFiles.pdf && (
            <div className="file-info">
              <p>Selected PDF file: {selectedFiles.pdf.name}</p>
              <p className="file-size">Size: {(selectedFiles.pdf.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
        </div>
        
        {selectedFiles.excel && selectedFiles.pdf && !isUploading && !uploadStatus && (
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            Submit Files
          </button>
        )}
        
        {isUploading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Uploading files, please wait...</p>
          </div>
        )}
        
        {uploadStatus && (
          <div className={`status-message ${uploadStatus.success ? 'success' : 'error'}`}>
            {uploadStatus.message}
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 