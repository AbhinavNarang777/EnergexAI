# EnergexAI
A comprehensive AI-powered project using FastAPI and Next.js

## Initializing and Setting Up the Project

To get started with EnergexAI, follow these steps:

### Step 1: Clone the Repository

Clone the EnergexAI repository from GitHub using the following command:
bash
git clone https://github.com/your-username/EnergexAI.git

### Step 2: Navigate to the project directory and initialize the project using the following commands:

#### Backend
Clone the EnergexAI repository from GitHub using the following command:
bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt


#### Frontend
Clone the EnergexAI repository from GitHub using the following command:
bash
cd frontend
npm install


### Step 3: Upload OpenAI Key
Upload your OpenAI API key to a file named openai_key.txt in the backend directory.
bash
OPENAI_API_KEY = ""

Replace this with the original API Key.

### Step 4: Run the FastAPI Server
Run the FastAPI server using the following command:
bash
uvicorn main:app --host 0.0.0.0 --port 8000

This will start the FastAPI server on http://localhost:8000.

### Step 5: Run the Next.js Server
Run the Next.js server using the following command:
bash
npm run dev

This will start the Next.js server on http://localhost:3000.


#### Project Structure
The EnergexAI project consists of two main folders:

#### backend: Contains the FastAPI API code written in Python.
#### frontend: Contains the Next.js frontend code.