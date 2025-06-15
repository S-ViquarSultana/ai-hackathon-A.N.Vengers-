# app/utils/recommendations.py
import os
import json
import requests
from typing import List, Dict
from app.models.user import User
from app.models.recommendation import Recommendation
from datetime import datetime



SERP_API_KEY = os.getenv('SERP_API_KEY')
SERP_API_URL = os.getenv('SERP_API_URL', 'https://serpapi.com/search')


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


def store_recommendations(user_id: str, results: dict, category: str) -> None:
    """Store recommendations in the database."""
    category = category.lower()

    for result in results.get('organic_results', []):
        recommendation = Recommendation(
            user=user_id,
            title=result.get('title', ''),
            url=result.get('link', ''),
            description=result.get('snippet', ''),
            tags=[tag.strip() for tag in result.get('title', '').split()],
            category=category
        )
        try:
            recommendation.save()
        except Exception as e:
            print(f"Error saving recommendation: {str(e)}")


def get_user_recommendations(user_id: str) -> List[Dict]:
    """Retrieve the latest recommendations for the user."""
    user = User.objects(id=user_id).first()
    if not user:
        return []

    try:
        interests = json.loads(user.interests or "[]")
    except Exception:
        interests = []

    query = " ".join(interests) or "online tech courses"

    params = {
        "q": query,
        "engine": "google",
        "api_key": SERP_API_KEY,
    }

    try:
        response = requests.get(SERP_API_URL, params=params)
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
    except Exception as e:
        print(f"Error in get_user_recommendations: {str(e)}")
        return []


def update_recommendations(user_id: str, interests: List[str]) -> Dict[str, List[Dict]]:
    """Update recommendations based on user interests."""
    # Clear existing recommendations
    Recommendation.objects(user=user_id).delete()

    # Fetch and store new recommendations
    for interest in interests:
        store_recommendations(user_id, fetch_serpapi_results(f"{interest} online course"), 'course')
        store_recommendations(user_id, fetch_serpapi_results(f"{interest} internship"), 'internship')
        store_recommendations(user_id, fetch_serpapi_results(f"{interest} project github"), 'project')

    return {"recommendations": get_user_recommendations(user_id)}
