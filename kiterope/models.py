from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.files.storage import default_storage
from tinymce import models as tinymce_models
import pytz
from timezone_field import TimeZoneField
import datetime


TIME_COMMITMENT_CHOICES = (
    ("1h", "1 hour per day"),
    ("2h", "2 hours per day"),
    ("3h", "3 hours per day"),
    ("4h", "4 hours per day"),
    ("5h", "5 hours per day"),
    ("8h", "8 hours per day"),

)

SESSION_TYPE_CHOICES = (
    ("TRIAL", "Trial"),
    ("PAID", "Paid"),

)

VIEWABLE_CHOICES = (
    ("ONLY_ME", "Only me"),
    ("SHARED", "Just people I've shared this goal with"),
    ("MY_COACHES", "Just my coaches"),
    ("ALL_COACHES", "All coaches"),
    ("ANYONE", "Anyone"),
    
    )
PLAN_VIEWABLEBY_CHOICES =(
    ("ONLY_ME", "Only me"),
    ("ONLY_CLIENTS", "Just my clients"),
    ("ANYONE", "Anyone"),

    )

PLAN_COST_FREQUENCY_METRIC_CHOICES = (
    ("FREE", "Free"),
    ("MONTH", "Per Month" ),
    ("ONE_TIME", "One Time" ),

)
TIME_METRIC_CHOICES = (
    ("DAY", "Day"),
    ("WEEK", "Week"),
    ("MONTH", "Month"),
)

FREQUENCY_CHOICES = (
    ("ONCE", "Once"),
    ("DAILY", "Daily"),
    ("WEEKLY", "Weekly"),
    ("MONTHLY", "Monthly"),
)

UPDATE_METRIC_CHOICES = (
    ("TEXT", "Text"),
    ("VALUE", "Value"),
    ("QUANTITY", "Quantity"),
    ("DISTANCE", "Distance"),
    ("HEIGHT", "Height"),
    ("DEPTH", "Depth"),
    ("TEMPERATURE", "Temperature"),
    ("WEIGHT", "Weight"),
    ("TIME", "Time"),
    ("VIDEO", "Video File"),
    ("AUDIO", "Audio File"),
    ("VOLUME", "Volume")
)

METRIC_FORMAT_CHOICES = (
    ("text", "text"),
    ("integer","integer"),
    ("float", "float"),
    ("url", "url"),
    ("picture", "picture"),
    ("video", "video"),
    ("audio", "audio"),


)

PARTICIPANT_CHOICES = (
    ("INITIATING_USER", "Initiating User"),
    ("USER","User"),
    ("INITIATING_COACH", "Initiating Coach"),
    ("COACH", "Coach"),

)

SCHEDULE_LENGTH_CHOICES = (
    ('1w', "1 week"),
    ('2w',  "2 weeks"),
    ('3w', "3 weeks"),
    ('1m', "1 month"),
    ('6w', "6 weeks"),
    ('2m', "2 months"),
    ('10w', "10 weeks"),
    ('3m', "3 months"),
    ('4m', "4 months"),
    ('5m', "5 months"),
    ('6m', "6 months"),
    ('7m', "7 months"),
    ('8m', "8 months"),
    ('9m', "9 months"),
    ('10m', "10 months"),
    ('11m', "11 months"),
    ('1y', "1 year"),
)

NOTIFICATION_CHOICES = (
    ('CALL', "Call"),

)

