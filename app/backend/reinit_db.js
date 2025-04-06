import { MongoClient } from 'mongodb';

async function reinitDatabase() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('financial_analysis');
    const collection = database.collection('analyses');

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample proposals
    const sampleProposals = [
      {
        proposal_title: "GreenEnergy Solutions Project",
        company_description: "Renewable energy company seeking funding for solar panel installation project",
        risk_percentage: 35.5,
        loan_amount: 120000,
        gemini_analysis: `# Financial Analysis of GreenEnergy Solutions Project

## Asset Valuation
- Current assets show moderate growth over the past 12 months
- Net Asset Value (NAV) has increased by 2% year-over-year
- Asset quality is acceptable with some volatility in valuations

## Cash Management
- Cash flow is mostly positive but shows some concerning patterns
- Working capital is adequate for current operations
- Moderate dependency on short-term financing

## Risk Assessment
- Overall risk score: 35.5% (Low Risk)
- Financial statements show some inconsistencies
- Professional communication in proposal
- Loan request is reasonable but on the higher end

## Recommendation
**CONDITIONAL APPROVAL** with the following conditions:
1. Implement stricter financial reporting requirements
2. Provide additional collateral to reduce risk exposure
3. Agree to quarterly financial reviews
4. Develop a more detailed repayment plan
5. Consider reducing the loan amount by 20%`,
        financial_metrics: {
          nav: [150000, 148000, 146000, 144000, 142000, 140000, 138000, 136000, 134000, 132000, 130000, 128000],
          profit_loss: [15000, 13000, 11000, 9000, 7000, 5000, 3000, 1000, -1000, -3000, -5000, -7000],
          cash_flow: [8000, 6000, 4000, 2000, 0, -2000, -4000, -6000, -8000, -10000, -12000, -14000]
        }
      },
      {
        proposal_title: "Amish Bahi's Loan Proposal",
        company_description: "Business expansion proposal for retail operations",
        risk_percentage: 82.8,
        loan_amount: 50000,
        gemini_analysis: `# Financial Analysis of Amish Bahi's Loan Proposal

## Asset Valuation
- Current assets show a declining trend over the past 12 months
- Net Asset Value (NAV) has decreased by 15% year-over-year
- Asset quality is questionable with high volatility in valuations

## Cash Management
- Cash flow is inconsistent with multiple negative months
- Working capital appears insufficient for current operations
- High dependency on short-term financing

## Risk Assessment
- Overall risk score: 82.8% (High Risk)
- Multiple red flags in financial statements
- Unprofessional communication in proposal
- Zero-value loan request is concerning

## Recommendation
**REJECT** this loan proposal due to:
1. High risk score exceeding acceptable threshold
2. Declining asset values
3. Inconsistent cash flow
4. Unprofessional business practices
5. Zero-value loan request indicating potential fraud`,
        financial_metrics: {
          nav: [100000, 95000, 92000, 90000, 88000, 85000, 82000, 80000, 78000, 75000, 72000, 70000],
          profit_loss: [10000, 8000, 6000, 4000, 2000, 0, -2000, -4000, -6000, -8000, -10000, -12000],
          cash_flow: [5000, 3000, 1000, -1000, -3000, -5000, -7000, -9000, -11000, -13000, -15000, -17000]
        }
      },
      {
        proposal_title: "TechStart Innovation Fund",
        company_description: "Early-stage technology startup seeking seed funding",
        risk_percentage: 65.2,
        loan_amount: 75000,
        gemini_analysis: `# Financial Analysis of TechStart Innovation Fund

## Asset Valuation
- Current assets show moderate growth potential
- Net Asset Value (NAV) has increased by 8% year-over-year
- Asset quality is good with some volatility in early stages

## Cash Management
- Cash flow is positive but shows expected startup fluctuations
- Working capital is adequate for current operations
- Moderate dependency on venture funding

## Risk Assessment
- Overall risk score: 65.2% (Medium Risk)
- Financial statements show promising growth
- Professional communication in proposal
- Reasonable loan request for seed funding

## Recommendation
**CONDITIONAL APPROVAL** with the following conditions:
1. Regular milestone-based funding releases
2. Quarterly progress reports
3. Clear exit strategy
4. Additional equity consideration
5. Technology validation requirements`,
        financial_metrics: {
          nav: [80000, 82000, 84000, 86000, 88000, 90000, 92000, 94000, 96000, 98000, 100000, 102000],
          profit_loss: [-5000, -3000, -1000, 1000, 3000, 5000, 7000, 9000, 11000, 13000, 15000, 17000],
          cash_flow: [-3000, -1000, 1000, 3000, 5000, 7000, 9000, 11000, 13000, 15000, 17000, 19000]
        }
      }
    ];

    const result = await collection.insertMany(sampleProposals);
    console.log(`Inserted ${result.insertedCount} sample proposals`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

reinitDatabase().catch(console.error); 