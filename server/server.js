const express = require('express');
const multer = require('multer');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
const port = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File size limit (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// File filter for Excel and PDF files
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'excel' && file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Expected Excel (.xlsx) or PDF (.pdf) but got ${file.mimetype}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter
});

// Middleware
app.use(cors());
app.use(express.json());

// Function to parse Excel file
function parseExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);
  
  // Extract Article No. and US Sale columns
  const extractedData = data.map(row => {
    // Find the keys that contain "Article No" and "US Sale" (case insensitive)
    const articleNoKey = Object.keys(row).find(key => 
      key.toLowerCase().includes('article') && key.toLowerCase().includes('no'));
    
    const usSaleKey = Object.keys(row).find(key => 
      key.toLowerCase().includes('us') && key.toLowerCase().includes('sale'));
    
    // Extract values if keys exist
    const articleNo = articleNoKey ? row[articleNoKey] : null;
    const usSale = usSaleKey ? row[usSaleKey] : null;
    
    // Determine if it's a sale item (US Sale column has a value)
    const isSaleItem = usSale !== null && usSale !== undefined && usSale !== '';
    
    return {
      articleNo,
      usSale,
      isSaleItem
    };
  }).filter(item => item.articleNo !== null);
  
  return extractedData;
}

// Function to parse PDF file
async function parsePdfFile(filePath) {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Extract article numbers using regex
    // This pattern looks for article numbers which are typically 6-10 digits
    // Adjust the regex pattern based on the actual format of article numbers in your PDF
    const articleNoPattern = /\b\d{6,10}\b/g;
    const articleNumbers = [];
    let match;
    
    // Find all matches in the PDF text
    while ((match = articleNoPattern.exec(data.text)) !== null) {
      articleNumbers.push(match[0]);
    }
    
    // Remove duplicates
    const uniqueArticleNumbers = [...new Set(articleNumbers)];
    
    return {
      articleNumbers: uniqueArticleNumbers,
      totalPages: data.numpages,
      pdfText: data.text.substring(0, 500) + '...' // First 500 chars for debugging
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
}

// Function to match sale items with PDF article numbers
function matchSaleItemsWithPdf(excelData, pdfArticleNumbers) {
  // Create a Set from PDF article numbers for faster lookups
  const pdfArticleSet = new Set(pdfArticleNumbers);
  
  // Mark each Excel item if it's found in the PDF
  const matchedData = excelData.map(item => {
    // Convert to string to ensure consistent comparison
    const articleNoStr = String(item.articleNo).trim();
    const isInPdf = pdfArticleSet.has(articleNoStr);
    
    return {
      ...item,
      isInPdf,
      isMatch: item.isSaleItem && isInPdf // It's a match if it's both on sale and in the PDF
    };
  });
  
  // Calculate match statistics
  const matchStats = {
    totalMatches: matchedData.filter(item => item.isMatch).length,
    saleItemsInPdf: matchedData.filter(item => item.isSaleItem && item.isInPdf).length,
    saleItemsNotInPdf: matchedData.filter(item => item.isSaleItem && !item.isInPdf).length,
    regularItemsInPdf: matchedData.filter(item => !item.isSaleItem && item.isInPdf).length
  };
  
  return { matchedData, matchStats };
}

// API endpoint for file upload
app.post('/api/upload', upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.excel || !req.files.pdf) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both Excel and PDF files are required' 
      });
    }
    
    const excelFilePath = req.files.excel[0].path;
    const pdfFilePath = req.files.pdf[0].path;
    
    // Parse Excel file
    const excelData = parseExcelFile(excelFilePath);
    
    // Parse PDF file
    const pdfData = await parsePdfFile(pdfFilePath);
    
    // Match sale items with PDF article numbers
    const { matchedData, matchStats } = matchSaleItemsWithPdf(excelData, pdfData.articleNumbers);
    
    // Calculate statistics
    const totalItems = excelData.length;
    const saleItems = excelData.filter(item => item.isSaleItem).length;
    const pdfItems = pdfData.articleNumbers.length;
    
    // Return the processed data
    res.json({
      success: true,
      message: 'Files processed successfully',
      excelData: matchedData,
      pdfData,
      stats: {
        totalItems,
        saleItems,
        pdfItems,
        ...matchStats
      }
    });
    
    // Clean up uploaded files after processing
    setTimeout(() => {
      try {
        fs.unlinkSync(excelFilePath);
        fs.unlinkSync(pdfFilePath);
        console.log('Temporary files deleted');
      } catch (err) {
        console.error('Error deleting temporary files:', err);
      }
    }, 5000); // 5 second delay before deletion
    
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ 
      success: false, 
      message: `Error processing files: ${error.message}` 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 