import os
import openai
from fastapi import FastAPI, Request
from utilities.logging import CustomLog
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()


app = FastAPI(title=f"Energex-AI")
openai.api_key = os.environ.get("OPENAI_API_KEY")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    log = CustomLog(request)
    # log.print_log("START")

    start_time = datetime.now()
    response = await call_next(request)
    end_time = datetime.now()
    elapsed_time = (end_time - start_time).total_seconds()

    # log.print_log("END", level="info", elapsed_time=elapsed_time)
    return response

from fastapi.middleware.cors import CORSMiddleware

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers for the project
from routers.analytics import time_series
from routers.chat import openai_chat


app.include_router(time_series.router)
app.include_router(openai_chat.router)