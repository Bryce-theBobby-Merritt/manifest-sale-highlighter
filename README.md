# Manifest Sale Highlighter

A web application that helps logistics coordinators identify sale items in manifests by comparing Excel data with PDF manifests.

## Features

- Upload Excel files containing sale item information
- Upload PDF manifest files
- File validation (type and size)
- Excel parsing to extract Article No. and US Sale columns
- Identification of sale items
- Highlight sale items that appear in the manifest
- Generate downloadable reports

## Current Implementation Status

- ✅ File upload UI with validation
- ✅ Excel file selection (.xlsx)
- ✅ PDF file selection (.pdf)
- ✅ File size validation
- ✅ Submit functionality with loading indicator
- ✅ Server-side Excel parsing
- ✅ Sale item identification
- 🔄 PDF manifest parsing (coming soon)
- 🔄 Matching sale items with manifest items (coming soon)
- 🔄 Report generation (coming soon)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/manifest-sale-highlighter.git
   cd manifest-sale-highlighter
   ```

2. Install client dependencies
   ```
   npm install
   ```

3. Install server dependencies
   ```
   cd server
   npm install
   cd ..
   ```

4. Start the server
   ```
   cd server
   npm start
   ```

5. In a new terminal, start the client
   ```
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Upload Excel File" to select an Excel file containing sale items
2. Click "Upload PDF Manifest" to select a PDF manifest file
3. Click "Submit Files" to upload both files
4. Wait for the processing to complete
5. View the highlighted sale items in the results

## Project Structure

- `src/` - React client application
  - `App.js` - Main application component
  - `App.css` - Styling for the application
- `public/` - Static assets and HTML template
- `server/` - Express server application
  - `server.js` - Main server file
  - `uploads/` - Directory for uploaded files

## Technologies Used

### Client
- React.js
- CSS3
- JavaScript (ES6+)
- FormData API for file uploads

### Server
- Express.js
- Multer for file uploads
- XLSX for Excel parsing
- Node.js

## Future Enhancements

- PDF manifest parsing
- Matching sale items with manifest items
- Downloadable reports
- User authentication
- Integration with external inventory systems

## License

This project is licensed under the MIT License - see the LICENSE file for details. 