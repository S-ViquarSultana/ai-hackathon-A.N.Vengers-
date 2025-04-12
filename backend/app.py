from flask import Flask, request, jsonify, abort
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import json
import requests
import jwt
from dotenv import load_dotenv
from supabase import create_client, Client

# Load env variables
load_dotenv()

app = Flask(__name__)

# App configs
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Enable CORS
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(','),
        "methods": ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        "allow_headers": ['Content-Type', 'Authorization']
    }
})

# Init extensions
db = SQLAlchemy(app)
jwt_manager = JWTManager(app)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkenl0cnVyYm5ocHJ0ZHRtZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDY4MzYsImV4cCI6MjA1ODI4MjgzNn0.xPS-3Jbi5x71_TcdGLgK0mm5fEnrX52xLWFv3LC6uiY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    interests = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    tags = db.Column(db.String(500))
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AssessmentQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    domain = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# SerpAPI fetch helper
def fetch_serpapi_results(query: str) -> dict:
    params = {
        'q': query,
        'api_key': os.getenv('SERP_API_KEY'),
        'engine': 'google',
        'num': 10
    }
    try:
        response = requests.get('https://serpapi.com/search', params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching from SERP API: {str(e)}")
        return {'organic_results': []}

# Store recommendations
def store_recommendations(user_id: int, results: dict, category: str) -> None:
    for result in results.get('organic_results', [])[:6]:  # Limit to 6
        recommendation = Recommendation(
            user_id=user_id,
            title=result.get('title', ''),
            url=result.get('link', ''),
            description=result.get('snippet', ''),
            tags=json.dumps(result.get('title', '').split()),
            category=category
        )
        db.session.add(recommendation)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"DB commit failed: {str(e)}")

