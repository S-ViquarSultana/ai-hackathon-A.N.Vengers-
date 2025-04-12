from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.supabase_auth import supabase_auth_required
from app.utils.auth import register_user, authenticate_user, update_user_interests
from app.utils.recommendations import get_user_recommendations, update_recommendations
from app.utils.assessment import get_questions_by_domain, search_questions, get_all_domains

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

@recommendations_bp.route('/<int:user_id>/interests', methods=['PUT'])
@jwt_required()
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

# Search routes
@search_bp.route('/questions', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'success': False, 'message': 'Query parameter is required'}), 400
    
    questions = search_questions(query)
    return jsonify({'success': True, 'data': questions}), 200

@search_bp.route('/domains', methods=['GET'])
def get_domains():
    domains = get_all_domains()
    return jsonify({'success': True, 'data': domains}), 200

@search_bp.route('/questions/<domain>', methods=['GET'])
def get_domain_questions(domain):
    questions = get_questions_by_domain(domain)
    return jsonify({'success': True, 'data': questions}), 200 