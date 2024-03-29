import json
from django.template.defaulttags import register
import validators
from django.shortcuts import render
from django.core.paginator import Paginator
from django.db import DataError, IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from .models import Attempted, User, Course, Topic, Answer, Question, Userscourses, Attempt, EssayQuestion, EssayAnswer, SubQuestion
import markdown
from django import forms 
from django_quill.forms import QuillFormField 
# Create your views here.
def index(request):
    # here I will just query for all the courses in my database
    all_courses = Course.objects.all()
    return render(request, "myQBank/index.html", {
        "courses": all_courses
    })

# here I render view for seeing all the topics under a course
def course_view(request, course):
    # use the get method to only get one result
    desired_course = Course.objects.get(course_name=course)
    course_topics = Topic.objects.filter(course=desired_course)
    if len(course_topics) >= 1:
        return render(request, "myQBank/topics.html", {
            "Topics": course_topics
        })
    else:
        return render(request, "myQBank/topics.html", {
            "message": "No questions or Topics Yet"
        })

# in this view I only aim to produce those questions
# and answers in with that topic
def questions_view(request, topic_id):
    user = request.user
    paidState = request.user
    paid = paidState.paidup 
    # an empty list that I will use to append the query set for all
    # the answers for each question
    all_answers = []
    # get the topic with the corresponding topic_id
    get_topic = Topic.objects.get(id=topic_id)
    # get the queryset of all the mcq questions under/with this topic
    if paid:
        get_questions = Question.objects.filter(topic=get_topic)
    else:
        get_questions = Question.objects.filter(topic = get_topic)[:4]
    totalQs = len(Question.objects.filter(topic=get_topic))
    # create a for loop that gets the answers for each particular question
    for question in get_questions:
        # this creates a queryset with all the answers for each question
        get_answers = Answer.objects.filter(question=question)
        # Add the resulting queryset to all_answers list
        all_answers.append(get_answers)
    paginator = Paginator(all_answers, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "myQBank/topics.html", {
        #all_questions": all_answers,
        "all_questions": page_obj,
        "greedy": True,
        "total": totalQs
    })
