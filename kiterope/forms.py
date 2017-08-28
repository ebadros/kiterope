from django import forms
from django.forms import ModelForm
from kiterope.models import Profile, User, Goal, BlogPost, Student, Coach, Rate, Session, Review, Update, Post, Plan, Step, Question, Answer, Interest
from django.contrib.admin import widgets
from tinymce.widgets import TinyMCE

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = {'first_name', 'last_name', 'username','email'}
        
class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = {'bio',}
        
class GoalForm(ModelForm):
    description = forms.CharField(widget=forms.Textarea(attrs={'rows':4}))
    why = forms.CharField(widget=forms.Textarea(attrs={'rows':3}))
        
    class Meta:
        model = Goal
        fields = {'title', 'image','description', 'why', 'deadline', 'viewableBy',}
        
class PlanForm(ModelForm):
     description = forms.CharField(widget=forms.Textarea(attrs={'rows':4}))
     
     class Meta:
         model = Plan
         fields = {'title', 'viewableBy','description', 'startDate', }

class InterestForm(ModelForm):
    goal = forms.CharField(widget=forms.Textarea(attrs={'rows':4}))

    class Meta:
        model = Interest
        fields = {'name', 'email', 'goal'}

class StepForm(ModelForm):

    class Meta:
        model = Step
        fields = {'title', 'plan', 'description', 'frequency', 'day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07', 'monthlyDates', 'startTime', 'duration', }


class BlogPost(ModelForm):
    description = forms.CharField(widget=TinyMCE(attrs={'cols': 80, 'rows': 30}))

    class Meta:
        model = BlogPost
        fields = {'title', 'description', 'author', 'modified'}
