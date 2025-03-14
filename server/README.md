# Manifest Sale Highlighter - Server Component

This is the server component for the Manifest Sale Highlighter application. It handles file uploads, Excel parsing, and PDF processing.

## Features

- File upload handling with validation
- Excel file parsing to extract Article No. and US Sale columns
- Identification of sale items
- PDF manifest parsing (coming soon)
- Matching sale items with manifest items (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Install dependencies
   ```
   npm install
   ```

2. Start the server
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

3. The server will run on port 5000 by default (http://localhost:5000)

## API Endpoints

### POST /api/upload

Uploads and processes Excel and PDF files.

**Request:**
- Content-Type: multipart/form-data
- Body:
  - excel: Excel file (.xlsx)
  - pdf: PDF file (.pdf)

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded and processed successfully",
  "excelData": [
    {
      "articleNo": "12345",
      "usSale": 19.99,
      "isSaleItem": true
    },
    ...
  ],
  "stats": {
    "totalItems": 100,
    "saleItems": 25
  },
  "files": {
    "excel": "example.xlsx",
    "pdf": "example.pdf"
  }
}
```

## Project Structure

- `server.js` - Main server file
- `uploads/` - Directory for uploaded files (created automatically)

## Technologies Used

- Express.js - Web server framework
- Multer - File upload handling
- XLSX - Excel file parsing
- cors - Cross-Origin Resource Sharing 