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
from django.utils import timezone
from kiterope.helpers import toUTC
from kiterope.expoPushNotifications import send_push_message
from django_celery_beat.models import PeriodicTask, IntervalSchedule, CrontabSchedule
import datetime
from datetime import timedelta
from dateutil.rrule import rrule, DAILY





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

VISUALIZATION_CHOICES = (
    ("LINE", "Line Graph"),
    ("BAR", "Bar Graph")
)

STEP_TYPE_CHOICES = (
    ("COMPLETION", "Completion-Based Step"),
    ("TIME", "Time-Based Step"),
    #("ORDERED_COMPLETION", "Ordered, Completion-Based Step"),
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
    ("boolean", "boolean"),
    ("datetime", "datetime"),

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
    ('00:00', "12:00 am"),
    ('00:30', "12:30 am"),
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
    ('APP_TEXT_EMAIL', "App, Text, and Email"),
    ('APP_TEXT', "App and Text"),
    ('APP_EMAIL',"App and Email"),
    ('TEXT_EMAIL', "Text and Email"),
    ('APP', "App Only"),
    ('TEXT', "Text Only"),
    ('EMAIL', "Email Only"),
    ('NO_NOTIFICATIONS',  "I don't want any notifications"),
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
    obstacles = models.CharField(max_length=2000, null=True, blank=False)
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
    costFrequencyMetric = models.CharField(max_length=20, choices=PROGRAM_COST_FREQUENCY_METRIC_CHOICES, default="MONTH")
    category = models.CharField(max_length=20, choices=PROGRAM_CATEGORY_CHOICES, default="UNCATEGORIZED")
    isActive = models.BooleanField(blank=True, default=True)


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

    def get_updates(self):
        return Update.objects.filter(program=self)

    def get_visualizations(self):
        return Visualization.objects.filter(program=self)



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
    title = models.CharField(max_length=100, blank=False, default="")
    description = models.CharField(max_length=1000, default="")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, null=False, default='ONCE')
    image = models.CharField(max_length=200, null=True, blank=True, default="images/stepDefaultImage.svg")
    type = models.CharField(max_length=30, null=False, choices=STEP_TYPE_CHOICES, default='COMPLETION')


    # These dates are absolute dates and are used to calculate the startDate and endDate
    absoluteStartDate = models.DateField(blank=True, null=True)
    absoluteEndDate = models.DateField(blank=True, null=True)

    # Relative start and end dates are in reference to the associated Plan start date
    startDate = models.IntegerField(blank=True, null=True)
    endDate = models.IntegerField(blank=True, null=True)

    startTime = models.CharField(max_length=20, blank=True, null=True, default="09:00" ,choices=START_TIME_CHOICES,)

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

        return Update.objects.filter(steps=self)

    def get_visualizations(self):
        return Visualization.objects.filter(step=self)

    def get_programStartDate(self):
        try:
            programStartDate = Program.objects.get(id=self.program.id).startDate
        except:
            programStartDate = None
        return programStartDate

    # Converts the string of monthly dates to an array of integers
    def get_monthlyDatesArray(self):
        dateText = self.monthlyDates
        dateArrayWithRanges = dateText.split(",")
        dateArray = []
        for element in dateArrayWithRanges:
            print(element)
            if '-' in element:
                print(" dash in element")
                subElementArray = element.split("-")
                #print(subElementArray)
                startingSubElement = int(subElementArray[0])
                endingSubElement = int(subElementArray[1])
                for i in range(startingSubElement, (endingSubElement + 1), 1):
                    dateArray.append(i)
            else:
                dateArray.append(int(element))
        dateArray.sort()
        return dateArray



