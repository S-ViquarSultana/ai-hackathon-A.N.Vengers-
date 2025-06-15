from app.models.user import User, CourseProgress
from app.utils.db import connect_db

def update_progress(user_id, course_id, title):
    connect_db()
    user = User.objects(_id=user_id).first()

    if not user:
        return {"error": "User not found"}

    # Check if course already in progress
    for course in user.progress:
        if course.course_id == course_id:
            return {"message": "Course already in progress"}

    # Add course to progress
    new_course = CourseProgress(course_id=course_id, title=title)
    user.progress.append(new_course)
    user.save()

    return {"message": "Progress updated"}
