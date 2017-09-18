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
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user, get_user_model
from colorfield.fields import ColorField
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.core.validators import MinLengthValidator
from django.utils import timezone
from django.utils.crypto import get_random_string
import json
import ast
from django.db.models import Q
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models.query import QuerySet
from django_group_by import GroupByMixin
from tinymce.models import HTMLField
from tinymce.widgets import TinyMCE



TIME_COMMITMENT_CHOICES = (
("10m", "10 minutes per day"),
("20m", "20 minutes per day"),
("30m", "30 minutes per day"),
("40m", "40 minutes per day"),
("50m", "50 minutes per day"),
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

PROGRAM_CATEGORY_CHOICES = (
    ("UNCATEGORIZED", "Uncategorized"),
    ("HEALTH_AND_FITNESS", "Health & Fitness"),
    ("FAMILY", "Family"),
    ("RELATIONSHIPS", "Relationships"),
    ("CAREER", "Career"),
    ("EDUCATION_AND_SKILLS", "Education & Skills"),
    ("MONEY", "Money"),

)

VIEWABLE_CHOICES = (
    ("ONLY_ME", "Only me"),
    #("SHARED", "Just people I've shared this with"),
    #("ONLY_COACHES", "Just my coaches"),
    #("ALL_COACHES", "All coaches"),
    ("ANYONE", "Anyone"),
    
    )
PROGRAM_VIEWABLEBY_CHOICES =(
    ("ONLY_ME", "Only me"),
    #("ONLY_CLIENTS", "Just my clients"),
    ("ANYONE", "Anyone"),

    )

PROGRAM_COST_FREQUENCY_METRIC_CHOICES = (
    ("MONTH", "Per Month" ),
    ("WEEK", "Per Week" ),
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
    ("decimal", "decimal"),
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
    ('TEXT', "Text"),
    ('NOTIFICATION_REFERENCE', 'Notification Reference'),
    ('NOTIFICATION', 'Notification')


)

KCHANNEL_PERMISSION_CHOICES = (
    ('ONLYRECEIVER_ONLYSENDER', "Only receiver and sender"),
    ('ONLYRECEIVER_ANYSENDER', "Only receiver, any sender"),

)

DURATION_CHOICES = [
    ('1', "1 minute"),
    ('2', "2 minutes"),
    ('3', "3 minutes"),
    ('4', "4 minutes"),
    ('5', "5 minutes"),
    ('6', "6 minutes"),
    ('7', "7 minutes"),
    ('8', "8 minutes"),
    ('9', "9 minutes"),
    ('10', "10 minutes"),
    ('15', "15 minutes"),
    ('20', "20 minutes"),
    ('30', "30 minutes"),
    ('45', "45 minutes"),
    ('(60', "1 hour"),
    ('90', "1.5 hours"),
    ('120', "2 hours"),
    ('150', "2.5 hours"),
    ('180', "3 hours"),
]

START_TIME_CHOICES = [
    ('12:00', "12:00 am"),
    ('12:30', "12:30 am"),
    ('01:00',  "1:00 am"),
    ('01:30',  "1:30 am"),
    ('02:00',  "2:00 am"),
    ('02:30',  "2:30 am"),
    ('03:00',  "3:00 am"),
    ('03:30',  "3:30 am"),
    ('04:00',  "4:00 am"),
    ('04:30',  "4:30 am"),
    ('05:00',  "5:00 am"),
    ('05:30',  "5:30 am"),
    ('06:00',  "6:00 am"),
    ('06:30',  "6:30 am"),
    ('07:00',  "7:00 am"),
    ('07:30',  "7:30 am"),
    ('08:00',  "8:00 am"),
    ('08:30',  "8:30 am"),
    ('09:00',  "9:00 am"),
    ('09:30',  "9:30 am"),
    ('10:00', "10:00 am"),
    ('10:30', "10:30 am"),
    ('11:00', "11:00 am"),
    ('11:30', "11:30 am"),
    ('12:00', "12:00 pm"),
    ('12:30', "12:30 pm"),
    ('13:00',  "1:00 pm"),
    ('13:30',  "1:30 pm"),
    ('14:00',  "2:00 pm"),
    ('14:30',  "2:30 pm"),
    ('15:00',  "3:00 pm"),
    ('15:30',  "3:30 pm"),
    ('16:00',  "4:00 pm"),
    ('16:30',  "4:30 pm"),
    ('17:00',  "5:00 pm"),
    ('17:30',  "5:30 pm"),
    ('18:00',  "6:00 pm"),
    ('18:30',  "6:30 pm"),
    ('19:00',  "7:00 pm"),
    ('19:30',  "7:30 pm"),
    ('20:00',  "8:00 pm"),
    ('20:30',  "8:30 pm"),
    ('21:00',  "9:00 pm"),
    ('21:30',  "9:30 pm"),
    ('22:00', "10:00 pm"),
    ('22:30', "10:30 pm"),
    ('23:00', "11:00 pm"),
    ('23:30', "11:30 pm"),
    ]


NOTIFICATION_METHOD_CHOICES = [
    ('EMAIL_AND_TEXT',"Email and Text"),
    ('EMAIL',  "Email Only"),
    ('TEXT',"Text Only"),
    ('NO_NOTIFICATIONS',  "I don't want any notifications")
]



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
    title = models.CharField(max_length=200, default="", blank=False, null=True,)
    deadline = models.DateField(null=True, default=datetime.date.today, blank=False)
    description = models.CharField(max_length=2000, null=True, blank=False)
    why = models.CharField(max_length=2000, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    votes = models.IntegerField(null=True, blank=True)
    viewableBy = models.CharField(max_length=20, choices=VIEWABLE_CHOICES, default="ONLY_ME")
    user = models.ForeignKey(User)
    wasAchieved = models.BooleanField(default=False)
    metric = models.CharField(max_length=100, blank=True, null=True)


    #plans = models.ManyToManyField("Plan", blank=True, related_name='plans')
    #metric = 
    def __str__(self):
        return "%s" % (self.title)




    def get_planOccurrences(self):
        #str_w_quotes = ast.literal_eval(my_str)
        planOccurrences = PlanOccurrence.objects.filter(goal=self)

        return planOccurrences


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError




class Program(models.Model):

    title = models.CharField(max_length=200, default=" ")
    author = models.ForeignKey(User, null=True, blank=True)
    description = models.CharField(max_length=1000, default=" ")
    image = models.CharField(max_length=200, null=True, blank=True)
    viewableBy = models.CharField(max_length=20, choices=PROGRAM_VIEWABLEBY_CHOICES, default="ONLY_ME")
    steps = models.ManyToManyField('Step', blank=True, related_name='steps')
    scheduleLength = models.CharField(max_length=20, null=False, choices=SCHEDULE_LENGTH_CHOICES, default="3m")
    startDate = models.DateField(null=True, blank=True)
    timeCommitment = models.CharField(max_length=100, choices=TIME_COMMITMENT_CHOICES, blank=True, default="1h")
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    costFrequencyMetric = models.CharField(max_length=20, choices=PROGRAM_COST_FREQUENCY_METRIC_CHOICES, default="PER MONTH")
    category = models.CharField(max_length=20, choices=PROGRAM_CATEGORY_CHOICES, default="UNCATEGORIZED")


    def get_userPlanOccurrenceId(self, theUser):
        try:
            thePlanOccurrence = PlanOccurrence.objects.get(program=self, user=theUser, isSubscribed=True)
            return thePlanOccurrence.id
        except:
            return ""

    def __str__(self):
        return "%s" % (self.title)

    def get_steps(self):
        return Step.objects.filter(program=self)

    def get_goals(self):
        return Goal.objects.filter(program=self)



    '''def get_scheduleLength(self):
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
        return "%s %s" % (formattedScheduleLength, metric)'''

    def get_author_id(self):
        return "%s" % self.author.id

    def get_author_fullName(self):
        return "%s" % self.author.profile.get_fullName()

    def get_author_profilePhoto(self):
        return "%s" % self.author.profile.profilePhoto


class Step(models.Model):
    program = models.ForeignKey(Program, null=True, blank=True)
    title = models.CharField(max_length=100, default=" ")
    description = models.CharField(max_length=1000, default=" ")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, null=False, default='ONCE')
    image = models.CharField(max_length=200, null=True, blank=True, default="images/stepDefaultImage.svg")


    # These dates are absolute dates and are used to calculate the startDate and endDate
    absoluteStartDate = models.DateField(blank=True, null=True)
    absoluteEndDate = models.DateField(blank=True, null=True)

    # Relative start and end dates are in reference to the associated Plan start date
    startDate = models.IntegerField(blank=True, null=True)
    endDate = models.IntegerField(blank=True, null=True)

    startTime = models.CharField(max_length=20, blank=True, default=" ", choices=START_TIME_CHOICES,)

    # If useAbsoluteTime is True, the timezone value will be used to set it so all people on the step will be doing things at the same time
    useAbsoluteTime = models.BooleanField(blank=True, default=False)
    timezone = TimeZoneField(blank=True, null=True, default='America/Los_Angeles' )
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES, null=False, default='1')

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

    def get_programStartDate(self):
        try:
            programStartDate = Program.objects.get(id=self.program.id).startDate
        except:
            programStartDate = None
        return programStartDate






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
        updateOccurrences = UpdateOccurrence.objects.filter(stepOccurrence=self)
        return updateOccurrences

    @classmethod
    def test(self):
        print("inside test")


