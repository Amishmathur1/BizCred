@echo off
echo Starting Flask API server...
start cmd /k "python api.py"
echo Starting Streamlit servers...
start cmd /k "streamlit run main.py"
start cmd /k "streamlit run view_analyses.py"
echo Servers started! You can now use the application. 