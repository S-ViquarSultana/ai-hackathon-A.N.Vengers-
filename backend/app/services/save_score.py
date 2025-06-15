from app.models.score import Score
from app.utils.db import connect_db

def save_score(user_id, domain, scores):
    connect_db()
    score = Score(user_id=user_id, domain=domain, skill_scores=scores)
    score.save()
    return {"message": "Score saved successfully"}