# Get recommendations by user
@app.route('/api/recommendations/<int:user_id>', methods=['GET'])
@jwt_required()
def get_recommendations(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    recommendations = Recommendation.query.filter_by(user_id=user_id).all()
    result = {
        'courses': [],
        'internships': [],
        'projects': []
    }
    
    for rec in recommendations:
        data = {
            'title': rec.title,
            'url': rec.url,
            'description': rec.description,
            'tags': json.loads(rec.tags or "[]")
        }
        result[f"{rec.category}s"].append(data)
    
    return jsonify({'success': True, 'data': result}), 200

# Update interests and fetch fresh recommendations
@app.route('/api/recommendations/<int:user_id>/interests', methods=['PUT'])
@jwt_required()
def update_interests(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    interests = data.get('interests', [])

    if not isinstance(interests, list):
        return jsonify({'success': False, 'message': 'Interests must be a list'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    try:
        user.interests = json.dumps(interests)
        db.session.commit()

        # Clear old
        Recommendation.query.filter_by(user_id=user_id).delete()
        db.session.commit()

        for interest in interests:
            store_recommendations(user_id, fetch_serpapi_results(f"{interest} online course"), 'course')
            store_recommendations(user_id, fetch_serpapi_results(f"{interest} internship"), 'internship')
            store_recommendations(user_id, fetch_serpapi_results(f"{interest} project github"), 'project')

        return jsonify({'success': True, 'message': 'Updated interests & fetched data'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

# Search courses directly
@app.route('/api/recommendations/search', methods=['GET'])
def search_recommendations():
    query = request.args.get('q', '').lower()

    all_courses = [
    {
        "title": "Full Stack Web Development with React", #done
        "url": "https://www.coursera.org/specializations/full-stack-react",
        "description": "Build complete web apps with React and Node.",
        "tags": ["web", "full stack", "react", "node"],
        "image": "https://static.vecteezy.com/system/resources/previews/001/879/576/original/designing-program-web-apps-on-monitor-screen-or-desktop-teamwork-in-developing-programming-debugging-development-process-illustration-for-website-homepage-header-landing-web-page-template-free-vector.jpg"
    },
    {
        "title": "Python for Everybody", #done
        "url": "https://www.coursera.org/specializations/python",
        "description": "Learn Python programming and data handling.",
        "tags": ["python", "beginner", "data", "programming"],
        "image": "https://getwallpapers.com/wallpaper/full/b/3/7/145190.jpg"
    },
    {
        "title": "The Web Developer Bootcamp 2023", #done
        "url": "https://www.udemy.com/course/the-web-developer-bootcamp/",
        "description": "HTML, CSS, JS, Node, and more from scratch.",
        "tags": ["web", "frontend", "backend", "javascript"],
        "image": "https://img-c.udemycdn.com/course/480x270/625204_436a_3.jpg"
    },
    {
        "title": "CS50: Introduction to Computer Science", #done
        "url": "https://cs50.harvard.edu/x/",
        "description": "Harvard's free intro to CS and programming.",
        "tags": ["cs", "beginner", "python", "c"],
        "image": "https://thumbs.dreamstime.com/b/python-programming-language-programing-workflow-abstract-algorithm-concept-virtual-screen-200850656.jpg"
    },
    {
        "title": "Java Programming and Software Engineering Fundamentals", #done
        "url": "https://www.coursera.org/specializations/java-programming",
        "description": "Learn Java, OOP, and software engineering.",
        "tags": ["java", "oop", "software"],
        "image": "https://getwallpapers.com/wallpaper/full/6/7/d/491909.jpg"
    },
    {
        "title": "Responsive Web Design Certification", #done
        "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
        "description": "HTML and CSS fundamentals with projects.",
        "tags": ["html", "css", "responsive", "frontend"],
        "image": "https://wallpaperbat.com/img/414476-is-responsive-web-design-enough-hint-no-search-engine-land.jpg"
    },
    {
        "title": "Machine Learning by Stanford University", #done
        "url": "https://www.coursera.org/learn/machine-learning",
        "description": "Andrew Ngs classic ML course with Octave/Matlab.",
        "tags": ["ml", "ai", "supervised", "unsupervised"],
        "image": "https://wallpaperaccess.com/full/1728956.jpg"
    },
    {
        "title": "Front-End Web Developer Nanodegree", #done
        "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011",
        "description": "Advanced HTML, CSS, JS, React.",
        "tags": ["frontend", "web", "html", "css", "js"],
        "image": "https://wallpaperbat.com/img/414476-is-responsive-web-design-enough-hint-no-search-engine-land.jpg"
    },
    {
        "title": "Introduction to Databases", #done
        "url": "https://www.edx.org/course/databases-5-sql",
        "description": "Learn SQL and relational databases.",
        "tags": ["sql", "database", "relational"],
        "image": "https://wallpapercave.com/wp/wp2765309.jpg"
    },
    {
        "title": "Programming for the Web with JavaScript", #done
        "url": "https://www.edx.org/course/programming-for-the-web-with-javascript",
        "description": "Dive into JS for dynamic websites.",
        "tags": ["javascript", "web", "frontend"],
        "image": "https://www.wallpaperflare.com/static/303/644/873/javascript-code-web-development-web-wallpaper.jpg"
    },
    {
        "title": "Introduction to DevOps", #done
        "url": "https://www.coursera.org/learn/introduction-devops",
        "description": "Fundamentals of DevOps culture & tools.",
        "tags": ["devops", "tools", "ci/cd"],
        "image": "https://wallpaperbat.com/img/873586-cloud-native-devops.jpg"
    },
    {
        "title": "Meta Front-End Developer Certificate", #done
        "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "description": "Beginner to job-ready front-end skills.",
        "tags": ["meta", "frontend", "html", "css", "react"],
        "image": "https://coingape.com/wp-content/uploads/2023/05/The-Latest-Innovations-That-Meta-Has-Come-Up-with-in-2022-1.jpg"
    },
    {
        "title": "Google IT Automation with Python", #done
        "url": "https://www.coursera.org/professional-certificates/google-it-automation",
        "description": "Learn automation using Python from Google.",
        "tags": ["google", "python", "automation"],
        "image": "https://cdn.analyticsvidhya.com/wp-content/uploads/2021/07/38787wallpaper.png"
    },
    {
        "title": "Docker Essentials", #done
        "url": "https://www.edx.org/course/docker-essentials",
        "description": "Get started with Docker containers.",
        "tags": ["docker", "containers", "devops"],
        "image": "https://wallpapercave.com/wp/wp8114786.jpg"
    },
    {
        "title": "Cloud Computing Basics (Cloud 101)", #done
        "url": "https://www.coursera.org/learn/cloud-computing-basics",
        "description": "Intro to cloud platforms and models.",
        "tags": ["cloud", "aws", "gcp", "azure"],
        "image": "https://wallpaperaccess.com/full/5095904.jpg"
    },
    {
        "title": "Introduction to Artificial Intelligence (AI)", #done
        "url": "https://www.coursera.org/learn/introduction-to-ai",
        "description": "What is AI, how does it work, and how is it used?",
        "tags": ["ai", "ml", "basics"],
        "image": "https://wallpaperaccess.com/full/5757349.jpg"
    },
    {
        "title": "React - The Complete Guide", #done
        "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
        "description": "React, Redux, hooks, context, and more.",
        "tags": ["react", "frontend", "redux"],
        "image": "https://wallpapercave.com/wp/wp7718053.png"
    },
    {
        "title": "Building Modern Python Applications on AWS", #done
        "url": "https://explore.skillbuilder.aws/learn/course/external/view/elearning/12346/building-modern-python-applications-on-aws",
        "description": "Develop, build, and deploy apps using Python on AWS.",
        "tags": ["aws", "python", "cloud"],
        "image": "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
    },
    {
        "title": "Data Structures and Algorithms Specialization", #done
        "url": "https://www.coursera.org/specializations/data-structures-algorithms",
        "description": "Master problem solving, DSA, and coding interviews.",
        "tags": ["dsa", "algorithms", "coding"],
        "image": "https://cdn.eduonix.com/assets/images/header_img/2019032806183511015.jpg"
    },
    {
        "title": "freeCodeCamp JavaScript Algorithms and Data Structures", #done
        "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        "description": "Master JS, DSA, and projects for free.",
        "tags": ["javascript", "dsa", "free"],
        "image": "https://e1.pxfuel.com/desktop-wallpaper/923/737/desktop-wallpaper-algorithms-and-data-structures-in-action-version-13-data-structures.jpg"
    }
]


    matching_courses = [
    course for course in all_courses
    if any(word in course["title"].lower() or word in course["description"].lower() or any(word in tag for tag in course["tags"])
           for word in query.split())
]


    return jsonify({"courses": matching_courses, "success": True})

# Search projects
@app.route('/api/recommendations/search-experiences', methods=['GET'])
def search_experiences():
    query = request.args.get('q', '').lower()

    all_experiences = [
        # Projects
        {
            "title": "Exercism", #done
            "url": "https://github.com/exercism",
            "description": "Learn and practice coding in various programming languages through mentorship.",
            "tags": ["learning", "mentorship", "multi-language"],
            "image": "https://static.vecteezy.com/system/resources/previews/013/375/685/non_2x/business-mentoring-personal-coaching-training-personal-development-concept-mixed-media-photo.jpg"
        },
        {
            "title": "FastAPI", #done
            "url": "https://github.com/tiangolo/fastapi",
            "description": "Modern, fast (high-performance) web framework for building APIs with Python.",
            "tags": ["python", "api", "web"],
            "image": "https://miro.medium.com/v2/resize:fit:1200/1*JAamJNBtxotDMC2phWdRwQ.png"
        },
        {
            "title": "OpenCV", #done
            "url": "https://github.com/opencv/opencv",
            "description": "Open source computer vision and machine learning software library.",
            "tags": ["computer vision", "machine learning", "image processing"],
            "image": "https://miro.medium.com/v2/resize:fit:1199/1*ge_qSI9SH-0UgHUXg9KOlw.jpeg"
        },
        {
            "title": "TensorFlow", #done
            "url": "https://github.com/tensorflow/tensorflow",
            "description": "An end-to-end open source machine learning platform.",
            "tags": ["machine learning", "deep learning", "ai"],
            "image": "https://wallpapercave.com/wp/wp9509473.png"
        },
        {
            "title": "React", #done
            "url": "https://github.com/facebook/react",
            "description": "A JavaScript library for building user interfaces.",
            "tags": ["javascript", "frontend", "ui"],
            "image": "https://reactjs.org/logo-og.png"
        },
        {
            "title": "Vue.js", #done
            "url": "https://github.com/vuejs/vue",
            "description": "The Progressive JavaScript Framework.",
            "tags": ["javascript", "frontend", "framework"],
            "image": "https://wallpaperaccess.com/full/4584358.jpg"
        },
        {
            "title": "Django", #done
            "url": "https://github.com/django/django",
            "description": "The Web framework for perfectionists with deadlines.",
            "tags": ["python", "web", "framework"],
            "image": "https://wallpapercave.com/wp/wp12510358.jpg"
        },
        {
            "title": "Flutter", #done
            "url": "https://github.com/flutter/flutter",
            "description": "UI toolkit for building natively compiled applications for mobile, web, and desktop.",
            "tags": ["dart", "mobile", "ui"],
            "image": "https://thesmythgroup.com/uploads/flutter-hero.jpg"
        },
        {
            "title": "Kubernetes", #done
            "url": "https://github.com/kubernetes/kubernetes",
            "description": "Production-Grade Container Scheduling and Management.",
            "tags": ["container", "orchestration", "devops"],
            "image": "https://wallpaperaccess.com/full/6129715.png"
        },
        {
            "title": "Electron", #done
            "url": "https://github.com/electron/electron",
            "description": "Build cross-platform desktop apps with JavaScript, HTML, and CSS.",
            "tags": ["javascript", "desktop", "cross-platform"],
            "image": "https://wallhere.com/en/wallpaper/297215"
        },
        {
            "title": "Bootstrap", #done
            "url": "https://github.com/twbs/bootstrap",
            "description": "The most popular HTML, CSS, and JS library in the world.",
            "tags": ["css", "frontend", "responsive"],
            "image": "https://wallpaperaccess.com/full/4623140.jpg"
        },
        {
            "title": "Node.js", #done
            "url": "https://github.com/nodejs/node",
            "description": "Node.js JavaScript runtime.",
            "tags": ["javascript", "runtime", "backend"],
            "image": "https://images8.alphacoders.com/380/380534.png"
        },
        {
            "title": "Angular", #done
            "url": "https://github.com/angular/angular",
            "description": "One framework. Mobile & desktop.",
            "tags": ["typescript", "frontend", "framework"],
            "image": "https://wallpaperbat.com/img/839905-angular-dependency-injection-and-the-function-of-injectors-providers-mobilelive.jpg"
        },
        {
            "title": "Laravel", #done
            "url": "https://github.com/laravel/laravel",
            "description": "A PHP framework for web artisans.",
            "tags": ["php", "web", "framework"],
            "image": "https://images.hdqwalls.com/download/laravel-to-3840x2160.jpg"
        },
        {
            "title": "Spring Boot", #done
            "url": "https://github.com/spring-projects/spring-boot",
            "description": "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.",
            "tags": ["java", "backend", "framework"],
            "image": "https://wallpaperaccess.com/full/9954252.jpg"
        },
        {
            "title": "Ruby on Rails", #done
            "url": "https://github.com/rails/rails",
            "description": "Ruby on Rails is a full-stack web framework optimized for programmer happiness and sustainable productivity.",
            "tags": ["ruby", "web", "framework"],
            "image": "https://swall.teahub.io/photos/small/281-2815762_ruby-on-rails-business-project-header-image-ruby.png"
        },
        {
            "title": "Apache Kafka", #done
            "url": "https://github.com/apache/kafka",
            "description": "A distributed streaming platform.",
            "tags": ["streaming", "data", "messaging"],
            "image": "https://e0.pxfuel.com/wallpapers/799/170/desktop-wallpaper-apache-kafka-for-beginners.jpg"
        },
        {
            "title": "Elasticsearch", #done
            "url": "https://github.com/elastic/elasticsearch",
            "description": "Open Source, Distributed, RESTful Search Engine.",
            "tags": ["search", "data", "analytics"],
            "image": "https://www.pngitem.com/pimgs/m/387-3873369_elasticsearch-hd-png-download.png"
        },
        {
            "title": "Redis", #done
            "url": "https://github.com/redis/redis",
            "description": "In-memory data structure store, used as a database, cache, and message broker.",
            "tags": ["database", "cache", "nosql"],
            "image": "https://www.kevsrobots.com/learn/redis/assets/redis-cover.jpg"
        },
        {
            "title": "Docker", #done
            "url": "https://github.com/docker/docker-ce",
            "description": "Docker Community Edition.",
            "tags": ["container", "devops", "docker"],
            "image": "https://wallpaperaccess.com/full/2982327.jpg"
        }
    ]

    matching_experiences = [
        experience for experience in all_experiences
        if any(word in experience["title"].lower() or word in experience["description"].lower() or any(word in tag for tag in experience["tags"])
               for word in query.split())
    ]

    return jsonify({"experiences": matching_experiences, "success": True})


# Search internships
@app.route('/api/recommendations/search-internships', methods=['GET'])
def search_internships():
    query = request.args.get('q', '').lower()

    internships = [
        {
            "title": "ML Research Internship - Hugging Face", #done
            "url": "https://huggingface.co/careers",
            "description": "Work on cutting-edge NLP research, transformer models, and open-source projects.",
            "tags": ["machine learning", "nlp", "research", "transformers"],
            "image": "https://wallpaperaccess.com/full/1729028.jpg"
        },
        {
            "title": "Software Engineering Intern - Google Summer of Code", #done
            "url": "https://summerofcode.withgoogle.com/",
            "description": "Contribute to open-source under mentorship from global organizations.",
            "tags": ["open source", "coding", "remote", "mentorship"],
            "image": "https://wallpaperbat.com/img/354669-senior-software-engineer-job-description-job-description.jpg"
        },
        {
            "title": "Data Science Intern - IBM", #done
            "url": "https://www.ibm.com/employment/internships/",
            "description": "Hands-on experience with data analysis, visualization, and ML pipelines.",
            "tags": ["data science", "machine learning", "analytics"],
            "image": "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
        },
        {
            "title": "Backend Developer Intern - Microsoft", #done
            "url": "https://careers.microsoft.com/students/us/en",
            "description": "Work with scalable backend systems and APIs using C# or Python.",
            "tags": ["backend", "c#", "api", "cloud"],
            "image": "https://image.freepik.com/free-vector/backend-technology-concept-with-glowing-lines-background_1017-28405.jpg"
        },
        {
            "title": "AI Intern - OpenAI", #done
            "url": "https://openai.com/careers",
            "description": "Join AI research and implementation tasks at OpenAI.",
            "tags": ["ai", "deep learning", "research"],
            "image": "https://images5.alphacoders.com/137/1372788.jpeg"
        },
        {
            "title": "Frontend Intern - Shopify", #done
            "url": "https://www.shopify.com/careers/interns",
            "description": "Work with React and GraphQL to build e-commerce interfaces.",
            "tags": ["frontend", "react", "graphql", "ecommerce"],
            "image": "https://e0.pxfuel.com/wallpapers/891/733/desktop-wallpaper-shopify-ecommerce-shopify-shopify-background-e-commerce.jpg"
        },
        {
            "title": "Cloud Engineering Intern - Amazon AWS", #done
            "url": "https://www.amazon.jobs/en/teams/internships",
            "description": "Build and deploy cloud-native applications using AWS.",
            "tags": ["cloud", "aws", "devops"],
            "image": "https://wallpapercave.com/wp/wp13394360.jpg"
        },
        {
            "title": "Mobile Developer Intern - Meta", #done
            "url": "https://www.metacareers.com/students",
            "description": "Build Android/iOS apps with high performance and user experience.",
            "tags": ["android", "ios", "mobile"],
            "image": "https://wallpapercave.com/wp/wp9517070.jpg"
        },
        {
            "title": "Cybersecurity Intern - Palo Alto Networks", #done
            "url": "https://jobs.paloaltonetworks.com/students",
            "description": "Gain practical experience in network security and threat detection.",
            "tags": ["cybersecurity", "networking", "internship"],
            "image": "https://wallpapercave.com/wp/wp2691579.jpg"
        },
        {
            "title": "UI/UX Intern - Adobe", #done
            "url": "https://adobe.com/careers/students.html",
            "description": "Design user-friendly interfaces for creative cloud applications.",
            "tags": ["ui", "ux", "design"],
            "image": "https://i.ytimg.com/vi/yjKd5p6z2i4/maxresdefault.jpg"
        },
        {
            "title": "Game Dev Intern - Unity Technologies", #done
            "url": "https://careers.unity.com/early-careers",
            "description": "Work on game development and simulation projects using Unity.",
            "tags": ["unity", "gaming", "3d", "dev"],
            "image": "https://wallpapercave.com/wp/wp7664856.png"
        },
        {
            "title": "Blockchain Intern - ConsenSys", #done
            "url": "https://consensys.net/open-roles/",
            "description": "Hands-on development with smart contracts and Web3 tools.",
            "tags": ["blockchain", "web3", "ethereum"],
            "image": "https://wallpaperaccess.com/full/4578765.jpg"
        },
        {
            "title": "NLP Intern - Cohere AI", #done
            "url": "https://cohere.ai/careers",
            "description": "Work with LLMs for language understanding and generation.",
            "tags": ["nlp", "ai", "llm", "transformers"],
            "image": "https://wallpaperaccess.com/full/12044574.jpg"
        },
        {
            "title": "Robotics Intern - Boston Dynamics", #done
            "url": "https://www.bostondynamics.com/careers",
            "description": "Contribute to software systems controlling robots.",
            "tags": ["robotics", "c++", "mechatronics"],
            "image": "https://c4.wallpaperflare.com/wallpaper/262/350/392/blue-water-light-technology-wallpaper-preview.jpg"
        },
        {
            "title": "AI for Healthcare Intern - Tempus", #done
            "url": "https://www.tempus.com/careers/",
            "description": "Use AI to accelerate cancer care and research.",
            "tags": ["healthcare", "ai", "biomedical"],
            "image": "https://www.wazoku.com/wp-content/uploads/2023/07/AdobeStock_542691981-scaled.jpeg"
        },
        {
            "title": "AR/VR Intern - Magic Leap", #done
            "url": "https://www.magicleap.com/careers",
            "description": "Develop immersive AR applications using Unity and C++.",
            "tags": ["ar", "vr", "unity"],
            "image": "https://img.freepik.com/premium-photo/futuristic-concept-vr-ar-technologies-man-3d-glasses-blue-background-3d-illustration_76964-5182.jpg?w=2000"
        },
        {
            "title": "Analytics Intern - Swiggy", #done
            "url": "https://careers.swiggy.com/jobs",
            "description": "Work with customer behavior data to improve delivery systems.",
            "tags": ["analytics", "data", "python"],
            "image": "https://miro.medium.com/v2/resize:fit:683/1*cwr6G3Zcf80fHmimAks0jg.jpeg"
        },
        {
            "title": "Fullstack Intern - Razorpay", #done
            "url": "https://razorpay.com/jobs/",
            "description": "Develop secure payment systems using MERN stack.",
            "tags": ["mern", "fullstack", "fintech"],
            "image": "https://woocommerce.com/wp-content/uploads/2021/01/Razorpay-footer.png?resize=650"
        },
        {
            "title": "IoT Intern - Bosch", #done
            "url": "https://www.bosch.com/careers/",
            "description": "Contribute to IoT systems in embedded environments.",
            "tags": ["iot", "embedded", "c"],
            "image": "https://www.wallpaperflare.com/static/769/378/433/bosch-company-equipment-logo-wallpaper.jpg"
        },
        {
            "title": "AI Intern - TCS Research", #done
            "url": "https://www.tcs.com/careers/internship",
            "description": "Build ML/AI models for large-scale applications under expert mentorship.",
            "tags": ["ai", "ml", "research"],
            "image": "https://pbs.twimg.com/ext_tw_video_thumb/1629064105834467329/pu/img/p2I2T6_ReF4Vy1mF?format=jpg&name=large"
        }
    ]  

    matching_internships = [
        internship for internship in internships
        if any(
            word in internship["title"].lower() or
            word in internship["description"].lower() or
            any(word in tag for tag in internship["tags"])
            for word in query.split()
        )
    ]

    return jsonify({
        "success": True,
        "internships": matching_internships
    })

 


# Search assessment questions
@app.route('/api/search/questions', methods=['GET'])
def search_questions():
    query = request.args.get('q')
    if not query:
        return jsonify({'success': False, 'message': 'Query is missing'}), 400

    # Sample dummy results for testing
    sample_data = [
        {
            "title": "Introduction to Python",
            "url": "https://example.com/python",
            "description": "Learn Python from scratch",
            "tags": ["python", "beginner"],
            "image": "https://example.com/image.jpg"
        }
    ]

    return jsonify({"success": True, "data": sample_data})

# JWT helper (if needed)
def get_supabase_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        abort(401, description="Missing or invalid Authorization header")
    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except Exception:
        abort(401, description="Invalid token")


# Search assessment questions
@app.route('/api/search/questions/v2', methods=['GET'])
def search_questions_v2():
    query = request.args.get('q')
    if not query:
        return jsonify({'success': False, 'message': 'Query is missing'}), 400

    # Sample for v2
    data = [
        {
            "title": "Advanced Machine Learning",
            "url": "https://example.com/ml",
            "description": "Deep dive into ML",
            "tags": ["machine learning", "advanced"],
            "image": "https://example.com/ml.jpg"
        }
    ]

    return jsonify({"success": True, "data": data})

# JWT helper (if needed)
def get_supabase_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        abort(401, description="Missing or invalid Authorization header")
    token = auth_header.split(" ")[1]
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded
    except Exception:
        abort(401, description="Invalid token")

# Run
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
