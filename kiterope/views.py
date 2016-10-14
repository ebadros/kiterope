from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from kiterope.models import Goal, Plan, Step, Coach, Student, Session, Review, Update, Rate, Question, Answer, Interest
import datetime, time
from time import mktime
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from oauth2_provider.ext.rest_framework import TokenHasReadWriteScope, TokenHasScope



import requests
import json



from kiterope.helpers import formattime


from rest_framework import viewsets
from rest_framework.views import APIView
from kiterope.serializers import UserSerializer, GoalSerializer, PlanSerializer, StepSerializer, CoachSerializer, QuestionSerializer
from kiterope.serializers import StudentSerializer, SessionSerializer, ReviewSerializer, UpdateSerializer, RateSerializer, AnswerSerializer, InterestSerializer
from kiterope.forms import UserForm, ProfileForm, GoalForm, PlanForm, InterestForm

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import generics

from rest_framework.decorators import api_view, renderer_classes
from rest_framework import response, schemas
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer



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
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Goal.objects.all()
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

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

class StepViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Step.objects.all()
    serializer_class = StepSerializer




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


class StepList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Step.objects.all()
    serializer_class = StepSerializer


class StepDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['groups']
    queryset = Step.objects.all()
    serializer_class = StepSerializer



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


class SessionList(generics.ListCreateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


class SessionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer



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
    
    
    

    
    
    
    
    
    
    
    

