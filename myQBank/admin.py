from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Attempt, Attempted, EssayAnswer, EssayQuestion, GrandAttempt, SubQuestion, User, Question, Answer, Course, Topic, Userscourses
# Register your models here.
admin.site.register(User)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Attempted)
admin.site.register(Attempt)
admin.site.register(GrandAttempt)
admin.site.register(EssayQuestion)
admin.site.register(EssayAnswer)
admin.site.register(SubQuestion)
admin.site.register(Userscourses)