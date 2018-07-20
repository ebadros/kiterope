from __future__ import absolute_import, unicode_literals
from celery import shared_task
import datetime, time
from time import mktime
from kiterope.celery_setup import app
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from django.contrib.auth.models import User
from datetime import date
from kiterope.expoPushNotifications import send_push_message
#from kiterope.models import Goal, Program, Step, Label, Message, Contact, KChannel, MessageThread, SearchQuery, BlogPost, KChannelUser, Participant, KChannelManager, Notification, Session, Review, Profile, Update, Rate, Question, Answer, Interest, StepOccurrence, PlanOccurrence, UpdateOccurrence, UpdateOccurrenceManager, StepOccurrenceManager
from django_celery_beat.models import PeriodicTask, IntervalSchedule, CrontabSchedule
import json
from datetime import timedelta
from django.core.mail import send_mail, EmailMessage
from kiterope.send_sms import sendMessage
from scheduler.tasks import RepeatTask
from django.apps import AppConfig
from django.apps import apps
from django.template.loader import render_to_string
from django.db.models import Q


from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)






app.conf.beat_schedule = {
    #'say_hello': {
    #    'task': 'kiterope.tasks.say_hello',
    #    'schedule': crontab(minute="*/1"),
    #},
    #'create_users_daily_step_occurrences': {
    #    'task': 'kiterope.tasks.dailyUpdateStepOccurrences',
    #    'schedule': crontab(hour=0, minute=0,),

    #}
}

app.conf.timezone = 'UTC'


@app.task(base=RepeatTask)
def say_hello():
    print("say_hello is running")

    #sendMessage("", "You've got a message")

@app.task()
def createTimeBasedTasks(thePlanOccurrenceId):
    PlanOccurrence = apps.get_model('kiterope', 'PlanOccurrence')
    thePlanOccurrence = PlanOccurrence.objects.get(id=thePlanOccurrenceId)
    thePlanOccurrence.create_step_occurrence_creator_tasks()


@app.task(base=RepeatTask)
def createStepOccurrence(currentUserId, theStepId, thePlanOccurrenceId):
    print("createStepOccurrence")

    Profile = apps.get_model('kiterope', 'Profile')
    PlanOccurrence = apps.get_model('kiterope', 'PlanOccurrence')
    StepOccurrence = apps.get_model('kiterope', 'StepOccurrence')
    Update = apps.get_model('kiterope', 'Update')
    UpdateOccurrence = apps.get_model('kiterope', 'UpdateOccurrence')

    theUserProfile = Profile.objects.get(user_id=currentUserId)
        # theUTCDatetime = toUTC(theDatetime, theUserProfile.timezone)
    currentDatetime = datetime.datetime.now(theUserProfile.timezone)
    try:
        thePlanOccurrence = PlanOccurrence.objects.get(id=thePlanOccurrenceId)
        if (thePlanOccurrence.isSubscribed):
            aStepOccurrence = StepOccurrence.objects.create_occurrence(theStepId, currentDatetime, thePlanOccurrenceId,
                                                                       currentUserId)
            defaultIsTrue = Q(default=True)
            stepIsCurrentStep = Q(steps=theStepId)
            currentStepUpdates = Update.objects.filter(defaultIsTrue | stepIsCurrentStep)


            for currentStepUpdate in currentStepUpdates:
                anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(aStepOccurrence.id, currentStepUpdate.id)


    except Exception as ex:
        print("Error in tasks>createStepOccurrence")
        print(ex)


        #@app.on_after_configure.connect
#def setup_periodic_tasks(sender, **kwargs):
    #sender.add_periodic_task(crontab(minute='*/1'), send_notification(), name='send_notification' )
#    pass
@app.task(base=RepeatTask)
def rebuildSearchIndexes():
    from haystack.management.commands import update_index, rebuild_index
    rebuild_index.Command().handle(interactive=False)


@app.task()
def send_app_notification(expoPushToken, message ):
    print("send app notification")

    send_push_message(expoPushToken, message)

def _send_email(to_list, subject, message, sender='notifications@kiterope.com'):
    msg = EmailMessage(subject=subject, body=message, from_email=sender, to=to_list)
    msg.content_subtype = "html"  # Main content is now text/html
    return msg.send(fail_silently=False)

@app.task()
def send_email_notification(emailAddress, subject, messageParameters ):

    msg_html = render_to_string('stepEmail.html', messageParameters)

    _send_email([emailAddress], subject=subject, message=msg_html, )


    '''
    send_mail(
        subject,
        message,
        'notifications@kiterope.com',
        [emailAddress],
        fail_silently=False,
    )
    '''

@app.task()
def send_text_notification(phoneNumber, message ):
    print("here's where a text message would be sent")
    #sendMessage(phoneNumber, message)

@app.task()
def updateOccurrencesForUserAtMidnight(theUser):
    periodRangeStart = datetime.datetime.now().date()
    periodRangeEnd = periodRangeStart + datetime.timedelta(days=1)
    periodRangeEnd = periodRangeEnd - datetime.timedelta(seconds=1)

    StepOccurrence.objects.updateStepOccurrencesForRange(theUser, periodRangeStart, periodRangeEnd)


