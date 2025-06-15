from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from mongoengine import connect
from app.config import Config
from app.routes import auth_bp, recommendations_bp, search_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize JWT and CORS
    JWTManager(app)
    CORS(app, origins=Config.CORS_ORIGINS, methods=Config.CORS_METHODS, allow_headers=Config.CORS_HEADERS)

    # Connect to MongoDB using mongoengine
    connect(host=Config.MONGODB_URI)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    app.register_blueprint(search_bp, url_prefix='/api/search')

    return app
