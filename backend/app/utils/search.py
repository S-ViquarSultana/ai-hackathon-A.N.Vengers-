from app.models.question import Question

def search_questions(query):
    results = Question.objects(question__icontains=query)
    return [
        {
            "id": str(q.id),
            "question": q.question,
            "domain": q.domain,
            "difficulty": q.difficulty_level,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d
            },
            "badge": q.badge
        } for q in results
    ]

def get_all_domains():
    return Question.objects().distinct('domain')

def get_questions_by_domain(domain):
    results = Question.objects(domain=domain)
    return [
        {
            "id": str(q.id),
            "question": q.question,
            "difficulty": q.difficulty_level,
            "options": {
                "a": q.option_a,
                "b": q.option_b,
                "c": q.option_c,
                "d": q.option_d
            },
            "badge": q.badge
        } for q in results
    ]
