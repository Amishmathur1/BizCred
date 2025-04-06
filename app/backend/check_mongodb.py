from pymongo import MongoClient
import json
from datetime import datetime

def connect_to_mongodb():
    """Connect to MongoDB database"""
    try:
        # Connect to local MongoDB instance
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        db = client["financial_analysis"]
        print("Successfully connected to MongoDB!")
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        print("Please ensure MongoDB is running locally on port 27017")
        return None

def main():
    db = connect_to_mongodb()
    if db is None:
        print("Failed to connect to MongoDB")
        return
    
    # Check if the collection exists
    collections = db.list_collection_names()
    print(f"Collections in database: {collections}")
    
    # Get all proposals from the database
    proposals = list(db.analyses.find())
    print(f"Number of proposals: {len(proposals)}")
    
    # Print each proposal
    for i, proposal in enumerate(proposals):
        print(f"\nProposal {i+1}:")
        # Convert ObjectId to string for printing
        proposal['_id'] = str(proposal['_id'])
        print(json.dumps(proposal, indent=2, default=str))

if __name__ == "__main__":
    main() 