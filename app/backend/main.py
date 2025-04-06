import pandas as pd
import google.generativeai as genai
import os
from datetime import datetime
import streamlit as st
import time
import threading
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
import json
import uuid

# Import MongoDB operations from the new file
from mongodb_operations import save_analysis_to_mongodb

# Set the Gemini API key directly in the backend
GEMINI_API_KEY = "AIzaSyD5xZwJFi-q9b04HkR3DX5rjitfbBvIT3I"

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# ===== GOOGLE SHEETS CONNECTION AND DATA EXTRACTION =====
def setup_gsheets_connection(credentials_path):
    """Connect to Google Sheets API for real-time data access"""
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    credentials = ServiceAccountCredentials.from_json_keyfile_name(credentials_path, scope)
    client = gspread.authorize(credentials)
    return client

def get_realtime_data(gsheets_client, spreadsheet_name, worksheet_name='Sheet1'):
    """Fetch real-time data from Google Sheets with improved handling for wide format data"""
    try:
        # Open the sheet
        sheet = gsheets_client.open(spreadsheet_name).worksheet(worksheet_name)
        
        # Get all values as a list of lists
        all_values = sheet.get_all_values()
        
        # Add debugging
        st.sidebar.write("Raw data sample (first few rows):")
        st.sidebar.write(all_values[:3] if all_values and len(all_values) > 3 else all_values)
        
        # Check if we have data
        if len(all_values) <= 1:
            st.error("No data found in the sheet or sheet is empty")
            return None
        
        # Determine if data is in wide format (dates as columns) or long format
        # Wide format: First row contains dates, column headers in first column
        # Long format: First column contains categories
        
        # Check first row for dates
        first_row = all_values[0] if all_values else []
        
        # Wide format detected - need to transpose
        if any(cell.strip() == "Dates" for cell in first_row) or any("/" in cell for cell in first_row[1:]):
            # This is wide format - convert to long format
            # Get headers (first row)
            headers = all_values[0]
            
            # Create DataFrame
            df = pd.DataFrame(all_values[1:], columns=headers)
            
            # Set the first column as the index (likely 'Dates')
            if not df.empty:
                first_col = df.columns[0]
                # Create a clean 'Category' column
                df['Category'] = df[first_col]
                # Reorder columns to have Category first
                cols = ['Category'] + [col for col in df.columns if col != 'Category' and col != first_col]
                df = df[cols]
        else:
            # Create DataFrame starting from the header row
            headers = all_values[0]
            data_rows = all_values[1:]
            
            # Create DataFrame
            df = pd.DataFrame(data_rows, columns=headers)
            
            # Ensure 'Category' exists
            if 'Category' not in df.columns and not df.empty:
                df = df.rename(columns={df.columns[0]: 'Category'})
        
        # Remove empty rows and columns
        df = df.dropna(how='all').dropna(axis=1, how='all')
        
        # Show the resulting DataFrame structure
        st.sidebar.write("Processed DataFrame columns:", list(df.columns))
        st.sidebar.write("DataFrame shape:", df.shape)
        
        return df
    
    except Exception as e:
        st.error(f"Error fetching real-time data: {str(e)}")
        import traceback
        st.sidebar.code(traceback.format_exc())
        return None
    
# ===== FINANCIAL DATA PROCESSING =====
def prepare_financial_data(df):
    """Clean and prepare financial data for analysis"""
    try:
        # Make a copy to avoid modifying the original
        prepared_df = df.copy()
        
        # Debug information
        st.sidebar.write("Preparing financial data with columns:", list(prepared_df.columns))
        
        # Determine which columns are numeric (skip first column if it's Category or Dates)
        numeric_cols = prepared_df.columns[1:] if len(prepared_df.columns) > 1 else []
        
        # Convert numeric columns to float with better error handling
        for col in numeric_cols:
            try:
                # Replace commas and handle other common formatting issues
                prepared_df[col] = prepared_df[col].astype(str).str.replace(',', '')
                prepared_df[col] = prepared_df[col].replace('', np.nan)
                prepared_df[col] = pd.to_numeric(prepared_df[col], errors='coerce')
            except Exception as e:
                st.sidebar.write(f"Error converting column {col}: {str(e)}")
                pass  # Skip columns that can't be converted
        
        return prepared_df
    
    except Exception as e:
        st.error(f"Error preparing financial data: {str(e)}")
        return df  # Return original if processing fails

