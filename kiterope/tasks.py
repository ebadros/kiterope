from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .celery_setup import app
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from django.contrib.auth.models import User
from kiterope.views import PeriodViewSet
from kiterope.models import StepOccurrence, PlanOccurrence, Program
from datetime import date
from kiterope.expoPushNotifications import send_push_message


app.conf.beat_schedule = {
    #'send_notification': {
    #    'task': 'kiterope.tasks.send_notification',
    #    'schedule': crontab(minute="*/1"),
    #},
    'create_users_daily_step_occurrences': {
        'task': 'kiterope.tasks.dailyUpdateStepOccurrences',
        'schedule': crontab(minute=0, hour=0),

    }
}

app.conf.timezone = 'UTC'


#@app.on_after_configure.connect
#def setup_periodic_tasks(sender, **kwargs):
    #sender.add_periodic_task(crontab(minute='*/1'), send_notification(), name='send_notification' )
#    pass

@app.task()
def send_notification():
    print("send notification called")
    send_push_message('ExponentPushToken[u9Rw6jBgLm9MVSKXYeSk3p]', "did you get this?")






@app.task()
def dailyUpdateStepOccurrences():
    userSet = User.objects.all()
    for theUser in userSet:
        updateOccurrences(theUser, date.today(), date.today())


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
