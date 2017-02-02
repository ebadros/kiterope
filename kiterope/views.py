from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from kiterope.models import Goal, Plan, Step, Coach, SearchQuery, Participant, Notification, Student, Session, Review, Profile, Update, Rate, Question, Answer, Interest, StepOccurrence, PlanOccurrence, UpdateOccurrence, UpdateOccurrenceManager, StepOccurrenceManager
import datetime, time
from time import mktime
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from oauth2_provider.ext.rest_framework import TokenHasReadWriteScope, TokenHasScope

from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.decorators import detail_route
from rest_framework.decorators import list_route

from datetime import date
from dateutil.rrule import rrule, DAILY

from kiterope.permissions import IsAuthorOrReadOnly, AllAccessPostingOrAdminAll, IsOwnerOrReadOnly


import requests
import json
import datetime
from datetime import timedelta

import boto
import mimetypes


from kiterope.helpers import formattime


from rest_framework import viewsets
from rest_framework.views import APIView
from kiterope.serializers import UserSerializer, SearchQuerySerializer, NotificationSerializer, UpdateOccurrenceSerializer, UpdateSerializer, ProfileSerializer, GoalSerializer, PlanSerializer, StepSerializer2, CoachSerializer, QuestionSerializer, StepOccurrenceSerializer, PlanOccurrenceSerializer
from kiterope.serializers import StudentSerializer, SessionSerializer, ReviewSerializer, UpdateSerializer, PlanSearchSerializer, RateSerializer, AnswerSerializer, InterestSerializer
from kiterope.forms import UserForm, ProfileForm, GoalForm, PlanForm, InterestForm
from drf_haystack.viewsets import HaystackViewSet
from drf_haystack.serializers import HaystackSerializer

from kiterope.search_indexes import PlanIndex


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import generics

from rest_framework.decorators import api_view, renderer_classes
from rest_framework import response, schemas
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework.permissions import IsAuthenticated


# OpenTok is the protocol for Video and Voice chat that Kiterope uses
from opentok import OpenTok, MediaModes, OpenTokException, __version__




OPENTOK_API_KEY = "45757612"       # Replace with your OpenTok API key.
OPENTOK_API_SECRET  = "a2287c760107dbe1758d5bc9655ceb7135184cf9"

class ApiEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, OAuth2!')

@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
def schema_view(request):
    generator = schemas.SchemaGenerator(title='Bookings API')
    return response.Response(generator.get_schema(request=request))

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer



class GoalViewSet(viewsets.ModelViewSet):
    model = Goal

    queryset = Goal.objects.all()

    #permission_classes = [permissions.IsAuthenticated, TokenScope]
    #authentication_classes = []

    required_scopes = ['groups']

    #parser_classes = (JSONParser, )

    serializer_class = GoalSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)


class StepViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    #required_scopes = ['groups']

    serializer_class = StepSerializer2
    queryset = Step.objects.all()
    required_scopes = ['groups']

    def get_queryset(self):

        try:
            plan_id = self.kwargs['plan_id']
            print(plan_id)
            aQueryset = Step.objects.filter(plan=plan_id)
        except:
            aQueryset = Step.objects.all()

        return aQueryset

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        print(request)

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    @list_route(methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='daily')
    def dailyList(self, request, *args, **kwargs):
        print("inside")

class PlanOccurrenceViewSet(viewsets.ModelViewSet):

    serializer_class = PlanOccurrenceSerializer


class UpdateOccurrenceViewSet(viewsets.ModelViewSet):
    queryset = UpdateOccurrence.objects.all()
    required_scopes = ['groups']
    serializer_class = UpdateOccurrenceSerializer

    def get_queryset(self):

        try:
            stepOccurrence_id = self.kwargs['stepOccurrence_id']
            aQueryset = UpdateOccurrence.objects.filter(stepOccurrence=stepOccurrence_id)
            print("aQueryset %s" % aQueryset.count())
        except:
            aQueryset = UpdateOccurrence.objects.all()

        return aQueryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    required_scopes = ['groups']
    serializer_class = UpdateSerializer

    def get_queryset(self):

        try:
            step_id = self.kwargs['step_id']
            aQueryset = Update.objects.filter(step=step_id)
        except:
            aQueryset = Update.objects.all()

        return aQueryset

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        print(request)

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)



class StepOccurrenceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    #required_scopes = ['groups']
    stepStart = -999
    stepEnd = -999
    serializer_class = StepOccurrenceSerializer

    def list(self, request, *args, **kwargs):

        try:

            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']

            #print("inside list2")
            periodRangeStart = datetime.date.strptime(periodRangeStart, "%Y-%m-%d")
            periodRangeEnd = datetime.date.strptime(periodRangeEnd, "%Y-%m-%d")
            print("periodRangeStart %s" % periodRangeStart)
            print("periodRangeStart %s" % periodRangeEnd)

        except:
            #periodRangeStart = str(datetime.datetime.now().date())
            periodRangeStart = datetime.datetime.now().date() - datetime.timedelta(days=1) #+ datetime.timedelta(days=10)

            periodRangeEnd = periodRangeStart
            #print ("periodRangeStart " + periodRangeStart)
            #print ("periodRangeEnd " + periodRangeEnd)

        currentUser = request.user



        self.updateOccurrences(currentUser, periodRangeStart, periodRangeEnd)
        print("occurrencesUpdated")

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)


        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)




    def post(self, request, *args, **kwargs):
        print(request)

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def updateOccurrences(self, currentUser, periodRangeStart, periodRangeEnd):
        print("updateOccurrences called")
        try:
            print("currentUser %s" % currentUser)
            userPlanOccurrences = PlanOccurrence.objects.filter(user=currentUser.id)
            print("userPlanOccurrences %d" % userPlanOccurrences.count())

            print("before persisted occurrences")

            persistedOccurrences = StepOccurrence.objects.filter(user=currentUser.id)

            print("persistedOccurrences %d" % persistedOccurrences.count())



            for aPlanOccurrence in userPlanOccurrences:
                #print("aPlanOccurrence.startDate %s" % type(aPlanOccurrence.startDate))
                #periodRangeStart = datetime.datetime.strftime(periodRangeStart, '%Y-%m-%d')
                #print("periodRangeStart %s" % type(periodRangeStart))

                #planOccurrenceStartDate = datetime.datetime.strftime(aPlanOccurrence.startDate, '%Y-%m-%d')

                periodStart = periodRangeStart - aPlanOccurrence.startDate

                periodStart = periodStart.days
                print("periodStart %s" % periodStart)


                periodEnd = periodRangeEnd - aPlanOccurrence.startDate
                periodEnd = periodEnd.days
                print("periodEnd %s" % periodEnd)




                #print("aPlanOccurrence.plan %d" % aPlanOccurrence.plan.id)

                thePlan = Plan.objects.filter(id=aPlanOccurrence.plan.id)
                print("thePlan %d" % thePlan.count())

                #print("beforePlansSteps")
                thePlansSteps = Step.objects.filter(plan=thePlan[0].id)
                print("thePlansSteps %d" % thePlansSteps.count())

                for aStep in thePlansSteps:
                    print("inside thePlansSteps loop")

                    #print("inside comparePeriodToStep")
                    print("aStep.frequency %s" % aStep.frequency)
                    print("aStep.id %d" % aStep.id)

                    if (aStep.frequency == "ONCE"):
                        #print("aStep.startDate %s" % aStep.startDate)

                        stepStart = aStep.startDate
                        stepEnd = aStep.startDate



                    elif (aStep.frequency == "DAILY"):
                        #print("aStep.startDate %s" % aStep.startDate)
                        #print("aStep.endDate %s" % aStep.endDate)

                        stepStart = aStep.startDate
                        stepEnd = aStep.endDate

                    elif (aStep.frequency == "WEEKLY"):
                        daysList = [aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06,
                                    aStep.day07]
                        #print("daysList %s" % aStep.day01, aStep.day02, aStep.day03, aStep.day04, aStep.day05, aStep.day06,
                                    #aStep.day07)
                        try:
                            aStepStart = daysList.index(True)
                            print ("aStepStart %s" % aStepStart)

                            aStepEnd = len(daysList) - daysList[::-1].index(True) - 1
                            stepStart = ((aStep.begins - 1) * 7) + aStepStart
                            stepEnd = ((aStep.ends - 1) * 7) + aStepEnd
                        except:
                            pass


                    elif (aStep.frequency == "MONTHLY"):
                        print("frequency = monthly - work needs to be done")

                    # stepStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                    # stepEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                    #print("stepStart %d" % stepStart)
                    #print("stepEnd %d" % stepEnd)
                    #print("periodStart %d" % periodStart)
                    #print("periodEnd %d" % periodEnd)
                    print("aPlanOccurence startDate %s" % aPlanOccurrence.startDate)

                    if (stepStart <= periodStart & stepEnd >= periodEnd):
                        print("periodStart to periodEnd")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)

                    elif (stepStart <= periodStart & stepEnd <= periodEnd):
                        print("periodStart to StepEnd")

                        iterationStart =  aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)



                    elif (stepStart >= periodStart & stepEnd <= periodEnd):
                        print("stepStart to stepEnd")

                        #print("inside comparison =2")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                        #print("iterationStart %s" % iterationStart)

                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                        #print("iterationEnd %s" % iterationEnd)

                    elif (stepStart <= periodStart & stepEnd > periodEnd):
                        print("stepStart to periodEnd")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)
                    else:
                        pass
                    print("periodStart %s" % periodStart)
                    print("periodEnd %s" % periodEnd)

                    print("stepStart %s" % stepStart)
                    print("stepStart %s" % stepEnd)


                    stepOccurrenceExists = False

                    #iterationStart = datetime.datetime.strptime(iterationStart, '%Y-%m-%d')
                    #iterationEnd = datetime.datetime.strptime(iterationEnd, '%Y-%m-%d')

                    print("before DateIterator loop")

                    for dateIterator in rrule(DAILY, dtstart=iterationStart, until=iterationEnd):
                    #for dateIterator in range(iterationStart, iterationEnd):
                        print("inside dateIteration")


                        #print("inside false stepOccurrence loop")
                        #print("aStep.id %d" % aStep.id)
                        #print("dateIterator %s" % dateIterator)
                        #print("aPlanOccurrence %d" % aPlanOccurrence.id)
                        #print("currentUser %d" % currentUser.id)

                        #print("aStepOccurrence ")
                        for persistentOccurrence in persistedOccurrences:
                            #print("currentPersistentOccurence.step.id %s" % persistentOccurrence.step.id)
                            #print("aStep.id %s" % aStep.id)

                            if aStep.id == persistentOccurrence.step.id:
                                print("dateIterator is %s" % type(dateIterator))
                                print("persistentOccurrence.date is %s" % type(persistentOccurrence.date))
                                print("persistentOccurrence.date %s" % persistentOccurrence.date)
                                print("dateIterator %s" % dateIterator)
                                print("inside aStep.id == persistentOccurrence.step.id")

                                if dateIterator.date() == persistentOccurrence.date.date():
                                    print("inside dateIterator == persistentOccurrence.date")

                                    print("persistentOccurrence.planOccurrence.id %d" % persistentOccurrence.planOccurrence.id)
                                    print("aPlanOccurrence.id %s" % aPlanOccurrence.id)
                                    if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                                        print("inside aPlanOccurrence.id == persistentOccurrent.id")
                                        stepOccurrenceExists=True
                                        print("stepOccurrenceExists %s" % stepOccurrenceExists)

                                        break
                        print("stepOccurrenceExists %s" % stepOccurrenceExists)
                        if (stepOccurrenceExists == False):
                            aStepOccurrence = StepOccurrence.objects.create_occurrence(aStep.id, dateIterator,
                                                                                       aPlanOccurrence.id,
                                                                                       currentUser.id)
                            print("aStep.id = %s" % aStep.id )
                            currentStepUpdates = Update.objects.filter(step=aStep.id)

                            for currentStepUpdate in currentStepUpdates:
                                print("inside currentStepUpdates")
                                anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(aStepOccurrence.id, currentStepUpdate.id)

                                print("Update create Occurrence finished")

                            print("stepOccurrence Doesn't Exist")

                            #aStepOccurrence.save()



        except:
            pass



    def get_queryset(self):
        # user = self.request.user
        # userPlanQueryset = user.plan_set.all()
        try:
            print("inside Get Queryset")
            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']
            print("inside Get Queryset2")

            #periodRangeStart = datetime.date.strptime(periodRangeStart, "%Y-%m-%d")
            #periodRangeEnd = datetime.date.strptime(periodRangeEnd, "%Y-%m-%d")

            print("getQueryset periodRangeStart %s periodRangeEnd" % (periodRangeStart, periodRangeEnd))


        except:
            #periodRangeStart = str(datetime.datetime.now().date())
            periodRangeStart = datetime.datetime.now().date()

            periodRangeEnd = periodRangeStart


        theQueryset = StepOccurrence.objects.all()

        return theQueryset


    def comparePeriodToStep(self, periodStart, periodEnd, aStep, aPlanOccurrence):

        return range(iterationStart, iterationEnd)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        theUser = self.request.user
        return Notification.objects.filter(user_id=theUser.id)





