# app/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.auth import auth_required, create_token
from app.utils.recommendations import get_user_recommendations, update_recommendations
from app.models.question import Question
from app.utils.search import search_questions, get_all_domains, get_questions_by_domain
from app.services.auth import hybrid_auth_required  


# Create blueprints
auth_bp = Blueprint('auth', __name__)
recommendations_bp = Blueprint('recommendations', __name__)
search_bp = Blueprint('search', __name__)

# Auth routes
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    result = register_user(username, email, password)
    if result['success']:
        return jsonify(result), 201
    return jsonify(result), 400

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    result = authenticate_user(username, password)
    if result['success']:
        return jsonify(result), 200
    return jsonify(result), 401

# Recommendations routes
@recommendations_bp.route('/<int:user_id>', methods=['GET'])
@hybrid_auth_required
def get_recommendations(user_id):
    current_user_id = int(request.user['sub'])
    if current_user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    recommendations = get_user_recommendations(user_id)
    return jsonify({'success': True, 'data': recommendations}), 200

@recommendations_bp.route('/<int:user_id>/interests', methods=['POST'])
def update_interests(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    interests = data.get('interests', [])
    
    if not isinstance(interests, list):
        return jsonify({'success': False, 'message': 'Interests must be a list'}), 400
    
    # Update user interests
    result = update_user_interests(user_id, interests)
    if not result['success']:
        return jsonify(result), 400
    
    # Update recommendations
    recommendations = update_recommendations(user_id, interests)
    return jsonify({'success': True, 'data': recommendations}), 200
def search_questions(query):
    results = Question.objects(question__icontains=query)
    return [
        {
            "id": str(q.id),
            "question": q.question,
            "domain": q.domain,
            "difficulty": q.difficulty_level,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d
            },
            "badge": q.badge
        } for q in results
    ]

def get_all_domains():
    return Question.objects().distinct('domain')

def get_questions_by_domain(domain):
    results = Question.objects(domain=domain)
    return [
        {
            "id": str(q.id),
            "question": q.question,
            "difficulty": q.difficulty_level,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d
            },
            "badge": q.badge
        } for q in results
    ]