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
#from .views import ApiEndpoint
#import oauth2_provider.views as oauth2_views
from django.conf.urls import include, url


from rest_framework.authtoken.views import obtain_auth_token

from django.views.decorators.csrf import csrf_exempt


import apps
from kiterope import views

from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'expoPushToken', views.ExpoPushTokenViewSet)


router.register(r'updates', views.UpdateViewSet)
router.register(r'steps', views.StepViewSet)
router.register(r'searchQuery', views.SearchQueryViewSet, 'SearchQuery')
router.register(r'goalEntry', views.GoalViewSet, base_name='Goal')
router.register(r'sessions', views.SessionViewSet, base_name='Session')
router.register(r'blogPosts', views.BlogPostViewSet, base_name='BlogPost')

router.register(r'notifications', views.NotificationViewSet, base_name='Notification')

router.register(r'messageThreads/(?P<thread_id>\w+)/messages', views.MessageThreadMessageViewSet, base_name='MessageThreadMessage')
router.register(r'messageThreads/labels/(?P<label_id>\w+)', views.MessageThreadViewSet, base_name='MessageThread')

router.register(r'messageThreads', views.MessageThreadViewSet, base_name='MessageThread')

router.register(r'planOccurrences', views.PlanOccurrenceViewSet, base_name='PlanOccurrence')

router.register(r'messages/(?P<sender_id>\w+)/(?P<receiver_id>\w+)', views.MessageViewSet, base_name='Message')
router.register(r'messages', views.MessageViewSet, base_name='Message')
router.register(r'labels/(?P<typeOfLabel>\w+)', views.LabelViewSet, base_name='Label')

router.register(r'labels', views.LabelViewSet, base_name='Label')
router.register(r'channels/(?P<channel_id>\w+)/messageThread', views.MessageThreadChannelViewSet, base_name='MessageThreadChannel')

router.register(r'channels', views.KChannelViewSet, base_name='Room')

router.register(r'channelUsers/(?P<receiver_id>\w+)', views.ReceiverKChannelViewSet, base_name='KChannel')
router.register(r'^steps/(?P<step_id>\w+)/duplicate', views.StepDuplicatorViewSet, base_name='step-duplicate')
router.register(r'^programs/(?P<program_id>\w+)/duplicate', views.ProgramDuplicatorViewSet, base_name='program-duplicate')


router.register(r'^programs/(?P<program_id>\w+)/steps', views.StepViewSet, base_name='Step')
router.register(r'^programs/(?P<program_id>\w+)/', views.ProgramViewSet, base_name='Program')
router.register(r'programs', views.ProgramViewSet)

router.register(r'browseablePrograms', views.BrowseableProgramViewSet, base_name='Program')



router.register(r'^plans/(?P<plan_id>\w+)/steps', views.StepOccurrenceViewSet, base_name='Step')
router.register(r'^plans', views.PlanOccurrenceViewSet, base_name='PlanOccurrence')


router.register(r'^period/(?P<periodRangeStart>[\w\-]+)/(?P<periodRangeEnd>[\w\-]+)', views.PeriodViewSet, base_name="StepOccurrence")
#router.register(r'period', views.GoalViewSet, base_name='Goal')
router.register(r'^steps/(?P<step_id>\w+)/updates', views.UpdateViewSet, base_name='Update')

router.register(r'goals', views.GoalViewSet, base_name='Goal')
router.register(r'contacts', views.ContactViewSet, base_name='Contact')

router.register(r'^goals/(?P<goal_id>\w+)/planOccurrences', views.GoalPlanOccurrenceViewSet, base_name='PlanOccurrence')

router.register(r'^goals/(?P<goal_id>\w+)/programs', views.ProgramViewSet, base_name='Program')
router.register(r'^stepOccurrences/(?P<stepOccurrence_id>\w+)/updateOccurrences', views.UpdateOccurrenceViewSet, base_name='UpdateOccurrence')
router.register(r'^stepOccurrences', views.StepOccurrenceViewSet, base_name='StepOccurrence')
router.register(r'^updateOccurrences', views.UpdateOccurrenceViewSet, base_name='UpdateOccurrence')


router.register(r'^clients', views.ClientViewSet, base_name='Profile')

router.register(r'^profiles', views.ProfileViewSet, base_name='Profile')
router.register(r'^program/search', views.ProgramSearchViewSet, base_name="program-search")



from django.views.generic.base import RedirectView


'''
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
    '''

urlpatterns = [
      url(r'^$', TemplateView.as_view(template_name='index.html')),
      url(r'^', include('django.contrib.auth.urls')),


                  # django-rest-auth (Login and registration via React)
      url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
      url(r'^rest-auth/', include('rest_auth.urls')),
      url(r'^api/obtain-auth-token/$', obtain_auth_token),
      url(r'^swagger/', schema_view),
      #url(r'^api/hello', ApiEndpoint.as_view()),  # an example resource endpoint
      url(r'^api/', include(router.urls)),
      #url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
      url(r'^search/', include('haystack.urls')),
      url(r'^admin/', admin.site.urls),
      url(r'^accounts/', include('allauth.urls')),
      url(r'^secret', views.secret_page, name='secret'),
      url(r'^tinymce/', include('tinymce.urls')),
      url(r'^signS3Upload/$', views.sign_s3_upload, name='sign_s3_upload'),
      url(r'^api-auth/', include('rest_framework.urls')),
      url(r'^favicon.ico$', RedirectView.as_view(url='/static/favicon2.ico'), name="favicon"),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
