from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Attempted, GrandAttempt, User, Question, Answer, Course, Topic
# Register your models here.
admin.site.register(User)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Attempted)
admin.site.register(GrandAttempt)