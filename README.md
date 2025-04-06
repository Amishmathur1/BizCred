# Financial Analysis Application

This application provides a financial analysis dashboard built with Streamlit and a React frontend.

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js and npm (for the frontend)
- MongoDB (for storing financial data)

### Backend Setup

1. Install the required Python packages:

   ```
   cd app/backend
   pip install -r requirements.txt
   ```

2. Start the Flask API server:
   ```
   python api.py
   ```
   This will start the API server on http://localhost:5000

### Frontend Setup

1. Install the required npm packages:

   ```
   npm install
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

## How It Works

1. The frontend has an "Add loan" button that, when clicked, sends a request to the backend API.
2. The API starts a Streamlit server that runs the financial analysis application.
3. The Streamlit application opens in a new browser window.
4. After analysis, the data is stored in MongoDB.
5. The dashboard displays the latest loan proposals from the database.
6. Clicking on a proposal shows detailed analysis and financial metrics.

## Streamlit Servers

The application uses two Streamlit servers:

1. **Main Analysis Server** (port 8501): Used for creating new loan proposals and performing financial analysis.
2. **View Analyses Server** (port 8502): Used for viewing all stored analyses and detailed financial metrics.

## MongoDB Integration

The application stores financial analysis data in MongoDB with the following structure:

```json
{
  "_id": "unique-id",
  "blockchain_address": "0x...",
  "name": "Company Name",
  "loan_amount": 0,
  "proposal_title": "Loan Proposal Title",
  "company_description": "Company Description",
  "gemini_analysis": "Detailed analysis from Gemini AI",
  "financial_metrics": {
    "nav": [...],
    "profit_loss": [...],
    "cash_flow": [...]
  },
  "risk_percentage": 82.8,
  "timestamp": "2025-04-06T01:10:45.116Z"
}
```

## Troubleshooting

- If you encounter CORS issues, make sure the Flask API server is running and accessible.
- If the Streamlit server doesn't start, check that all required packages are installed.
- If the browser doesn't open automatically, you can manually navigate to http://localhost:8501 after clicking the "Add loan" button.
- If you can't connect to MongoDB, make sure MongoDB is running locally on port 27017.
- If you're having issues with both Streamlit servers, make sure they're running on different ports (8501 and 8502).

# BizCred
# BizCred
# BizCred
