from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from pathlib import Path

# Load the correct .env file
dotenv_path = Path(".env.local") if Path(".env.local").exists() else Path(".env")
load_dotenv(dotenv_path)

from api.gemini.ask import handler
from api.proposals.send import router as proposals_router

app = FastAPI()

# Include proposals router
app.include_router(proposals_router)

@app.post("/api/gemini/ask")
async def ask_gemini(request: Request):
    data = await request.json()
    return handler(data)

@app.get("/")
async def root():
    return {"status": "Server running. Send POST to /api/gemini/ask"}
