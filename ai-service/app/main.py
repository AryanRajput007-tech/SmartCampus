import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes.match_routes import router as match_router
from app.routes.chat_routes import router as chat_router

load_dotenv()

app = FastAPI(
    title="SmartCampus AI Service",
    description="Python FastAPI service providing explainable TF-IDF job matching and Google Gemini placement assistance.",
    version="1.0.0"
)

# CORS configuration for Node backend & internal services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI routers
app.include_router(match_router)
app.include_router(chat_router)

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint confirming FastAPI service is active."""
    return {
        "status": "healthy",
        "service": "SmartCampus Python FastAPI AI Service",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY", "").strip())
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