class Update(models.Model):
    name = models.CharField(max_length=60, blank=True)
    measuringWhat = models.CharField(max_length=30, default="emotions and thoughts")
    units = models.CharField(max_length=10, null=True, blank=True, default=" ")
    format = models.CharField(max_length=10, choices=METRIC_FORMAT_CHOICES, default="text")
    metricLabel = models.CharField(max_length=100, default="Please provide an update:")
    steps = models.ManyToManyField(Step, null=True, blank=True, related_name="kiterope_stepupdate")
    program = models.ForeignKey(Program, null=True, blank=True, )
    default = models.BooleanField(default=False)


    def __str__(self):
        return "Program: %s, Name: %s, %s, metric: %s in %s using %s" % (self.program, self.name, self.metricLabel, self.measuringWhat, self.units, self.format)
        #return "%s, metric: %s in %s using %s" % (self.metricLabel, self.measuringWhat, self.units, self.format)

    @receiver(post_save, sender=Step)
    def create_step_default_updates(sender, instance, created, **kwargs):
        if created:
            ThroughModel = Update.steps.through
            defaultUpdates = Update.objects.filter(program=instance.program, default=True )
            for defaultUpdate in defaultUpdates:
                ThroughModel.objects.bulk_create([ThroughModel(step_id=instance.pk, update_id=defaultUpdate.pk)])


    @receiver(post_save, sender=Program)
    def create_program_default_updates(sender, instance, created, **kwargs):
        if created:
            completionUpdate = Update.objects.create(measuringWhat="Completion", format="boolean",metricLabel="Was the step completed?", program=instance, default=True)
            absoluteDateTimeUpdate = Update.objects.create(measuringWhat="Absolute Date/Time", format="datetime", metricLabel="What was the absolute start date?", program=instance,default=True)
            relativeDateTimeUpdate = Update.objects.create(measuringWhat="Relative Date/Time", units="days", format="integer", metricLabel="What was the date in relation to plan start date?", program=instance, default=True)







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
    stepOccurrence = models.ForeignKey("StepOccurrence", null=False,  related_name="stepOccurrence")
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
    boolean = models.BooleanField(default=False)
    datetime = models.DateTimeField(blank=True, null=True)

    objects = UpdateOccurrenceManager()

    def get_stepOccurrenceDate(self):
        theStepOccurrence = StepOccurrence.objects.get(id=self.stepOccurrence.id)
        return theStepOccurrence.date

    def __str__(self):
        return "Name: %s Step: %s" % (self.update.name,  self.stepOccurrence)