# ===== COLUMN SCANNING AND DETECTION =====
def scan_financial_columns(df):
    """Scan and identify important financial metrics in the dataset"""
    key_metrics = {
        'asset': ['asset', 'assets', 'asset valuation', 'asset value', 'onchain reserve', 'offchain cash'],
        'nav': ['nav', 'net asset value', 'net asset'],
        'profit_loss': ['profit', 'loss', 'profit / loss', 'profit/loss', 'total profit', 'net profit', 'realized profit'],
        'cash_flow': ['cash flow', 'net cash flow', 'net cash', 'cash flow from'],
        'income': ['income', 'revenue', 'total income', 'accrued fees'],
        'expenses': ['expense', 'expenses', 'total expenses', 'cost', 'costs', 'fee', 'payments'],
    }
    
    detected_metrics = {}
    
    # Check if we have a Category column or use first available
    category_col = None
    
    for col in df.columns:
        if col.lower() == 'category':
            category_col = col
            break
    
    # If no Category column, look at column names instead
    if category_col is None:
        # Scan column headers for financial metrics
        for col in df.columns:
            col_lower = col.lower()
            for metric_type, keywords in key_metrics.items():
                if any(keyword in col_lower for keyword in keywords):
                    if metric_type not in detected_metrics:
                        detected_metrics[metric_type] = []
                    detected_metrics[metric_type].append(col)
    else:
        # Scan for key metrics in the Category column
        for category in df[category_col].astype(str):
            category_lower = category.lower()
            for metric_type, keywords in key_metrics.items():
                if any(keyword in category_lower for keyword in keywords):
                    if metric_type not in detected_metrics:
                        detected_metrics[metric_type] = []
                    detected_metrics[metric_type].append(category)
    
    # If no metrics detected, add some default categories
    if not detected_metrics:
        st.warning("No standard financial metrics detected. Using column names as metrics.")
        detected_metrics['metrics'] = [col for col in df.columns if col.lower() != 'category' and col.lower() != 'dates']
    
    return detected_metrics

# ===== SIMPLIFIED RISK CALCULATION =====
def calculate_simplified_risk(df, detected_metrics):
    """Calculate a simplified risk score as a percentage"""
    try:
        # Initialize risk score
        risk_score = 0
        total_metrics = 0
        
        # Helper function to extract data for a metric
        def get_metric_data(metric_categories):
            for category in metric_categories:
                row = df[df['Category'] == category]
                if not row.empty:
                    return row.iloc[:, 1:].values.flatten(), category
            return None, None
        
        # Calculate risk for each metric type
        for metric_type, categories in detected_metrics.items():
            metric_data, _ = get_metric_data(categories)
            if metric_data is not None:
                # Convert to numeric and handle NaN values
                values = pd.to_numeric(metric_data, errors='coerce')
                # Convert numpy array to pandas Series to use dropna
                values = pd.Series(values).dropna()
                
                if len(values) > 1:
                    # Calculate coefficient of variation (standard deviation / mean)
                    mean = np.mean(values)
                    std = np.std(values)
                    
                    if mean != 0:
                        cv = std / abs(mean)
                        # Add to risk score (higher CV = higher risk)
                        risk_score += min(cv, 1.0)  # Cap at 1.0
                        total_metrics += 1
        
        # Calculate final risk percentage
        if total_metrics > 0:
            risk_percentage = (risk_score / total_metrics) * 100
            # Cap at 100%
            risk_percentage = min(risk_percentage, 100)
        else:
            risk_percentage = 0
        
        return risk_percentage
    
    except Exception as e:
        st.warning(f"Error calculating risk score: {str(e)}")
        return 0