class PlanViewSet(viewsets.ModelViewSet):
    serializer_class = PlanSerializer
    queryset = Plan.objects.all()
    permission_classes = [IsAuthorOrReadOnly]

    required_scopes = ['groups']

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    required_scopes = ['groups']







class SessionViewSet(viewsets.ModelViewSet):

    serializer_class = SessionSerializer
    queryset = Session.objects.all()
    permission_classes = [IsAuthenticated]
    required_scopes = ['groups']

    def create(self, request, *args, **kwargs):
        OPENTOK_API_KEY = "45757612"  # Replace with your OpenTok API key.
        OPENTOK_API_SECRET = "a2287c760107dbe1758d5bc9655ceb7135184cf9"

        opentok_sdk = OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET)




        serializer = self.get_serializer(data=request.data)
        userProfileBeingCalledId = request.data['userProfileBeingCalledId']
        session = opentok_sdk.create_session()

        try:

            theTokBoxSessionId = session.session_id
            theTokBoxToken = session.generate_token()


            theSession = Session.objects.create_session(theTokBoxSessionId, theTokBoxToken)

            print("theSession")


            print("theSession.id %s" % theSession.id)
            primaryParticipant = Participant.objects.create_participant(request.user.id, True, theSession.id)

            theUserBeingCalled = Profile.objects.filter(id=userProfileBeingCalledId).first()

            secondaryParticipant = Participant.objects.create_participant(theUserBeingCalled.user_id, False, theSession.id)
            notification = Notification.objects.create_notification(theUserBeingCalled.user_id, theSession.id, "CALL")
            notification = Notification.objects.create_notification(request.user.id, theSession.id, "CALL")




        except:
            pass

        serializer.is_valid(raise_exception=True)

        print("this is the serializer data %s" % serializer.data)

        #self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class SearchQueryViewSet(viewsets.ModelViewSet):
    serializer_class = SearchQuerySerializer
    queryset = SearchQuery.objects.all()
    permission_classes = [AllAccessPostingOrAdminAll]





