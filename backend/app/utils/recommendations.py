import requests
import os
from typing import List, Dict
from app.models import Recommendation, db
import json

SERP_API_KEY = os.getenv('SERP_API_KEY')
SERP_API_URL = 'https://serpapi.com/search'

category = category.lower()


def fetch_serpapi_results(query: str) -> dict:
    """Fetch results from SERP API."""
    params = {
        'q': query,
        'api_key': SERP_API_KEY,
        'engine': 'google',
        'num': 10
    }
    
    try:
        response = requests.get(SERP_API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching from SERP API: {str(e)}")
        return {'organic_results': []}

def store_recommendations(user_id: int, results: dict, category: str) -> None:
    """Store recommendations in the database."""
    for result in results.get('organic_results', []):
        recommendation = Recommendation(
            user_id=user_id,
            title=result.get('title', ''),
            url=result.get('link', ''),
            description=result.get('snippet', ''),
            tags=json.dumps([tag.strip() for tag in result.get('title', '').split()]),
            category=category
        )
        db.session.add(recommendation)
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error storing recommendations: {str(e)}")
import requests
import os
from app.models import User

def get_user_recommendations(user_id):
    user = User.query.get(user_id)
    if not user:
        return []

    interests = []
    try:
        interests = json.loads(user.interests or "[]")
    except Exception:
        pass

    query = " ".join(interests) or "online tech courses"

    params = {
        "q": query,
        "engine": "google",
        "api_key": os.getenv("SERP_API_KEY"),
    }

    response = requests.get(os.getenv("SERP_API_URL"), params=params)

    if response.status_code != 200:
        return []

    results = response.json().get("organic_results", [])
    return [
        {
            "title": r.get("title"),
            "link": r.get("link"),
            "snippet": r.get("snippet")
        } for r in results[:5]
    ]


def update_recommendations(user_id: int, interests: List[str]) -> Dict[str, List[Dict]]:
    """Update recommendations based on user interests."""
    # Clear existing recommendations
    Recommendation.query.filter_by(user_id=user_id).delete()
    
    # Fetch and store new recommendations for each interest
    for interest in interests:
        # Courses
        course_results = fetch_serpapi_results(f"{interest} online course")
        store_recommendations(user_id, course_results, 'course')
        
        # Internships
        internship_results = fetch_serpapi_results(f"{interest} internship")
        store_recommendations(user_id, internship_results, 'internship')
        
        # Projects
        project_results = fetch_serpapi_results(f"{interest} project github")
        store_recommendations(user_id, project_results, 'project')
    
    return get_user_recommendations(user_id) 