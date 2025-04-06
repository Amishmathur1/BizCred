import subprocess
import os
import sys
import webbrowser
import time
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to track if the server is running
streamlit_process = None

# MongoDB connection
def connect_to_mongodb():
    """Connect to MongoDB database"""
    try:
        # Connect to local MongoDB instance
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        db = client["financial_analysis"]
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        return None

@app.route('/start-streamlit', methods=['GET'])
def start_streamlit():
    global streamlit_process
    
    # Check if the server is already running
    if streamlit_process is not None and streamlit_process.poll() is None:
        return jsonify({
            "status": "already_running",
            "message": "Streamlit server is already running"
        })
    
    try:
        # Get the absolute path to the main.py file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        main_py_path = os.path.join(current_dir, "main.py")
        
        # Start the Streamlit server as a subprocess
        streamlit_process = subprocess.Popen(
            [sys.executable, "-m", "streamlit", "run", main_py_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment for the server to start
        time.sleep(2)
        
        # Open the browser to the Streamlit app
        webbrowser.open("http://localhost:8501")
        
        return jsonify({
            "status": "success",
            "message": "Streamlit server started successfully",
            "url": "http://localhost:8501"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to start Streamlit server: {str(e)}"
        }), 500

@app.route('/start-view-analyses', methods=['GET'])
def start_view_analyses():
    global streamlit_process
    
    # Check if the server is already running
    if streamlit_process is not None and streamlit_process.poll() is None:
        return jsonify({
            "status": "already_running",
            "message": "Streamlit server is already running"
        })
    
    try:
        # Get the absolute path to the view_analyses.py file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        view_analyses_path = os.path.join(current_dir, "view_analyses.py")
        
        # Start the Streamlit server as a subprocess
        streamlit_process = subprocess.Popen(
            [sys.executable, "-m", "streamlit", "run", view_analyses_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment for the server to start
        time.sleep(2)
        
        # Open the browser to the Streamlit app
        webbrowser.open("http://localhost:8502")
        
        return jsonify({
            "status": "success",
            "message": "Streamlit server started successfully",
            "url": "http://localhost:8502"
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to start Streamlit server: {str(e)}"
        }), 500

@app.route('/stop-streamlit', methods=['GET'])
def stop_streamlit():
    global streamlit_process
    
    if streamlit_process is not None and streamlit_process.poll() is None:
        streamlit_process.terminate()
        streamlit_process = None
        return jsonify({
            "status": "success",
            "message": "Streamlit server stopped successfully"
        })
    else:
        return jsonify({
            "status": "not_running",
            "message": "Streamlit server is not running"
        })

# New endpoints for MongoDB data
@app.route('/api/proposals', methods=['GET'])
def get_proposals():
    try:
        db = connect_to_mongodb()
        if db is None:
            return jsonify({
                "status": "error",
                "message": "Failed to connect to MongoDB"
            }), 500
        
        # Get all proposals from the database
        proposals = list(db.analyses.find())
        
        # Process and format each proposal
        formatted_proposals = []
        for proposal in proposals:
            # Convert ObjectId to string for JSON serialization
            proposal['_id'] = str(proposal['_id'])
            
            # Ensure all required fields are present with default values
            formatted_proposal = {
                '_id': proposal['_id'],
                'proposal_title': proposal.get('proposal_title', 'Untitled Proposal'),
                'company_description': proposal.get('company_description', 'No description available'),
                'risk_percentage': float(proposal.get('risk_percentage', 0)),
                'loan_amount': float(proposal.get('loan_amount', 0)),
                'gemini_analysis': proposal.get('gemini_analysis', 'No analysis available')
            }
            
            # Add financial metrics if available
            if 'financial_metrics' in proposal:
                formatted_proposal['financial_metrics'] = {
                    'nav': proposal['financial_metrics'].get('nav', []),
                    'profit_loss': proposal['financial_metrics'].get('profit_loss', []),
                    'cash_flow': proposal['financial_metrics'].get('cash_flow', [])
                }
            
            # Convert datetime to string if present
            if 'timestamp' in proposal and isinstance(proposal['timestamp'], datetime.datetime):
                formatted_proposal['timestamp'] = proposal['timestamp'].isoformat()
            
            formatted_proposals.append(formatted_proposal)
        
        return jsonify({
            "status": "success",
            "proposals": formatted_proposals
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to fetch proposals: {str(e)}"
        }), 500

@app.route('/api/proposals/<proposal_id>', methods=['GET'])
def get_proposal(proposal_id):
    try:
        db = connect_to_mongodb()
        if db is None:
            return jsonify({
                "status": "error",
                "message": "Failed to connect to MongoDB"
            }), 500
        
        # Get the proposal by ID - handle both string and ObjectId
        try:
            # Try to convert to ObjectId if it's a valid ObjectId string
            from bson import ObjectId
            object_id = ObjectId(proposal_id)
            proposal = db.analyses.find_one({"_id": object_id})
        except:
            # If conversion fails, try to find by string ID
            proposal = db.analyses.find_one({"_id": proposal_id})
        
        if proposal is None:
            return jsonify({
                "status": "error",
                "message": "Proposal not found"
            }), 404
        
        # Convert ObjectId to string for JSON serialization
        proposal['_id'] = str(proposal['_id'])
        
        # Ensure all required fields are present with default values
        formatted_proposal = {
            '_id': proposal['_id'],
            'proposal_title': proposal.get('proposal_title', 'Untitled Proposal'),
            'company_description': proposal.get('company_description', 'No description available'),
            'risk_percentage': float(proposal.get('risk_percentage', 0)),
            'loan_amount': float(proposal.get('loan_amount', 0)),
            'gemini_analysis': proposal.get('gemini_analysis', 'No analysis available')
        }
        
        # Add financial metrics if available
        if 'financial_metrics' in proposal:
            formatted_proposal['financial_metrics'] = {
                'nav': proposal['financial_metrics'].get('nav', []),
                'profit_loss': proposal['financial_metrics'].get('profit_loss', []),
                'cash_flow': proposal['financial_metrics'].get('cash_flow', [])
            }
        
        # Convert datetime to string if present
        if 'timestamp' in proposal and isinstance(proposal['timestamp'], datetime.datetime):
            formatted_proposal['timestamp'] = proposal['timestamp'].isoformat()
        
        return jsonify({
            "status": "success",
            "proposal": formatted_proposal
        })
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to fetch proposal: {str(e)}"
        }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000) 