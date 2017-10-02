from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from kiterope.models import Goal, Program, Step, Label, Message, Contact, SettingsSet, KChannel, MessageThread, SearchQuery, BlogPost, KChannelUser, Participant, KChannelManager, Notification, Session, Review, Profile, Update, Rate, Question, Answer, Interest, StepOccurrence, PlanOccurrence, UpdateOccurrence, UpdateOccurrenceManager, StepOccurrenceManager
import datetime, time
from time import mktime
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.core.mail import EmailMessage
#from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

#from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope

from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.decorators import detail_route
from rest_framework.decorators import list_route

from datetime import date
from dateutil.rrule import rrule, DAILY
from rest_framework.authtoken.models import Token
from rest_framework_extensions.mixins import PaginateByMaxMixin
from django.db.models import Q

from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

import pytz
from kiterope.send_sms import sendMessage

from kiterope.permissions import CustomAllowAny, UserPermission, IsAuthorOrReadOnly, PostPutAuthorOrView, IsProgramOwnerOrReadOnly, AllAccessPostingOrAdminAll, PostPutAuthorOrNone, IsOwnerOrNone, IsOwnerOrReadOnly, NoPermission, IsReceiverSenderOrReadOnly
from celery import shared_task
from .celery_setup import app
from celery.task.schedules import crontab
from celery.decorators import periodic_task
from kiterope.expoPushNotifications import send_push_message
from django_celery_beat.models import PeriodicTask, IntervalSchedule, CrontabSchedule


import requests
import json
import datetime
from datetime import timedelta

import boto
import mimetypes
import uuid
import os.path


from kiterope.helpers import formattime


from rest_framework import viewsets
from rest_framework.views import APIView
from kiterope.serializers import UserSerializer, ProgramNoStepsSerializer, ContactSerializer,  SettingsSetSerializer, BlogPostSerializer, BrowseableProgramSerializer, KChannelSerializer, LabelSerializer, MessageSerializer, MessageThreadSerializer, SearchQuerySerializer, NotificationSerializer, UpdateOccurrenceSerializer, UpdateSerializer, ProfileSerializer, GoalSerializer, ProgramSerializer, StepSerializer, StepOccurrenceSerializer, PlanOccurrenceSerializer
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
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


# OpenTok is the protocol for Video and Voice chat that Kiterope uses
from opentok import OpenTok, MediaModes, OpenTokException, __version__
from rest_framework.pagination import PageNumberPagination
from copy import deepcopy

from django.views.generic import TemplateView



OPENTOK_API_KEY = "45757612"       # Replace with your OpenTok API key.
OPENTOK_API_SECRET  = "a2287c760107dbe1758d5bc9655ceb7135184cf9"

'''class ApiEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, OAuth2!')
'''

def create_missing_profiles(request):
    users = User.objects.filter(profile=None)
    for u in users:
        Profile.objects.create(user=u)



@api_view()
@renderer_classes([OpenAPIRenderer, SwaggerUIRenderer])
def schema_view(request):
    generator = schemas.SchemaGenerator(title='Bookings API')
    return response.Response(generator.get_schema(request=request))


class React(TemplateView):
    template_name = 'index.html'



class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    model=User
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
            send_push_message('ExponentPushToken[2BErIjItiQadkO-bFdABGR]',"did you get this?")
            #print(request.user.username)

            return Response(UserSerializer(request.user, context={'request': request}).data)

        return super(UserViewSet, self).retrieve(request, pk)

class ExpoPushTokenViewSet(viewsets.ModelViewSet):
    model = Profile
    queryset = Profile.objects.all()

    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    required_scopes = ['groups']

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(Profile.objects.none())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
            #print("inside receiverKChannel", channelWithBothUserAndReceiver)

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



class BlogPostViewSet(viewsets.ModelViewSet):
    model = BlogPost
    queryset = BlogPost.objects.all().order_by('-modified')
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = BlogPostSerializer
    pagination_class = StandardResultsSetPagination
    utcTime = datetime.datetime.now().strftime("%H:%M")
    print(utcTime)

    tz = pytz.timezone('America/Los_Angeles')
    today = datetime.datetime.now(tz).date()
    midnight = tz.localize(datetime.datetime.combine(today, datetime.time(0, 0)), is_dst=None)
    utc_dt = midnight.astimezone(pytz.utc).time().strftime("%H:%M")
    print(utc_dt)



