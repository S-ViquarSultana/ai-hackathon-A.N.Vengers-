import jwt
import os
from flask import request, jsonify
from functools import wraps
from app.models.user import User  # Update this to match your MongoDB User model
from datetime import datetime, timedelta 

JWT_SECRET = os.getenv("JWT_SECRET", "your_default_secret")
JWT_ALGORITHM = "HS256"

# --- Verify JWT
def verify_jwt(token):
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

# --- Decorator for protected routes
def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({'success': False, 'message': 'Missing or invalid token'}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded_token = verify_jwt(token)
            request.user = decoded_token

            # Optional: ensure user exists in DB
            email = decoded_token.get("email")
            if email:
                user = User.objects(email=email).first()
                if not user:
                    return jsonify({'success': False, 'message': 'User not found'}), 404

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 401

        return f(*args, **kwargs)
    return decorated

# -- Token generation --
def create_token(user):
    payload = {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def hybrid_auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            request.user = {'sub': user_id}
            return fn(*args, **kwargs)
        except Exception:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    return wrapper