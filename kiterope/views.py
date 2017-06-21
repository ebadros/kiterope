from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from kiterope.models import Goal, Program, Step, Label, Message, Contact, KChannel, MessageThread, SearchQuery, KChannelUser, Participant, KChannelManager, Notification, Session, Review, Profile, Update, Rate, Question, Answer, Interest, StepOccurrence, PlanOccurrence, UpdateOccurrence, UpdateOccurrenceManager, StepOccurrenceManager
import datetime, time
from time import mktime
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.decorators import detail_route
from rest_framework.decorators import list_route

from datetime import date
from dateutil.rrule import rrule, DAILY
from rest_framework.authtoken.models import Token
from rest_framework_extensions.mixins import PaginateByMaxMixin
from django.db.models import Q

from rest_framework.permissions import AllowAny

from kiterope.send_sms import sendMessage

from kiterope.permissions import UserPermission, IsAuthorOrReadOnly, IsProgramOwnerOrReadOnly, AllAccessPostingOrAdminAll, PostPutAuthorOrNone, IsOwnerOrNone, IsOwnerOrReadOnly, NoPermission, IsReceiverSenderOrReadOnly


import requests
import json
import datetime
from datetime import timedelta

import boto
import mimetypes


from kiterope.helpers import formattime


from rest_framework import viewsets
from rest_framework.views import APIView
from kiterope.serializers import UserSerializer, ContactSerializer,  KChannelSerializer, LabelSerializer, MessageSerializer, MessageThreadSerializer, SearchQuerySerializer, NotificationSerializer, UpdateOccurrenceSerializer, UpdateSerializer, ProfileSerializer, GoalSerializer, ProgramSerializer, StepSerializer, StepOccurrenceSerializer, PlanOccurrenceSerializer
from kiterope.serializers import SessionSerializer, UpdateSerializer, ProgramSearchSerializer, RateSerializer, InterestSerializer
from drf_haystack.viewsets import HaystackViewSet
from drf_haystack.serializers import HaystackSerializer

from kiterope.search_indexes import ProgramIndex


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
from rest_framework.pagination import PageNumberPagination
from copy import deepcopy


OPENTOK_API_KEY = "45757612"       # Replace with your OpenTok API key.
OPENTOK_API_SECRET  = "a2287c760107dbe1758d5bc9655ceb7135184cf9"

class ApiEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, OAuth2!')


def create_missing_profiles(request):
    users = User.objects.filter(profile=None)
    for u in users:
        Profile.objects.create(user=u)


@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
def schema_view(request):
    generator = schemas.SchemaGenerator(title='Bookings API')
    return response.Response(generator.get_schema(request=request))

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    required_scopes = ['groups']


    def retrieve(self, request, pk=None):
        def handle(self, *args, **options):
            users = User.objects.filter(profile=None)
            for u in users:
                Profile.objects.create(user=u, firstName=u.first_name, lastName=u.lastName)
                print("Created profile for {u}".format(u=u))

        if pk == 'i':
            return Response(UserSerializer(request.user,
                                           context={'request': request}).data)
        return super(UserViewSet, self).retrieve(request, pk)





class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 50

class LabelViewSet(viewsets.ModelViewSet):
    model = Label
    queryset = Label.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = LabelSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        try:
            typeOfLabel = self.kwargs['typeOfLabel']
            print("this is type of message %s" % typeOfLabel)
            #aQueryset = Label.objects.filter(Q(user=self.request.user) | Q(type=typeOfLabel))

            aQueryset = Label.objects.all()
        except:
            aQueryset = Label.objects.none()

        return aQueryset

class MessageThreadMessageViewSet(viewsets.ModelViewSet):
    model = Message
    queryset = Message.objects.all()
    permission_classes = [IsReceiverSenderOrReadOnly]
    required_scopes = ['groups']
    serializer_class = MessageSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        try:
            thread_id = self.kwargs['thread_id']

            aQueryset = Message.objects.filter(thread=thread_id)
        except:
            aQueryset = Message.objects.none()

        return aQueryset


