from django import forms
from django.forms import ModelForm
from kiterope.models import Profile, User, Goal, Student, Coach, Rate, Session, Review, Update, Post, Plan, Step, Question, Answer
from django.contrib.admin import widgets


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = {'first_name', 'last_name', 'username','email'}
        
class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = {'bio','images'}
        
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
         fields = {'title', 'viewableBy','description', 'startDate', 'endDate'}
