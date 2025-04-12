# Educational Assistant Platform

A full-stack application for personalized learning and skill assessment.

## Features

- User authentication (sign up, sign in)
- Personalized course recommendations
- Skill assessment with AI-powered questions
- Course search and filtering
- User profile management
- Dark/light mode support

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- TailwindCSS
- Axios for API calls
- React Router for navigation
- Framer Motion for animations

### Backend
- Flask
- SQLite database
- JWT authentication
- CORS support
- SERP API integration

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with the following variables:
   ```
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   DATABASE_URL=sqlite:///app.db
   CORS_ORIGINS=http://localhost:5173
   SERP_API_KEY=your-serp-api-key-here
   SUPABASE_URL=your-supabase-url-here
   SUPABASE_KEY=your-supabase-key-here
   ```

6. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login user

### Recommendations
- GET `/api/recommendations/:userId` - Get user recommendations
- PUT `/api/recommendations/:userId/interests` - Update user interests

### Search
- GET `/api/search/questions` - Search for assessment questions

## Environment Variables

### Backend
- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing key
- `DATABASE_URL` - Database connection URL
- `CORS_ORIGINS` - Allowed CORS origins
- `SERP_API_KEY` - SERP API key for course search
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 