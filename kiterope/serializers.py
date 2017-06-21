from django.contrib.auth.models import User
from kiterope.models import Goal, SearchQuery, Label, Contact, Message, KRMessage, MessageThread, KChannel, Program, Step, Profile, Update, Participant, Notification, Session, Review, Answer, Question, Rate, Interest, StepOccurrence, PlanOccurrence, Metric, UpdateOccurrence
from rest_framework import serializers

from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet

from kiterope.search_indexes import ProgramIndex
from kiterope.validators import RequiredValidator
import json
import datetime


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

class InterestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model= Interest
        fields = ('id', 'name', 'email', 'goal')

class StepSerializer(serializers.HyperlinkedModelSerializer):
    program = serializers.PrimaryKeyRelatedField(many=False, queryset=Program.objects.all())
    absoluteStartDate = serializers.DateField()
    absoluteEndDate = serializers.DateField()
    useAbsoluteTime = serializers.BooleanField(required=False)
    programStartDate = serializers.SerializerMethodField(required=False, read_only=True)
    isAllDay = serializers.SerializerMethodField(required=False, read_only=True)
    absoluteStartDateForCalendar = serializers.SerializerMethodField(required=False, read_only=True)
    absoluteEndDateForCalendar = serializers.SerializerMethodField(required=False, read_only=True)
    permissions = serializers.SerializerMethodField(required=False, read_only=True)
    updates = serializers.SerializerMethodField(required=False, read_only=True)

    def get_absoluteStartDateForCalendar(self,obj):
        #date_1 = datetime.datetime.strptime(obj.absoluteStartDate, "%y-%m-%d")
        new_date = obj.absoluteStartDate + datetime.timedelta(days=1)
        return new_date

    def get_absoluteEndDateForCalendar(self,obj):
        #date_1 = datetime.datetime.strptime(obj.absoluteEndDate, "%y-%m-%d")
        new_date = obj.absoluteEndDate + datetime.timedelta(days=1)
        return new_date

    def get_isAllDay(self,obj):
        return True

    def get_programStartDate(self, obj):
        return obj.get_programStartDate()

    def get_updates(self,obj):
        serializer = UpdateSerializer(obj.get_updates(), many=True)
        return serializer.data



    def get_senderName(self, obj):
        return obj.sender.profile.get_fullName()

    def get_permissions(self,obj):
        #return obj.get_permissions()
        #serializer = self.request.user
        #if serializer == obj.program.author:
        if self.context['request'].user == obj.program.author:
            return True

    class Meta:
        model = Step
        fields = ('id', 'program', 'image', 'updates','absoluteStartDate', 'absoluteEndDate', 'permissions','absoluteStartDateForCalendar', 'absoluteEndDateForCalendar','startDate', 'endDate', 'programStartDate', 'title', 'description', 'isAllDay', 'frequency', 'day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07', 'monthlyDates','startTime','useAbsoluteTime','duration',)

class KChannelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = KChannel
        fields = ('id', 'label', 'users', 'permission' )

    users = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'url', 'first_name', 'last_name', 'username', 'email', 'groups', 'name', 'profilePhoto', 'isCoach', 'bio', 'notificationChannelLabel', 'notificationChannel','profile', 'profileId')

    name = serializers.SerializerMethodField()
    profilePhoto = serializers.SerializerMethodField()
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

    def get_profilePhoto(self,obj):
        try:
            return obj.profile.profilePhoto
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
        fields=( 'id','date', 'step','planOccurrence', 'wasCompleted', 'posts', 'updateOccurrences' )





class UpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Update
        fields = ('id','measuringWhat', 'units','format','metricLabel', 'step' )

    step = serializers.PrimaryKeyRelatedField(required=False, many=False, queryset=Step.objects.all())

class UpdateOccurrenceSerializer(serializers.ModelSerializer):

    #update = UpdateSerializer()
    stepOccurrence = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    update = UpdateSerializer(read_only=True)
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())


    class Meta:
        model = UpdateOccurrence
        field = ('id','update', 'stepOccurrence', 'author', 'integer', 'decimal', 'audio', 'video', 'picture', 'url', 'text', 'longText', 'time' )


class ContactListingField(serializers.RelatedField):
    def to_representation(self, value):
        duration = time.strftime('%M:%S', time.gmtime(value.duration))
        return 'Track %d: %s (%s)' % (value.order, value.name, duration)

class ContactProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ( 'id', 'bio', 'isCoach', 'firstName', 'lastName', 'zipCode', 'profilePhoto', 'notificationChannel', 'user',  )

    bio = serializers.CharField(max_length=2000, required=False)
    notificationChannel = serializers.PrimaryKeyRelatedField(many=False, queryset=KChannel.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)



