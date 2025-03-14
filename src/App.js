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
  const [processedData, setProcessedData] = useState(null);
  
  const excelInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  
  // Maximum file size in bytes (20MB)
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  // Server API URL
  const API_URL = 'http://localhost:5000/api/upload';
  // Server base URL
  const SERVER_URL = 'http://localhost:5000';

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
    setProcessedData(null);

    // Create FormData object to send files
    const formData = new FormData();
    formData.append('excel', selectedFiles.excel);
    formData.append('pdf', selectedFiles.pdf);

    try {
      // Send files to the server
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUploadStatus({
          success: true,
          message: result.message || 'Files uploaded successfully!'
        });
        setProcessedData(result);
      } else {
        throw new Error(result.message || `Server responded with status: ${response.status}`);
      }
    } catch (err) {
      setUploadStatus({
        success: false,
        message: `Upload failed: ${err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (processedData && processedData.highlightedPdf) {
      // Create a download link
      const downloadUrl = `${SERVER_URL}${processedData.highlightedPdf.url}`;
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = processedData.highlightedPdf.filename;
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
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
            <p>Uploading and processing files, please wait...</p>
          </div>
        )}
        
        {uploadStatus && (
          <div className={`status-message ${uploadStatus.success ? 'success' : 'error'}`}>
            {uploadStatus.message}
          </div>
        )}
        
        {processedData && processedData.excelData && (
          <div className="results-container">
            <h2>Processing Results</h2>
            
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Excel Items</span>
                <span className="stat-value">{processedData.stats.totalItems}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sale Items</span>
                <span className="stat-value">{processedData.stats.saleItems}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">PDF Items</span>
                <span className="stat-value">{processedData.stats.pdfItems}</span>
              </div>
              <div className="stat-item highlight-stat">
                <span className="stat-label">Matched Items</span>
                <span className="stat-value">{processedData.stats.totalMatches}</span>
              </div>
            </div>
            
            <div className="match-stats">
              <div className="match-stat-item">
                <span className="match-label">Sale Items in PDF:</span>
                <span className="match-value">{processedData.stats.saleItemsInPdf}</span>
              </div>
              <div className="match-stat-item">
                <span className="match-label">Sale Items not in PDF:</span>
                <span className="match-value">{processedData.stats.saleItemsNotInPdf}</span>
              </div>
              <div className="match-stat-item">
                <span className="match-label">Regular Items in PDF:</span>
                <span className="match-value">{processedData.stats.regularItemsInPdf}</span>
              </div>
            </div>
            
            {processedData.highlightedPdf && (
              <div className="download-section">
                <p>A highlighted PDF has been generated with all sale items marked.</p>
                <button 
                  className="download-button"
                  onClick={handleDownloadPdf}
                >
                  Download Highlighted PDF
                </button>
              </div>
            )}
            
            <div className="data-tables-wrapper">
              <div className="data-table-container">
                <h3>Excel Data</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Article No.</th>
                      <th>US Sale</th>
                      <th>Status</th>
                      <th>In PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.excelData.slice(0, 10).map((item, index) => (
                      <tr 
                        key={`excel-${index}`} 
                        className={
                          item.isMatch ? 'match-item' : 
                          item.isSaleItem ? 'sale-item' : ''
                        }
                      >
                        <td>{item.articleNo}</td>
                        <td>{item.usSale || '-'}</td>
                        <td>{item.isSaleItem ? 'On Sale' : 'Regular'}</td>
                        <td>
                          {item.isInPdf ? 
                            <span className="status-icon yes">✓</span> : 
                            <span className="status-icon no">✗</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {processedData.excelData.length > 10 && (
                  <p className="table-note">Showing 10 of {processedData.excelData.length} items</p>
                )}
              </div>
              
              <div className="data-table-container">
                <h3>PDF Article Numbers</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Article No.</th>
                      <th>In Excel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.pdfData.articleNumbers.slice(0, 10).map((item, index) => {
                      const inExcel = processedData.excelData.some(
                        excelItem => String(excelItem.articleNo).trim() === item
                      );
                      const isSaleItem = processedData.excelData.some(
                        excelItem => String(excelItem.articleNo).trim() === item && excelItem.isSaleItem
                      );
                      
                      return (
                        <tr 
                          key={`pdf-${index}`}
                          className={inExcel && isSaleItem ? 'match-item' : ''}
                        >
                          <td>{item}</td>
                          <td>
                            {inExcel ? 
                              <span className="status-icon yes">✓</span> : 
                              <span className="status-icon no">✗</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {processedData.pdfData.articleNumbers.length > 10 && (
                  <p className="table-note">Showing 10 of {processedData.pdfData.articleNumbers.length} items</p>
                )}
              </div>
            </div>
            
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color sale-color"></span>
                <span className="legend-text">Sale Item</span>
              </div>
              <div className="legend-item">
                <span className="legend-color match-color"></span>
                <span className="legend-text">Matched Item (Sale Item in PDF)</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 