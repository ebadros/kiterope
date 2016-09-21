"""kiterope URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.views import APIView
from django.views.generic import TemplateView
from django.conf.urls import url
from kiterope.views import schema_view
from django.conf import settings


import apps
from kiterope import views

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'goals', views.GoalViewSet)
router.register(r'plans', views.PlanViewSet)
router.register(r'steps', views.StepViewSet)




if settings.IN_STAGING or settings.IN_DEVELOPMENT:
urlpatterns = [
    url(r'^swagger/', schema_view),
    url(r'^api/', include(router.urls)),

                  #url(r'^$', views.splash, name='splash'),

    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^goals/add', views.goals_add, name='goals_add'),

    # REST FRAMEWORK URLS
    #url(r'^users/$', views.UserList.as_view()),
    #url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    #url(r'^goals/$', views.GoalList.as_view()),
    #url(r'^goals/(?P<pk>[0-9]+)$', views.GoalDetail.as_view()),
    #url(r'^plans/$', views.PlanList.as_view()),
    #url(r'^plans/(?P<pk>[0-9]+)$', views.PlanDetail.as_view()),
    #url(r'^steps/$', views.StepList.as_view()),
    #url(r'^steps/(?P<pk>[0-9]+)$', views.StepDetail.as_view()),
    #url(r'^coaches/$', views.CoachList.as_view()),
    #url(r'^coaches/(?P<pk>[0-9]+)$', views.CoachDetail.as_view()),
    #url(r'^students/$', views.StudentList.as_view()),
    #url(r'^students/(?P<pk>[0-9]+)$', views.StudentDetail.as_view()),
    #url(r'^reviews/$', views.ReviewList.as_view()),
    #url(r'^reviews/(?P<pk>[0-9]+)$', views.ReviewDetail.as_view()),

    url(r'^rates/$', views.RateList.as_view()),
    url(r'^rates/(?P<pk>[0-9]+)$', views.RateDetail.as_view()),

    url(r'^sessions/$', views.SessionList.as_view()),
    url(r'^sessions/(?P<pk>[0-9]+)$', views.SessionDetail.as_view()),

    url(r'^updates/$', views.UpdateList.as_view()),
    url(r'^updates/(?P<pk>[0-9]+)$', views.UpdateDetail.as_view()),

    url(r'^questions/$', views.QuestionList.as_view()),
    url(r'^questions/(?P<pk>[0-9]+)$', views.QuestionDetail.as_view()),

    url(r'^answers/$', views.AnswerList.as_view()),
    url(r'^answers/(?P<pk>[0-9]+)$', views.AnswerDetail.as_view()),





    url(r'^goals/(?P<goal_id>\w+)/plans', views.goals_plans, name='goals_plans'),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^plans/(?P<plan_id>\w+)', views.plan_edit, name='plan_edit'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.IN_PRODUCTION:
    urlpatterns = [
    url(r'^$', views.splash, name='splash'),
 ]