class Contact(models.Model):
    sender = models.ForeignKey('Profile', related_name="contact_sender")
    receiver = models.ForeignKey('Profile', related_name="contact_receiver")
    relationship = models.CharField(max_length=20, default=" ")
    wasConfirmed = models.CharField(max_length=20, default=" ", blank=True)

    def get_senderBio(self):
        return self.sender.bio


    def get_senderProfile(self):
        theQueryset = Profile.objects.filter(id=self.sender.id)

        return theQueryset

    def get_receiverProfile(self):
        theQueryset = Profile.objects.filter(id=self.receiver.id)

        return theQueryset



class PlanOccurrence(models.Model):
    program = models.ForeignKey(Program, null=True, blank=True)
    goal = models.ForeignKey(Goal, null=True, blank=True)
    startDate = models.DateField(blank=True, null=True)
    user = models.ForeignKey(User, null=True, blank=True)
    isSubscribed = models.BooleanField(default=False)

    notificationEmail = models.EmailField(max_length=70, blank=True)
    notificationPhone = PhoneNumberField(blank=True)
    notificationMethod = models.CharField(max_length=20, blank=False, default='NO_NOTIFICATIONS', choices=NOTIFICATION_METHOD_CHOICES)
    notificationSendTime = models.CharField(max_length=10, blank=True, choices=START_TIME_CHOICES)



    def __str__(self):
        return "Program: %s, User: %s" % (self.program,  self.user)

    def get_theProgram(self):
        return Program.objects.get(id=self.program.id)










