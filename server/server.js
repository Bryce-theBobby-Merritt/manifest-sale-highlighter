const express = require('express');
const multer = require('multer');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'excel' && !file.originalname.endsWith('.xlsx')) {
      return cb(new Error('Only .xlsx files are allowed for Excel uploads'));
    }
    if (file.fieldname === 'pdf' && !file.originalname.endsWith('.pdf')) {
      return cb(new Error('Only .pdf files are allowed for PDF uploads'));
    }
    cb(null, true);
  }
});

// Parse Excel file to extract Article No. and US Sale columns
function parseExcelFile(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Assume the first sheet is the one we want
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert the worksheet to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Extract Article No. and US Sale columns
    const extractedData = data.map(row => {
      // Check for different possible column names
      const articleNo = row['Article No.'] || row['Article No'] || row['ArticleNo'] || row['Article Number'] || row['Item Number'] || row['ItemNumber'];
      const usSale = row['US Sale'] || row['USSale'] || row['Sale Price'] || row['SalePrice'] || row['US Sale Price'];
      
      return {
        articleNo,
        usSale: usSale || null, // If US Sale is empty, set to null
        isSaleItem: !!usSale // Boolean flag for sale items
      };
    });
    
    return {
      success: true,
      data: extractedData,
      totalItems: extractedData.length,
      saleItems: extractedData.filter(item => item.isSaleItem).length
    };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Upload endpoint
app.post('/api/upload', upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), (req, res) => {
  try {
    if (!req.files || !req.files.excel || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: 'Both Excel and PDF files are required'
      });
    }

    const excelFilePath = req.files.excel[0].path;
    const pdfFilePath = req.files.pdf[0].path;

    // Parse the Excel file
    const excelData = parseExcelFile(excelFilePath);

    if (!excelData.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to parse Excel file',
        error: excelData.error
      });
    }

    // For now, we'll just return the Excel data
    // PDF parsing will be implemented in a future story
    return res.status(200).json({
      success: true,
      message: 'Files uploaded and processed successfully',
      excelData: excelData.data,
      stats: {
        totalItems: excelData.totalItems,
        saleItems: excelData.saleItems
      },
      files: {
        excel: req.files.excel[0].originalname,
        pdf: req.files.pdf[0].originalname
      }
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing upload',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 