@app.task()
def removeOldUncompletedTimeBasedStepOccurrences():
    print("removeOldUncompletedTimeBasedStepOccurrences")
    stepOccurrenceNotPreviouslySaved = Q(stepOccurrence__previouslySaved=False)
    fiveDaysAgo = Q(date__lt=datetime.datetime.today())
    timeBased = Q(type="TIME")
    StepOccurrence.objects.filter(timeBased & fiveDaysAgo & stepOccurrenceNotPreviouslySaved).delete

@app.task()
def updateOccurrencesAtUTCMidnight():

    # Get users whose midnight is equal to utcMidnight of utcMidnightString e.g. '07:00' is equal to an offset of -07:00
    # This gets all of the users who, regardless of what timezone they're in, have the same offset right now
    userSet = User.objects.all()

    periodRangeStart = datetime.datetime.now().date() + datetime.timedelta(days=2)
    periodRangeEnd = periodRangeStart + datetime.timedelta(days=1)
    periodRangeEnd = periodRangeEnd - datetime.timedelta(seconds=1)

    for theUser in userSet:
        StepOccurrence.objects.updateStepOccurrencesForRange(currentUser, periodRangeStart, periodRangeEnd)


        #StepOccurrence.objects.updateStepOccurrences(theUser, periodRangeStart, periodRangeEnd)



@app.task()
def dailyUpdateStepOccurrences():
    todaysUTCDate = datetime.datetime.now().date()
    print(todaysUTCDate)
    '''
    userSet = User.objects.all()
    periodRangeStart = datetime.datetime.now().date()  # + datetime.timedelta(days=10)

    periodRangeEnd = periodRangeStart + datetime.timedelta(days=10)
    #for theUser in userSet:
    #    updateOccurrences(theUser, periodRangeStart, periodRangeEnd)
    #todaysStepOccurrences = StepOccurrence.objects.filter(date__gte=periodRangeStart, date__lt=periodRangeEnd)
    #for aStepOccurrence in todaysStepOccurrences:
    #theDate = aStepOccurrence.date.replace(tzinfo=timezone('UTC'))
    theDate = datetime.datetime.now()
    print(theDate)


    theMonth = theDate.month
    print(theMonth)
    theDayOfTheMonth = theDate.day
    print(theDayOfTheMonth)

    theHour = theDate.hour
    print(theHour)

    theMinute = theDate.minute
    inAFewMinutes = theMinute + 1
    print(theMinute)

    schedule = CrontabSchedule.objects.create(hour=theHour, minute=inAFewMinutes, month_of_year=theMonth, day_of_month=theDayOfTheMonth)
    task = PeriodicTask.objects.create(crontab=schedule, name='StepEvent_SendNotification', task='kiterope.tasks.send_notification', args=json.dumps([66]))
    '''






