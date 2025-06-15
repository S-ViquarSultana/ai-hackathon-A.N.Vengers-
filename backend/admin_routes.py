from flask import Blueprint, request, jsonify
from pymongo import MongoClient

admin_bp = Blueprint('admin_bp', __name__)

client = MongoClient("mongodb://localhost:27017")
db = client['course_recommendation']
users_col = db['users']

@admin_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    users = list(users_col.find({}, {'password': 0}))  # hide password if any
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@admin_bp.route('/admin/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    from bson import ObjectId
    result = users_col.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count == 1:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'User not found'})

@admin_bp.route('/admin/user/<user_id>', methods=['PATCH'])
def update_user(user_id):
    from bson import ObjectId
    data = request.json
    users_col.update_one({'_id': ObjectId(user_id)}, {'$set': data})
    return jsonify({'success': True, 'message': 'User updated'})
