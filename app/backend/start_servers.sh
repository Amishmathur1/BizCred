#!/bin/bash
echo "Starting Flask API server..."
python api.py &
echo "Starting Streamlit servers..."
streamlit run main.py &
streamlit run view_analyses.py &
echo "Servers started! You can now use the application." 