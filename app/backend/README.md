# Financial Analysis Application

This application provides a financial analysis dashboard built with Streamlit and a React frontend.

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js and npm (for the frontend)

### Backend Setup

1. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

2. Start the Flask API server:
   ```
   python api.py
   ```
   This will start the API server on http://localhost:5000

### Frontend Setup

The frontend is a React application that communicates with the backend API.

## How It Works

1. The frontend has an "Add loan" button that, when clicked, sends a request to the backend API.
2. The API starts a Streamlit server that runs the financial analysis application.
3. The Streamlit application opens in a new browser window.

## Streamlit Servers

The application uses two Streamlit servers:

1. **Main Analysis Server** (port 8501): Used for creating new loan proposals and performing financial analysis.
2. **View Analyses Server** (port 8502): Used for viewing all stored analyses and detailed financial metrics.

## Troubleshooting

- If you encounter CORS issues, make sure the Flask API server is running and accessible.
- If the Streamlit server doesn't start, check that all required packages are installed.
- If the browser doesn't open automatically, you can manually navigate to http://localhost:8501 after clicking the "Add loan" button.
- If you're having issues with both Streamlit servers, make sure they're running on different ports (8501 and 8502).
