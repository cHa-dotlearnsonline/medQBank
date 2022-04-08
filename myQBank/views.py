import json
from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from .models import User, Course, Topic, Answer, Question, Userscourses
# Create your views here.
def index(request):
    # here I will just query for all the courses in my database
    all_courses = Course.objects.all()
    return render (request, "myQBank/index.html", {
        "courses": all_courses
    })
# here I render view for seeing all the topics under a course
def course_view(request, course):
    #use the get method to only get one result
    desired_course = Course.objects.get(course_name = course)
    course_topics = Topic.objects.filter(course = desired_course)
    if len(course_topics) >= 1:
        return render (request, "myQBank/topics.html", {
            "Topics": course_topics
            })
    else:
        return render (request, "myQBank/topics.html",{
            "message": "No questions or Topics Yet"    
        })
    
# in this view I only aim to produce those questions
# and answers in with that topic
def questions_view(request, topic_id):
    #an empty list that I will use to append the query set for all 
    # the answers for each question
    all_answers = []
    #get the topic with the corresponding topic_id
    get_topic = Topic.objects.get(id=topic_id)
    #get the queryset of all the questions under/with this topic
    get_questions = Question.objects.filter(topic = get_topic)
    # create a for loop that gets the answers for each particular question
    for question in get_questions:
        #this creates a queryset with all the answers for each question
        get_answers = Answer.objects.filter(question = question)
        #Add the resulting queryset to all_answers list
        all_answers.append(get_answers)
    return render (request, "myQBank/topics.html", {
        "all_questions" : all_answers
        })

def login_view(request):
    # the login process here
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "myQbank/login.html", {
                "message": "Invalid username and/or password"
            })
    return render(request, "myQBank/login.html")

# We are logging out people here
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

# The Register view will be here
def register_view(request):
    # copy some code for the registration process

    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            return render(request, "myQBank/register.hmtl", {
                "message": "Passwords must match"
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "myQBank/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "myQBank/register.html")

# remember to migrate the database
def add_course(request, courseName):
    
    # check if the request method is post
    if request.method == "POST":
        # get the value of the course ID
        user = request.user
        data = json.loads(request.body)
        if data.get("courseID") is not None:
            course_id = int(data["courseID"])
            # change The course id into an interger
            course_id = int(course_id)
            # grab that course from the database
            course = Course.objects.get(id=course_id)
            try:
                check_addition = Userscourses.objects.get(course = course, user=user)
                check_addition.delete()
                return HttpResponse(status=204)
            except Userscourses.DoesNotExist:
                # add the course and user taking the course to users courses
                chosen_course = Userscourses(course = course, user = user)
                chosen_course.save()
                return HttpResponse(status=204)

    elif request.method == "GET":
        # add for checking if the user already has the course added
        course_taken = Course.objects.get(id = courseName)
        try:
            check_add = Userscourses.objects.get(course = course_taken)
            return JsonResponse({"taking":True})
        except Userscourses.DoesNotExist:
            return JsonResponse({"taking":False})

def profile_view(request, username):
    # get the courses that the user has subscribed to
    user = User.objects.get(username=username)
    all_user_courses = Userscourses.objects.filter(user = user)
    return render(request, 'myQBank/profile.html', {
        "UsersCourses": all_user_courses
    })