class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=2000, default=" ", blank=True)
    isCoach = models.BooleanField(default=False)
    firstName = models.CharField(max_length=100, default=" ", null=True, blank=True)
    lastName = models.CharField(max_length=100, default=" ", null=True, blank=True)
    zipCode = models.CharField(max_length=10, blank=True, null=True)
    profilePhoto = models.CharField(max_length=200, null=True, blank=True, default="images/user.svg")
    notificationChannel = models.OneToOneField('KChannel', null=True, blank=True)
    expoPushToken = models.CharField(max_length=100, blank=True, null=True)
    timezone = TimeZoneField(blank=True, null=True, default='America/Los_Angeles' )




    def get_profilePhoto(self):
        return self.profilePhoto



    def get_notificationChannel(self):

        if self.notificationChannel != None:
            theNotificationChannel = self.notificationChannel
        else:
            theNotificationChannel = self.createNotificationChannel()

        return theNotificationChannel

    def get_notificationChannelLabel(self):
        try:
            #theNotificationChannel = KChannel.objects.get(id=self.notificationChannel)
            return self.notificationChannel.label
        except:
            return ""



    def createNotificationChannel(self):
        self.notificationChannel = KChannel.objects.create_channel([self.user.id], "ONLYRECEIVER_ANYSENDER")
        self.save()
        return self.notificationChannel;



    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance, firstName=instance.first_name, lastName = instance.last_name)
            Goal.objects.create(user=instance, title="My first goal")

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()

    def save(self, *args, **kwargs):
        super(Profile, self).save(*args, **kwargs)
        if self.notificationChannel == None:
            self.notificationChannel = KChannel.objects.create_channel([self.user.id], 'ONLYRECEIVER_ANYSENDER')
            self.save()

    def get_goals(self):
        return Goal.objects.filter(user=user.id)

    def get_programs(self):
        return Program.objects.filter(user=user.id)

    def get_planOccurrences(self):
        return PlanOccurrence.objects.filter(user=user.id)

    def get_stepOccurrences(self):
        return StepOccurrence.object.filter(user=user.id)

    def get_fullName(self):
        return "%s %s" % (self.firstName, self.lastName)

    def __str__(self):
        return "Username: %s Name: %s %s" % (self.user, self.firstName, self.lastName)

    #post_save.connect(create_profile, sender=User)