class KChannelViewSet(viewsets.ModelViewSet):
    model = KChannel
    queryset = KChannel.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = KChannelSerializer

class ReceiverKChannelViewSet(viewsets.ModelViewSet):
    model = KChannel
    queryset = KChannel.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = KChannelSerializer





    def get_queryset(self):
        try:
            receiver_id = self.kwargs['receiver_id']
            print("receiverId %s" % receiver_id)
            currentUser = self.request.user.id
            print("currentUser %s" % currentUser)

            usersChannelsIds = KChannelUser.objects.filter(user_id=currentUser).values_list('channel_id', flat=True)
            usersChannelsIds = usersChannelsIds[::1]
            receiversChannelsIds = KChannelUser.objects.filter(user_id=receiver_id).values_list('channel_id', flat=True)
            receiversChannelsIds = receiversChannelsIds[::1]

            channelWithBothUserAndReceiver =  [val for val in usersChannelsIds if val in receiversChannelsIds]
            print("inside receiverKChannel", channelWithBothUserAndReceiver)

            if channelWithBothUserAndReceiver == []:
                try:
                    theUsersWithPermission = [receiver_id, currentUser]
                    print("try to create_channel")
                    print(theUsersWithPermission)


                    theChannel = KChannel.objects.create_channel([receiver_id, currentUser], "ONLYRECEIVER_ONLYSENDER")
                    print("try to get channel query")
                    aQueryset = KChannel.objects.filter(id=theChannel.id)
                except:
                    aQueryset = KChannel.objects.none()


            #print(roomWithBothUserAndReceiver.keys())
            else:
                try:
                    aQueryset = KChannel.objects.filter(id=channelWithBothUserAndReceiver[0])
                except:
                    aQueryset = KChannel.objects.none()

        except:

            aQueryset = KChannel.objects.none()

        return aQueryset

    def intersect(a, b):
        print("inside intersect")
        print(usersChannelsIds)
        print(receiversChannelsIds)
        return set(a) & set(b)

class MessageThreadChannelViewSet(viewsets.ModelViewSet):
    model = MessageThread
    queryset = MessageThread.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = MessageThreadSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        try:
            channel_id = self.kwargs['channel_id']

            aQueryset = MessageThread.objects.filter(channel=channel_id)
        except:
            aQueryset = MessageThread.objects.none()

        return aQueryset





class MessageThreadViewSet(viewsets.ModelViewSet):
    model = MessageThread
    queryset = MessageThread.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = MessageThreadSerializer
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        #page = self.paginate_queryset(queryset)
        #if page is not None:
        #    serializer = self.get_serializer(page, many=True)
        #    return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        data = {i['id']: i for i in serializer.data}
        return Response(data)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_queryset(self):
        try:
            label_id = self.kwargs['label_id']
            currentUser = self.request.user.id
            #aQueryset = MessageThread.objects.filter(labels=label_id)

            aQueryset = MessageThread.objects.filter((Q(sender=currentUser) | Q(receiver=currentUser)) & Q(labels=label_id))
        except:
            try:
                currentUser = self.request.user.id
                print("currentUser is %s" % currentUser)
                aQueryset = MessageThread.objects.filter(Q(sender=currentUser) | Q(receiver=currentUser))

            except:
                aQueryset = MessageThread.objects.none()

        return aQueryset


class MessageViewSet(viewsets.ModelViewSet):
    model = Message
    queryset = Message.objects.all()
    permission_classes = [IsReceiverSenderOrReadOnly]
    required_scopes = ['groups']
    serializer_class = MessageSerializer
    pagination_class = LargeResultsSetPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)


        return self.list(request, *args, **kwargs)

    def get_queryset(self):

        try:
            sender_id = self.kwargs['sender_id']
            receiver_id = self.kwargs['receiver_id']
            aQueryset = Message.objects.filter(sender=sender_id, receiver=receiver_id)
        except:
            aQueryset = Message.objects.all()

        return aQueryset


