import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from typing import List
import requests
import os
from app.config import Config

class QuestionSearch:
    def __init__(self):
        self.questions = self._load_questions()
        self.vectorizer = TfidfVectorizer()
        self.question_vectors = self.vectorizer.fit_transform(self.questions)
        self.neighbors = NearestNeighbors(n_neighbors=20, metric='cosine')
        self.neighbors.fit(self.question_vectors)
    
    def _load_questions(self) -> List[str]:
        try:
            data = pd.read_csv("database/examplee.csv", encoding="utf-8-sig")
            return data['question'].tolist()
        except UnicodeDecodeError:
            data = pd.read_csv("database/examplee.csv", encoding="ISO-8859-1")
            return data['question'].tolist()
        except Exception as e:
            print(f"Error loading questions: {e}")
            return []
    
    def search(self, query: str) -> List[str]:
        query_vector = self.vectorizer.transform([query])
        distances, indices = self.neighbors.kneighbors(query_vector)
        return [self.questions[i] for i in indices[0]]

