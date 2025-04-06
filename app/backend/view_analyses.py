import streamlit as st
import pymongo
from pymongo import MongoClient
import pandas as pd
import plotly.express as px
import urllib.parse
import os

# Set the page configuration with a different port
st.set_page_config(page_title="Financial Analysis Dashboard", layout="wide")

# Add a function to set the port
def set_streamlit_port():
    os.environ['STREAMLIT_SERVER_PORT'] = '8503'
    return 8503

# Call the function to set the port
set_streamlit_port()

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

# Function to fetch all analyses from MongoDB
def fetch_all_analyses():
    """Fetch all analyses from MongoDB"""
    db = connect_to_mongodb()
    if db is None:
        return []
    
    analyses = list(db.analyses.find())
    return analyses

# Function to fetch a specific analysis by ID
def fetch_analysis_by_id(analysis_id):
    """Fetch a specific analysis by ID"""
    db = connect_to_mongodb()
    if db is None:
        return None
    
    analysis = db.analyses.find_one({"_id": analysis_id})
    return analysis

# Function to create bar charts for financial metrics
def create_financial_charts(metrics):
    """Create bar charts for financial metrics"""
    charts = {}
    
    # Create a chart for each metric
    for metric_name, values in metrics.items():
        if values:
            # Create a DataFrame for the metric
            df = pd.DataFrame({
                "Index": range(len(values)),
                "Value": values,
                "Metric": [metric_name.replace('_', ' ').title()] * len(values)
            })
            
            # Create a bar chart
            title = f"{metric_name.replace('_', ' ').title()} Metrics"
            fig = px.bar(
                df, 
                x="Index", 
                y="Value", 
                title=title,
                labels={"Value": "Amount", "Index": "Data Point"},
                color_discrete_sequence=['#1f77b4' if metric_name == 'nav' else 
                                        '#ff7f0e' if metric_name == 'profit_loss' else 
                                        '#2ca02c']
            )
            
            # Update the layout
            fig.update_layout(
                title_font_size=18,
                xaxis_title_font_size=14,
                yaxis_title_font_size=14
            )
            
            charts[metric_name] = fig
    
    return charts

def main():
    # Set up the app header
    st.title("Financial Analysis Dashboard")
    st.write("View financial analyses stored in MongoDB")
    
    # Sidebar configuration
    st.sidebar.title("Navigation")
    
    # Fetch all analyses from MongoDB
    analyses = fetch_all_analyses()
    
    if not analyses:
        st.warning("No analyses found in the database.")
        st.info("Please ensure that you have analyses stored in the MongoDB database.")
        return
    
    # Create a list of companies for selection
    company_options = [f"{a.get('name', 'Unnamed')} - {a.get('proposal_title', 'No Title')}" for a in analyses]
    
    # Check if a company parameter is in the URL
    query_params = st.experimental_get_query_params()
    company_param = query_params.get("company", [None])[0]
    
    # If a company parameter is provided, find the matching index
    selected_company_index = 0
    if company_param:
        # Decode the company name
        company_name = urllib.parse.unquote(company_param)
        # Find the index of the company in the options
        for i, option in enumerate(company_options):
            if company_name in option:
                selected_company_index = i
                break
    
    # Create the selectbox with the pre-selected company
    selected_company_index = st.sidebar.selectbox(
        "Select Company", 
        range(len(company_options)), 
        index=selected_company_index,
        format_func=lambda x: company_options[x]
    )
    
    # Get the selected analysis
    selected_analysis = analyses[selected_company_index]
    
    # Display company information
    st.header("Company Information")
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Name:** {selected_analysis.get('name', 'N/A')}")
        st.write(f"**Blockchain Address:** {selected_analysis.get('blockchain_address', 'N/A')}")
        st.write(f"**Loan Amount:** {selected_analysis.get('loan_amount', 'N/A')} ETH")
    
    with col2:
        st.write(f"**Proposal Title:** {selected_analysis.get('proposal_title', 'N/A')}")
        st.write(f"**Risk Percentage:** {selected_analysis.get('risk_percentage', 'N/A')}%")
        if 'timestamp' in selected_analysis:
            st.write(f"**Analysis Date:** {selected_analysis['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Display company description if available
    if 'company_description' in selected_analysis and selected_analysis['company_description']:
        st.subheader("Company Description")
        st.write(selected_analysis['company_description'])
    
    # Display the AI analysis
    if 'gemini_analysis' in selected_analysis and selected_analysis['gemini_analysis']:
        st.header("AI Analysis")
        st.markdown(selected_analysis['gemini_analysis'])
    
    # Display financial metrics charts
    st.header("Financial Metrics")
    
    if 'financial_metrics' in selected_analysis:
        metrics = selected_analysis['financial_metrics']
        charts = create_financial_charts(metrics)
        
        if not charts:
            st.info("No financial metrics data available for this analysis.")
        else:
            # Display charts in 3 columns if possible
            if len(charts) >= 3:
                col1, col2, col3 = st.columns(3)
                
                if 'nav' in charts:
                    with col1:
                        st.plotly_chart(charts['nav'], use_container_width=True)
                
                if 'profit_loss' in charts:
                    with col2:
                        st.plotly_chart(charts['profit_loss'], use_container_width=True)
                
                if 'cash_flow' in charts:
                    with col3:
                        st.plotly_chart(charts['cash_flow'], use_container_width=True)
            else:
                # Display available charts
                for chart_name, chart in charts.items():
                    st.plotly_chart(chart, use_container_width=True)
    else:
        st.info("No financial metrics data available for this analysis.")
    
    # Export options
    st.header("Export Options")
    export_col1, export_col2 = st.columns(2)
    
    with export_col1:
        if st.button("Export Analysis as CSV"):
            # Convert analysis to DataFrame
            df = pd.DataFrame([{k: v for k, v in selected_analysis.items() if k != '_id' and k != 'financial_metrics' and k != 'timestamp'}])
            
            # Convert to CSV
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"{selected_analysis.get('name', 'analysis')}_export.csv",
                mime="text/csv"
            )
    
    with export_col2:
        if st.button("Export Financial Metrics as CSV"):
            # Convert metrics to DataFrame
            if 'financial_metrics' in selected_analysis:
                metrics = selected_analysis['financial_metrics']
                max_len = max([len(v) for v in metrics.values()] or [0])
                
                metrics_df = pd.DataFrame({
                    k: v + [None] * (max_len - len(v)) for k, v in metrics.items()
                })
                
                # Convert to CSV
                csv = metrics_df.to_csv(index=False)
                st.download_button(
                    label="Download Metrics CSV",
                    data=csv,
                    file_name=f"{selected_analysis.get('name', 'analysis')}_metrics.csv",
                    mime="text/csv"
                )

if __name__ == "__main__":
    main()