class SearchQuery(models.Model):
    query = models.CharField(max_length=2000, default=" ")




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

class Label(models.Model):
    text = models.CharField(max_length=20, blank=False, default = "")
    color = ColorField(default="#2199E8", )
    type = models.CharField(max_length=20, blank=False, default = "")
    user = models.ForeignKey(User, null=False, blank=False)

    def __str__(self):
        return "%s" % (self.text)

class Message(models.Model):
    text = models.CharField(max_length=1000, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    thread = models.ForeignKey('MessageThread', null=False, blank=False, related_name="messageThread")
    sender = models.ForeignKey(User, null=False, blank=False, related_name="messageSender")
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    typeOfMessage = models.TextField(choices=NOTIFICATION_CHOICES)



    def __str__(self):
        return "%s" % (self.text)

class KRMessage(models.Model):
    channel = models.ForeignKey('KChannel', related_name='krmessages')
    typeOfMessage = models.TextField(choices=NOTIFICATION_CHOICES)
    message = models.TextField()
    sender = models.ForeignKey(User, null=True, blank=False)
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)



class KChannelManager(models.Manager):
    def create_channel(self, theUserIds, thePermission):
        print("inside create_channel")
        print(thePermission)
        theChannel = KChannel.objects.create()
        if thePermission:
            theChannel.permission = thePermission
            theChannel.save()

        for theUserId in theUserIds:
            theChannelUser = KChannelUser.objects.create(channel_id=theChannel.id, user_id=theUserId)
            theChannelUser.save()

        return theChannel

    def create(self, **kwargs):
        """
        Creates a new object with the given kwargs, saving it to the database
        and returning the created object.
        """
        obj = self.model(**kwargs)

        self._for_write = True

        obj.save(force_insert=True, using=self.db)

        return obj

class KChannel(models.Model):
    label = models.TextField(max_length=16, unique=True)
    users = models.ManyToManyField(User, blank=True, through="KChannelUser", related_name="%(app_label)s_%(class)s_related")
    permission = models.CharField(max_length=30, choices=KCHANNEL_PERMISSION_CHOICES, default="ONLYRECEIVER_ONLYSENDER", )

    objects=KChannelManager()

    def save(self, *args, **kwargs):
        if self.id:
            print("inside channel save")

            super(KChannel, self).save(*args, **kwargs)

        else:
            print("no id")
            unique = False
            while not unique:
                print("while not unique")
                try:
                    print("try")

                    self.label = get_random_string(length=16, allowed_chars=u'-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                    print("self.label %s" % self.label)

                    super(KChannel, self).save(*args, **kwargs)
                    print("saved")
                except IntegrityError:
                    self.label = get_random_string(length=16, allowed_chars=u'-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                else:
                    unique = True

    def __str__(self):
        return "%s" % (self.label)


class KChannelUser(models.Model):
    channel = models.ForeignKey(KChannel )
    user = models.ForeignKey(User)

    def __str__(self):
        return "ChannelLabel: %s %s " % (self.channel.label, self.user)






class MessageThread(models.Model):
    sender = models.ForeignKey(User, null=False, blank=False, related_name="sender")
    receiver = models.ForeignKey(User, null=False, blank=False, related_name="receiver")
    labels = models.ManyToManyField('Label', blank=True, related_name="labels")
    channel = models.OneToOneField('KChannel', blank=True, null=True)

    def get_latest_message(self):
        try:
            if Message.objects.filter(thread=self).exists():
                return [Message.objects.filter(thread=self).latest('created_at')][0].text
            else:
                return "No messages in this thread"
        except:
            return "No messages in this thread"


    def get_messages(self):
        messages = Message.objects.filter(thread=self)
        return messages

    def __str__(self):
        return "%s %s" % (self.id, self.get_latest_message())

    def get_labels(self):
        return self.labels.all().values()



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
    audio = models.CharField(max_length=100, blank=True, null=True)
    video = models.CharField(max_length=100, blank=True,null=True)
    picture = models.CharField(max_length=100, blank=True,null=True)
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


class BlogPost(models.Model):
    author = models.ForeignKey(User, null=True, blank=True)
    title = models.CharField(max_length=200, default=" ")
    description = HTMLField()
    created = models.DateTimeField(editable=False)
    modified = models.DateTimeField()
    def __str__(self):
        return "%s" % (self.title)


    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        self.modified = timezone.now()
        return super(BlogPost, self).save(*args, **kwargs)



