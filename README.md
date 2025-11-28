Plant Leaf Disease Classification Web App
Project Description

This web application classifies plant leaf diseases from images using deep learning. The system helps farmers identify diseases early and provides actionable insights such as causes, recommended fertilizers, and solutions for effective crop management.

Key Features

Classifies multiple plant leaf diseases with high accuracy using EfficientNet.

Provides disease causes and solutions for better crop care.

Real-time predictions through a user-friendly web interface.

Frontend built with React, integrated with a FastAPI backend.

Technologies Used

Frontend: React.js, HTML, CSS

Backend: Python, FastAPI

Deep Learning: EfficientNet, OpenCV

Other Tools: TensorFlow / PyTorch (whichever you used), NumPy, Pandas

Installation / Setup Instructions
1. Clone the repository
git clone https://github.com/Khadarbeesk/Leaf-Disease-Classification.git
cd Leaf-Disease-Classification

2. Set up Python environment

Create a virtual environment (optional but recommended):

python -m venv venv


Activate the environment:

Windows:

venv\Scripts\activate


Linux / Mac:

source venv/bin/activate

3. Install required Python packages
pip install -r requirements.txt

4. Start the FastAPI backend
uvicorn backend:app --reload


The backend will run on http://127.0.0.1:8000 by default.

5. Start the React frontend
cd frontend
npm install
npm start


The frontend will run on http://localhost:3000. Open it in your browser.

Usage Instructions

Open the web app in your browser.

Upload an image of a plant leaf.

The system predicts the disease and provides:

Disease name

Causes

Recommended fertilizers

Suggested solutions

6. Using the application

Open the frontend in a browser.

Upload a leaf image.

The app will predict the disease and display:

Disease name

Causes

Recommended fertilizers

Suggested solutions