class StepOccurrenceManager(models.Manager):
    def create_completionBased_occurrence(self, aStepId, aPlanOccurrenceId, theUserId):
        print("create_completionBased_occurrence")
        theStep = Step.objects.get(id=aStepId)
        theUserProfile = Profile.objects.get(user_id=theUserId)
        occurrence = self.create(step_id=aStepId, type=theStep.type, planOccurrence_id=aPlanOccurrenceId,
                                 wasCompleted=False, user_id=theUserId)
        occurrence.full_clean()
        return occurrence

    def create_scheduleBased_occurrence(self, aStepId, aDate, aPlanOccurrenceId, theUserId):


        theStep = Step.objects.get(id=aStepId)



        try:
            # If the step has a set time
            theStepStartTimeString = theStep.startTime
            theStepStartTimeStringComponents = theStepStartTimeString.split(":")
            theHour = theStepStartTimeStringComponents[0]
            theMinutes = theStepStartTimeStringComponents[1]
            theDatetime = aDate + datetime.timedelta(hours=int(theHour), minutes=int(theMinutes))

        except:
            theSettingsSet = SettingsSet.objects.get(user=theUserId)
            try:
                theStepStartTimeString = theSettingsSet.defaultNotificationSendTime
                theStepStartTimeStringComponents = theStepStartTimeString.split(":")
                theHour = theStepStartTimeStringComponents[0]
                theMinutes = theStepStartTimeStringComponents[1]
                theDatetime = aDate + datetime.timedelta(hours=int(theHour), minutes=int(theMinutes))
            except:
                theDatetime = aDate + datetime.timedelta(hours=int(9), minutes=int(0))
        print("create_scheduleBased_occurrence")
        print(theDatetime)



        if theStep.useAbsoluteTime:
            theProgramAuthorProfileTimezone = theStep.program.author.profile.timezone
            theUTCDatetime = toUTC(theDatetime, theProgramAuthorProfileTimezone)
            theUserProfile = Profile.objects.get(user_id=theUserId)

        else:

            theUserProfile = Profile.objects.get(user_id=theUserId)
            theUTCDatetime = toUTC(theDatetime, theUserProfile.timezone)


        theUTCMonth = theUTCDatetime.month
        theUTCDayOfTheMonth = theUTCDatetime.day

        theUTCHour = theUTCDatetime.hour

        theUTCMinute = theUTCDatetime.minute
        theDateString = theUTCDatetime.strftime("%Y-%m-%d %H:%M:%S")




        schedule = CrontabSchedule.objects.create(hour=theUTCHour, minute=theUTCMinute, month_of_year=theUTCMonth, day_of_month=theUTCDayOfTheMonth)
        thePlanOccurrence = PlanOccurrence.objects.get(id=aPlanOccurrenceId)


        if 'EMAIL' in thePlanOccurrence.notificationMethod:
            #print("inside EMAIL")
            periodicTaskString1 = "%s: %s - %s %s" % (theUserProfile.user, theStep.title, theDateString, datetime.datetime.now().microsecond)

            task = PeriodicTask.objects.create(crontab=schedule, name=periodicTaskString1,
                                               task='kiterope.tasks.send_email_notification',
                                               args=json.dumps([thePlanOccurrence.notificationEmail, theStep.title, "https://kiterope.com/stepOccurrences/" + theStep.id + "/" + "\n\n" + theStep.description]))
            #print("email section done")

        if 'APP' in thePlanOccurrence.notificationMethod:
            #print("inside APP")
            periodicTaskString2 = "%s: %s - %s %s" % (theUserProfile.user, theStep.title, theDateString, datetime.datetime.now().microsecond)

            #print("expoToekn")
            print(theUserProfile.expoPushToken)

            task = PeriodicTask.objects.create(crontab=schedule, name=periodicTaskString2,
                                               task='kiterope.tasks.send_app_notification',
                                               args=json.dumps([theUserProfile.expoPushToken, theStep.title]))
            #print("app section done")


        if 'TEXT' in thePlanOccurrence.notificationMethod:
            #print("inside TEXT")
            periodicTaskString3 = "%s: %s - %s %s" % (theUserProfile.user, theStep.title, theDateString, datetime.datetime.now().microsecond)
            phoneNumber = "%s" % thePlanOccurrence.notificationPhone
            task = PeriodicTask.objects.create(crontab=schedule, name=periodicTaskString3,
                                               task='kiterope.tasks.send_text_notification',
                                               args=json.dumps([phoneNumber, theStep.title + "\n" + "https://kiterope.com/stepOccurrences/" + theStep.id + "/"]))
            #print("text section done")



        occurrence = self.create(step_id=aStepId, date = theUTCDatetime, type=theStep.type, planOccurrence_id = aPlanOccurrenceId, wasCompleted=False, user_id = theUserId)
        occurrence.full_clean()

        return occurrence

    def createScheduleBasedStepOccurrencesForRange(aPlanOccurrence, persistedOccurrences, aStep, periodStart, periodEnd, theUserProfile, userTimezone):
        print("createScheduleBasedStepOccurrencesForRange")
        stepStart = aStep.startDate
        if aStep.endDate != aStep.startDate and aStep.endDate >= stepStart:
            stepEnd = aStep.endDate
        else:
            stepEnd = aStep.startDate

        if (aStep.frequency == "WEEKLY"):
            daysList = [aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06, aStep.day07]

        if (aStep.frequency == 'MONTHLY'):
            monthlyDatesArray = aStep.get_monthlyDatesArray()

        if (stepStart <= periodStart):
            iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
        else:
            iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)

        if (stepEnd <= periodEnd):
            iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
        else:
            iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)

        for dateIterator in rrule(DAILY, dtstart=iterationStart, until=iterationEnd):
            print("iterationstart")
            print(iterationStart)
            print("iterationEnd")
            print(iterationEnd)
            stepOccurrenceExists = False
            beginningUTCDateTime = toUTC(dateIterator, userTimezone)
            endUTCDateTime = beginningUTCDateTime + datetime.timedelta(days=1)

            for persistentOccurrence in persistedOccurrences:

                if aStep.id == persistentOccurrence.step.id:
                    if (beginningUTCDateTime <= persistentOccurrence.date) & (persistentOccurrence.date < endUTCDateTime):
                        if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                            stepOccurrenceExists = True
                            break

            if (stepOccurrenceExists == False):

                if aStep.frequency == 'WEEKLY':

                    if daysList[dateIterator.weekday()] == True:
                        aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator, aPlanOccurrence.id, theUser.id)
                        self.create_update_occurrences(aStep.id, aStepOccurrence)

                elif aStep.frequency == 'MONTHLY':
                    if (dateIterator.date().day in monthlyDatesArray):
                        aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator, aPlanOccurrence.id, theUser.id)

                        self.create_update_occurrences(aStep.id, aStepOccurrence)


                else:
                    aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator, aPlanOccurrence.id, theUser.id)
                    self.create_update_occurrences(aStep.id, aStepOccurrence)

    def updateStepOccurrences(self, theUser, periodRangeStart, periodRangeEnd):
        try:
            userPlanOccurrences = PlanOccurrence.objects.filter(user=theUser.id, isSubscribed='True')
            persistedOccurrences = StepOccurrence.objects.filter(user=theUser.id)

            for aPlanOccurrence in userPlanOccurrences:
                periodStart = periodRangeStart.date() - aPlanOccurrence.startDate
                periodStart = periodStart.days
                periodEnd = periodRangeEnd.date() - aPlanOccurrence.startDate
                periodEnd = periodEnd.days
                theProgram = Program.objects.filter(id=aPlanOccurrence.program.id)
                theProgramsSteps = Step.objects.filter(program=theProgram[0].id)
                theUserProfile = Profile.objects.get(user=theUser)
                userTimezone = theUserProfile.timezone

                for aStep in theProgramsSteps:
                    if aStep.type == "TIME":
                        stepStart = aStep.startDate

                        if aStep.endDate != aStep.startDate and aStep.endDate >= stepStart:
                            stepEnd = aStep.endDate
                        else:
                            stepEnd = aStep.startDate

                        if (aStep.frequency == "WEEKLY"):
                            daysList = [aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06,
                                        aStep.day07]

                        if (aStep.frequency == 'MONTHLY'):
                            monthlyDatesArray = aStep.get_monthlyDatesArray()

                        if (stepStart <= periodStart):
                            iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                        else:
                            iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)

                        if (stepEnd <= periodEnd):
                            iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                        else:
                            iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)

                        for dateIterator in rrule(DAILY, dtstart=iterationStart, until=iterationEnd):
                            print("iterationstart")
                            print(iterationStart)
                            print("iterationEnd")
                            print(iterationEnd)

                            stepOccurrenceExists = False
                            beginningUTCDateTime = toUTC(dateIterator, userTimezone)
                            endUTCDateTime = beginningUTCDateTime + datetime.timedelta(days=1)

                            for persistentOccurrence in persistedOccurrences:

                                if aStep.id == persistentOccurrence.step.id:
                                    if (beginningUTCDateTime <= persistentOccurrence.date) & (persistentOccurrence.date < endUTCDateTime):
                                        if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                                            stepOccurrenceExists = True
                                            break

                            if (stepOccurrenceExists == False):
                                print(aStep.title)

                                if aStep.frequency == 'WEEKLY':

                                    if daysList[dateIterator.weekday()] == True:
                                        aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator,
                                                                                               aPlanOccurrence.id,
                                                                                               theUser.id)
                                        self.create_update_occurrences(aStep.id, aStepOccurrence)

                                elif aStep.frequency == 'MONTHLY':
                                    if (dateIterator.date().day in monthlyDatesArray):
                                        aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator,
                                                                                               aPlanOccurrence.id,
                                                                                               theUser.id)

                                        self.create_update_occurrences(aStep.id, aStepOccurrence)


                                else:
                                    aStepOccurrence = self.create_scheduleBased_occurrence(aStep.id, dateIterator,
                                                                                           aPlanOccurrence.id,
                                                                                           theUser.id)
                                    self.create_update_occurrences(aStep.id, aStepOccurrence)
                    elif aStep.type == "COMPLETION":

                        stepOccurrenceExists = False
                        for persistentOccurrence in persistedOccurrences:
                            if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                                stepOccurrenceExists = True
                                break
                        if stepOccurrenceExists == False:
                            aStepOccurrence = self.create_completionBased_occurrence(aStep.id, aPlanOccurrence.id, theUser.id)

                            self.create_update_occurrences(aStep.id, aStepOccurrence)

        except:
            pass



    def create_update_occurrences(self, theStepId, theStepOccurrence):
        currentStepUpdates = Update.objects.filter(steps=theStepId)
        print("inside create update occurrences")
        print(currentStepUpdates.count())
        for currentStepUpdate in currentStepUpdates:
            anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(theStepOccurrence.id, currentStepUpdate.id)