def essays_view(request, topic_id):
    # get all the main questions
    user = request.user
    paid = user.paidup
    topicID = int(topic_id)
    get_topic = Topic.objects.get(id=topicID)
    if paid:
        mainEssays = EssayQuestion.objects.filter(topic=get_topic)
    else:
        print("This guy hasn't paid")
        mainEssays = EssayQuestion.objects.filter(topic=get_topic)[:1]
    totalQs = len(EssayQuestion.objects.filter(topic=get_topic))
    all_questions = []
    #have a list of lists so each list will be like this
    #a question followed by it's subquestions, then to see the answer I will
    # javascript so that when a use clicks see answer thats when they see the answer
    for essayQ in mainEssays:
        q_subqs = []
        associated_ans = EssayAnswer.objects.filter(essay_question=essayQ)

        # all_subqs = SubQuestion.objects.filter(essay_question=essayQ)
        q_subqs.append(essayQ)
        for ans in associated_ans:
            if ans.is_main:
                q_subqs.append(ans)
        #q_subqs.append(all_subqs)
        all_questions.append(q_subqs)
    return render(request, "myQBank/essays.html", {
        "all_questions": all_questions,
        "greedy": True,
        "total": totalQs
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
            return render(request, "myQBank/login.html", {
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
            return render(request, "myQBank/register.html", {
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
                check_addition = Userscourses.objects.get(
                    course=course, user=user)
                check_addition.delete()
                return HttpResponse(status=204)
            except Userscourses.DoesNotExist:
                # add the course and user taking the course to users courses
                chosen_course = Userscourses(course=course, user=user)
                chosen_course.save()
                return HttpResponse(status=204)

    elif request.method == "GET":
        # add for checking if the user already has the course added
        user = user = request.user
        course_taken = Course.objects.get(id=courseName)
        try:
            check_add = Userscourses.objects.get(
                course=course_taken, user=user)
            return JsonResponse({"taking": True})
        except Userscourses.DoesNotExist:
            return JsonResponse({"taking": False})

def profile_view(request, username):
    # get the courses that the user has subscribed to
    user = User.objects.get(username=username)
    all_user_courses = Userscourses.objects.filter(user=user)
    return render(request, 'myQBank/profile.html', {
        "UsersCourses": all_user_courses
    })
#the view for recording attempts
def attempt_records(request):
    # add the logic here that unpacks the information that will be
    # sent to me from the client side
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("attempts") is not None:
            user = request.user
            question_id = int(data["question"])
            attempts = int(data["attempts"])
            correct = int(data["correct"])
            course = data["course"]
            topic = data["topic"]

            question = Question.objects.get(id=question_id)
            course = Course.objects.get(course_name=course)
            # enter the data collected
            topic  = Topic.objects.get(topic_name = topic, course = course)
            try:
                second_attempt = Attempt.objects.get(
                    question=question, user=user)
                second_attempt.totalAttempts = second_attempt.totalAttempts + attempts
                second_attempt.correctAttempts = second_attempt.correctAttempts + correct
                second_attempt.save()
                return HttpResponse(status=204)
            except Attempt.DoesNotExist:
                attempt_data = Attempt(question=question, user=user,
                                         totalAttempts=attempts, correctAttempts=correct, course=course, topic=topic)
                attempt_data.save()
                return HttpResponse(status=204)
    elif request.method == "PUT":
        data = json.loads(request.body)
        user = request.user
        if data.get("course") is not None:
            user = request.user
            course_id = int(data["course"])

            course = Course.objects.get(id=course_id)
            try:
                checkAttempts = Attempt.objects.filter(
                    course=course, user=user)
                total_attempts = 0
                total_correct = 0

                for attempt in checkAttempts:
                    total_attempts = total_attempts + attempt.totalAttempts
                    total_correct = total_correct + attempt.correctAttempts
                if total_attempts > 0:
                    pass_percentage = round(
                        (total_correct/total_attempts) * 100, 2)
                    return JsonResponse({"Total Attempts": total_attempts,
                                        "Total Correct": total_correct,
                                         "Pass Percentage": pass_percentage,
                                         "Course ID": course_id})
                elif total_attempts == 0:
                    return JsonResponse({"error": "No Attempts Yet",
                                        "Course ID": course_id})

            except Attempt.DoesNotExist:
                return JsonResponse({"error": "No Attempts Yet"})

def add_question(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        user = request.user
        if data.get("question") is not None:
            question = data["question"]
            course = data["course"]
            topic = data["topic"]
            courseImage = data["courseImage"]
            theOptions = data["theOptions"]
            try:
                set_course = Course.objects.get(course_name__iexact=course)
            except Course.DoesNotExist:
                set_course = Course(
                    course_name=course.lower().capitalize(), image_url=courseImage, typical_year = 0)
                set_course.save()
                set_course = Course.objects.get(course_name__iexact=course)
            try:
                set_topic = Topic.objects.get(topic_name__iexact=topic)
            except Topic.DoesNotExist:
                set_topic = Topic(topic_name=topic, course=set_course, mcq_topic=True)
                set_topic.save()
            set_topic = Topic.objects.get(topic_name__iexact=topic)
            set_question = Question(
            question=question, course=set_course, topic=set_topic)
            set_question.save()
            for answer in theOptions:
                for option, correctness in answer.items():
                    if correctness:
                        set_question.is_answered = True
                    set_answer = Answer(
                        option=option, correctness=correctness, question=set_question)
                    set_answer.save()
        return HttpResponse(status=204)

#let me sleep I will finish this thing tomorrow
# whatever problems I have created for myself today I will
# solve tomorrow. but I should pat myself on the back for 
# doint what I have done today. I have to wake up at 5:00hrs today
    if request.method == "POST":
        #data = json.loads(request.body)
        form = QuillPostForm(request.POST)
        if form.is_valid():
            mainQuestion = form.cleaned_data["essayQ"]
            mainAnswer = form.cleaned_data['answers2Q']
            course = request.POST["course"]
            topic = request.POST["topic"]
            courseImage = request.POST["courseImage"]
            #questionImage= request.PUT["image"]
            #subQuestions = request.PUT['subquestions']
            if len(mainQuestion) > 0:
                try:
                    get_course = Course.objects.get(course_name__iexact = course)
                except Course.DoesNotExist:
                    set_course = Course(
                        course_name=course.lower().capitalize(), image_url = courseImage, typical_year = 0
                    )
                    set_course.save()
                set_course = Course.objects.get(course_name__iexact=course)
                try:
                    set_topic = Topic.objects.get(topic_name__iexact=topic)
                    set_topic.essay_topic = True
                    set_topic.save()
                except Topic.DoesNotExist:
                    set_topic = Topic(topic_name=topic, course=set_course, essay_topic=True, mcq_topic = False)
                    set_topic.save()
                    set_topic = Topic.objects.get(topic_name__iexact=topic)
                # if validators.url(questionImage):
                #     set_question = EssayQuestion(
                #         question=mainQuestion, course=set_course, topic=set_topic, has_picture=True)
                #     set_question.save()
                # else:
                set_question = EssayQuestion(
                    question=mainQuestion, course=set_course, topic=set_topic)
                set_question.save()
                set_answer = EssayAnswer(answer=mainAnswer, essay_question=set_question, is_main=True)
                set_answer.save()
                get_question = EssayQuestion.objects.get(question=mainQuestion)
            #if len(subQuestions) > 0:
            #    for subquestion in subQuestions:
            #        for quest, ans in subquestion.items():
            #            set_essay_answer = EssayAnswer(answer=markdown.markdown(ans), essay_question=get_question)
            #           set_essay_answer.save()
            #            set_essay_answer = EssayAnswer.objects.get(answer=markdown.markdown(ans))
            #            set_subQ = SubQuestion(subQuestion = quest, essay_question = get_question, essay_answer = set_essay_answer)
            #            set_subQ.save()
            return HttpResponseRedirect(reverse('addQuestions'))

    return render(request, 'myQBank/addquestion.html', {
        "quillform": QuillPostForm()
    })


def statistics(request, user_course_id):
    # Get statistics for user
    user=request.user
    my_attempts = {}
    #TODO: get course taken by user
    course = Course.objects.get(id=user_course_id)
    #TODO: get attempts under said course
    all_attempts = Attempt.objects.filter(user=user, course=course)
    #TODO: Get total number of attempts per topic
    for attempt in all_attempts:
        if attempt.topic not in my_attempts.keys():
            my_attempts[attempt.topic] = {"Total":attempt.totalAttempts,
            "Correct": attempt.correctAttempts, "Pass":round((attempt.correctAttempts/attempt.totalAttempts)*100,2)}
        else:
            my_attempts[attempt.topic]["Total"] = my_attempts[attempt.topic]["Total"] + attempt.totalAttempts
            my_attempts[attempt.topic]["Correct"] = my_attempts[attempt.topic]["Correct"] + attempt.correctAttempts
            my_attempts[attempt.topic]["Pass"] = round((my_attempts[attempt.topic]["Correct"]/my_attempts[attempt.topic]["Total"]) * 100, 2)
    #TODO: get all the topics put them in a list then 
    attempted_topics = my_attempts.keys()
    return render(request, "myQBank/statistics.html", {
        "topics": attempted_topics,
        "topicStats": my_attempts
    })

def edit(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if data.get("question") is not None:
            question = int(data["question"])
            optionID = int(data["option"])
            fullQuestion = Question.objects.get(id=question)
            associatedOptions = Answer.objects.filter(question=fullQuestion)
            option = Answer.objects.get(id=optionID)
            for answer in associatedOptions:
                if answer == option:
                    answer.correctness = True
                    answer.save()
                else:
                    answer.correctness = False
                    answer.save()
            return HttpResponse(status=204)

    # TODO: Add a put request for editing the content of a question:
    if request.method == "PUT":
        data = json.loads(request.body)
        question = data["question"]
        questionID = int(data["identityNumber"])
        fullQuestion = Question.objects.get(id=questionID)
        fullQuestion.question = question 
        fullQuestion.save()
        all_options = data["theOptions"]
        for option in all_options:
            id_of_option = option.keys()
            for key in id_of_option:
                id_of_option1 = int(key)
                answer_to_change = Answer.objects.get(id=id_of_option1)
                answer_to_change.option = option[key]
                answer_to_change.save()
        return HttpResponse(status=204)
        
    return HttpResponse("Method Not allowed")
@register.filter
def get_value(dictionary, key):
    dictionary1 = dictionary.get(key)
    return f'Total attempts:{dictionary1["Total"]}, Total Correct:{dictionary1["Correct"]}, Pass Percentage: {dictionary1["Pass"]}%'

def countdown(request):
    return render(request, 'myQBank/countdown.html')

class QuillPostForm(forms.Form):
    essayQ = QuillFormField()
    answers2Q = QuillFormField()