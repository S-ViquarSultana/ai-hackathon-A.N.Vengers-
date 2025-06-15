from mongoengine import connect
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

def connect_db():
    db_uri = os.getenv("MONGODB_URI")
    db_name = "dashboard"  # same as your earlier JS code
    connect(db=db_name, host=db_uri)

def init_db():
    """Initialize the database with the Flask app context."""
    app = create_app()
    with app.app_context():
        db.create_all()

def add_sample_data():
    """Add sample data to the database for testing."""
    app = create_app()
    with app.app_context():
        from app.models import User, Recommendation, AssessmentQuestion
        import json
        from datetime import datetime

        # Add sample user
        user = User(
            username='testuser',
            email='test@example.com',
            password_hash='hashed_password_here',
            interests=json.dumps(['programming', 'web development'])
        )
        db.session.add(user)
        db.session.commit()

        # Add sample recommendations
        recommendations = [
            Recommendation(
                user_id=user.id,
                title='Introduction to Python',
                url='https://www.coursera.org/learn/python',
                description='Learn Python programming from scratch',
                tags=json.dumps(['python', 'programming']),
                category='course'
            ),
            Recommendation(
                user_id=user.id,
                title='Web Development Internship',
                url='https://www.example.com/internship',
                description='Summer internship for web developers',
                tags=json.dumps(['web development', 'internship']),
                category='internship'
            )
        ]
        db.session.add_all(recommendations)

        # Add sample assessment questions
        questions = [
            AssessmentQuestion(
                question='What is the difference between HTTP and HTTPS?',
                domain='web development',
                difficulty='medium'
            ),
            AssessmentQuestion(
                question='Explain the concept of object-oriented programming.',
                domain='programming',
                difficulty='easy'
            )
        ]
        db.session.add_all(questions)

        db.session.commit()

def store_recommendations(user_id: str, results: dict, category: str):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for result in results.get("organic_results", []):
            cursor.execute("""
                INSERT INTO recommendations (user_id, title, url, description, tags, category)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                result.get("title", "Unknown"),
                result.get("link", ""),
                result.get("snippet", ""),
                json.dumps([category]),  # Store tags as JSON string
                category
            ))
        conn.commit() 