
# File Analysis & Processing

## Overview

The File Analysis & Processing module is responsible for handling supplier price lists in various formats, extracting structured data, and analyzing price changes. This is a core functionality of the Supplier Price Watch application.

## Supported File Formats

- **Excel (.xlsx, .xls)**: Processed using the xlsx library
- **CSV (.csv)**: Parsed using custom CSV handling
- **PDF (.pdf)**: Processed using Gadget.dev's document processing capabilities (if configured)

## Processing Pipeline

```
File Upload → Format Detection → Data Extraction → Data Validation → Analysis → Results
```

## Key Components

### 1. File Upload

The `FileUpload` component handles file selection and initial validation:

```typescript
// File upload component interface
interface FileUploadProps {
  onFileProcessed: (result: AnalysisResult) => void;
  acceptedFormats: string[];
  maxFileSize: number;
}
```

### 2. Data Extraction

Different extractors handle specific file formats:

- **Excel Extractor**: Uses xlsx library to parse Excel documents
- **CSV Extractor**: Custom parser for CSV files
- **PDF Extractor**: Uses Gadget.dev for PDF processing (if available)

### 3. Data Validation

The system validates extracted data for consistency and completeness:

- Checks for required fields (e.g., SKU, price)
- Validates data types (e.g., prices are numeric)
- Identifies missing or malformed data

### 4. Price Analysis

The core analysis functions identify different types of price changes:

```typescript
// Price change detection
const detectPriceChanges = (
  oldPrices: Record<string, number>,
  newPrices: Record<string, number>
): PriceChangeResult => {
  // Implementation details...
};

// Price change categories
interface PriceChangeResult {
  increases: PriceItem[];
  decreases: PriceItem[];
  unchanged: PriceItem[];
  new: PriceItem[];
  discontinued: PriceItem[];
}
```

### 5. Results Generation

The system generates comprehensive results for display and export:

- Summary statistics (e.g., number of increases, average change)
- Detailed item-by-item analysis
- Potential financial impact calculations

## Advanced Features

### AI-Enhanced Analysis

When Gadget.dev integration is configured, the system can perform enhanced analysis:

- Market position assessment
- Competitive price analysis
- Trend identification
- Recommendation generation

### Batch Processing

For large files, the system uses batch processing to handle data efficiently:

```typescript
// Batch processing helper
const processBatch = async <T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize: number = 100
): Promise<R[]> => {
  // Implementation details...
};
```

### History & Comparison

The system maintains a history of previous analyses to enable:

- Trend analysis over time
- Comparison between different supplier updates
- Identification of patterns in price changes

## Error Handling

The file processing system includes robust error handling:

- Graceful handling of malformed files
- Detailed error reporting for debugging
- Partial results extraction from partially valid files
- Recovery suggestions for common issues

## Performance Considerations

For optimal performance, the system:

- Uses web workers for computationally intensive tasks
- Implements progressive loading for large files
- Optimizes memory usage during processing
- Caches intermediate results to avoid redundant computation
