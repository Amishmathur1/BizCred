import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = "mongodb://localhost:27017";
const dbName = "financial_analysis";

async function checkMongoDB() {
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully");
    
    // Get the database
    const db = client.db(dbName);
    
    // Check if the proposals collection exists
    const collections = await db.listCollections().toArray();
    const hasProposalsCollection = collections.some(collection => collection.name === 'proposals');
    
    if (hasProposalsCollection) {
      console.log("The 'proposals' collection exists");
      
      // Count the number of documents in the proposals collection
      const count = await db.collection('proposals').countDocuments();
      console.log(`There are ${count} documents in the 'proposals' collection`);
      
      // Get the latest 3 proposals
      const proposals = await db.collection('proposals')
        .find({})
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      
      console.log("\nLatest 3 proposals:");
      proposals.forEach((proposal, index) => {
        console.log(`\nProposal ${index + 1}:`);
        console.log(`ID: ${proposal._id}`);
        console.log(`Title: ${proposal.proposal_title}`);
        console.log(`Risk: ${proposal.risk_percentage}%`);
        console.log(`Loan Amount: ${proposal.loan_amount} ETH`);
        
        // Check if financial metrics exist
        if (proposal.financial_metrics) {
          console.log("Financial metrics:");
          console.log(`- NAV: ${proposal.financial_metrics.nav ? proposal.financial_metrics.nav.length : 0} data points`);
          console.log(`- Profit/Loss: ${proposal.financial_metrics.profit_loss ? proposal.financial_metrics.profit_loss.length : 0} data points`);
          console.log(`- Cash Flow: ${proposal.financial_metrics.cash_flow ? proposal.financial_metrics.cash_flow.length : 0} data points`);
        } else {
          console.log("No financial metrics found");
        }
        
        // Check if gemini_analysis exists
        if (proposal.gemini_analysis) {
          console.log("Gemini analysis exists");
        } else {
          console.log("No Gemini analysis found");
        }
      });
    } else {
      console.log("The 'proposals' collection does not exist");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("\nMongoDB connection closed");
  }
}

// Run the check
checkMongoDB(); 