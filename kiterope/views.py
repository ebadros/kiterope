from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from kiterope.models import Goal, Program, Step, Label, Message, Contact, CroppableImage, SettingsSet, Visualization, KChannel, MessageThread, SearchQuery, BlogPost, KChannelUser, Participant, KChannelManager, Notification, Session, Review, Profile, Update, Rate, Question, Answer, Interest, StepOccurrence, PlanOccurrence, UpdateOccurrence, UpdateOccurrenceManager, StepOccurrenceManager
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
from kiterope.helpers import toUTC


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
from kiterope.serializers import UserSerializer, ProgramNoStepsSerializer, CroppableImageSerializer, VisualizationSerializer, ContactSerializer,  SettingsSetSerializer, BlogPostSerializer, BrowseableProgramSerializer, KChannelSerializer, LabelSerializer, MessageSerializer, MessageThreadSerializer, SearchQuerySerializer, NotificationSerializer, UpdateOccurrenceSerializer, UpdateSerializer, ProfileSerializer, GoalSerializer, ProgramSerializer, StepSerializer, StepOccurrenceSerializer, PlanOccurrenceSerializer
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
            #send_push_message('ExponentPushToken[2BErIjItiQadkO-bFdABGR]',"did you get this?")
            print(request.user.username)

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

    @detail_route(methods=['get'], permission_classes=[IsProgramOwnerOrReadOnly], url_path='duplicate')
    def duplicateStep(self, request, *args, **kwargs):

        step_id = self.kwargs['pk']
        theStep = Step.objects.get(id=step_id)
        theNewStep = deepcopy(theStep)
        theNewStep.id = None
        theNewStep.title = theNewStep.title + " Copy"
        theNewStep.save()
        theUpdates = Update.objects.filter(steps=theStep)
        for theUpdate in theUpdates:
            theNewUpdate = deepcopy(theUpdate)
            theNewUpdate.id = None
            theNewUpdate.step_id = theNewStep.id
            theNewUpdate.save()
        theStepFromDB = Step.objects.get(id=theNewStep.id)
        serializer = self.get_serializer(theStepFromDB)
        return Response(serializer.data)

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
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

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
    #pagination_class = StandardResultsSetPagination







class UpdateOccurrenceViewSet(viewsets.ModelViewSet):
    queryset = UpdateOccurrence.objects.all()
    permission_classes = [AllowAny]
    required_scopes = ['groups']
    serializer_class = UpdateOccurrenceSerializer


    def get_queryset(self):

        try:
            stepOccurrence_id = self.kwargs['stepOccurrence_id']
            aQueryset = UpdateOccurrence.objects.filter(stepOccurrence=stepOccurrence_id)
        except:
            aQueryset = UpdateOccurrence.objects.all()

        return aQueryset

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        print("inside update")
        instance = self.get_object()

        if instance.update.measuringWhat == "Absolute Date/Time":
            print("inside the dated")
            print(instance.stepOccurrence.planOccurrence.startDate)
            instance.datetime = datetime.datetime.now()
        if instance.update.measuringWhat == "Relative Date":
            instance.integer = instance.stepOccurrence.planOccurrence.startDate - datetime.datetime.now()



        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_update(serializer)

            print("inside theStepOccurrence")
            print(instance.stepOccurrence)

            theStepOccurrence = StepOccurrence.objects.get(id=instance.stepOccurrence.id)
            theStepOccurrence.previouslySaved = True
            theStepOccurrence.save()

            print("inside theStepOccurrence2")

            theUpdate = Update.objects.get(id=instance.update.id)

            # This checks if the StepOccurrence has been previously saved and the default UpdateOccurrence capturing
            # whether it's been completed and sets the StepOccurrence wasCompleted to True if it's so
            if theUpdate.format == "boolean":
                if theUpdate.default and instance.boolean == True:
                    theStepOccurrence.wasCompleted = True
                    theStepOccurrence.save()
                elif theUpdate.default and instance.boolean == False:

                    theStepOccurrence.wasCompleted = False

                    theStepOccurrence.save()
                    print("check it")
                    print(theStepOccurrence.wasCompleted)
                    print("check it out")
        except:
            pass



        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ProgramUpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    required_scopes = ['groups']
    permission_classes = [AllowAny]
    serializer_class = UpdateSerializer

    def get_queryset(self):

        try:
            program_id = self.kwargs['program_id']
            aQueryset = Update.objects.filter(program=program_id)
        except:
            aQueryset = Update.objects.all()

        return aQueryset

