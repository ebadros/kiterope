from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.files.storage import default_storage


VIEWABLE_CHOICES = (
    ("ONLY_ME", "Only me"),
    ("SHARED", "Just people I've shared this goal with"),
    ("MY_COACHES", "Just my coaches"),
    ("ALL_COACHES", "All coaches"),
    ("ANYONE", "Anyone"),
    
    )

class Interest(models.Model):
    name = models.CharField(max_length=30, default = " ")
    email = models.EmailField(max_length=70,)
    goal = models.CharField(max_length=1000, default = " ")

class Goal(models.Model):
    title = models.CharField(max_length=200, default=" ")
    deadline = models.CharField(max_length=16, default = " " )
    description = models.CharField(max_length=1000, default = " ")
    why = models.CharField(max_length=200, default = " ")
    image = models.FileField(null=True, upload_to='images')
    votes = models.IntegerField(null=True)
    viewableBy = models.CharField(max_length=20, choices=VIEWABLE_CHOICES, default="ONLY_ME")
    priority = models.IntegerField(null=True)
    user = models.ForeignKey(User)
    coaches = models.ManyToManyField('Coach', blank=True, related_name='coaches')
    updates = models.ManyToManyField('Update', blank=True, related_name='updates')
    wasAchieved = models.BooleanField(default=False)
    hasMetric = models.BooleanField(default=False)
    plans = models.ManyToManyField("Plan", blank=True, related_name='plans')
    #metric = 
    def __str__(self):
        return "%s" % (self.user_id)

    #def get_plans(self):
    #    return Plan.objects.filter(goals=self)
    
    
        


class Plan(models.Model):
    title = models.CharField(max_length=200, default=" ")
    author = models.ForeignKey(User, null=True, blank=True)
    description = models.CharField(max_length=1000, default=" ")
    calendar = models.FileField(null=True, upload_to='calendars')
    viewableBy = models.CharField(max_length=20, choices=VIEWABLE_CHOICES, default="ONLY_ME")
    steps = models.ManyToManyField('Step', blank=True, related_name='steps')
    startDate = models.CharField(max_length=16, default = " " )
    endDate = models.CharField(max_length=16, default = " " )
    goals = models.ManyToManyField(Goal, blank=True);

    def get_steps(self):
        return Step.objects.filter(plan=self)

    def get_goals(self):
        return Goal.objects.filter(plan=self)
    

class Step(models.Model):
    plan = models.ForeignKey(Plan, null=True)
    description = models.CharField(max_length=200, default=" ")
    substeps = models.ManyToManyField('Step', blank=True, )
    frequency = models.CharField(max_length=20, null=True)
    onSunday = models.BooleanField(default=False)
    onMonday = models.BooleanField(default=False)
    onTuesday = models.BooleanField(default=False)
    onWednesday = models.BooleanField(default=False)
    onThursday = models.BooleanField(default=False)
    onFriday = models.BooleanField(default=False)
    onSaturday = models.BooleanField(default=False)
    startTime = models.DateTimeField(null=True)
    endTime = models.DateTimeField(null=True)
    duration = models.DurationField(null=True)
    wasCompleted = models.BooleanField(default=False)

class Profile(models.Model):
    user = models.ForeignKey(User, null=True, blank=True)
    images = models.ManyToManyField('Image', blank=True,  )
    bio = models.CharField(max_length=2000, default=" ")
    isCoach = models.BooleanField(default=False)
    isStudent = models.BooleanField(default=True)
    
    
    def create_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    post_save.connect(create_profile, sender=User)
    

class Student(models.Model):
    goals = models.ManyToManyField(Goal, blank=True, )
    coaches = models.ManyToManyField('Coach', blank=True, )
    sessions = models.ManyToManyField('Session', blank=True, )
    reviews = models.ManyToManyField('Review', blank=True, )
    questions = models.ManyToManyField('Question', blank=True, )
    settings = models.ForeignKey('StudentSettings', null=True, blank=True)
    plans = models.ManyToManyField(Plan,blank=True, )
    user = models.ForeignKey(User, null=True, blank=True)
    
class Coach(models.Model):
    students = models.ManyToManyField(Student, blank=True, )
    sessions = models.ManyToManyField('Session', related_name='sessions', blank=True, )
    reviews = models.ManyToManyField('Review', blank=True, )
    answers = models.ManyToManyField('Question', blank=True, )
    rating = models.FloatField(null=True)
    planTemplates = models.ManyToManyField(Plan,blank=True,  )
    rates = models.ManyToManyField('Rate', blank=True, )
    #domains = models.ManyToManyField(Domain, null=True)
    

class Rate(models.Model):
    inPersonRate = models.IntegerField(null=True)
    inPersonRateUnit = models.CharField(max_length=20, default="minute")
    realtimeRate = models.IntegerField(null=True)
    realtimeRateUnit = models.CharField(max_length=20, default="minute")
    feedbackRate = models.IntegerField(null=True)
    feedbackTurnaroundTime = models.CharField(max_length=20, default="minute")
    turnaroundUnit = models.CharField(max_length=20, default="minute")
    answerRate= models.IntegerField(null=True)
    activePlanManagementRate = models.IntegerField(null=True)
    activePlanManagementRateUnit = models.CharField(max_length=20, default="minute")
    
class Session(models.Model):
    startTime = models.DateTimeField(null=True)
    endTime = models.DateTimeField(null=True)
    duration = models.DurationField(null=True)
    #location = GeoPositionField()
    coach = models.ForeignKey(Coach, )
    students = models.ManyToManyField(Student, blank=True, )
    mode = models.CharField(max_length=20, default="minute") 
    media = models.URLField(null=True)
    isGroup = models.BooleanField(default=False)

class Review(models.Model):
    rating = models.FloatField(null=True)
    description = models.CharField(max_length=1000, null=True)
    title = models.CharField(max_length=80, null=True)
    author = models.ForeignKey(User, null=True, blank=True, related_name='author')
    isStudentReviewed = models.BooleanField(default=False)
    reviewedUser = models.OneToOneField(User, null=True, related_name='reviewedUser')
    
class Update(models.Model):
    goal = models.ForeignKey(Goal, null=True)
    measurement = models.FloatField(null=True)
    hasMetric = models.BooleanField(default=False)
    #metric
    step = models.ForeignKey(Step)
    author = models.ForeignKey(User, null=True, blank=True)
    description = models.CharField(max_length=1000)

class Post(models.Model):
    author = models.ForeignKey(User, null=True, blank=True)
    goal = models.ForeignKey(Goal, null=True)
    comments = models.ManyToManyField('Post', blank=True, )
    text = models.CharField(max_length=2000, null=True)


class Question(models.Model):
    text = models.CharField(max_length=2000, default=" ")
    author = models.ForeignKey(User, null=True, blank=True)
    needAnswerBy = models.DateTimeField(null=True)
    answers = models.ManyToManyField('Answer', blank=True, related_name='answers')
    media = models.URLField(null=True)
    price = models.IntegerField(null=True)
    
class Answer(models.Model):
    question = models.ForeignKey(Question, null=True)
    author = models.ForeignKey(User, null=True, blank=True)
    text = models.CharField(max_length=2000, default=" ")
    media = models.URLField(null=True)
    votes = models.IntegerField(null=True)
    
class Image(models.Model):
    image = models.ImageField(default=True)

class StudentSettings(models.Model):
    allNotifications = models.BooleanField(default=True)
    