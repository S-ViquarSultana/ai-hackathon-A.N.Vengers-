from flask import Blueprint, request, jsonify

test_bp = Blueprint('test_bp', __name__)

@test_bp.route('/api/test/submit', methods=['POST'])
def submit_test():
    data = request.get_json()
    # Save test score logic here
    return jsonify({"message": "Score submitted"}), 200