def updateOccurrences(currentUser, periodRangeStart, periodRangeEnd):
    print("updateOccurrences called")
    try:
        print("currentUser %s" % currentUser)
        userPlanOccurrences = PlanOccurrence.objects.filter(user=currentUser.id)
        print("userPlanOccurrences %d" % userPlanOccurrences.count())

        # print("before persisted occurrences")

        persistedOccurrences = StepOccurrence.objects.filter(user=currentUser.id)

        # print("persistedOccurrences %d" % persistedOccurrences.count())



        for aPlanOccurrence in userPlanOccurrences:
            print("aPlanOccurrence.startDate %s" % type(aPlanOccurrence.startDate))
            # periodRangeStart = datetime.datetime.strftime(periodRangeStart, '%Y-%m-%d')
            # print("periodRangeStart %s" % type(periodRangeStart))

            # planOccurrenceStartDate = datetime.datetime.strftime(aPlanOccurrence.startDate, '%Y-%m-%d')

            periodStart = periodRangeStart - aPlanOccurrence.startDate

            periodStart = periodStart.days
            # print("periodStart %s" % periodStart)


            periodEnd = periodRangeEnd - aPlanOccurrence.startDate
            periodEnd = periodEnd.days
            # print("periodEnd %s" % periodEnd)




            # print("aPlanOccurrence.plan %d" % aPlanOccurrence.plan.id)

            theProgram = Program.objects.filter(id=aPlanOccurrence.program.id)
            # print("theProgram %d" % theProgram.count())

            # print("beforePlansSteps")
            theProgramsSteps = Step.objects.filter(program=theProgram[0].id)
            # print("theProgramsSteps %d" % theProgramsSteps.count())

            for aStep in theProgramsSteps:
                # print("inside theProgramsSteps loop")

                # print("inside comparePeriodToStep")
                # print("aStep.frequency %s" % aStep.frequency)
                # print("aStep.id %d" % aStep.id)

                if (aStep.frequency == "ONCE"):
                    # print("aStep.startDate %s" % aStep.startDate)

                    stepStart = aStep.startDate
                    stepEnd = aStep.startDate



                elif (aStep.frequency == "DAILY"):
                    # print("aStep.startDate %s" % aStep.startDate)
                    # print("aStep.endDate %s" % aStep.endDate)

                    stepStart = aStep.startDate
                    stepEnd = aStep.endDate

                elif (aStep.frequency == "WEEKLY"):
                    daysList = [aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06,
                                aStep.day07]
                    # print("daysList %s" % aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06,
                    # aStep.day07)
                    try:
                        aStepStart = daysList.index(True)
                        print("aStepStart %s" % aStepStart)

                        aStepEnd = len(daysList) - daysList[::-1].index(True) - 1
                        stepStart = ((aStep.begins - 1) * 7) + aStepStart
                        stepEnd = ((aStep.ends - 1) * 7) + aStepEnd
                    except:
                        pass


                elif (aStep.frequency == "MONTHLY"):
                    print("frequency = monthly - work needs to be done")

                # stepStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                # stepEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                # print("stepStart %d" % stepStart)
                # print("stepEnd %d" % stepEnd)
                # print("periodStart %d" % periodStart)
                # print("periodEnd %d" % periodEnd)
                # print("aPlanOccurence startDate %s" % aPlanOccurrence.startDate)

                if (stepStart <= periodStart & stepEnd >= periodEnd):
                    # print("periodStart to periodEnd")

                    iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                    iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)

                elif (stepStart <= periodStart & stepEnd <= periodEnd):
                    # print("periodStart to StepEnd")

                    iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                    iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)



                elif (stepStart >= periodStart & stepEnd <= periodEnd):
                    # print("stepStart to stepEnd")

                    # print("inside comparison =2")

                    iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                    # print("iterationStart %s" % iterationStart)

                    iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                    # print("iterationEnd %s" % iterationEnd)

                elif (stepStart <= periodStart & stepEnd > periodEnd):
                    # print("stepStart to periodEnd")

                    iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                    iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)
                else:
                    pass
                # print("periodStart %s" % periodStart)
                # print("periodEnd %s" % periodEnd)

                # print("stepStart %s" % stepStart)
                # print("stepStart %s" % stepEnd)


                stepOccurrenceExists = False

                # iterationStart = datetime.datetime.strptime(iterationStart, '%Y-%m-%d')
                # iterationEnd = datetime.datetime.strptime(iterationEnd, '%Y-%m-%d')

                # print("before DateIterator loop")

                for dateIterator in rrule(DAILY, dtstart=iterationStart, until=iterationEnd):
                    # for dateIterator in range(iterationStart, iterationEnd):
                    # print("inside dateIteration")


                    # print("inside false stepOccurrence loop")
                    # print("aStep.id %d" % aStep.id)
                    # print("dateIterator %s" % dateIterator)
                    # print("aPlanOccurrence %d" % aPlanOccurrence.id)
                    # print("currentUser %d" % currentUser.id)

                    # print("aStepOccurrence ")
                    for persistentOccurrence in persistedOccurrences:
                        # print("currentPersistentOccurence.step.id %s" % persistentOccurrence.step.id)
                        # print("aStep.id %s" % aStep.id)

                        if aStep.id == persistentOccurrence.step.id:
                            # print("dateIterator is %s" % type(dateIterator))
                            # print("persistentOccurrence.date is %s" % type(persistentOccurrence.date))
                            # print("persistentOccurrence.date %s" % persistentOccurrence.date)
                            # print("dateIterator %s" % dateIterator)
                            # print("inside aStep.id == persistentOccurrence.step.id")

                            if dateIterator.date() == persistentOccurrence.date.date():
                                # print("inside dateIterator == persistentOccurrence.date")

                                # print("persistentOccurrence.planOccurrence.id %d" % persistentOccurrence.planOccurrence.id)
                                # print("aPlanOccurrence.id %s" % aPlanOccurrence.id)
                                if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                                    # print("inside aPlanOccurrence.id == persistentOccurrent.id")
                                    stepOccurrenceExists = True
                                    # print("stepOccurrenceExists %s" % stepOccurrenceExists)

                                    break
                    # print("stepOccurrenceExists %s" % stepOccurrenceExists)
                    if (stepOccurrenceExists == False):
                        aStepOccurrence = StepOccurrence.objects.create_occurrence(aStep.id, dateIterator,
                                                                                   aPlanOccurrence.id,
                                                                                   currentUser.id)
                        # print("aStep.id = %s" % aStep.id )
                        currentStepUpdates = Update.objects.filter(step=aStep.id)

                        for currentStepUpdate in currentStepUpdates:
                            # print("inside currentStepUpdates")
                            anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(aStepOccurrence.id,
                                                                                            currentStepUpdate.id)

                            # print("Update create Occurrence finished")

                            # print("stepOccurrence Doesn't Exist")

                            # aStepOccurrence.save()



    except:
        pass
