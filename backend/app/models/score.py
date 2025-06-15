from mongoengine import Document, StringField, DictField, DateTimeField
from datetime import datetime

class Score(Document):
    user_id = StringField(required=True)
    domain = StringField(required=True)
    skill_scores = DictField()  # e.g., {"NLP": 80, "Vision": 60}
    submitted_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'scores'}
