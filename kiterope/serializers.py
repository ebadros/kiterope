from django.contrib.auth.models import User
from kiterope.models import Goal, SearchQuery, Plan, Step, Coach, Profile, Update, Participant, Notification, Session, Student, Review, Answer, Question, Rate, Interest, StepOccurrence, PlanOccurrence, Metric, UpdateOccurrence
from rest_framework import serializers

from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet

from kiterope.search_indexes import PlanIndex



def makeSerializer(serializerName, source, many,read_only):
    return {
        'User': lambda: UserSerializer(source, many, read_only),
        'Step': lambda: StepSerializer(source, many, read_only),
        'Goal': lambda: GoalSerializer(source, many, read_only),
        'Plan': lambda: PlanSerializer(source, many, read_only),
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

    }[serializerName]

class InterestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model= Interest
        fields = ('id', 'name', 'email', 'goal')

class StepSerializer2(serializers.HyperlinkedModelSerializer):
    plan = serializers.PrimaryKeyRelatedField(many=False, queryset=Plan.objects.all())
    absoluteStartDate = serializers.DateField()
    absoluteEndDate = serializers.DateField()
    useAbsoluteTime = serializers.BooleanField()

    class Meta:
        model = Step
        fields = ('id', 'plan', 'title', 'description', 'frequency', 'day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07', 'monthlyDates','startTime', 'startDate', 'endDate','absoluteStartDate', 'absoluteEndDate','useAbsoluteTime','duration', 'durationMetric')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id','url', 'username', 'email', 'groups')




class SearchQuerySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SearchQuery
        fields = ('id', 'query')



class StepOccurrenceSerializer(serializers.HyperlinkedModelSerializer):

    #step = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    step = StepSerializer2()
    planOccurrence = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = StepOccurrence
        fields=( 'id','date', 'step','planOccurrence', 'wasCompleted', 'posts', )

class PlanOccurrenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PlanOccurrence
        fields=('id','plan', 'goal', 'startDate')

    plan = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    goal = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

class UpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Update
        fields = ('id','measuringWhat', 'units','format','metricLabel', 'step' )

    step = serializers.PrimaryKeyRelatedField(many=False, queryset=Step.objects.all())

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ( 'id', 'bio', 'isCoach', 'firstName', 'lastName', 'zipCode', 'profilePhoto')

class UpdateOccurrenceSerializer(serializers.HyperlinkedModelSerializer):

    #update = UpdateSerializer()
    stepOccurrence = StepOccurrenceSerializer()
    update = UpdateSerializer()


    class Meta:
        model = UpdateOccurrence
        field = ('id','update', 'stepOccurrence', 'author', 'integer', 'decimal', 'audio', 'video', 'picture', 'url', 'text','longText', 'time' )


class PlanSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Plan
        fields = ('id','image','title', 'author', 'description', 'viewableBy', 'scheduleLength', 'startDate', 'cost', 'costFrequencyMetric','timeCommitment', 'steps' )

    timeCommitment = serializers.SerializerMethodField()
    scheduleLength = serializers.SerializerMethodField()
    viewableBy = serializers.SerializerMethodField()
    costFrequencyMetric = serializers.SerializerMethodField()


    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    steps = serializers.PrimaryKeyRelatedField(many=True, queryset=Step.objects.all())

    def get_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def get_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()

    def get_viewableBy(self, obj):
        return obj.get_viewableBy_display()

    def get_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    def create(self, validated_data):
        steps_data = validated_data.pop('plans')
        plan = Plan.objects.create(**validated_data)
        for steps_data in steps_data:
            Step.objects.create(plan=plan, **steps_data)
        return plan

    def update(self, instance, validated_data):
        print ("inside planSerializer update")
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

class PlanSearchSerializer(HaystackSerializer):
    class Meta:
        index_classes = [PlanIndex]
        fields = ['id','text','title', 'description', 'author','image', 'author_id', 'timeCommitment', 'scheduleLength', 'costFrequencyMetric', 'cost']


class StepSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Step
        fields =('id', 'plan', 'title', 'description', 'frequency', 'day01', 'day02', 'day03', 'day04', 'day05', 'day06', 'day07', 'monthlyDates','startTime', 'startDate', 'endDate','duration', )

    plan = serializers.PrimaryKeyRelatedField(many=False, queryset=Plan.objects.all())
    #plan = PlanSerializer()

class NotificationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'type', 'call')

    call = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)



class GoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Goal
        fields =('id','title', 'deadline', 'description', 'why', 'image', 'votes', 'viewableBy',  'user', 'coaches', 'updates', 'wasAchieved', 'plans')

    plans = serializers.PrimaryKeyRelatedField(many=True, queryset=Plan.objects.all())
    coaches = serializers.PrimaryKeyRelatedField(many=True, queryset=Coach.objects.all())
    updates = serializers.PrimaryKeyRelatedField(many=True,  queryset=Update.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    #coaches = makeSerializer('Coach', source='get_coaches', many=True, read_only=True)
    #updates = makeSerializer('Update', source='get_updates', many=True, read_only=True)




class CoachSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Coach
        fields = ('sessions', 'students', 'reviews', 'answers', 'rating', )

    #sessions = makeSerializer('Session', source='get_sessions', many=True, read_only=True)
    #students = makeSerializer('Student', source='get_students', many=True, read_only=True)
    #reviews = makeSerializer('Review', source='get_reviews', many=True, read_only=True)
    #answers = makeSerializer('Answer', source='get_answers', many=True, read_only=True)
    sessions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    students = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    reviews = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    answers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)





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








class StudentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = ('id','goals', 'coaches', 'sessions', 'reviews', 'questions', 'settings', 'plans', 'user')

    #goals = makeSerializer('Goal',  source='get_goals', many=True, read_only=True)
    #coaches = makeSerializer('Coach',  source='get_coaches', many=True, read_only=True)
    #sessions = makeSerializer('Session',  source='get_sessions', many=True, read_only=True)
    #questions = makeSerializer('Question',  source='get_questions', many=True, read_only=True)
    #plans = makeSerializer('Plan',  source='get_plans', many=True, read_only=True)
    #user = makeSerializer('User', source='get_user', many=False, read_only=True)

    goals = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    coaches = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    sessions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    questions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    plans = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(many=False, read_only=True)





class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ('id','rating', 'description', 'title', 'author', 'isStudentReviewed', 'reviewedUser')

    #author = makeSerializer('User', source='get_author', many=False, read_only=True)
    #reviewedUser = makeSerializer('User', source='get_reviewedUser', many=False, read_only=True)
    author = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    reviewedUser = serializers.PrimaryKeyRelatedField(many=False, read_only=True)





class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('id','text', 'author', 'needAnswerBy', 'answers', 'media', 'price')

    #author = makeSerializer('User', source='get_author', many=False, read_only=True)
    #answers = makeSerializer('Answer', source='get_answers', many=True, read_only=True)
    author = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    answers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)





class AnswerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Answer
        fields = ('id','question', 'author', 'text', 'media', 'votes')

    #author = makeSerializer('User', source='get_author', many=False, read_only=True)
    #question = makeSerializer('Question', source='get_question', many=False, read_only=True)
    author = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    question = serializers.PrimaryKeyRelatedField(many=False, read_only=True)





class RateSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model= Rate
        fields = ('id','inPersonRate', 'inPersonRateUnit', 'realtimeRate', 'realtimeRateUnit', 'feedbackRate', 'feedbackTurnaroundTime', 'turnaroundUnit', 'answerRate', 'activePlanManagementRate', 'activePlanManagementRateUnit')