class MessageThreadViewSet(viewsets.ModelViewSet):
    model = MessageThread
    queryset = MessageThread.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = MessageThreadSerializer
    #pagination_class = StandardResultsSetPagination

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
                #print("currentUser is %s" % currentUser)
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

    def get_queryset(self):
        theUser = self.request.user

        userIsCurrentUser = Q(user=theUser)
        viewableByAnyone = Q(viewableBy="ANYONE")

        theQueryset = Goal.objects.filter(userIsCurrentUser | viewableByAnyone)

        try:
            goal_id = self.kwargs['goal_id']
            theQueryset = theQueryset.filter(pk=goal_id)
        except:
            theQueryset = theQueryset


        return theQueryset




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
        #print(self.request.data)
        #print("update")
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        #api.send_sms(body='I can haz txt', from_phone='+3107703042', to=['+3107703042'])

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        #page = self.paginate_queryset(queryset)
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

        #page = self.paginate_queryset(queryset)
        #if page is not None:
        #    serializer = self.get_serializer(page, many=True)
        #    return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        data = {i['id']: i for i in serializer.data}

        return Response(data)



    def get_queryset(self):

        try:

            aQueryset = PlanOccurrence.objects.filter(user=self.request.user)
        except:
            aQueryset = PlanOccurrence.objects.none()

        return aQueryset



    def create(self, request, *args, **kwargs):
        print(self.request.data)
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
            aQueryset = PlanOccurrence.objects.filter(goal=goal_id, isSubscribed=True)
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
    permission_classes = [AllowAny]
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
        '''theDate = datetime.datetime.now()
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
        print(theDate.strftime)
        theDateString = theDate.strftime("%Y-%m-%d-%H:%M:%S.%f")
        schedule = CrontabSchedule.objects.create(hour=theHour, minute=inAFewMinutes, month_of_year=theMonth,
                                                  day_of_month=theDayOfTheMonth)
        task = PeriodicTask.objects.create(crontab=schedule, name=theDateString,
                                           task='kiterope.tasks.send_notification', args=json.dumps(['ExponentPushToken[A8Xg__J5oKIZtFo65N2604]', 'This is the message sent to you']))
        #send_push_message('ExponentPushToken[u9Rw6jBgLm9MVSKXYeSk3p]', "Listing")
        '''

        #print("list")
        #print(self.request.META)
        #print(self.request.user.is_authenticated())

        try:
            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']
            print("periodRangeStart %s" % periodRangeStart)
            print("periodRangeEnd %s" % periodRangeEnd)


            print("inside list2")
            periodRangeStart = datetime.datetime.strptime(periodRangeStart, "%Y-%m-%d").date()
            periodRangeEnd = datetime.datetime.strptime(periodRangeEnd, "%Y-%m-%d").date()
            print("inside list3")

            print("periodRangeStart %s" % periodRangeStart)
            print("periodRangeEnd %s" % periodRangeEnd)

        except:
            periodRangeStart = str(datetime.datetime.now().date())
            periodRangeStart = datetime.datetime.now().date()  #+ datetime.timedelta(days=10)

            periodRangeEnd = periodRangeStart + datetime.timedelta(days=1)
            #print ("periodRangeStart " + periodRangeStart)
            #print ("periodRangeEnd " + periodRangeEnd)

        request.user.is_authenticated()
        currentUser = request.user



        StepOccurrence.objects.updateStepOccurrences(currentUser, periodRangeStart, periodRangeEnd)
        print("Stepoccurrence updateStepOccurrences")
        #print("occurrencesUpdated")

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)


        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)




    def post(self, request, *args, **kwargs):
        #print(request)

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)



    '''def create_update_occurrence(self, aStepId, aStepOccurrence):
        print("create update occurrence")
        currentStepUpdates = Update.objects.filter(step=aStepId)
        for currentStepUpdate in currentStepUpdates:
            print("inside currentStepUpdates")
            anUpdateOccurrence = UpdateOccurrence.objects.create_occurrence(aStepOccurrence.id, currentStepUpdate.id)

            print("Update create Occurrence finished")'''



    def get_queryset(self):
        print("get queryset")
        #user = self.request.user
        #userPlanQueryset = user.plan_set.all()
        try:
            #print("inside Get Queryset")
            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']
            #print("inside Get Queryset2")

            #periodRangeStart = datetime.date.strptime(periodRangeStart, "%Y-%m-%d")
            #periodRangeEnd = datetime.date.strptime(periodRangeEnd, "%Y-%m-%d")

            #print("getQueryset periodRangeStart %s periodRangeEnd %s" % (periodRangeStart, periodRangeEnd))
            #querySet = Contact.objects.filter((Q(sender=theUser) | Q(receiver=theUser)))
            #theQueryset = StepOccurrence.objects.filter(Q(date__lte=periodRangeEnd))
            userIsCurrentUser = Q(user=self.request.user)
            dateLessThanEnd = Q(date__lte=periodRangeEnd)
            dateLaterThanStart = Q(date__gte=periodRangeStart)
            isSubscribed = Q(planOccurrence__isSubscribed=True)


            theQueryset = StepOccurrence.objects.filter(userIsCurrentUser & dateLessThanEnd & dateLaterThanStart).order_by('date')

        except:
            #periodRangeStart = str(datetime.datetime.now().date())
            periodRangeStart = datetime.datetime.now().date()

            periodRangeEnd = periodRangeStart


            theQueryset = StepOccurrence.objects.none()

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
    permission_classes = [PostPutAuthorOrView]

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

    def get_queryset(self):
        try:
            theUser = self.request.user.is_authenticated()
            userIsCurrentUser = Q(author=theUser)
            viewableByAnyone = Q(viewableBy="ANYONE")

            theQueryset = Program.objects.filter(userIsCurrentUser | viewableByAnyone)
        except:
            viewableByAnyone = Q(viewableBy="ANYONE")

            theQueryset = Program.objects.filter(viewableByAnyone)


        try:
            program_id = self.kwargs['program_id']
            theQueryset = theQueryset.filter(pk=program_id)
        except:
            theQueryset = theQueryset

        return theQueryset


class ProgramNoStepsViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramNoStepsSerializer
    queryset = Program.objects.all()
    permission_classes = [AllowAny]

    required_scopes = ['groups']
    pagination_class = StandardResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # This is the line that allows us to get at the object without iterating over an array
        return Response(serializer.data)

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

    def get_queryset(self):
        try:
            theUser = self.request.user.is_authenticated()
            userIsCurrentUser = Q(author=theUser)
            viewableByAnyone = Q(viewableBy="ANYONE")
            theQueryset = Program.objects.filter(userIsCurrentUser | viewableByAnyone)
        except:
            viewableByAnyone = Q(viewableBy="ANYONE")

            theQueryset = Program.objects.filter(viewableByAnyone)


        try:
            program_id = self.kwargs['program_id']
            theQueryset = theQueryset.filter(pk=program_id)
        except:
            theQueryset = theQueryset

        return theQueryset


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()
    permission_classes = [AllowAny]
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
        print(theUser)
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

    def retrieve(self, request, pk=None):
        if pk == 'me':
            currentUser = self.request.user.is_authenticated()
            theProfile = Profile.objects.get(user=currentUser)
            # send_push_message('ExponentPushToken[2BErIjItiQadkO-bFdABGR]', "did you get this?")
            # print(request.user.username)

            return Response(ProfileSerializer(theProfile, context={'request': request}).data)
        return super(ProfileViewSet, self).retrieve(request, pk)


    def get_queryset(self):
        theUser = self.request.user.is_authenticated()
        return Profile.objects.filter(user=theUser)

    def get_object(self):
        theUser = self.request.user.is_authenticated()
        return Profile.objects.get(user=theUser)


class SettingsSetViewSet(viewsets.ModelViewSet):
    serializer_class = SettingsSetSerializer
    queryset = SettingsSet.objects.all()
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    required_scopes = ['groups']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # This is the line that allows us to get at the object without iterating over an array
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if pk == 'me':
            currentUser = self.request.user.is_authenticated()
            theSettings = SettingsSet.objects.get(user=currentUser)
            # send_push_message('ExponentPushToken[2BErIjItiQadkO-bFdABGR]', "did you get this?")
            # print(request.user.username)

            return Response(SettingsSetSerializer(theSettings, context={'request': request}).data)
        return super(SettingsSetViewSet, self).retrieve(request, pk)

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_queryset(self):
        theUser = self.request.user.is_authenticated()
        return SettingsSet.objects.filter(user=theUser)

    def get_object(self):
        theUser = self.request.user.is_authenticated()
        return SettingsSet.objects.get(user=theUser)









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

