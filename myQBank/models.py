from django.db import models
from django.contrib.auth.models import AbstractUser
from django_quill.fields import QuillField 

# Create your models here.

class User(AbstractUser):
    paidup= models.BooleanField(default=False)

# This just records the particular course
class Course(models.Model):
    course_name = models.CharField(max_length=255)
    image_url = models.URLField(blank = True)
    typical_year = models.IntegerField(blank=True)
    def __str__(self):
        return f"{self.course_name}"

# create a class that lists the topic and the course
class Topic(models.Model):
    topic_name = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete = models.CASCADE)
    essay_topic = models.BooleanField(default=False)
    mcq_topic = models.BooleanField(default=True) 
    def __str__(self):
        return f"{self.topic_name}"

# create a question model
class Question(models.Model):
    #Add a question field here
    question = models.TextField()
    # Add a field that references the course for this particular Question
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # reference the topic under which the question is
    topic = models.ForeignKey(Topic, on_delete = models.CASCADE)
    # mark if the question has been answred or not
    is_answered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question}"

class Answer(models.Model):
    #the option field here is there for multiple choice question
    option = models.CharField(max_length=300)
    # references the question for which the answer is for
    question = models.ForeignKey(Question, on_delete = models.CASCADE)
    # the field just tells us if this is a correct answer
    # since each answer can only have one question it is 
    # either correct or incorrect for that question 
    correctness = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.option}"
# create a model that tracks the number of attempts
# a user has made  on a particular question
class Attempted(models.Model):
    # reference the question being attempted
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    #reference the user who made the attempt
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #write the total number of attempts
    totalAttempts = models.IntegerField(default=0)
    # write number of correct attempts
    correctAttempts = models.IntegerField(default=0)
    #reference the course that this whole attempt was for
    course = models.ForeignKey(Course, default=None, on_delete=models.CASCADE)

    def __str__(self):
        return f"totalAttempts: {self.totalAttempts}, correctAttempts: {self.correctAttempts}, user:{self.user}, question:{self.question}, course:{self.course}"

    def serialize(self):
        return {
            "id": self.id,
            "question": self.question,
            "user": self.user,
            "Attempts": self.totalAttempts,
            "correct": self.correctAttempts,
            "course": self.course,
            "topic": self.topic
        }

class Attempt(models.Model):
    # reference the question being attempted
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    #reference the user who made the attempt
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #write the total number of attempts
    totalAttempts = models.IntegerField(default=0)
    # write number of correct attempts
    correctAttempts = models.IntegerField(default=0)
    #reference the course that this whole attempt was for
    course = models.ForeignKey(Course, default=None, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete = models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"totalAttempts: {self.totalAttempts}, correctAttempts: {self.correctAttempts}, user:{self.user}, question:{self.question}, course:{self.course}"

    def serialize(self):
        return {
            "id": self.id,
            "question": self.question,
            "user": self.user,
            "Attempts": self.totalAttempts,
            "correct": self.correctAttempts,
            "course": self.course,
            "topic": self.topic
        }
# create a model that takes note oh how many grand attempts they have made
# in this case a grand session means how many topics have all the topics
# completely studied and the questions completed
class GrandAttempt(models.Model):
    # reference the user making the grand attempt
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    # reference the questions in the attempt
    attemptedQuestions = models.ManyToManyField(Attempted)

# model for the subjects taken by an individual
class Userscourses(models.Model):
    # register the user taking that course
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # reference the course being taken
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

class EssayQuestion(models.Model):
    question = QuillField()
    #the picture field is just a place holder
    #before I figure out how to upload an image 
    # to a django field so that I am able to have the question
    # picture = models.URLField(blank = True)
    has_picture = models.BooleanField(default=False)

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    # reference the topic under which the question is
    topic = models.ForeignKey(Topic, on_delete = models.CASCADE)

class EssayAnswer(models.Model):
    answer = QuillField()
    is_main = models.BooleanField(default=False)
    essay_question = models.ForeignKey(EssayQuestion, on_delete=models.CASCADE)
# I might not need the subquestion thing now that I am using Quill
class SubQuestion(models.Model):
    subQuestion = models.TextField()
    essay_question =models.ForeignKey(EssayQuestion, on_delete=models.CASCADE)
    essay_answer = models.ForeignKey(EssayAnswer, on_delete=models.CASCADE)


    #TODO: So I just need to change some things on how my quill form data is handled
    #TODO: I will have to forget the javascript that I was using to handle the form for the essay question
    #TODO: Then after I make the change add questions for obs, imed, surgery, paeds. even If they don't have answers