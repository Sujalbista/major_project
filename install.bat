@echo off
:: Installing client dependencies
echo Installing client dependencies...
cd client
npm install

:: Installing server dependencies (if you have a backend)
echo Installing server dependencies...
cd ..\server
npm install
python -m venv venv  # Create a new virtual environment
source venv/bin/activate  # (Mac/Linux) Activate it
venv\Scripts\activate  # (Windows) Activate it
pip install -r requirements.txt  # Install dependencies
:: Go back to the client folder
cd ..\client

:: Start the client (React with Vite or Create React App)
echo Starting the client...
start npm run dev

:: Start the server (if applicable)
cd ..\server
echo Starting the server...
start npm start

echo Project is now running. Press any key to close the window...
pause

