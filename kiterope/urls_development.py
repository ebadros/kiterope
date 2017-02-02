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
from .views import ApiEndpoint
import oauth2_provider.views as oauth2_views





import apps
from kiterope import views

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'plans', views.PlanViewSet)
router.register(r'updates', views.UpdateViewSet)
router.register(r'steps', views.StepViewSet)
router.register(r'searchQuery', views.SearchQueryViewSet, 'SearchQuery')
router.register(r'goalEntry', views.GoalViewSet, base_name='Goal')
router.register(r'sessions', views.SessionViewSet, base_name='Session')
router.register(r'notifications', views.NotificationViewSet, base_name='Notification')


router.register(r'^plans/(?P<plan_id>\w+)/steps', views.StepViewSet, base_name='Step')
router.register(r'^period/(?P<periodRangeStart>[\w\-]+)/(?P<periodRangeEnd>[\w\-]+)', views.StepOccurrenceViewSet, base_name="StepOccurrence")
#router.register(r'period', views.GoalViewSet, base_name='Goal')
router.register(r'^steps/(?P<step_id>\w+)/updates', views.UpdateViewSet, base_name='Update')
router.register(r'goals', views.GoalViewSet, base_name='Goal')
router.register(r'^goals/(?P<goal_id>\w+)/plans', views.PlanViewSet, base_name='Plan')
router.register(r'^stepOccurrences/(?P<stepOccurrence_id>\w+)/updateOccurrences', views.UpdateOccurrenceViewSet, base_name='UpdateOccurrence')
router.register(r'^myProfile', views.PersonalProfileViewSet)

router.register(r'^profiles', views.ProfileViewSet, base_name='Profile')
router.register(r'^plan/search', views.PlanSearchViewSet, base_name="plan-search")



from django.views.generic.base import RedirectView



oauth2_endpoint_views = [
    url(r'^authorize/$', oauth2_views.AuthorizationView.as_view(), name="authorize"),
    url(r'^token/$', oauth2_views.TokenView.as_view(), name="token"),
    url(r'^revoke-token/$', oauth2_views.RevokeTokenView.as_view(), name="revoke-token"),
]

if settings.DEBUG:
    # OAuth2 Application Management endpoints
    oauth2_endpoint_views += [
        url(r'^applications/$', oauth2_views.ApplicationList.as_view(), name="list"),
        url(r'^applications/register/$', oauth2_views.ApplicationRegistration.as_view(), name="register"),
        url(r'^applications/(?P<pk>\d+)/$', oauth2_views.ApplicationDetail.as_view(), name="detail"),
        url(r'^applications/(?P<pk>\d+)/delete/$', oauth2_views.ApplicationDelete.as_view(), name="delete"),
        url(r'^applications/(?P<pk>\d+)/update/$', oauth2_views.ApplicationUpdate.as_view(), name="update"),
    ]

    # OAuth2 Token Management endpoints
    oauth2_endpoint_views += [
        url(r'^authorized-tokens/$', oauth2_views.AuthorizedTokensListView.as_view(), name="authorized-token-list"),
        url(r'^authorized-tokens/(?P<pk>\d+)/delete/$', oauth2_views.AuthorizedTokenDeleteView.as_view(),
            name="authorized-token-delete"),
    ]

urlpatterns = [
      url(r'^$', TemplateView.as_view(template_name='index.html')),
      url(r'^interest', views.interest, name="interest"),
      url(r'^swagger/', schema_view),
      url(r'^api/hello', ApiEndpoint.as_view()),  # an example resource endpoint
      url(r'^api/', include(router.urls)),
      url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
      url(r'^search/', include('haystack.urls')),


                # url(r'^$', views.splash, name='splash'),

      url(r'^admin/', admin.site.urls),
      url(r'^accounts/', include('allauth.urls')),
      url(r'^goals/add', views.goals_add, name='goals_add'),
      url(r'^secret', views.secret_page, name='secret'),
      url(r'^tinymce/', include('tinymce.urls')),
      url(r'^signS3Upload/$', views.sign_s3_upload, name='sign_s3_upload'),

                  # REST FRAMEWORK URLS
      # url(r'^users/$', views.UserList.as_view()),
      # url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
      # url(r'^goals/$', views.GoalList.as_view()),
      # url(r'^goals/(?P<pk>[0-9]+)$', views.GoalDetail.as_view()),
      # url(r'^plans/$', views.PlanList.as_view()),
      # url(r'^plans/(?P<pk>[0-9]+)$', views.PlanDetail.as_view()),
      # url(r'^steps/$', views.StepList.as_view()),
      # url(r'^steps/(?P<pk>[0-9]+)$', views.StepDetail.as_view()),
      # url(r'^coaches/$', views.CoachList.as_view()),
      # url(r'^coaches/(?P<pk>[0-9]+)$', views.CoachDetail.as_view()),
      # url(r'^students/$', views.StudentList.as_view()),
      # url(r'^students/(?P<pk>[0-9]+)$', views.StudentDetail.as_view()),
      # url(r'^reviews/$', views.ReviewList.as_view()),
      # url(r'^reviews/(?P<pk>[0-9]+)$', views.ReviewDetail.as_view()),

      url(r'^rates/$', views.RateList.as_view()),
      url(r'^rates/(?P<pk>[0-9]+)$', views.RateDetail.as_view()),

      url(r'^updates/$', views.UpdateList.as_view()),
      url(r'^updates/(?P<pk>[0-9]+)$', views.UpdateDetail.as_view()),

      url(r'^questions/$', views.QuestionList.as_view()),
      url(r'^questions/(?P<pk>[0-9]+)$', views.QuestionDetail.as_view()),

      url(r'^answers/$', views.AnswerList.as_view()),
      url(r'^answers/(?P<pk>[0-9]+)$', views.AnswerDetail.as_view()),

      url(r'^goals/(?P<goal_id>\w+)/plans', views.goals_plans, name='goals_plans'),
      url(r'^api-auth/', include('rest_framework.urls')),
      url(r'^plans/(?P<plan_id>\w+)', views.plan_edit, name='plan_edit'),
      url(r'^favicon.ico$', RedirectView.as_view(url='/static/favicon2.ico'), name="favicon"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

