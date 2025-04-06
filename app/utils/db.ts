import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection string
const uri = "mongodb://localhost:27017";
const dbName = "financial_analysis";

// Create a MongoDB client
const client = new MongoClient(uri);

// Connect to MongoDB
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Get the latest proposals from the database
export async function getLatestProposals(limit = 3) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proposals");
    
    // Find the latest proposals, sorted by _id in descending order
    const proposals = await collection
      .find({})
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();
    
    return proposals;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
}

// Get a specific proposal by ID
export async function getProposalById(id: string) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proposals");
    
    // Try to convert the ID to ObjectId
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch (e) {
      // If conversion fails, use the string ID
      query = { _id: id };
    }
    
    const proposal = await collection.findOne(query);
    return proposal;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    throw error;
  }
}

// Close the MongoDB connection
export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log("Closed MongoDB connection");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
} 