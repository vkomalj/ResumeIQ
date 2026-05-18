import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from fastapi.staticfiles import StaticFiles

load_dotenv()  # ✅ MUST be first

from api import job, resume, user, pool
from db.db import Base, engine

# Base.metadata.drop_all(bind=engine)  # 👈 Disabled so database is persistent!

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Create and mount static uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Resume Analyzer API", "status": "running"}


app.include_router(resume.router)
app.include_router(job.router)
app.include_router(user.router)
app.include_router(pool.router, prefix="/pool")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