class NotificationManager(models.Manager):

    def create_notification(self, theUserId, sessionId, theType):
        print("create notification called")
        notification = self.create(user_id=theUserId, call_id=sessionId, type=theType)


        return notification

    def create(self, **kwargs):
        """
        Creates a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)

        self._for_write = True

        obj.save(force_insert=True, using=self.db)

        return obj

class Notification(models.Model):
    user = models.ForeignKey(User)
    type = models.CharField(max_length=20, choices=NOTIFICATION_CHOICES)
    call = models.ForeignKey("Session")

    objects = NotificationManager()




class Interest(models.Model):
    name = models.CharField(max_length=30, default = " ")
    email = models.EmailField(max_length=70,)
    goal = models.CharField(max_length=1000, default = " ")

    def __str__(self):
        return "%s" % (self.name)

class Goal(models.Model):
    title = models.CharField(max_length=200, default=" ", blank=True)
    deadline = models.CharField(max_length=16, default = " " , null=True, blank=True)
    description = models.CharField(max_length=2000, default = " ", null=True, blank=True)
    coreValues = models.CharField(max_length=2000, default = " ", null=True, blank=True)
    goalInAlignmentWithCoreValues = models.BooleanField(default=False)
    obstacles = models.CharField(max_length=2000, default=" ", null=True, blank=True)
    isThisReasonable = models.BooleanField(default=False)
    why = models.CharField(max_length=2000, default = " ", null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    votes = models.IntegerField(null=True, blank=True)
    viewableBy = models.CharField(max_length=20, choices=VIEWABLE_CHOICES, default="ONLY_ME")
    user = models.ForeignKey(User)
    coaches = models.ManyToManyField('Coach', blank=True, related_name='coaches')
    updates = models.ManyToManyField('Update', blank=True, related_name='updates')
    wasAchieved = models.BooleanField(default=False)
    metric = models.CharField(max_length=100, default=" ", blank=True, null=True)

    plans = models.ManyToManyField("Plan", blank=True, related_name='plans')
    #metric = 
    def __str__(self):
        return "%s" % (self.title)

    #def get_plans(self):
    #    return Plan.objects.filter(goals=self)
    
    



class Plan(models.Model):
    title = models.CharField(max_length=200, default=" ")
    author = models.ForeignKey(User, null=True, blank=True)
    description = models.CharField(max_length=1000, default=" ")
    image = models.CharField(max_length=200, null=True, blank=True)
    calendar = models.FileField(null=True, upload_to='calendars', blank=True)
    viewableBy = models.CharField(max_length=20, choices=PLAN_VIEWABLEBY_CHOICES, default="ONLY_ME")
    steps = models.ManyToManyField('Step', blank=True, related_name='steps')
    goals = models.ManyToManyField(Goal, blank=True, )
    scheduleLength = models.CharField(max_length=20, null=False, choices=SCHEDULE_LENGTH_CHOICES, default="3m")
    templatePlan = models.ForeignKey('Plan', null=True, blank=True)
    startDate = models.DateField(null=True, blank=True)
    users = models.ManyToManyField(User, blank=True, related_name='users')
    timeCommitment = models.CharField(max_length=100, choices=TIME_COMMITMENT_CHOICES, blank=True, default="1h")
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    costFrequencyMetric = models.CharField(max_length=20, choices=PLAN_COST_FREQUENCY_METRIC_CHOICES, default="PER MONTH")



    def __str__(self):
        return "%s" % (self.title)

    def get_steps(self):
        return Step.objects.filter(plan=self)

    def get_goals(self):
        return Goal.objects.filter(plan=self)

    def get_scheduleLength(self):
        theScheduleLength = self.scheduleLength
        if theScheduleLength > 90:
            metric = "months"
            formattedScheduleLength = floor(theScheduleLength/30)
        elif theScheduleLength > 14:
            formattedScheduleLength = floor(theScheduleLength/7)
            metric = "weeks"
        else:
            formattedScheduleLength = theScheduleLength
            metric="days"
        return "%s %s" % (formattedScheduleLength, metric)

    def get_author_id(self):
        return "%s" % self.author.id

class Step(models.Model):
    plan = models.ForeignKey(Plan, null=True, blank=True)
    title = models.CharField(max_length=100, default=" ")
    description = tinymce_models.HTMLField(blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, null=False, default='ONCE')

    # These dates are absolute dates and are used to calculate the startDate and endDate
    absoluteStartDate = models.DateField(blank=True, null=True)
    absoluteEndDate = models.DateField(blank=True, null=True)

    # Relative start and end dates are in reference to the associated Plan start date
    startDate = models.IntegerField(blank=True, null=True)
    endDate = models.IntegerField(blank=True, null=True)

    startTime = models.CharField(max_length=20, blank=True, default=" ")

    # If useAbsoluteTime is True, the timezone value will be used to set it so all people on the step will be doing things at the same time
    useAbsoluteTime = models.BooleanField(blank=True, default=False)
    timezone = TimeZoneField(blank=True, null=True, default='America/Los_Angeles' )


    duration = models.IntegerField(blank=True, null=True)
    durationMetric = models.CharField(max_length=10, blank=True, default="Hour")

    day01 = models.BooleanField(default=False)
    day02 = models.BooleanField(default=False)
    day03 = models.BooleanField(default=False)
    day04 = models.BooleanField(default=False)
    day05 = models.BooleanField(default=False)
    day06 = models.BooleanField(default=False)
    day07 = models.BooleanField(default=False)

    monthlyDates = models.CharField(max_length=40, blank=True, null=True)

    def __str__(self):
        return "%s" % (self.title)

    def get_updates(self):
        return Update.objects.filter(step=self)

class StepOccurrenceManager(models.Manager):
    def create_occurrence(self, aStepId, aDate, aPlanOccurrenceId, theUser):
        #print("inside create_occurrence")
        #print("aStepId %d" % aStepId)
        #print("aDate %s" % aDate)
        #print("aPlanOccurrenceId %d" % aPlanOccurrenceId)
        #print("aPlanOccurrenceId %d" % aPlanOccurrenceId)
        #print("theUser %d" % theUser)

        occurrence = self.create(step_id=aStepId, date = aDate, planOccurrence_id = aPlanOccurrenceId, wasCompleted=False, user_id = theUser)
        occurrence.full_clean()
        #print("after Created")
        # do something with the book
        return occurrence

class StepOccurrence(models.Model):
    step = models.ForeignKey(Step, null=True, blank=True)
    date = models.DateTimeField(blank=True, null=True)
    planOccurrence = models.ForeignKey("PlanOccurrence", null=True, blank=True)
    wasCompleted = models.BooleanField(default=False)
    user = models.ForeignKey(User, null=True, blank = True)
    posts = models.ManyToManyField('Post', blank=True, )


    objects = StepOccurrenceManager()

    def get_step(self):
        theStep = Step.objects.get(pk=step.id)
        return theStep

    def get_title(self):
        theStep = Step.objects.get(pk=step.id)
        return theStep.title

    def get_description(self):
        theStep = Step.objects.get(pk=step.id)
        return theStep.description

    def get_updateOccurrences(self):
        updateOccurrences = UpdateOccurrence.objects.filter(stepOccurrence_id=id)
        return updateOccurrences

    @classmethod
    def test(self):
        print("inside test")





class PlanOccurrence(models.Model):
    plan = models.ForeignKey(Plan, null=True, blank=True)
    goal = models.ForeignKey(Goal, null=True, blank=True)
    startDate = models.DateField(blank=True, null=True)
    user = models.ForeignKey(User, null=True, blank=True)


class Profile(models.Model):
    user = models.ForeignKey(User, null=True, blank=True)
    bio = models.CharField(max_length=2000, default=" ")
    isCoach = models.BooleanField(default=False)
    firstName = models.CharField(max_length=100, default=" ", null=True, blank=True)
    lastName = models.CharField(max_length=100, default=" ", null=True, blank=True)
    zipCode = models.CharField(max_length=10, blank=True, null=True)
    profilePhoto = models.FileField(null=True, upload_to='images', blank=True)
    
    
    def create_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    def get_goals(self):
        return Goal.objects.filter(user=user.id)

    def get_plans(self):
        return Plan.objects.filter(user=user.id)

    def get_planOccurrences(self):
        return PlanOccurrence.objects.filter(user=user.id)

    def get_stepOccurrences(self):
        return StepOccurrence.object.filter(user=user.id)

    def __str__(self):
        return "Username: %s Name: %s %s" % (self.user, self.firstName, self.lastName)

    post_save.connect(create_profile, sender=User)

class SearchQuery(models.Model):
    query = models.CharField(max_length=2000, default=" ")
    

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

class Metric(models.Model):
    measuringWhat = models.CharField(max_length=30, default="emotions and thoughts")
    units = models.CharField(max_length=10, null=True, blank=True, default = " ")
    format = models.CharField(max_length=10, choices=METRIC_FORMAT_CHOICES, default="text")


    def __str__(self):
        return "%s in %s using %s" % (self.measuringWhat, self.units, self.format)

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
    


class SessionManager(models.Manager):
    def create_session(self, theTokBoxSessionId, theTokBoxToken):

        session = self.create(tokBoxSessionId=theTokBoxSessionId, tokBoxToken=theTokBoxToken)

        return session

    def create(self, **kwargs):
        """
        Creates a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)

        self._for_write = True

        obj.save(force_insert=True, using=self.db)

        return obj

