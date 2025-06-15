# app/models/question.py
from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocumentField, EmbeddedDocument

class Question(Document):
    domain = StringField(required=True)
    difficulty_level = StringField(required=True)
    question = StringField(required=True)
    option_a = StringField(required=True)
    option_b = StringField(required=True)
    option_c = StringField(required=True)
    option_d = StringField(required=True)
    correct_answer = StringField(required=True)
    badge = StringField()