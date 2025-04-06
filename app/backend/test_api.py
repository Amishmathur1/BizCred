import requests
import json

def test_get_proposal(proposal_id):
    """Test the API endpoint for fetching a single proposal"""
    try:
        response = requests.get(f"http://localhost:5000/api/proposals/{proposal_id}")
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Test with a specific proposal ID
    proposal_id = "dcd99de0-e89d-4f23-814e-c2bc35da267a"
    test_get_proposal(proposal_id) 