class GoalViewSet(viewsets.ModelViewSet):
    model = Goal
    queryset = Goal.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    required_scopes = ['groups']
    serializer_class = GoalSerializer
    pagination_class = StandardResultsSetPagination

    def create(self, request, *args, **kwargs):
        sendMessage('+13107703042','You have tasks that you need to achieve today...check them out here: http://127.0.0.1.8000/' )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        #page = self.paginate_queryset(queryset)
        #if page is not None:
        #    serializer = self.get_serializer(page, many=True)
        #    return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        data = {i['id']: i for i in serializer.data}
        return Response(data)

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        self.create(request, *args, **kwargs)


        print(self.request.errors)
        return self.list(request, *args, **kwargs)

    def get_serializer_context(self):
        """
        pass request attribute to serializer
        """
        context = super(GoalViewSet, self).get_serializer_context()
        return context




class StepViewSet(viewsets.ModelViewSet):
    #permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    #required_scopes = ['groups']

    serializer_class = StepSerializer
    queryset = Step.objects.all()
    required_scopes = ['groups']
    permission_classes = [IsProgramOwnerOrReadOnly]

    pagination_class = LargeResultsSetPagination


    def get_queryset(self):

        try:
            program_id = self.kwargs['program_id']
            aQueryset = Step.objects.filter(program=program_id)
        except:
            aQueryset = Step.objects.all()

        return aQueryset

    def create(self, request, *args, **kwargs):
        print(self.request.data)


        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        try:

            theUpdates = request.POST.getlist('updatesIds[]')
            theStepId = serializer.data['id']


            for anUpdate in theUpdates:
                theUpdate = Update.objects.get(id=anUpdate)
                theUpdate.step_id = theStepId
                theUpdate.save()
        except:
            pass



        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        print("update")
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        api.send_sms(body='I can haz txt', from_phone='+3107703042', to=['+3107703042'])

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        #if page is not None:
        #    serializer = self.get_serializer(page, many=True)
        #    return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        data = {i['id']: i for i in serializer.data}

        return Response(data)


    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)


    @list_route(methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='daily')
    def dailyList(self, request, *args, **kwargs):
        print("inside")

class PlanOccurrenceViewSet(viewsets.ModelViewSet):
    queryset = PlanOccurrence.objects.all()
    serializer_class = PlanOccurrenceSerializer
    permission_classes = [AllowAny]
    required_scopes = ['groups']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        #if page is not None:
        #    serializer = self.get_serializer(page, many=True)
        #    return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        data = {i['id']: i for i in serializer.data}

        return Response(data)



    def create(self, request, *args, **kwargs):
        #print(self.request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)










class GoalPlanOccurrenceViewSet(viewsets.ModelViewSet):
    queryset = PlanOccurrence.objects.all()
    serializer_class = PlanOccurrenceSerializer
    permission_classes = [IsOwnerOrNone]
    required_scopes = ['groups']
    pagination_class = StandardResultsSetPagination

    def create(self, request, *args, **kwargs):
        print(self.request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):

        try:
            goal_id = self.kwargs['goal_id']
            aQueryset = PlanOccurrence.objects.filter(goal=goal_id)
        except:
            aQueryset = PlanOccurrence.objects.none()

        return aQueryset

class StepOccurrenceViewSet(viewsets.ModelViewSet):
    queryset = StepOccurrence.objects.all()
    serializer_class = StepOccurrenceSerializer
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    pagination_class = StandardResultsSetPagination





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



class PeriodViewSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrNone]
    #permission_classes = [permissions.IsAuthenticated, TokenHasScope]

    required_scopes = ['groups']
    stepStart = -999
    stepEnd = -999
    serializer_class = StepOccurrenceSerializer

    def list(self, request, *args, **kwargs):

        try:
            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']
            print("periodRangeStart %s" % periodRangeStart)

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
        #print("occurrencesUpdated")

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
        #print("updateOccurrences called")
        try:
            #print("currentUser %s" % currentUser)
            userPlanOccurrences = PlanOccurrence.objects.filter(user=currentUser.id)
            #print("userPlanOccurrences %d" % userPlanOccurrences.count())

            #print("before persisted occurrences")

            persistedOccurrences = StepOccurrence.objects.filter(user=currentUser.id)

            #print("persistedOccurrences %d" % persistedOccurrences.count())



            for aPlanOccurrence in userPlanOccurrences:
                #print("aPlanOccurrence.startDate %s" % type(aPlanOccurrence.startDate))
                #periodRangeStart = datetime.datetime.strftime(periodRangeStart, '%Y-%m-%d')
                #print("periodRangeStart %s" % type(periodRangeStart))

                #planOccurrenceStartDate = datetime.datetime.strftime(aPlanOccurrence.startDate, '%Y-%m-%d')

                periodStart = periodRangeStart - aPlanOccurrence.startDate

                periodStart = periodStart.days
                #print("periodStart %s" % periodStart)


                periodEnd = periodRangeEnd - aPlanOccurrence.startDate
                periodEnd = periodEnd.days
                #print("periodEnd %s" % periodEnd)




                #print("aPlanOccurrence.plan %d" % aPlanOccurrence.plan.id)

                theProgram = Program.objects.filter(id=aPlanOccurrence.program.id)
                #print("theProgram %d" % theProgram.count())

                #print("beforePlansSteps")
                theProgramsSteps = Step.objects.filter(program=theProgram[0].id)
                #print("theProgramsSteps %d" % theProgramsSteps.count())

                for aStep in theProgramsSteps:
                    #print("inside theProgramsSteps loop")

                    #print("inside comparePeriodToStep")
                    #print("aStep.frequency %s" % aStep.frequency)
                    #print("aStep.id %d" % aStep.id)

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
                    #print("aPlanOccurence startDate %s" % aPlanOccurrence.startDate)

                    if (stepStart <= periodStart & stepEnd >= periodEnd):
                        #print("periodStart to periodEnd")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)

                    elif (stepStart <= periodStart & stepEnd <= periodEnd):
                        #print("periodStart to StepEnd")

                        iterationStart =  aPlanOccurrence.startDate + datetime.timedelta(days=periodStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)



                    elif (stepStart >= periodStart & stepEnd <= periodEnd):
                        #print("stepStart to stepEnd")

                        #print("inside comparison =2")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                        #print("iterationStart %s" % iterationStart)

                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=stepEnd)
                        #print("iterationEnd %s" % iterationEnd)

                    elif (stepStart <= periodStart & stepEnd > periodEnd):
                        #print("stepStart to periodEnd")

                        iterationStart = aPlanOccurrence.startDate + datetime.timedelta(days=stepStart)
                        iterationEnd = aPlanOccurrence.startDate + datetime.timedelta(days=periodEnd)
                    else:
                        pass
                    #print("periodStart %s" % periodStart)
                    #print("periodEnd %s" % periodEnd)

                    #print("stepStart %s" % stepStart)
                    #print("stepStart %s" % stepEnd)


                    stepOccurrenceExists = False

                    #iterationStart = datetime.datetime.strptime(iterationStart, '%Y-%m-%d')
                    #iterationEnd = datetime.datetime.strptime(iterationEnd, '%Y-%m-%d')

                    #print("before DateIterator loop")

                    for dateIterator in rrule(DAILY, dtstart=iterationStart, until=iterationEnd):
                    #for dateIterator in range(iterationStart, iterationEnd):
                        #print("inside dateIteration")


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
                                #print("dateIterator is %s" % type(dateIterator))
                                #print("persistentOccurrence.date is %s" % type(persistentOccurrence.date))
                                #print("persistentOccurrence.date %s" % persistentOccurrence.date)
                                #print("dateIterator %s" % dateIterator)
                                #print("inside aStep.id == persistentOccurrence.step.id")

                                if dateIterator.date() == persistentOccurrence.date.date():
                                    #print("inside dateIterator == persistentOccurrence.date")

                                    #print("persistentOccurrence.planOccurrence.id %d" % persistentOccurrence.planOccurrence.id)
                                    #print("aPlanOccurrence.id %s" % aPlanOccurrence.id)
                                    if aPlanOccurrence.id == persistentOccurrence.planOccurrence.id:
                                        #print("inside aPlanOccurrence.id == persistentOccurrent.id")
                                        stepOccurrenceExists=True
                                        #print("stepOccurrenceExists %s" % stepOccurrenceExists)

                                        break
                        #print("stepOccurrenceExists %s" % stepOccurrenceExists)
                        if (stepOccurrenceExists == False):
                            aStepOccurrence = StepOccurrence.objects.create_occurrence(aStep.id, dateIterator,
                                                                                       aPlanOccurrence.id,
                                                                                       currentUser.id)
                            #print("aStep.id = %s" % aStep.id )
                            currentStepUpdates = Update.objects.filter(step=aStep.id)

                            for currentStepUpdate in currentStepUpdates:
                                #print("inside currentStepUpdates")
                                anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(aStepOccurrence.id, currentStepUpdate.id)

                                #print("Update create Occurrence finished")

                            #print("stepOccurrence Doesn't Exist")

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

            print("getQueryset periodRangeStart %s periodRangeEnd %s" % (periodRangeStart, periodRangeEnd))
            #querySet = Contact.objects.filter((Q(sender=theUser) | Q(receiver=theUser)))
            #theQueryset = StepOccurrence.objects.filter(Q(date__lte=periodRangeEnd))
            dateLessThanEnd = Q(date__lte=periodRangeEnd)
            dateLaterThanStart = Q(date__gte=periodRangeStart)


            theQueryset = StepOccurrence.objects.filter(dateLessThanEnd & dateLaterThanStart)

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





class ProgramViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer
    queryset = Program.objects.all()
    permission_classes = [PostPutAuthorOrNone]

    required_scopes = ['groups']
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # This is the line that allows us to get at the object without iterating over an array
        data = {i['id']: i for i in serializer.data}
        return Response(data)

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # This is the line that allows us to get at the object without iterating over an array
        data = {i['id']: i for i in serializer.data}
        return Response(data)


    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        theUser = self.request.user
        #querySet = Contact.objects.all()
        querySet = Contact.objects.filter((Q(sender=theUser.profile) | Q(receiver=theUser.profile)))
        return querySet


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    pagination_class = StandardResultsSetPagination

    required_scopes = ['groups']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # This is the line that allows us to get at the object without iterating over an array
        data = {i['id']: i for i in serializer.data}
        return Response(data)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)





class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsOwnerOrReadOnly]

    required_scopes = ['groups']

    def get_queryset(self):
        theUser = self.request.user
        return Profile.objects.filter(coach=theUser.id)



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





class ProgramSearchViewSet(HaystackViewSet):
    index_models = [Program]
    serializer_class = ProgramSearchSerializer
    permission_classes = [IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination



class StepDuplicatorViewSet(viewsets.ModelViewSet):
    serializer_class = StepSerializer
    queryset = Step.objects.all()
    permission_classes = [AllAccessPostingOrAdminAll]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def get_queryset(self):
        try:
            step_id = self.kwargs['step_id']
            theStep = Step.objects.get(id=step_id)
            theNewStep = deepcopy(theStep)
            theNewStep.id = None
            theNewStep.title = theNewStep.title + " Copy"
            theNewStep.save()
            theUpdates = Update.objects.filter(step=theStep)
            for theUpdate in theUpdates:
                theNewUpdate = deepcopy(theUpdate)
                theNewUpdate.id = None
                theNewUpdate.step_id = theNewStep.id
                theNewUpdate.save()
            aQuerySet = Step.objects.get(id=theNewStep.id)
            return aQueryset

        except:
            aQueryset = Step.objects.none()
            return aQueryset


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



    
    
conn = boto.connect_s3(settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY)

def sign_s3_upload(request):
    print("sign s3 upload")
    print("%s , %s" % (settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY))
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
    
    
    
    
    

