from flask import Blueprint, request, jsonify
from app.models.user import User
import os

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/user/create', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(**data)
    user.save()
    return jsonify({"message": "User created"}), 201
    
import requests
from flask import Blueprint, request, jsonify

update_bp = Blueprint('update_bp', __name__)

CLERK_SECRET_KEY = os.getenv('CLERK_SECRET_KEY') # Store this securely

@update_bp.route('/api/update-interests', methods=['POST'])
def update_interests():
    data = request.json
    user_id = data.get('userId')
    interests = data.get('interests', [])
    skills = data.get('skills', [])

    if not user_id:
        return jsonify({'success': False, 'message': 'Missing userId'}), 400

    try:
        response = requests.patch(
            f'https://api.clerk.com/v1/users/{user_id}',
            headers={
                'Authorization': f'Bearer {CLERK_SECRET_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'public_metadata': {
                    'interests': interests,
                    'skills': skills
                }
            }
        )
        if response.status_code == 200:
            return jsonify({'success': True, 'message': 'Metadata updated'})
        else:
            return jsonify({'success': False, 'message': response.text}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
