from mongoengine import Document, StringField, EmailField, ListField, EmbeddedDocumentField, EmbeddedDocument

class CourseProgress(EmbeddedDocument):
    course_id = StringField(required=True)
    title = StringField()
    status = StringField(default="ongoing")  # could be: ongoing, completed

class User(Document):
    _id = StringField(primary_key=True)  # Clerk ID or UUID
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    interests = ListField(StringField())
    skills = ListField(StringField())
    image_url = StringField()
    progress = ListField(EmbeddedDocumentField(CourseProgress))
    meta = {'collection': 'users'}
