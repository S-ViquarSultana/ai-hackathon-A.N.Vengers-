# app/models/recommendation.py
from mongoengine import Document, StringField, ReferenceField, ListField, DateTimeField
from datetime import datetime


class Recommendation(Document):
    user = StringField(required=True)  # You can also use ReferenceField(User) if needed
    title = StringField()
    url = StringField()
    description = StringField()
    tags = ListField(StringField())
    category = StringField()
    created_at = DateTimeField(default=datetime.utcnow)