class StepOccurrence(models.Model):
    step = models.ForeignKey(Step, null=True, blank=True)
    type = models.CharField(max_length=30, null=False, choices=STEP_TYPE_CHOICES, default='COMPLETION')
    date = models.DateTimeField(blank=True, null=True)
    planOccurrence = models.ForeignKey("PlanOccurrence", null=True, blank=True)
    wasCompleted = models.BooleanField(default=False)
    user = models.ForeignKey(User, null=True, blank = True)
    posts = models.ManyToManyField('Post', blank=True, )
    previouslySaved = models.BooleanField(default=False)



    objects = StepOccurrenceManager()

    def __str__(self):
        return "%s - %s" % (self.step.title, self.date)

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



class SettingsSet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    defaultNotificationPhone = PhoneNumberField(blank=True)
    defaultNotificationEmail = models.EmailField(max_length=70, blank=True)
    defaultNotificationMethod = models.CharField(max_length=20, blank=False, default='NO_NOTIFICATIONS', choices=NOTIFICATION_METHOD_CHOICES)
    defaultNotificationSendTime = models.CharField(max_length=10, blank=True, choices=START_TIME_CHOICES)



class Visualization(models.Model):
    name = models.CharField(max_length=50, blank=True, )
    user = models.ForeignKey(User, null=True, blank=True)
    step = models.ForeignKey(Step, null=True, blank=True)
    kind = models.CharField(max_length=15, blank=True, choices=VISUALIZATION_CHOICES)
    dependentVariable = models.ForeignKey(Update, blank=True, null=True, related_name='visualization_dependendentVariable')
    independentVariable = models.ForeignKey(Update, blank=True, null=True, related_name='visualization_independendentVariable' )
    mediatorVariable = models.ForeignKey(Update, blank=True, null=True, related_name='visualization_mediatorVariable' )
    program = models.ForeignKey(Program, null=True, blank=True, )
    plan = models.ForeignKey("PlanOccurrence", null=True, blank=True)

    def __str__(self):
        return "Name: %s, Kind: %s, User: %s" % (self.name, self.kind, self.user)

    def get_updateOccurrences(self):
        if self.program:
            # Return all update occurrences associated with a program

            self.user.is_authenticated
            currentUser = self.user
            dependentVariableIsUpdate = Q(update=self.dependentVariable)
            independentVariableIsUpdate = Q(update=self.independentVariable)
            mediatorVariableIsUpdate = Q(update=self.mediatorVariable)
            userIsProgramAuthor = Q(update__program__author=currentUser)
            return UpdateOccurrence.objects.filter((dependentVariableIsUpdate | independentVariableIsUpdate | mediatorVariableIsUpdate) & userIsProgramAuthor )

        elif self.plan:
            # Return all update occurrences owned by a user associated with a specific plan

            self.user.is_authenticated
            currentUser = self.user
            dependentVariableIsUpdate = Q(update=self.dependentVariable)
            independentVariableIsUpdate = Q(update=self.independentVariable)
            mediatorVariableIsUpdate = Q(update=self.mediatorVariable)
            userOwnsPlan = Q(user=currentUser)
            return UpdateOccurrence.objects.filter((dependentVariableIsUpdate | independentVariableIsUpdate | mediatorVariableIsUpdate) & userOwnsPlan)

        else:
            # Return all update occurrences owned by a user
            self.user.is_authenticated
            currentUser = self.user
            dependentVariableIsUpdate = Q(update__measuringWhat=self.dependentVariable.measuringWhat)
            independentVariableIsUpdate = Q(update=self.independentVariable.measuringWhat)
            mediatorVariableIsUpdate = Q(update=self.mediatorVariable.measuringWhat)
            userOwnsPlan = Q(user=currentUser)
            return UpdateOccurrence.objects.filter((dependentVariableIsUpdate | independentVariableIsUpdate | mediatorVariableIsUpdate) & userOwnsPlan)


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
    utcMidnight = models.CharField(max_length=5, blank=True, null=True, default='00:00')




    def get_utcMidnight(self):
        try:

            tz = pytz.timezone(str(self.timezone))
            today = datetime.datetime.now(tz).date()
            midnight = tz.localize(datetime.datetime.combine(today, datetime.time(0, 0)), is_dst=None)
            utc_dt = midnight.astimezone(pytz.utc).time().strftime("%H:%M")
            self.utcMidnight = utc_dt
            self.save()

        except:
            pass

        return self.utcMidnight






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
            SettingsSet.objects.create(user=instance, defaultNotificationEmail=instance.email)
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



