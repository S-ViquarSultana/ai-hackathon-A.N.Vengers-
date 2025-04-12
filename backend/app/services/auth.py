import jwt, requests, os, json
from flask import request, jsonify
from functools import wraps
from app.models import User, db

SUPABASE_PROJECT_ID = os.getenv('SUPABASE_PROJECT_ID')
SUPABASE_JWKS_URL = f"https://{SUPABASE_PROJECT_ID}.supabase.co/auth/v1/keys"
JWKS = requests.get(SUPABASE_JWKS_URL).json()

def get_public_key(kid):
    for key in JWKS['keys']:
        if key['kid'] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)
    return None

def verify_supabase_jwt(token):
    unverified_header = jwt.get_unverified_header(token)
    public_key = get_public_key(unverified_header['kid'])
    if not public_key:
        raise Exception("Public key not found")
    return jwt.decode(
        token,
        public_key,
        algorithms=['RS256'],
        audience=os.getenv('SUPABASE_JWT_AUDIENCE', 'authenticated')
    )

def supabase_auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Missing or invalid token'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            decoded_token = verify_supabase_jwt(token)
            request.user = decoded_token
            
            # Sync user locally (backup plan)
            email = decoded_token.get('email')
            if email:
                user = User.query.filter_by(email=email).first()
                if not user:
                    username = email.split('@')[0]
                    new_user = User(username=username, email=email, interests=json.dumps([]))
                    db.session.add(new_user)
                    db.session.commit()
        except Exception as e:
            return jsonify({'success': False, 'message': f'Invalid token: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    return decorated
