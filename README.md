## ForestGuard : Forest Monitoring System

ForestGuard is an integrated platform that uses AI + satellite imagery to detect deforestation events in real time, generate visual insights, and support sustainable forest management in Kenya.
This project was built for the HACKATHON (Track 2).

# Slides & Presentation

A full breakdown of the system, workflow, and demo can be found in the slides here:

f-guard-vite/slides/ForestGuard_Track2_WMH2025.pdf

# Overview

Deforestation in Kenya threatens biodiversity, local livelihoods, and climate resilience. Current monitoring methods rely on manual patrols or limited drone coverage, which are slow, expensive, and often reactive.

ForestGuard solves this by enabling continuous, automated forest monitoring using satellite imagery and AI.

# The platform provides:

Real-time deforestation alerts

Tree-level monitoring across large forest areas

Historical analytics (monthly)

A dashboard for forest rangers, researchers, and policymakers

Instant visibility on illegal logging hotspots

This system makes forest protection faster, data-driven, scalable, and proactive.

# How It Works
1️ AI Model (Satellite Analysis)

Processes satellite images

Detects tree cover changes

Flags potential illegal logging events

# Backend (FastAPI)

Serves the model’s processed results

Provides secure API endpoints:

/home dashboard — dashboard data

/alerts — recent deforestation alerts

/reports — yearly statistics

Connects to the AI model and database

# Frontend (React + Vite)

Displays real-time and historical forest analytics

charts

Alert feeds

Map-based visual insights

# Running the Project Locally
Clone the repo
git clone https://github.com/Munira12345/f-guard-vite.git


# Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev


frontend will run at:

 http://localhost:5173

# Backend Setup (FastAPI)
Step 1: Install Python dependencies
cd api
pip install -r requirements.txt

Step 2: Run the FastAPI server
uvicorn main:app --reload

The backend will run at:

 http://127.0.0.1:8000

# Frontend ↔ Backend Connection

Once both servers are running:

The frontend automatically fetches data from the backend endpoints.


#Tech Stack
Frontend, React, Vite, JavaScript, Custom CSS

Backend: FastAPI, Python, Uvicorn

AI / Analysis: Satellite image processing, Custom tree-cover change detection model

# Why ForestGuard Matters

Gives Kenya its first near real-time, AI-powered deforestation tracking system
Reduces response time to illegal logging
Supports climate action and forest conservation
Provides accurate insights for NGOs, KEFRI, KFS, researchers, and policymakers

Thank you

TEAM MEMBERS:
1.Munira Ngomo- Team Lead/ Frontend 
2.Daniel - Backend Developer 
3.Jeanne - Data Scientist 
4.Lorna  - Researcher/ Story Teller 
