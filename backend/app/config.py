import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')

    # JWT settings
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-jwt-secret-key-here')
    JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
    JWT_EXPIRATION_DELTA = timedelta(days=7)

    # MongoDB URI for mongoengine
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ai_edu_guide')

    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    CORS_HEADERS = ['Content-Type', 'Authorization']

    # Optional: Other API keys
    SERP_API_KEY = os.getenv('SERP_API_KEY')
