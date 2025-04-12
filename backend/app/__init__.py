from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from app.models import db
from app.routes import auth_bp, recommendations_bp, search_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    # Configure your DB URL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Or PostgreSQL, etc.
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    JWTManager(app)
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app 