class PlanSearchViewSet(HaystackViewSet):
    index_models = [Plan]
    serializer_class = PlanSearchSerializer
    permission_classes = [IsAuthorOrReadOnly]







class PersonalProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    required_scopes = ['groups']
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


    def get_queryset(self):



        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        theUser = self.request.user

        return Profile.objects.filter(user_id=theUser.id)



class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer



'''class GoalList(generics.ListCreateAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def create(self, request, *args, **kwargs):
        logging.info("post called")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        console.log("post called")
        return self.create(request, *args, **kwargs)
'''

class InterestList(generics.ListCreateAPIView):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer


class InterestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interest.objects.all()
    serializer_class = InterestSerializer

class GoalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer



class PlanList(generics.ListCreateAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer


class PlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer





class CoachList(generics.ListCreateAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer


class CoachDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer


class StudentList(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class RateList(generics.ListCreateAPIView):
    queryset = Rate.objects.all()
    serializer_class = RateSerializer


class RateDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rate.objects.all()
    serializer_class = RateSerializer


class UpdateList(generics.ListCreateAPIView):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer

class UpdateDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer



class ReviewList(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer






class QuestionList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = QuestionSerializer


class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AnswerList(generics.ListCreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer



def interest(request):
    interestForm = InterestForm()
    displaySuccessMessage = False

    if request.method == 'POST':
        interestForm = InterestForm(request.POST)

        if interestForm.is_valid():
            interest = interestForm.save()
            interest.save()
            displaySuccessMessage = True

            headers = {'Content-Type': 'application/json'}

            helpdeskTicket = {
                "helpdesk_ticket":{
                "description":"Their dream is to: %s" % interest.goal,
                "subject":"New Potential Customer: %s" % interest.name,
                "name": interest.name,
                "email":interest.email,
                "priority":1,
                "status":2
                  },
                }

            r = requests.post("https://kiterope.freshdesk.com/helpdesk/tickets.json", auth=("HrB9zJ9AYJaBEivf0s","x" ),
                              headers=headers, data=json.dumps(helpdeskTicket))

            return render(request, "interest2.html", {'interestForm': interestForm, 'displaySuccessMessage': displaySuccessMessage})

    return render(request, "interest2.html", {'interestForm': interestForm, 'displaySuccessMessage':displaySuccessMessage})

def splash(request):
    hasGoals = None
    userGoals = None
    
    if request.user.is_authenticated():
        
        userForm = UserForm()
        profileForm = ProfileForm()
        user = request.user
        
        try:
            userGoals = Goal.objects.filter(user=user.id)      
            if len(userGoals) == 0:                
                hasGoals = False
            else:
                pass
        except:
            pass
        try: 
            profile = Profile.object.filter(user=user)
        except:
            pass
    else:
        userForm = UserForm()
        profileForm = ProfileForm()
        
            
    return render(request, 'splash.html', {'userForm': userForm, 'profileForm': profileForm ,  'hasGoals':hasGoals, 'userGoals':userGoals} )


@login_required()
def secret_page(request, *args, **kwargs):
    return HttpResponse('Secret contents!', status=200)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def goals_list(request, format=None):
    try:
        goal= Goal.objects.get(pk=pk)
    except Goal.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GoalSerializer(goal, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GoalSerializer(goal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        goal.delete()
        return Response(status=status.HTTP_404_NOT_FOUND)



@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def goal_detail(request, pk, format=None):
    """
    Retrieve, update or delete a snippet instance.
    """
    try:
        goal = Goal.objects.get(pk=pk)
    except Goal.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GoalSerializer(goal, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GoalSerializer(goal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'PUT', 'DELETE'])
def plans_list(request, format=None):
    try:
        plan= Plan.objects.get(pk=pk)
    except Plan.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PlanSerializer(plan, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        plan.delete()
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'PUT', 'DELETE'])
def plan_detail(request, pk, format=None):
    """
    Retrieve, update or delete a snippet instance.
    """
    try:
        plan = Plan.objects.get(pk=pk)
    except Plan.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PlanSerializer(plan, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        plan.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

'''
@api_view(['GET', 'PUT', 'DELETE'])
def steps_list(request, format=None):
    try:
        step= Step.objects.get(pk=pk)
    except Step.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StepSerializer(step, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StepSerializer(step, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        step.delete()
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'PUT', 'DELETE'])
def step_detail(request, pk, format=None):
    """
    Retrieve, update or delete a snippet instance.
    """
    try:
        step = Step.objects.get(pk=pk)
    except Step.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StepSerializer(step, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StepSerializer(step, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        step.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
'''
@login_required  
def goals_add(request):    
    if request.method=='POST':
        goalForm = GoalForm(request.POST, request.FILES)
        
        if goalForm.is_valid():
            #handle_uploaded_file(request.FILES['file'])
            
            goal = goalForm.save()
            goal.user_id = request.user.id
            goal.save()
            
            return HttpResponseRedirect('/')
        else:
            
            return render(request, 'goals_add.html', {'goalForm':goalForm})
        
    else:
        goalForm = GoalForm()
        return render(request, 'goals_add.html', {'goalForm':goalForm})

@login_required  
def goals_plans(request, goal_id=None):
    user = request.user
    goal = Goal.objects.get(pk=goal_id)
    plans = Plan.objects.filter(goal=goal_id)
    
    if request.method=='POST':
        planForm = PlanForm(request.POST)
        
        if planForm.is_valid():
            plan = planForm.save()
            plan.goal_id = goal_id
            plan.save()
            goal.plans.add(plan)
            goal.save()
            return HttpResponseRedirect('/')
        else:
            return render(request, 'goals_plans.html', {'plans': plans, 'goal': goal, 'planForm':planForm})
            
            
                    
    else:
        planForm = PlanForm()
        return render(request, 'goals_plans.html', {'plans': plans, 'goal': goal, 'planForm':planForm})
        
@login_required
def plan_edit(request, plan_id=None):
    
    try:
        user = request.user
        plan = Plan.objects.get(pk=plan_id)
        startTime =  time.strptime(plan.startDate, "%m-%d-%Y %H:%M")
        endTime =  time.strptime(plan.endDate, "%m-%d-%Y %H:%M")
        startDateTime = datetime.fromtimestamp(mktime(startTime))
        endDateTime = datetime.fromtimestamp(mktime(endTime))
        durationDelta = startDateTime - endDateTime
        durationInWeeks = divmod(durationDelta.days, 7)
        durationInDays = divmod(durationDelta.days, 1)
                    
        
    except:
        pass
    if request.method=='POST':
        pass
    else:
        planForm = PlanForm()
        return render(request, 'plan_edit.html', {'plan': plan,'planForm':planForm, 'durationInWeeks':durationInWeeks[0], 'durationInDays':durationInDays[0]})    
    
    
    

    
    
conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)

def sign_s3_upload(request):
    print("this is the request %s" % request)
    object_name = request.GET['objectName']
    content_type = mimetypes.guess_type(object_name)[0]

    signed_url = conn.generate_url(
        300,
        "PUT",
        settings.AWS_STORAGE_BUCKET_NAME,
        'images/' + object_name,
        headers = {'Content-Type': content_type,
                   'x-amz-acl': 'public-read',
                   })

    return HttpResponse(json.dumps({'signedUrl': signed_url}))
    
    
    
    
    