class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ( 'id', 'bio', 'isCoach', 'firstName', 'lastName', 'zipCode', 'profilePhoto', 'notificationChannel', 'notificationChannelLabel','user',  )


    bio = serializers.CharField(max_length=2000, required=False)
    notificationChannel = serializers.PrimaryKeyRelatedField(many=False, queryset=KChannel.objects.all())
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    notificationChannelLabel = serializers.SerializerMethodField(required=False, read_only=True)

    def get_notificationChannelLabel(self, obj):
        try:
            return obj.get_notificationChannelLabel()
        except:
            return ""



class ContactSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Contact
        fields = ('id', 'sender', 'receiver', 'wasConfirmed', 'relationship',  )

    sender = ProfileSerializer()
    receiver = ProfileSerializer()
    wasConfirmed = serializers.CharField(max_length=20, )
    relationship = serializers.CharField(max_length=20, )




class KRMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = KRMessage
        fields = ('id', 'room', 'message', 'handle', 'timestamp')




class ProgramSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Program
        fields = ('id','image','title', 'author', 'description',  'viewableBy', 'scheduleLength', 'startDate', 'isSubscribed', 'cost', 'costFrequencyMetric', 'userPlanOccurrenceId', 'timeCommitment', 'steps', )

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000)
    scheduleLength = serializers.CharField()
    timeCommitment = serializers.CharField(max_length=20)
    costFrequencyMetric = serializers.CharField(max_length=20)
    cost = serializers.CharField(max_length=20)
    startDate = serializers.DateField()
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects.all())
    #user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    #steps = serializers.PrimaryKeyRelatedField(many=True, queryset=Step.objects.all())
    steps = serializers.SerializerMethodField(required=False, read_only=True)

    isSubscribed = serializers.SerializerMethodField(required=False, read_only=True)
    userPlanOccurrenceId = serializers.SerializerMethodField(required=False, read_only=True)


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
            thePlanOccurrence = PlanOccurrence.objects.get(program=self, user=self.context['request'].user, isSubscribed=True)
            return thePlanOccurrence.isSubscribed
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
        instance.scheduleLength = validated_data.get('scheduleLength', instance.startDate)

        instance.startDate = validated_data.get('startDate', instance.startDate)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.costFrequencyMetric = validated_data.get('costFrequencyMetric', instance.costFrequencyMetric)
        instance.timeCommitment = validated_data.get('timeCommitment', instance.timeCommitment)


        #instance.goals = validated_data.get('goals', instance.goals)

        instance.save()
        return instance

class PlanOccurrenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PlanOccurrence
        fields=('id', 'program', 'goal', 'startDate', 'user', 'isSubscribed', 'notificationEmail', 'notificationPhone', 'notificationMethod', 'notificationSendTime', )

    #program = serializers.PrimaryKeyRelatedField(many=False, queryset=Program.objects.all())
    program = serializers.PrimaryKeyRelatedField(many=False, queryset=Program.objects.all())

    goal = serializers.PrimaryKeyRelatedField(many=False, queryset=Goal.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    isSubscribed = serializers.BooleanField()











class ProgramSearchSerializer(HaystackSerializer):
    class Meta:
        index_classes = [ProgramIndex]
        fields = ['id','text','title', 'isSubscribed', 'description', 'author','image', 'author_id', 'timeCommitment', 'scheduleLength', 'costFrequencyMetric', 'cost', 'userPlanOccurrenceId']

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
            thePlanOccurrence = PlanOccurrence.objects.get(program=obj.id, user=self.context['request'].user, isSubscribed=True)
            return thePlanOccurrence.isSubscribed
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
        fields =('id','title', 'deadline', 'description', 'metric', 'why', 'image', 'votes', 'viewableBy',  'user', 'wasAchieved', 'planOccurrences')

    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=2000, required=False)
    why = serializers.CharField(max_length=2000)
    metric = serializers.CharField(max_length=200)
    deadline = serializers.DateField()

    planOccurrences = serializers.SerializerMethodField(required=False,read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    def get_planOccurrences(self, obj):
        serializer = PlanOccurrenceSerializer(obj.get_planOccurrences(), many=True)
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
        return obj.sender.profile.get_profilePhoto()

    def get_receiverName(self, obj):
        return obj.receiver.profile.get_fullName()

    def get_receiverPhoto(self, obj):
        return obj.receiver.profile.get_profilePhoto()

    def get_messages(self,obj):
        serializer = MessageSerializer(obj.get_messages(), many=True)
        return serializer.data




    def get_latestMessage(self, obj):
        return obj.get_latest_message()







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


