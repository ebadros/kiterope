from django.contrib.auth.models import User
from kiterope.models import Goal, SearchQuery, Label, Contact,  Visualization, Domain, ContactGroup, ProgramRequest, SettingsSet, CroppableImage, Message, BlogPost, KRMessage, MessageThread, KChannel, Program, Step, Profile, Update, Participant, Notification, Session, Review, Answer, Question, Rate, Interest, StepOccurrence, PlanOccurrence, Metric, UpdateOccurrence
from rest_framework import serializers

from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet

from kiterope.search_indexes import ProgramIndex
from kiterope.validators import RequiredValidator
import json
import datetime

from rest_auth.registration.serializers import RegisterSerializer
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.utils import six
from .fields import StringArrayField




def makeSerializer(serializerName, source, many,read_only):
    return {
        'User': lambda: UserSerializer(source, many, read_only),
        'Step': lambda: StepSerializer(source, many, read_only),
        'Goal': lambda: GoalSerializer(source, many, read_only),
        'Program': lambda: ProgramSerializer(source, many, read_only),
        'Coach': lambda: CoachSerializer(source, many, read_only),
        'Update': lambda: UpdateSerializer(source, many, read_only),
        'Session': lambda: SessionSerializer(source, many, read_only),
        'Student': lambda: StudentSerializer(source, many, read_only),
        'Review': lambda: ReviewSerializer(source, many, read_only),
        'Answer': lambda: AnswerSerializer(source, many, read_only),
        'Question': lambda: QuestionSerializer(source, many, read_only),
        'Rate': lambda: RateSerializer(source, many, read_only),
        'Update': lambda: UpdateSerializer(source, many, read_only),
        'Metric': lambda: MetricSerializer(source, many, read_only),
        'Contact': lambda: ContactSerializer(source, many, read_only),

    }[serializerName]

class TimezoneField(serializers.Field):
    "Take the timezone object and make it JSON serializable"
    def to_representation(self, obj):
        return six.text_type(obj)


    def to_internal_value(self, data):
        return data

class InterestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model= Interest
        fields = ('id', 'name', 'email', 'goal')




class StepSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Step
        fields = ('id', 'program', 'relativeStartDateTime', 'relativeEndDateTime','endRecurrence', 'monthlySpecificity', 'monthlyDay', 'monthlyDayOption', 'interval', 'numberOfOccurrences','image', 'type', 'croppableImage','croppableImageData','updates','absoluteStartDateTime', 'visualizations','absoluteEndDateTime', 'permissions', 'programStartDateTime', 'title', 'description', 'isAllDay', 'frequency', 'day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07', 'monthlyDates','useAbsoluteTime', 'recurrenceRule')

    program = serializers.PrimaryKeyRelatedField(many=False, queryset=Program.objects.all())
    absoluteStartDateTime = serializers.DateTimeField(required=False)
    absoluteEndDateTime = serializers.DateTimeField(required=False)
    relativeStartDateTime = serializers.DurationField(required=False)
    relativeEndDateTime = serializers.DurationField(required=False)
    useAbsoluteTime = serializers.BooleanField(required=False)
    programStartDateTime = serializers.SerializerMethodField(required=False, read_only=True)
    isAllDay = serializers.SerializerMethodField(required=False, read_only=True)
    #absoluteStartDateForCalendar = serializers.SerializerMethodField(required=False, read_only=True)
    #absoluteEndDateForCalendar = serializers.SerializerMethodField(required=False, read_only=True)
    permissions = serializers.SerializerMethodField(required=False, read_only=True)
    updates = serializers.SerializerMethodField(required=False, read_only=True)
    visualizations = serializers.SerializerMethodField(required=False, read_only=True)
    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())


    croppableImageData = serializers.SerializerMethodField()


    '''def get_absoluteStartDateForCalendar(self,obj):
        #date_1 = datetime.datetime.strptime(obj.absoluteStartDate, "%y-%m-%d")
        new_date = obj.absoluteStartDate + datetime.timedelta(days=1)
        return new_date



    def get_absoluteEndDateForCalendar(self,obj):
        #date_1 = datetime.datetime.strptime(obj.absoluteEndDate, "%y-%m-%d")
        new_date = obj.absoluteEndDate + datetime.timedelta(days=1)
        return new_date
        '''

    def get_isAllDay(self,obj):
        return True

    def get_programStartDateTime(self, obj):
        return obj.get_programStartDateTime()

    def get_updates(self,obj):
        serializer = UpdateSerializer(obj.get_updates(), many=True)
        return serializer.data

    def get_visualizations(self,obj):
        serializer = VisualizationSerializer(obj.get_visualizations(), many=True)
        return serializer.data



    def get_senderName(self, obj):
        return obj.sender.profile.get_fullName()

    def get_permissions(self,obj):
        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if self.context['request'].user == obj.program.author:
            return True



    def get_croppableImageData(self, obj):

        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data



class StepLimitedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ('id', )

class KChannelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = KChannel
        fields = ('id', 'label', 'users', 'permission' )

    users = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'first_name', 'last_name', 'username', 'email', 'groups', 'name', 'image', 'isCoach', 'bio', 'notificationChannelLabel', 'notificationChannel','profile', 'profileId')

    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    isCoach = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    notificationChannelLabel = serializers.SerializerMethodField()
    notificationChannel = serializers.SerializerMethodField()

    profile = serializers.SerializerMethodField()
    profileId = serializers.SerializerMethodField()




    def get_profile(self, obj):
        if Profile.objects.filter(user=obj.id).exists():

            return obj.profile.get_fullName()
        else:
            try:
                User.profile = property(lambda u: Profile.objects.get_or_create(user=u)[0])

                return obj.profile.get_fullName()

            except:
                return "Profile has not been created."





    def get_profileId(self, obj):
        try:
            return obj.profile.id
        except:
            return "Profile has not been created"

    def get_name(self, obj):
        try:
            return obj.profile.get_fullName()
        except:
            return "User is anonymous"

    def get_image(self,obj):
        try:
            return obj.profile.croppableImage.image
        except:
            return "User is anonymous"

    def get_isCoach(self,obj):
        try:
            return obj.profile.isCoach
        except:
            return "User is anonymous"


    def get_bio(self, obj):
        try:
            return obj.profile.bio
        except:
            return "User is anonymous"

    def get_notificationChannelLabel(self, obj):

        try:

            theChannel = obj.profile.get_notificationChannel()

            return theChannel.label
        except:
            return "User has no notification channel"

    def get_notificationChannel(self, obj):

        try:

            theChannel = obj.profile.get_notificationChannel()

            return theChannel.id
        except:
            return "User has no notification channel"


class MyRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'username': self.validated_data.get('email', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user

class SearchQuerySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SearchQuery
        fields = ('id', 'query')



class StepOccurrenceSerializer(serializers.HyperlinkedModelSerializer):

    #step = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    step = StepSerializer(read_only=True)
    planOccurrence = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    updateOccurrences = serializers.SerializerMethodField(required=False, read_only=True)





    def get_updateOccurrences(self, obj):
        serializer = UpdateOccurrenceSerializer(obj.get_updateOccurrences(), many=True, )
        return serializer.data


    class Meta:
        model = StepOccurrence
        fields=('id', 'date', 'step', 'planOccurrence', 'wasCompleted', 'previouslySaved','posts', 'updateOccurrences',  )





class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ('id','name', 'measuringWhat', 'units','format','metricLabel', 'steps_ids' , 'program', 'default')
    #steps = StepLimitedSerializer(many=True, read_only=True)
    steps_ids = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Step.objects.all(), source='steps')
    program = serializers.PrimaryKeyRelatedField(many=False, required=False, queryset=Program.objects.all())
    default = serializers.BooleanField(required=False)



class VisualizationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Visualization
        #fields = ('id','name', 'kind', 'dependentVariable', 'independentVariable', 'mediatorVariable', 'program', 'plan','user', 'permissions')
        fields = ('id','name', 'kind', 'dependentVariable', 'independentVariable', 'mediatorVariable', 'program', 'plan','user', 'permissions', 'updateOccurrences' )


    program = serializers.PrimaryKeyRelatedField(required=False, many=False, queryset=Program.objects.all())
    plan = serializers.PrimaryKeyRelatedField(required=False, many=False, queryset=PlanOccurrence.objects.all())

    updateOccurrences = serializers.SerializerMethodField(required=False, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    dependentVariable = serializers.PrimaryKeyRelatedField(required=True, many=False, queryset=Update.objects.all())
    independentVariable = serializers.PrimaryKeyRelatedField(required=True, many=False, queryset=Update.objects.all())
    mediatorVariable = serializers.PrimaryKeyRelatedField(required=False, many=False, queryset=Update.objects.all())
    permissions = serializers.SerializerMethodField(required=False, read_only=True)
    #dependentVariableInfo = UpdateSerializer(required=False, read_only=True)
    #independentVariableInfo = UpdateSerializer(required=False, read_only=True)
    #mediatorVariableInfo = UpdateSerializer(required=False, read_only=True)


    def get_permissions(self,obj):
        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if obj.program:
            if self.context['request'].user == obj.program.author :
                return True
            else:
                return False
        elif obj.plan:
            if self.context['request'].user == obj.plan.user :
                return True
            else:
                return False

        else:
            return True

    def get_dependentVariableInfo(self,obj):
        serializer_context = {'request': self.context.get('request')}
        serializer = UpdateSerializer(obj.dependentVariable, many=False, context=serializer_context)
        return serializer.data

    def get_independentVariableInfo(self, obj):
        serializer_context = {'request': self.context.get('request')}
        serializer = UpdateSerializer(obj.independentVariable, many=False, context=serializer_context)
        return serializer.data

    def get_mediatorVariableInfo(self, obj):
        serializer_context = {'request': self.context.get('request')}
        serializer = UpdateSerializer(obj.mediatorVariable, many=False, context=serializer_context)
        return serializer.data




    def get_updateOccurrences(self,obj):
        serializer_context = {'request': self.context.get('request')}

        serializer = UpdateOccurrenceSerializer(obj.get_updateOccurrences(), many=True, context=serializer_context)
        # data = {i['id']: i for i in serializer.data}

        return serializer.data
        return



class UpdateOccurrenceSerializer(serializers.ModelSerializer):

    #update = UpdateSerializer()
    stepOccurrence = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    update = UpdateSerializer(read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    pictures = serializers.JSONField(required=False)


    stepOccurrenceDate = serializers.SerializerMethodField(required=False, read_only=True)
    previouslySaved = serializers.SerializerMethodField(required=False, read_only=True)


    def get_stepOccurrenceDate(self, obj):
        return obj.get_stepOccurrenceDate()

    def get_previouslySaved(self, obj):
        return obj.stepOccurrence.previouslySaved

    class Meta:
        model = UpdateOccurrence
        fields = ('id','update', 'previouslySaved', 'stepOccurrence', 'author', 'integer', 'boolean', 'datetime','duration','stepOccurrenceDate', 'decimal', 'audio', 'video', 'pictures', 'url', 'text', 'longText', 'time' )


class ContactListingField(serializers.RelatedField):
    def to_representation(self, value):
        duration = time.strftime('%M:%S', time.gmtime(value.duration))
        return 'Track %d: %s (%s)' % (value.order, value.name, duration)

class ContactProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ( 'id', 'bio', 'isCoach', 'firstName', 'lastName', 'zipCode', 'image', 'croppableImage', 'notificationChannel', 'user',  )

    bio = serializers.CharField(max_length=2000, required=False)
    notificationChannel = serializers.PrimaryKeyRelatedField(many=False, queryset=KChannel.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())
    image = serializers.SerializerMethodField()

    croppableImageData = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField(required=False, read_only=True)

    def get_image(self, obj):
        try:
            return obj.croppableImage.image
        except:
            return obj.croppableImage.image

    def get_croppableImageData(self, obj):

        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data

    def get_permissions(self,obj):

        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if self.context['request'].user == obj.user:
            return True
        else:
            return False




class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ( 'id', 'bio', 'isCoach', 'utcMidnight', 'permissions','stripeSourceId', 'fullName', 'croppableImage', 'croppableImageData','firstName', 'timezone', 'lastName', 'zipCode', 'image', 'notificationChannel', 'notificationChannelLabel','user', 'expoPushToken',  )


    bio = serializers.CharField(max_length=2000, required=False)
    notificationChannel = serializers.PrimaryKeyRelatedField(many=False, queryset=KChannel.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    notificationChannelLabel = serializers.SerializerMethodField(required=False, read_only=True)
    timezone = TimezoneField()
    utcMidnight = serializers.SerializerMethodField()
    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())
    image = serializers.SerializerMethodField()


    croppableImageData = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField(required=False, read_only=True)
    fullName = serializers.SerializerMethodField(required=False, read_only=True)


    def get_image(self, obj):
        try:
            return obj.croppableImage.image
        except:
            return ""


    def get_croppableImageData(self, obj):

        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data

    def get_timezone(self, obj):
        return six.text_type(obj.timezone)

    def get_permissions(self, obj):

        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if self.context["request"].user == obj.user:
            return True
        else:
            return False
    def get_fullName(self,obj):
        return obj.get_fullName()


    def get_notificationChannelLabel(self, obj):
        try:
            return obj.get_notificationChannelLabel()
        except:
            return ""

    def get_utcMidnight(self,obj):
        try:
            return obj.get_utcMidnight()
        except:
            return ""


class SettingsSetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SettingsSet
        fields = ( 'id', 'defaultNotificationPhone', 'defaultNotificationMethod', 'defaultNotificationEmail', 'defaultNotificationSendTime')



class ProgramRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProgramRequest
        fields = ('id', 'user', 'goal', 'receiver', 'goalInfo')


    user = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    goal = serializers.PrimaryKeyRelatedField(many=False, queryset=Goal.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(required=False, many=False, queryset=User.objects.all())
    goalInfo = serializers.SerializerMethodField(required=False, read_only=True)


    def get_userInfo(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = UserSerializer(obj.user, many=False, context=serializer_context)
        return serializer.data

    def get_goalInfo(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = GoalSerializer(obj.goal, many=False, context=serializer_context)
        return serializer.data

class ContactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contact
        fields = ('id',  'connectionId', 'sender', 'receiver', 'bio', 'wasConfirmed', 'fullName' , 'image', 'notificationChannelLabel' )

    sender = serializers.PrimaryKeyRelatedField(many=False, queryset=Profile.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(many=False, queryset=Profile.objects.all())
    #senderProfile = serializers.SerializerMethodField(required=False, read_only=True)
    #receiverProfile = serializers.SerializerMethodField(required=False, read_only=True)
    bio = serializers.SerializerMethodField(required=False, read_only=True)
    fullName = serializers.SerializerMethodField(required=False, read_only=True)
    image = serializers.SerializerMethodField(required=False, read_only=True)
    notificationChannelLabel = serializers.SerializerMethodField(required=False, read_only=True)
    connectionId = serializers.SerializerMethodField(required=False, read_only=True)
    wasConfirmed = serializers.CharField(max_length=20, )

    def get_senderProfile(self,obj):
        serializer_context = {'request': self.context.get('request')}
        #theProfile = Profile.objects.get(id=obj.sender)

        serializer = ContactProfileSerializer(obj.sender, context=serializer_context )
        #data = {i['id']: i for i in serializer.data}

        return serializer.data

    def get_receiverProfile(self,obj):
        serializer_context = {'request': self.context.get('request')}
        #theProfile = Profile.objects.get(id=obj.receiver)


        serializer = ContactProfileSerializer(obj.receiver, context=serializer_context)
        #data = {i['id']: i for i in serializer.data}

        return serializer.data

    def get_bio(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.bio
        else:
            return obj.sender.bio

    def get_fullName(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.get_fullName()
        else:
            return obj.sender.get_fullName()

    def get_image(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.croppableImage.image
        else:
            return obj.sender.croppableImage.image

    def get_notificationChannelLabel(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.notificationChannel.label
        else:
            return obj.sender.notificationChannel.label

    def get_connectionId(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.id
        else:
            return obj.sender.id


class ContactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contact
        fields = ('id',  'connectionId', 'sender', 'receiver','bio', 'wasConfirmed', 'fullName' , 'image', 'notificationChannelLabel' )

    sender = serializers.PrimaryKeyRelatedField(many=False, queryset=Profile.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(many=False, queryset=Profile.objects.all())
    #senderProfile = serializers.SerializerMethodField(required=False, read_only=True)
    #receiverProfile = serializers.SerializerMethodField(required=False, read_only=True)
    bio = serializers.SerializerMethodField(required=False, read_only=True)
    fullName = serializers.SerializerMethodField(required=False, read_only=True)
    image = serializers.SerializerMethodField(required=False, read_only=True)
    notificationChannelLabel = serializers.SerializerMethodField(required=False, read_only=True)
    connectionId = serializers.SerializerMethodField(required=False, read_only=True)



    wasConfirmed = serializers.CharField(max_length=20, )

    def get_senderProfile(self,obj):
        serializer_context = {'request': self.context.get('request')}
        #theProfile = Profile.objects.get(id=obj.sender)

        serializer = ContactProfileSerializer(obj.sender, context=serializer_context )
        #data = {i['id']: i for i in serializer.data}

        return serializer.data

    def get_receiverProfile(self,obj):
        serializer_context = {'request': self.context.get('request')}
        #theProfile = Profile.objects.get(id=obj.receiver)


        serializer = ContactProfileSerializer(obj.receiver, context=serializer_context)
        #data = {i['id']: i for i in serializer.data}

        return serializer.data

    def get_bio(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.bio
        else:
            return obj.sender.bio

    def get_fullName(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.get_fullName()
        else:
            return obj.sender.get_fullName()

    def get_image(self,obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.croppableImage.image
        else:
            return obj.sender.croppableImage.image

    def get_notificationChannelLabel(self, obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.notificationChannel.label
        else:
            return obj.sender.notificationChannel.label

    def get_connectionId(self, obj):
        if self.context['request'].user.profile == obj.sender:
            return obj.receiver.id
        else:
            return obj.sender.id




class KRMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = KRMessage
        fields = ('id', 'room', 'message', 'handle', 'timestamp')

class PlanProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id','image','title', 'author', 'description',  'viewableBy', 'scheduleLength', 'startDateTime', 'isSubscribed', 'cost', 'costFrequencyMetric', 'userPlanOccurrenceId', 'timeCommitment', )

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000)
    scheduleLength = serializers.CharField()
    timeCommitment = serializers.CharField(max_length=20)
    costFrequencyMetric = serializers.CharField(max_length=20)
    cost = serializers.CharField(max_length=20)
    startDateTime = serializers.DateTimeField()
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())


    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)

    def get_userPlanOccurrenceId(self,obj):
        try:
            return obj.get_userPlanOccurrenceId(self.context['request'].user)
        except:
            return ""


    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False


    def get_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def get_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()

    def get_viewableBy(self, obj):
        return obj.get_viewableBy_display()

    def get_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()


class BlogPostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BlogPost
        fields = ('id', 'title', 'description', 'modified', 'author', 'authorName')

    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    authorName = serializers.SerializerMethodField(required=False, read_only=True)

    def get_authorName(self, obj):
        return obj.author.profile.get_fullName()




class BrowseableProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id', 'title', 'category', 'image', 'isSubscribed', 'scheduleLength', )

    title = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=20)
    image = serializers.CharField(max_length=20)

    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)

    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False

class CurrentUserProfileDefault(serializers.CurrentUserDefault):
    def __call__(self):
        return self.user.profile

class ProgramNoStepsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id','image','title', 'author', 'description',  'viewableBy', 'category','scheduleLength', 'startDateTime', 'authorName','authorPhoto','isSubscribed', 'cost', 'costFrequencyMetric', 'userPlanOccurrenceId', 'timeCommitment',  )

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000)
    scheduleLength = serializers.CharField()
    category = serializers.CharField(max_length=20)

    timeCommitment = serializers.CharField(max_length=20)
    costFrequencyMetric = serializers.CharField(max_length=20)
    cost = serializers.CharField(max_length=20)
    startDateTime = serializers.DateTimeField()
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    authorName = serializers.SerializerMethodField(required=False, read_only=True)
    authorPhoto = serializers.SerializerMethodField(required=False, read_only=True)

    #user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    #steps = serializers.PrimaryKeyRelatedField(many=True, queryset=Step.objects.all())

    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)


    def get_userPlanOccurrenceId(self,obj):
        try:
            return obj.get_userPlanOccurrenceId(self.context['request'].user)
        except:
            return ""


    def get_authorName(self, obj):
        try:
            return Profile.objects.get(user=obj.author).get_fullName()
        except:
            return ""

    def get_authorPhoto(self, obj):
        try:
            return Profile.objects.get(user=obj.author).croppableImage.image
        except:
            return ""

    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False

    def get_category(self, obj):
        return obj.get_category_display()


    def get_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def get_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()

    def get_viewableBy(self, obj):
        return obj.get_viewableBy_display()

    def get_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    '''def create(self, validated_data):
        steps_data = validated_data.pop('program')
        program = Program.objects.create(**validated_data)
        for steps_data in steps_data:
            Step.objects.create(program=program, **steps_data)
        return program'''

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)

        instance.title = validated_data.get('title', instance.title)
        instance.author = validated_data.get('author', instance.author)
        instance.description = validated_data.get('description', instance.description)
        #instance.steps = validated_data.get('steps', instance.steps)
        instance.viewableBy = validated_data.get('viewableBy', instance.viewableBy)
        instance.scheduleLength = validated_data.get('scheduleLength', instance.scheduleLength)

        instance.startDateTime = validated_data.get('startDateTime', instance.startDateTime)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.costFrequencyMetric = validated_data.get('costFrequencyMetric', instance.costFrequencyMetric)
        instance.timeCommitment = validated_data.get('timeCommitment', instance.timeCommitment)
        instance.category = validated_data.get('category', instance.category)



        #instance.goals = validated_data.get('goals', instance.goals)

        instance.save()
        return instance


class ProgramUpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Update
        fields = ('value','label', 'measuringWhat', 'units', 'format', 'metricLabel')

    value = serializers.SerializerMethodField(required=False, read_only=True)
    label = serializers.SerializerMethodField(required=False, read_only=True)

    def get_value(self, obj):
        return obj.id

    def get_label(self, obj):
        return obj.name

class ProgramVisualizationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Visualization
        fields = ('id', 'name', 'kind')



class AllProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id','image', 'title', 'author', 'description',  'viewableBy', 'permissions', 'isActive',  'croppableImage', 'croppableImageData', 'category','scheduleLength', 'startDateTime', 'isSubscribed', 'cost', 'costFrequencyMetric', 'userPlanOccurrenceId', 'timeCommitment',  )

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000)
    scheduleLength = serializers.CharField()
    category = serializers.CharField(max_length=20)

    timeCommitment = serializers.CharField(max_length=20)
    costFrequencyMetric = serializers.CharField(max_length=20)
    cost = serializers.CharField(max_length=20)
    startDateTime = serializers.DateTimeField()
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    #user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)
    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())
    croppableImageData = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField(required=False, read_only=True)
    #visualizations = serializers.SerializerMethodField(required=False, read_only=True)


    def get_visualizations(self, obj):
        serializer_context = {'request': self.context.get('request')}

        serializer = ProgramVisualizationSerializer(obj.get_visualizations(), many=True, context=serializer_context)
        data = {i['id']: i for i in serializer.data}

        return data

    def get_permissions(self, obj):
        # return obj.get_permissions()
        # serializer = self.request.user
        # if serializer == obj.program.author:

        if self.context['request'].user == obj.author:
            return True



    def get_image(self,obj):
        return obj.croppableImage.image

    def get_croppableImageData(self, obj):

        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data





    def get_userPlanOccurrenceId(self,obj):
        try:
            return obj.get_userPlanOccurrenceId(self.context['request'].user)
        except:
            return ""




    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False

    def get_category(self, obj):
        return obj.get_category_display()


    def get_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def get_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()

    def get_viewableBy(self, obj):
        return obj.get_viewableBy_display()

    def get_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    '''def create(self, validated_data):
        steps_data = validated_data.pop('program')
        program = Program.objects.create(**validated_data)
        for steps_data in steps_data:
            Step.objects.create(program=program, **steps_data)
        return program'''

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)

        instance.title = validated_data.get('title', instance.title)
        instance.croppableImage = validated_data.get('croppableImage', instance.croppableImage)

        instance.author = validated_data.get('author', instance.author)
        instance.isActive = validated_data.get('isActive', instance.isActive)
        instance.description = validated_data.get('description', instance.description)
        #instance.steps = validated_data.get('steps', instance.steps)
        instance.viewableBy = validated_data.get('viewableBy', instance.viewableBy)
        instance.scheduleLength = validated_data.get('scheduleLength', instance.startDate)

        instance.startDateTime = validated_data.get('startDateTime', instance.startDateTime)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.costFrequencyMetric = validated_data.get('costFrequencyMetric', instance.costFrequencyMetric)
        instance.timeCommitment = validated_data.get('timeCommitment', instance.timeCommitment)
        instance.category = validated_data.get('category', instance.category)



        #instance.goals = validated_data.get('goals', instance.goals)

        instance.save()
        return instance


class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id','image', 'title', 'author', 'description',  'viewableBy', 'isActive', 'permissions', 'croppableImage', 'croppableImageData', 'updates', 'category','scheduleLength', 'startDateTime', 'isSubscribed', 'cost', 'costFrequencyMetric', 'userPlanOccurrenceId', 'timeCommitment', 'steps', )

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000)
    scheduleLength = serializers.CharField()
    category = serializers.CharField(max_length=20)

    timeCommitment = serializers.CharField(max_length=20)
    costFrequencyMetric = serializers.CharField(max_length=20)
    cost = serializers.CharField(max_length=20)
    startDateTime = serializers.DateTimeField()
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    #user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    #steps = serializers.PrimaryKeyRelatedField(many=True, queryset=Step.objects.all())
    steps = serializers.SerializerMethodField(required=False, read_only=True)

    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)
    updates = serializers.SerializerMethodField(required=False, read_only=True)
    #visualizations = serializers.SerializerMethodField(required=False, read_only=True)
    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())

    croppableImageData = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    permissions = serializers.SerializerMethodField(required=False, read_only=True)

    def get_permissions(self, obj):
        # return obj.get_permissions()
        # serializer = self.request.user
        # if serializer == obj.program.author:
        if self.context['request'].user == obj.author:
            return True
        else:
            return False


    def get_image(self,obj):
        return obj.croppableImage.image

    def get_croppableImageData(self, obj):

        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data


    def get_updates(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = UpdateSerializer(obj.get_updates(), many=True, context=serializer_context)
        #data = {i['id']: i for i in serializer.data}

        return serializer.data

    def get_visualizations(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = VisualizationSerializer(obj.get_visualizations(), many=True, context=serializer_context)
        #data = {i['id']: i for i in serializer.data}

        return serializer.data


    def get_userPlanOccurrenceId(self,obj):
        try:
            return obj.get_userPlanOccurrenceId(self.context['request'].user)
        except:
            return ""

    def get_steps(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = StepSerializer(obj.get_steps(), many=True, context=serializer_context)
        data = {i['id']: i for i in serializer.data}

        return data


    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False

    def get_category(self, obj):
        return obj.get_category_display()


    def get_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def get_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()

    def get_viewableBy(self, obj):
        return obj.get_viewableBy_display()

    def get_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    '''def create(self, validated_data):
        steps_data = validated_data.pop('program')
        program = Program.objects.create(**validated_data)
        for steps_data in steps_data:
            Step.objects.create(program=program, **steps_data)
        return program'''

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)

        instance.title = validated_data.get('title', instance.title)
        instance.croppableImage = validated_data.get('croppableImage', instance.croppableImage)

        instance.author = validated_data.get('author', instance.author)
        instance.isActive = validated_data.get('isActive', instance.isActive)
        instance.description = validated_data.get('description', instance.description)
        #instance.steps = validated_data.get('steps', instance.steps)
        instance.viewableBy = validated_data.get('viewableBy', instance.viewableBy)
        instance.scheduleLength = validated_data.get('scheduleLength', instance.scheduleLength)

        instance.startDateTime = validated_data.get('startDateTime', instance.startDateTime)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.costFrequencyMetric = validated_data.get('costFrequencyMetric', instance.costFrequencyMetric)
        instance.timeCommitment = validated_data.get('timeCommitment', instance.timeCommitment)
        instance.category = validated_data.get('category', instance.category)



        #instance.goals = validated_data.get('goals', instance.goals)

        instance.save()
        return instance

'''
class ClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'domain_url', 'schema_name',  'name', )
'''

class CroppableImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CroppableImage
        fields = ('id', 'originalUncompressedImage', 'image',  'cropperCropboxData',)

    cropperCropboxData = serializers.JSONField()



    def create(self, validated_data):
        print(self)

        croppableImageInstance = CroppableImage.objects.create(**validated_data)
        return croppableImageInstance



class PlanOccurrenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PlanOccurrence
        fields=('id', 'program', 'goal', 'programInfo', 'programTitle', 'startDateTime', 'user', 'isSubscribed', 'notificationEmail', 'notificationPhone', 'notificationMethod', 'notificationSendTime', )

    program = serializers.PrimaryKeyRelatedField(required=True, many=False, queryset=Program.objects.all())
    programInfo = serializers.SerializerMethodField()
    programTitle = serializers.SerializerMethodField()
    goal = serializers.PrimaryKeyRelatedField(many=False, required=False, queryset=Goal.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    isSubscribed = serializers.BooleanField()

    def get_programInfo(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = PlanProgramSerializer(obj.program, many=False, context=serializer_context)
        return serializer.data

    def get_programTitle(self, obj):
        return obj.program.title




class DomainSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Domain
        fields=('id', 'subdomain', 'name', 'desktopLogo', 'mobileLogo', 'color1bg', 'color2bg', 'color3bg', 'color4bg', 'color1txt','color2txt','color3txt','color4txt',)



class ProgramSearchSerializer(HaystackSerializer):
    class Meta:
        index_classes = [ProgramIndex]
        fields = ['id','text','title', 'isActive', 'isSubscribed', 'description', 'author','image', 'author_id', 'timeCommitment', 'scheduleLength', 'costFrequencyMetric', 'cost', 'userPlanOccurrenceId']

    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)

    def get_userPlanOccurrenceId(self, obj):
        try:
            thePlanOccurrence = PlanOccurrence.objects.get(program=obj.id, user=self.context['request'].user, isSubscribed=True)
            return thePlanOccurrence.id
        except:
            return ""


    def get_isSubscribed(self, obj):
        try:
            if PlanOccurrence.objects.filter(program=obj, user=self.context['request'].user, isSubscribed=True).exists():
                return True
            else:
                return False

        except:
            return False




class NotificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'type', 'call')

    call = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)



class GoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Goal
        fields =('id','title', 'deadline', 'description', 'coreValues','metric', 'isThisReasonable', 'goalInAlignmentWithCoreValues','why', 'image', 'permissions', 'croppableImage', 'croppableImageData', 'votes', 'viewableBy',  'user', 'userName', 'userImage','wasAchieved', 'planOccurrences', 'obstacles')

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000, required=False)
    obstacles = serializers.CharField(max_length=2000)

    why = serializers.CharField(max_length=2000)
    metric = serializers.CharField(max_length=200)
    deadline = serializers.DateField()

    planOccurrences = serializers.SerializerMethodField(required=False,read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    userName = serializers.SerializerMethodField(required=False, read_only=True)
    userImage = serializers.SerializerMethodField(required=False, read_only=True)

    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())

    croppableImageData = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField(required=False, read_only=True)

    def get_permissions(self,obj):
        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if self.context['request'].user == obj.user:
            return True

    def get_image(self, obj):
        return obj.croppableImage.image

    def get_userImage(self,obj):
        return obj.user.profile.get_image()

    def get_userName(self,obj):
        return obj.user.profile.get_fullName()

    def get_croppableImageData(self, obj):
        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data

    def get_planOccurrences(self, obj):
        serializer_context = {'request': self.context.get('request') }

        serializer = PlanOccurrenceSerializer(obj.get_planOccurrences(), many=True, context=serializer_context)
        return serializer.data


class PublicGoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Goal
        fields =('id','title',  'image',  'croppableImage', 'croppableImageData', 'votes', 'viewableBy',  'user', 'userName', 'userImage',)

    title = serializers.CharField(max_length=200)


    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    userName = serializers.SerializerMethodField(required=False, read_only=True)
    userImage = serializers.SerializerMethodField(required=False, read_only=True)

    croppableImage = serializers.PrimaryKeyRelatedField(many=False, queryset=CroppableImage.objects.all())

    croppableImageData = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()



    def get_image(self, obj):
        return obj.croppableImage.image

    def get_userImage(self,obj):
        return obj.user.profile.get_image()

    def get_userName(self,obj):
        return obj.user.profile.get_fullName()

    def get_croppableImageData(self, obj):
        serializer_context = {'request': self.context.get('request')}

        serializer = CroppableImageSerializer(obj.croppableImage, many=False, context=serializer_context)
        return serializer.data





class LabelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Label
        fields = ('id', 'text', 'color', 'user', 'type')

    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())



class MessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Message
        fields = ('id','thread', 'text', 'sender' )

    thread = serializers.PrimaryKeyRelatedField(many=False, queryset=MessageThread.objects.all())
    sender = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())



class MessageThreadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MessageThread
        fields = ('id', 'sender', 'latestMessage', 'receiver', 'senderName', 'messages','senderPhoto','receiverName', 'receiverPhoto', 'labels', 'labelsList', 'channel', 'channelLabel')

    receiver = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    sender = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    senderName = serializers.SerializerMethodField()
    senderPhoto = serializers.SerializerMethodField()
    receiverName = serializers.SerializerMethodField()
    receiverPhoto = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    labels = serializers.PrimaryKeyRelatedField(many=True, queryset=Label.objects.all())
    labelsList = serializers.SerializerMethodField(required=False,read_only=True)
    channel = serializers.PrimaryKeyRelatedField(many=False, queryset=KChannel.objects.all())
    channelLabel = serializers.SerializerMethodField(required=False,read_only=True)

    #labels = LabelSerializer()
    #labels_id = serializers.PrimaryKeyRelatedField(many=True, queryset=Label.objects.all(), write_only=True)


    latestMessage = serializers.SerializerMethodField(read_only=True)

    #def create(self, validated_data):
    #    messageThread = MessageThread.objects.create(**validated_data)

#        return messageThread

    def get_channelLabel(self, obj):
        return obj.channel.label


    def get_labelsList(self, obj):
        return obj.get_labels()



    def get_senderName(self, obj):
        return obj.sender.profile.get_fullName()

    def get_senderPhoto(self, obj):
        return obj.sender.profile.get_image()

    def get_receiverName(self, obj):
        return obj.receiver.profile.get_fullName()

    def get_receiverPhoto(self, obj):
        return obj.receiver.profile.get_image()

    def get_messages(self,obj):
        serializer = MessageSerializer(obj.get_messages(), many=True)
        return serializer.data




    def get_latestMessage(self, obj):
        return obj.get_latest_message()

class ContactGroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ContactGroup
        fields = ('id', 'name', 'contacts', 'profile', 'contacts_ids', 'isDefault' )

    profile = serializers.PrimaryKeyRelatedField(read_only=True, default=CurrentUserProfileDefault())
    contacts = ContactSerializer(many=True, read_only=True)
    contacts_ids = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Contact.objects.all(), source='contacts')







class ParticipantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Participant
        fields = ('id', 'user', 'role', 'joiningTime', 'leavingTime')

    user = UserSerializer()

class RateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rate
        fields = ('id', 'inPersonRate', 'inPersonRateUnit', 'realtimeRate', 'realtimeRateUnit', 'feedbackRate', 'feedbackTurnaroundTime', 'turnaroundUnit', 'answerRate', 'activePlanManagementRate', 'activePlanManagementRateUnit')



class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session
        fields = ('id','startTime', 'endTime', 'duration', 'type', 'tokBoxSessionId', 'tokBoxToken', )

    #coach = makeSerializer('Coach',  source='get_coach', many=False, read_only=True)
    #students = makeSerializer('Student', source='get_students', many=False, read_only=True)



class RateSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model= Rate
        fields = ('id','inPersonRate', 'inPersonRateUnit', 'realtimeRate', 'realtimeRateUnit', 'feedbackRate', 'feedbackTurnaroundTime', 'turnaroundUnit', 'answerRate', 'activePlanManagementRate', 'activePlanManagementRateUnit')



