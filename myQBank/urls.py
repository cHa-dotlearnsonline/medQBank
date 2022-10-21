from unicodedata import name
from django.urls import path 
from . import views 
urlpatterns = [
    path("", views.index, name="index"),
    path("course/<str:course>", views.course_view, name="course"),
    #this view is for questions that are essay topics
    path("essay/<int:topic_id>",views.essays_view, name="essays"),
    path("questions/<int:topic_id>", views.questions_view, name="questions"),
    path("login", views.login_view, name="login"),
    path("register", views.register_view, name="register"),
    path("addCourse/<int:courseName>", views.add_course, name="addCourse"),
    path("profile/<str:username>", views.profile_view, name="profile"),
    path("logout", views.logout_view, name="logout"),
    #this part has the path for how I record the attempts of each candidate
    path("attempts", views.attempt_records, name="attempts"),
    # this part has the path for adding questions by the site's admins
    #path("addQuestions", views.add_question, name="addQuestions"),
    path("statistics/<int:user_course_id>", views.statistics, name="statistics"),
    path("edit", views.edit, name="edit"),
    #this part is just for a timer for when I finish Seventh year
    path("countdown", views.countdown, name="countdown")
]