class Session(models.Model):
    startTime = models.DateTimeField(null=True)
    endTime = models.DateTimeField(null=True)
    duration = models.DurationField(null=True)
    type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default="TRIAL")
    rate = models.ForeignKey("Rate", blank=True, null=True)
    tokBoxSessionId = models.CharField(max_length=100, blank=True)
    tokBoxToken = models.CharField(max_length=100, blank=True)

    objects = SessionManager()


    def get_participants(self):
        return Participant.object.filter(session_id=id)


    def __str__(self):
        return "%s" % (self.tokBoxSessionId)



class ParticipantManager(models.Manager):

    def create_participant(self, theUserId, isInitiator, sessionId):
        #print("inside create_occurrence")
        #print("aStepId %d" % aStepId)
        #print("aDate %s" % aDate)
        #print("aPlanOccurrenceId %d" % aPlanOccurrenceId)
        #print("theUser %d" % theUser)
        userProfile = Profile.objects.filter(user=theUserId).first()

        if userProfile.isCoach:
            theRole = "COACH"
        else:
            theRole = "USER"

        if isInitiator:
            theRole = "INITIATING_" + theRole
            theJoiningTime = datetime.datetime.now()
            participant = self.create(user_id=theUserId, role=theRole, joiningTime = theJoiningTime, session_id=sessionId)


        else:
            participant=self.create(user_id=theUserId, role=theRole, session_id=sessionId)

        # do something with the book
        return participant

    def create(self, **kwargs):
        """
        Creates a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)

        self._for_write = True

        obj.save(force_insert=True, using=self.db)

        return obj

class Participant(models.Model):
    session = models.ForeignKey(Session, null=False)
    user = models.ForeignKey(User)
    role = models.CharField(max_length=20, choices=PARTICIPANT_CHOICES)
    joiningTime = models.DateTimeField(null=True, blank=True)
    leavingTime = models.DateTimeField(null=True, blank=True)

    objects = ParticipantManager()

class Review(models.Model):
    rating = models.FloatField(null=True)
    description = models.CharField(max_length=1000, null=True)
    title = models.CharField(max_length=80, null=True)
    author = models.ForeignKey(User, null=True, blank=True, related_name='author')
    isStudentReviewed = models.BooleanField(default=False)
    reviewedUser = models.OneToOneField(User, null=True, related_name='reviewedUser')
    
class Update(models.Model):
    measuringWhat = models.CharField(max_length=30, default="emotions and thoughts")
    units = models.CharField(max_length=10, null=True, blank=True, default=" ")
    format = models.CharField(max_length=10, choices=METRIC_FORMAT_CHOICES, default="text")
    metricLabel = models.CharField(max_length=100, default="Please provide an update:")
    step = models.ForeignKey(Step, null=True, blank=True)

    def __str__(self):
        return "%s, metric: %s in %s using %s" % (self.metricLabel, self.measuringWhat, self.units, self.format)



class UpdateOccurrenceManager(models.Manager):

    def create_occurrence(self, aStepOccurrenceId, anUpdateId):
        #print("inside create_occurrence")
        #print("aStepId %d" % aStepId)
        #print("aDate %s" % aDate)
        #print("aPlanOccurrenceId %d" % aPlanOccurrenceId)
        #print("theUser %d" % theUser)
        print("aStepOccurrenceId %s, anUpdateId %s" % (aStepOccurrenceId, anUpdateId))
        occurrence = self.create(stepOccurrence_id= aStepOccurrenceId, update_id=anUpdateId)

        print("after Created")

        occurrence.full_clean()
        # do something with the book
        return occurrence

    def create(self, **kwargs):
        """
        Creates a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)

        self._for_write = True

        obj.save(force_insert=True, using=self.db)
        print("inside create2")

        return obj




class UpdateOccurrence(models.Model):
    update = models.ForeignKey(Update, null=False, related_name="update")
    stepOccurrence = models.ForeignKey(StepOccurrence, null=False,  related_name="stepOccurrence")
    author = models.ForeignKey(User, null=True, blank=True)

    time = models.TimeField(null=True, blank=True)
    integer = models.IntegerField(null=True, blank=True)
    decimal = models.FloatField(null=True, blank=True)
    audio = models.FileField(null=True, blank=True, upload_to='updates_audio')
    video = models.FileField(null=True, blank=True, upload_to='updates_video')
    picture = models.FileField(null=True, blank=True, upload_to='updates_picture')
    url = models.URLField(null=True, blank=True)
    text = models.CharField(max_length=100, blank=True,)
    longText = models.CharField(max_length=1000, blank=True, )

    objects = UpdateOccurrenceManager()



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

