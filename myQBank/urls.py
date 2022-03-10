# here I know i have to import path
# so that I am able to create a path
# that will be used in the url bar
#from unicodedata import name
from unicodedata import name
from django.urls import path 
# i'm importing views so that the app
# knows which function to call from the views
# file so that it can properly render the page
from . import views 
# the urlpatterns list is just a list with all the url paths I 
# can use.
urlpatterns = [
    path("", views.index, name="index"),
    path("course/<str:course>", views.course_view, name="course"),
    path("questions/<int:topic_id>", views.questions_view, name="questions"),
    path("login", views.login_view, name="login"),
    path("register", views.register_view, name="register"),
    path("addCourse", views.add_course, name="addCourse")
]