# ===== GEMINI API ANALYSIS =====
def generate_financial_analysis(df, detected_metrics, company_info):
    """Generate comprehensive financial analysis using Gemini API"""
    # Prepare data for analysis
    try:
        data_description = df.to_string(max_rows=100)  # Limit rows to avoid token limits
    except Exception as e:
        st.error(f"Error formatting data: {str(e)}")
        data_description = df.head(50).to_string()  # Fallback to just showing the head
    
    # Calculate risk percentage
    risk_percentage = calculate_simplified_risk(df, detected_metrics)
    
    # Create a more targeted prompt based on detected metrics
    metric_prompts = []
    
    if 'asset' in detected_metrics:
        metric_prompts.append("- Detailed analysis of asset valuation trends and significant changes")
    
    if 'nav' in detected_metrics:
        metric_prompts.append("- Analysis of Net Asset Value (NAV) performance and growth patterns")
    
    if 'profit_loss' in detected_metrics:
        metric_prompts.append("- Profit and Loss analysis with focus on key profitability drivers")
    
    if 'cash_flow' in detected_metrics:
        metric_prompts.append("- Cash flow analysis with emphasis on liquidity and operational efficiency")
    
    if 'income' in detected_metrics:
        metric_prompts.append("- Income trend analysis and revenue stream evaluation")
    
    if 'expenses' in detected_metrics:
        metric_prompts.append("- Expense breakdown and cost management assessment")
    
    # Build the prompt
    prompt = f"""
    Analyze this financial data for a loan proposal:
    
    Blockchain Address: {company_info.get('blockchain_address', 'N/A')}
    Name: {company_info.get('name', 'N/A')}
    Loan Amount: {company_info.get('loan_amount', 0.0)} ETH
    Proposal Title: {company_info.get('proposal_title', 'N/A')}
    Company Type: {company_info.get('type', 'N/A')}
    Company Description: {company_info.get('description', 'N/A')}
    
    Financial Data:
    {data_description}
    
    Please provide a concise financial analysis including:
    
    1. Executive summary of overall financial health and performance
    2. Key financial metrics and trends
    3. Risk assessment (current risk score: {risk_percentage:.1f}%)
    4. Brief recommendations based on the financial data
    5. Assessment of the loan request based on the financial data
    
    Format your analysis in clear sections with headers. Use professional financial analysis language.
    Focus on identifying patterns, anomalies, and significant changes in the data.
    """
    
    try:
        # Generate content with Gemini
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Add more detailed error handling
        st.info("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        
        if hasattr(response, 'text'):
            return response.text, risk_percentage
        else:
            st.error("Unexpected response format from Gemini API")
            # Try to get response contents through alternative means
            return str(response), risk_percentage
            
    except Exception as e:
        st.error(f"Error generating analysis: {str(e)}")
        import traceback
        st.sidebar.code(traceback.format_exc())
        return f"Analysis generation failed. Error: {str(e)}", risk_percentage

# ===== REPORT GENERATION =====
def create_financial_report(analysis, df, risk_percentage, company_info):
    """Create comprehensive financial report with analysis and visualizations"""
    current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    period = f"{df.columns[1]} to {df.columns[-1]}" if len(df.columns) > 1 else "N/A"
    
    # Create plain text report
    text_report = f"""FINANCIAL ANALYSIS REPORT
Generated on: {current_date}
Blockchain Address: {company_info.get('blockchain_address', 'N/A')}
Name: {company_info.get('name', 'N/A')}
Loan Amount: {company_info.get('loan_amount', 0.0)} ETH
Proposal Title: {company_info.get('proposal_title', 'N/A')}
Company Type: {company_info.get('type', 'N/A')}
Period analyzed: {period}
Risk Score: {risk_percentage:.1f}%

{analysis}

--- End of Report ---
"""
    
    # Create HTML report with structured sections
    report_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Financial Analysis Report - {company_info.get('name', 'Company')}</title>
        <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #333; line-height: 1.6; }}
            .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}
            header {{ background-color: #1E3A8A; color: white; padding: 20px; margin-bottom: 30px; }}
            h1 {{ margin: 0; font-size: 28px; }}
            h2 {{ color: #1E3A8A; margin-top: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; }}
            h3 {{ color: #2563EB; }}
            .meta-info {{ background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin-bottom: 30px; }}
            .analysis-section {{ background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 30px; }}
            .risk-score {{ font-size: 24px; font-weight: bold; color: {'#EF4444' if risk_percentage > 70 else ('#F59E0B' if risk_percentage > 30 else '#10B981')}; }}
            .footer {{ margin-top: 50px; border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 0.9em; color: #6B7280; }}
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <h1>Financial Analysis Report - {company_info.get('name', 'Company')}</h1>
            </div>
        </header>
        
        <div class="container">
            <div class="meta-info">
                <p><strong>Generated on:</strong> {current_date}</p>
                <p><strong>Blockchain Address:</strong> {company_info.get('blockchain_address', 'N/A')}</p>
                <p><strong>Name:</strong> {company_info.get('name', 'N/A')}</p>
                <p><strong>Loan Amount:</strong> {company_info.get('loan_amount', 0.0)} ETH</p>
                <p><strong>Proposal Title:</strong> {company_info.get('proposal_title', 'N/A')}</p>
                <p><strong>Company Type:</strong> {company_info.get('type', 'N/A')}</p>
                <p><strong>Period analyzed:</strong> {period}</p>
                <p><strong>Risk Score:</strong> <span class="risk-score">{risk_percentage:.1f}%</span></p>
            </div>
            
            <div class="analysis-section">
                <h2>Financial Analysis</h2>
                <div>
                    {analysis.replace('\n', '<br>')}
                </div>
            </div>
            
            <div class="footer">
                <p>This report was generated automatically based on financial data analysis using AI technology.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return text_report, report_html

# ===== MAIN APPLICATION =====
def main():
    st.set_page_config(page_title="Financial Data Analyzer", layout="wide")
    
    st.title("Financial Data Analysis Dashboard")
    st.write("Upload your financial data or connect to Google Sheets for real-time analysis")
    
    # Company Information Form
    st.header("Company Information")
    company_info = {}
    
    # New input fields for blockchain address, loan amount, and proposal title
    company_info['blockchain_address'] = st.text_input("Blockchain Address:")
    company_info['name'] = st.text_input("Name:")
    company_info['loan_amount'] = st.number_input("Loan Amount (ETH):", min_value=0.0, step=0.01)
    company_info['proposal_title'] = st.text_input("Title for the Proposal:")
    
    # Add validation for required fields
    if not company_info['name']:
        st.warning("Please enter a name for the company")
    
    if not company_info['proposal_title']:
        st.warning("Please enter a title for the proposal")
    
    col1, col2 = st.columns(2)
    with col1:
        company_info['type'] = st.text_input("Company Type (e.g., Technology, Finance, Healthcare):")
    with col2:
        company_info['description'] = st.text_area("Company Description:", height=100)
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("Data Source Configuration")
        data_source = st.radio("Choose data source:", ["Upload CSV", "Google Sheets (Real-time)"])
        
        # No need to input Gemini API key as it's hardcoded now
        st.info("Gemini API integration is pre-configured")
    
    # Main application flow
    if data_source == "Upload CSV":
        uploaded_file = st.file_uploader("Upload your financial CSV file", type=["csv"])
        
        if uploaded_file is not None:
            try:
                # Read and process the data
                df = pd.read_csv(uploaded_file, header=1)
                df.columns = ['Category' if i == 0 else col for i, col in enumerate(df.columns)]
                df = prepare_financial_data(df)
                
                # Process and analyze data
                process_financial_data(df, company_info)
                
            except Exception as e:
                st.error(f"Error processing CSV: {str(e)}")
    
    else:  # Google Sheets Real-time
        st.header("Google Sheets Connection")
        credentials_file = st.file_uploader("Upload Google Service Account JSON", type=["json"])
        col1, col2 = st.columns(2)
        with col1:
            spreadsheet_name = st.text_input("Google Sheet Name:")
        with col2:
            worksheet_name = st.text_input("Worksheet Name:", "Sheet1")
        
        if credentials_file and spreadsheet_name:
            # Save credentials temporarily
            with open("temp_creds.json", "wb") as f:
                f.write(credentials_file.getbuffer())
            
            try:
                # Set up connection
                client = setup_gsheets_connection("temp_creds.json")
                
                # Get data
                with st.spinner("Fetching data from Google Sheets..."):
                    df = get_realtime_data(client, spreadsheet_name, worksheet_name)
                
                if df is not None:
                    df = prepare_financial_data(df)
                    st.success("Data successfully retrieved from Google Sheets!")
                    
                    # Process and analyze data
                    process_financial_data(df, company_info)
                    
                else:
                    st.error("Failed to retrieve data from Google Sheets. Please check your sheet structure.")
            
            except Exception as e:
                st.error(f"Error connecting to Google Sheets: {str(e)}")
            
            # Clean up temp file
            if os.path.exists("temp_creds.json"):
                os.remove("temp_creds.json")

def process_financial_data(df, company_info):
    """Process financial data and generate analysis and reports"""
    # Show data preview
    st.subheader("Data Preview")
    st.dataframe(df.head())
    
    st.sidebar.write("Processing DataFrame with structure:")
    st.sidebar.write(f"Columns: {list(df.columns)}")
    st.sidebar.write(f"Shape: {df.shape}")
    
    # Check if 'Category' column exists, if not, use the first column as Category
    if 'Category' not in df.columns and not df.empty:
        st.warning("No 'Category' column found. Using first column as Category.")
        df = df.rename(columns={df.columns[0]: 'Category'})
    
    # Scan columns to identify financial metrics
    with st.spinner("Scanning financial data structure..."):
        detected_metrics = scan_financial_columns(df)
        
        st.subheader("Detected Financial Metrics")
        for metric_type, categories in detected_metrics.items():
            st.write(f"**{metric_type.replace('_', ' ').title()}**: {', '.join(categories)}")
    
    # Calculate simplified risk score
    with st.spinner("Calculating risk score..."):
        risk_percentage = calculate_simplified_risk(df, detected_metrics)
        
        st.subheader("Risk Assessment")
        st.metric("Overall Risk Score", f"{risk_percentage:.1f}%")
        
        # Display risk level
        if risk_percentage > 70:
            st.error("High Risk")
        elif risk_percentage > 30:
            st.warning("Medium Risk")
        else:
            st.success("Low Risk")
    
    # Generate analysis
    if st.button("Generate Financial Analysis"):
        # Validate required fields before proceeding
        if not company_info.get('name'):
            st.error("Please enter a name for the company before generating analysis")
            return
            
        if not company_info.get('proposal_title'):
            st.error("Please enter a title for the proposal before generating analysis")
            return
            
        with st.spinner("Analyzing financial data with Gemini AI..."):
            # Add progress indicators
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            status_text.text("Preparing data for analysis...")
            progress_bar.progress(25)
            time.sleep(0.5)  # Just to visualize the progress
            
            status_text.text("Sending request to Gemini API...")
            progress_bar.progress(50)
            
            # Run the analysis
            analysis, risk_percentage = generate_financial_analysis(df, detected_metrics, company_info)
            
            status_text.text("Generating reports...")
            progress_bar.progress(75)
            
            # Create reports
            text_report, html_report = create_financial_report(analysis, df, risk_percentage, company_info)
            
            # Debug information to check company_info values
            st.sidebar.write("Debug - Company Info before saving:", company_info)
            
            # Save to MongoDB
            status_text.text("Saving to database...")
            save_analysis_to_mongodb(company_info, analysis, risk_percentage, df)
            
            progress_bar.progress(100)
            status_text.text("Analysis complete!")
            time.sleep(0.5)
            status_text.empty()
            progress_bar.empty()
            
            # Display analysis
            st.subheader("Financial Analysis")
            st.markdown(analysis)
            
            # Provide download options
            st.subheader("Download Reports")
            col1, col2 = st.columns(2)
            
            with col1:
                st.download_button(
                    label="Download Text Report",
                    data=text_report,
                    file_name=f"financial_analysis_{datetime.now().strftime('%Y%m%d_%H%M')}.txt",
                    mime="text/plain"
                )
            
            with col2:
                st.download_button(
                    label="Download HTML Report",
                    data=html_report,
                    file_name=f"financial_analysis_{datetime.now().strftime('%Y%m%d_%H%M')}.html",
                    mime="text/html"
                )

if __name__ == "__main__":
    main()