#This is a good example of how to allow fully authorized without sign in
class BrowseableProgramViewSet(viewsets.ModelViewSet):
    serializer_class=BrowseableProgramSerializer
    #authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = [AllowAny]
    queryset = Program.objects.all()


    def get_queryset(self):

        viewableByAnyone = Q(viewableBy="ANYONE")

        theQueryset = Program.objects.filter(viewableByAnyone).order_by('category')



        return theQueryset









class ProgramSearchViewSet(HaystackViewSet):
    index_models = [Program]
    serializer_class = ProgramSearchSerializer
    permission_classes = [IsAuthorOrReadOnly]
    pagination_class = StandardResultsSetPagination


class ProgramDuplicatorViewSet(viewsets.ModelViewSet):
    serializer_class = ProgramSerializer
    queryset = Program.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=False)

        return Response(serializer.data)

    def get_queryset(self):
        try:
            program_id = self.kwargs['program_id']
            theProgram = Program.objects.get(id=program_id)
            theNewProgram = deepcopy(theProgram)
            theNewProgram.id = None
            theNewProgram.title = theNewProgram.title + " Copy"
            theNewProgram.save()
            theSteps = Step.objects.filter(program=theProgram)
            for theStep in theSteps:
                theNewStep = deepcopy(theStep)
                theNewStep.id = None
                theNewStep.program_id = theNewProgram.id
                theNewStep.save()
                theUpdates = Update.objects.filter(step=theStep)
                for theUpdate in theUpdates:
                    theNewUpdate = deepcopy(theUpdate)
                    theNewUpdate.id = None
                    theNewUpdate.step_id = theNewStep.id
                    theNewUpdate.save()


            aQueryset = Program.objects.get(id=theNewProgram.id)

            return aQueryset
            #aQuerySet = Step.objects.filter(id=theNewStep.id)


            #serializer = StepSerializer(aQuerySet)



        except:

            aQueryset = Program.objects.none()
            return aQueryset

class StepDuplicatorViewSet(viewsets.ModelViewSet):
    serializer_class = StepSerializer
    queryset = Step.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=False)

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
            aQueryset = Step.objects.get(id=theNewStep.id)

            return aQueryset
            #aQuerySet = Step.objects.filter(id=theNewStep.id)


            #serializer = StepSerializer(aQuerySet)



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



    
    
conn = boto.connect_s3(settings.S3_ACCESS_KEY_ID, settings.S3_SECRET_ACCESS_KEY)

def sign_s3_upload(request):
    object_name = request.GET['objectName']
    extension = os.path.splitext(object_name)[1]
    object_name = str(uuid.uuid4()) + extension
    content_type = mimetypes.guess_type(object_name)[0]
    if content_type == 'audio/x-wav':
        content_type = 'audio/wav'

    signed_url = conn.generate_url(
        300,
        "PUT",
        settings.AWS_STORAGE_BUCKET_NAME,
        'uploads/' + object_name,
        headers = {'Content-Type': content_type,
                   'x-amz-acl': 'public-read',
                   })

    return HttpResponse(json.dumps({'signedUrl': signed_url}))







# For react S3 uploader instead of dropzone
'''def s3_sign_upload(request):
    print("s3_sign_upload")
    object_name = request.GET['objectName']
    extension = os.path.splitext(object_name)[1]
    #object_name = str(uuid.uuid4()) + extension

    #content_type = mimetypes.guess_type(object_name)[0]

    signed_url = conn.generate_url(
        300,
        "PUT",
        settings.AWS_STORAGE_BUCKET_NAME,
        'uploads/' + object_name,
        headers = {'Content-Type': content_type,
                   'x-amz-acl': 'public-read',
                   })

    return HttpResponse(json.dumps({'signedUrl': signed_url}))

    
    '''
    
    

