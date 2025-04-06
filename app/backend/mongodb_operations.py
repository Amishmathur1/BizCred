import pymongo
from pymongo import MongoClient
import streamlit as st
import uuid
from datetime import datetime
import pandas as pd

# MongoDB connection
def connect_to_mongodb():
    """Connect to MongoDB database"""
    try:
        # Connect to local MongoDB instance
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        db = client["financial_analysis"]
        st.success("Successfully connected to MongoDB!")
        return db
    except Exception as e:
        st.error(f"Error connecting to MongoDB: {str(e)}")
        st.warning("Please ensure MongoDB is running locally on port 27017")
        st.info("If you're using MongoDB Compass, you can verify the connection using: mongodb://localhost:27017")
        return None

# ===== FINANCIAL METRICS EXTRACTION =====
def extract_financial_metrics(df):
    """Extract specific financial metrics from the DataFrame as lists of values"""
    metrics = {
        'nav': [],
        'profit_loss': [],
        'cash_flow': []
    }
    
    # First, check if we have a Category column
    category_col = None
    for col in df.columns:
        if col.lower() == 'category':
            category_col = col
            break
    
    # If we have a Category column, look for the specific metrics in the rows
    if category_col is not None:
        # Define the keywords to look for in the Category column
        nav_keywords = ['nav', 'net asset value', 'net asset']
        profit_loss_keywords = ['profit', 'loss', 'profit / loss', 'profit/loss', 'total profit', 'net profit', 'realized profit']
        cash_flow_keywords = ['cash flow', 'net cash flow', 'net cash', 'cash flow from investment']
        
        # Iterate through the rows to find the matching categories
        for idx, row in df.iterrows():
            category = str(row[category_col]).lower()
            
            # Check for NAV
            if any(keyword in category for keyword in nav_keywords):
                # Get all numeric values from this row (excluding the Category column)
                numeric_cols = [col for col in df.columns if col != category_col]
                for col in numeric_cols:
                    try:
                        value = pd.to_numeric(row[col], errors='coerce')
                        if not pd.isna(value):
                            metrics['nav'].append(value)
                    except:
                        pass
            
            # Check for Profit/Loss
            elif any(keyword in category for keyword in profit_loss_keywords):
                numeric_cols = [col for col in df.columns if col != category_col]
                for col in numeric_cols:
                    try:
                        value = pd.to_numeric(row[col], errors='coerce')
                        if not pd.isna(value):
                            metrics['profit_loss'].append(value)
                    except:
                        pass
            
            # Check for Cash Flow
            elif any(keyword in category for keyword in cash_flow_keywords):
                numeric_cols = [col for col in df.columns if col != category_col]
                for col in numeric_cols:
                    try:
                        value = pd.to_numeric(row[col], errors='coerce')
                        if not pd.isna(value):
                            metrics['cash_flow'].append(value)
                    except:
                        pass
    
    # If we couldn't find the values using the Category column, try looking at column names
    if not any(metrics.values()):
        for col in df.columns:
            col_lower = col.lower()
            
            # Check for NAV
            if 'nav' in col_lower or 'net asset value' in col_lower:
                # Get all non-null values
                values = df[col].dropna()
                if not values.empty:
                    metrics['nav'] = values.tolist()
            
            # Check for Profit/Loss
            elif 'profit' in col_lower and 'loss' in col_lower:
                values = df[col].dropna()
                if not values.empty:
                    metrics['profit_loss'] = values.tolist()
            
            # Check for Cash Flow
            elif 'cash flow' in col_lower and 'investment' in col_lower:
                values = df[col].dropna()
                if not values.empty:
                    metrics['cash_flow'] = values.tolist()
    
    # If we still couldn't find the values, try to extract them from all rows
    if not any(metrics.values()):
        # Try to extract numeric values from all rows
        for col in df.columns:
            try:
                values = pd.to_numeric(df[col], errors='coerce').dropna().tolist()
                if values:
                    # Assign to the first empty metric
                    if not metrics['nav']:
                        metrics['nav'] = values
                    elif not metrics['profit_loss']:
                        metrics['profit_loss'] = values
                    elif not metrics['cash_flow']:
                        metrics['cash_flow'] = values
                    else:
                        break
            except:
                pass
    
    return metrics

# ===== MONGODB DATA STORAGE =====
def save_analysis_to_mongodb(company_info, analysis, risk_percentage, df):
    """Save the analysis results to MongoDB"""
    try:
        # Connect to MongoDB
        db = connect_to_mongodb()
        if db is None:
            st.warning("Skipping database save - MongoDB is not available")
            return False
        
        # Create a unique ID for this analysis
        analysis_id = str(uuid.uuid4())
        
        # Extract financial metrics using the dedicated function
        financial_metrics = extract_financial_metrics(df)
        
        # Debug information to check company_info values
        st.sidebar.write("Debug - Company Info:", company_info)
        
        # Ensure name and proposal_title are not empty
        name = company_info.get('name', '')
        proposal_title = company_info.get('proposal_title', '')
        
        # If name or proposal_title is empty, try to get them from other fields
        if not name and 'blockchain_address' in company_info:
            name = f"Company {company_info['blockchain_address'][:8]}..."
        
        if not proposal_title and 'name' in company_info:
            proposal_title = f"Proposal for {company_info['name']}"
        
        # Prepare data for storage in the requested order
        analysis_data = {
            "_id": analysis_id,
            "blockchain_address": company_info.get('blockchain_address', ''),
            "name": name,
            "loan_amount": company_info.get('loan_amount', 0.0),
            "proposal_title": proposal_title,
            "company_description": company_info.get('description', ''),
            "gemini_analysis": analysis,
            "financial_metrics": financial_metrics,
            "risk_percentage": risk_percentage,
            "timestamp": datetime.now()
        }
        
        # Debug information to check final data
        st.sidebar.write("Debug - Analysis Data:", {k: v for k, v in analysis_data.items() if k not in ['gemini_analysis', 'financial_metrics']})
        
        # Save to MongoDB
        result = db.analyses.insert_one(analysis_data)
        
        if result.inserted_id:
            st.success(f"Analysis saved to database with ID: {analysis_id}")
            return True
        else:
            st.warning("Failed to save analysis to database")
            return False
            
    except Exception as e:
        st.error(f"Error saving to MongoDB: {str(e)}")
        st.warning("Analysis was generated but could not be saved to database")
        return False 