class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    required_scopes = ['groups']
    permission_classes = [AllowAny]
    serializer_class = UpdateSerializer

    def get_queryset(self):
        try:
            self.request.user.is_authenticated
            currentUser = self.request.user

            aQueryset = Update.objects.filter(program__author=currentUser )
        except:
            aQueryset = Update.objects.none()

        return aQueryset

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
        print(request.data)
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        print(request.data)

        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)


        return Response(serializer.data)


'''
class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    required_scopes = ['groups']
    permission_classes = [AllowAny]
    serializer_class = UpdateSerializer

    def get_queryset(self):

        try:
            step_id = self.kwargs['step_id']
            aQueryset = Update.objects.filter(steps__id=step_id)
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
        print(request.data)

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

'''

class CroppableImageViewSet(viewsets.ModelViewSet):
    queryset = CroppableImage.objects.all()
    required_scopes = ['groups']
    permission_classes = [AllowAny]
    serializer_class = CroppableImageSerializer

    def post(self, request, *args, **kwargs):
        print("inisde post")

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

class VisualizationViewSet(viewsets.ModelViewSet):
    queryset = Visualization.objects.all()
    required_scopes = ['groups']
    permission_classes = [AllowAny]
    serializer_class = VisualizationSerializer

    def post(self, request, *args, **kwargs):
        print(self.request.data)

        self.create(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

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
            periodRangeStart = datetime.datetime.strptime(periodRangeStart, "%Y-%m-%d")
            periodRangeEnd = datetime.datetime.strptime(periodRangeEnd, "%Y-%m-%d")
            periodRangeEnd = periodRangeEnd + datetime.timedelta(days=1)
            periodRangeEnd = periodRangeEnd - datetime.timedelta(seconds=1)

        except:
            periodRangeStart = datetime.datetime.now().date()  #+ datetime.timedelta(days=10)
            periodRangeEnd = periodRangeStart + datetime.timedelta(days=1)
            periodRangeEnd = periodRangeEnd - datetime.timedelta(seconds=1)


        request.user.is_authenticated()
        currentUser = self.request.user

        StepOccurrence.objects.updateStepOccurrencesForRange(currentUser, periodRangeStart, periodRangeEnd)
        print("occurrencesUpdated")

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
        print("getting queryset")
        #userPlanQueryset = user.plan_set.all()
        try:
            self.request.user.is_authenticated()
            currentUser = self.request.user


            periodRangeStart = self.kwargs['periodRangeStart']
            periodRangeEnd = self.kwargs['periodRangeEnd']
            #whichStepOccurrences = self.kwargs['whichStepOccurrences']

            periodRangeStart = datetime.datetime.strptime(periodRangeStart, "%Y-%m-%d")
            periodRangeEnd = datetime.datetime.strptime(periodRangeEnd, "%Y-%m-%d")
            periodRangeEnd = periodRangeEnd + datetime.timedelta(days=1)
            periodRangeEnd = periodRangeEnd - datetime.timedelta(seconds=1)

            theUserProfile = Profile.objects.get(user=currentUser)

            periodRangeStart = toUTC(periodRangeStart, theUserProfile.timezone)
            periodRangeEnd = toUTC(periodRangeEnd, theUserProfile.timezone)
            print("periodRangeStart")
            print(periodRangeStart)
            print("periodRangeEnd")
            print(periodRangeEnd)

            dateLaterThanStart = Q(date__gte=periodRangeStart)
            dateLessThanEnd = Q(date__lte=periodRangeEnd)
            isSubscribed = Q(planOccurrence__isSubscribed=True)
            userIsCurrentUser = Q(user=currentUser)

            '''if whichStepOccurrences == 'TODO' or whichStepOccurrences == 'NOT_COMPLETED' :
                stepOccurrenceStatusFilter = Q(wasCompleted=False)
            elif whichStepOccurrences == 'COMPLETED':
                stepOccurrenceStatusFilter = Q(wasCompleted=True)

            if whichStepOccurrences == 'TODO':
                isStepOccurrenceActive = Q(date__gte = datetime.datetime.now().date() )

            elif whichStepOccurrences == 'NEVER_COMPLETED':
                isStepOccurrenceActive = Q(date__lt = datetime.datetime.now().date())

            elif whichStepOccurrences == 'COMPLETED':
                isStepOccurrenceActive = Q(date__gte = periodRangeStart)
'''




            typeIsCompletionFilter = Q(type="COMPLETION")
            typeIsTimeBasedFilter = Q(type="TIME")


            # COMPLETION BASED
            #theQueryset = StepOccurrence.objects.filter(userIsCurrentUser & isSubscribed & stepOccurrenceStatusFilter & typeIsCompletionFilter).order_by('date')

            # TIME-BASED
            #theQueryset = StepOccurrence.objects.filter((userIsCurrentUser & isSubscribed & dateLessThanEnd & dateLaterThanStart & stepOccurrenceStatusFilter & typeIsTimeBasedFilter & isStepOccurrenceActive )).order_by('date')

            theQueryset = StepOccurrence.objects.filter(userIsCurrentUser & isSubscribed & dateLessThanEnd & dateLaterThanStart ).order_by('date')
            print(theQueryset)
            #theQueryset = StepOccurrence.objects.filter(userIsCurrentUser & isSubscribed & dateLessThanEnd & dateLaterThanStart ).order_by('date')

        except:
            #periodRangeStart = str(datetime.datetime.now().date())
            #periodRangeStart = datetime.datetime.now().date()
            #print("inside get queryste periodRangeStart %s" % periodRangeStart)

#            periodRangeEnd = periodRangeStart
 #           print("inside get queryste periodRangeEnd %s" % periodRangeEnd)



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

    @detail_route(methods=['get'], permission_classes=[PostPutAuthorOrView], url_path='duplicate')
    def duplicateProgram(self, request, *args, **kwargs):

        print("inside duplicateProgram")
        print(self.kwargs)
        program_id = self.kwargs['pk']
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
            theUpdates = Update.objects.filter(steps=theStep)
            for theUpdate in theUpdates:
                theNewUpdate = deepcopy(theUpdate)
                theNewUpdate.id = None
                theNewUpdate.step_id = theNewStep.id
                theNewUpdate.save()


        theProgramFromDB = Program.objects.get(id=theNewProgram.id)
        serializer = self.get_serializer(theProgramFromDB)


        return Response(serializer.data)



            #aQuerySet = Step.objects.filter(id=theNewStep.id)


            #serializer = StepSerializer(aQuerySet)






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
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def get_queryset(self):
        try:
            theUser = self.request.user.is_authenticated()
            userIsCurrentUser = Q(author=theUser)
            viewableByAnyone = Q(viewableBy="ANYONE")
            isActiveFilter = Q(isActive=True)

            theQueryset = Program.objects.filter(isActive & (userIsCurrentUser | viewableByAnyone))
        except:
            isActiveFilter = Q(isActive=True)

            viewableByAnyone = Q(viewableBy="ANYONE")

            theQueryset = Program.objects.filter(viewableByAnyone & isActiveFilter)


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

    def update(self, request, *args, **kwargs):
        print(self.request.data)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if pk == 'me':
            self.request.user.is_authenticated()
            currentUser = self.request.user
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




'''
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


            aQueryset = Program.objects.filter(id=theNewProgram.id)

            return aQueryset
            #aQuerySet = Step.objects.filter(id=theNewStep.id)


            #serializer = StepSerializer(aQuerySet)



        except:

            aQueryset = Program.objects.none()
            return aQueryset
'''
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



def twitter(request, *args, **kwargs):
    return HttpResponse('Secret contents!', status=200)

    
conn = boto.connect_s3(settings.S3_ACCESS_KEY_ID, settings.S3_SECRET_ACCESS_KEY)

def sign_s3_upload(request):
    object_name = request.GET['objectName']
    print(object_name)
    #extension = os.path.splitext(object_name)[1]
    #object_name = str(uuid.uuid4()) + extension
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
    
    

