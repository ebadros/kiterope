from django.contrib.auth.models import User
from kiterope.models import Goal, Plan, Step, Coach, Update, Session, Student, Review, Answer, Question, Rate
from rest_framework import serializers


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

    }[serializerName]

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id','url', 'username', 'email', 'groups')


class StepSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Step
        fields =('id','plan', 'description', 'substeps', 'frequency', 'onSunday', 'onMonday', 'onTuesday', 'onWednesday', 'onThursday', 'onFriday', 'onSaturday', 'startTime', 'endTime', 'duration', 'wasCompleted')

    #plan = makeSerializer('Plan', source='get_plan', many=False, read_only=True)
    plan = serializers.PrimaryKeyRelatedField(many=False, read_only=True)


class PlanSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Plan
        fields = ('id','title', 'author', 'description', 'steps', 'viewableBy', 'startDate', 'endDate', 'goals')

    #author = serializers.HyperlinkedRelatedField(many=False, queryset=User.objects.all(), view_name='author_detail')
    #steps = serializers.HyperlinkedRelatedField(many=True, queryset=Step.objects.all(), view_name='step_detail')
    #goals = serializers.HyperlinkedRelatedField(many=True, queryset=Goal.objects.all(), view_name='goal_detail')

    author = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    steps = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    goals = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    #author = UserSerializer(many=False, read_only=True)
    #steps = makeSerializer('Step', source='get_steps', many=True, read_only=True)
    #goals = makeSerializer('Goal', source='get_goals', many=True, read_only=True)
    #steps = StepSerializer(many=False, read_only=True)
    #goals = serializers.HyperlinkedRelatedField(many=True, read_only=True, view_name='goal-detail')



    def create(self, validated_data):
        steps_data = validated_data.pop('plans')
        plan = Plan.objects.create(**validated_data)
        for steps_data in steps_data:
            Step.objects.create(plan=plan, **steps_data)
        return plan

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.author = validated_data.get('author', instance.author)
        instance.description = validated_data.get('description', instance.description)
        instance.steps = validated_data.get('steps', instance.steps)
        instance.viewableBy = validated_data.get('viewableBy', instance.viewableBy)
        instance.startDate = validated_data.get('startDate', instance.startDate)
        instance.endDate = validated_data.get('endDate', instance.endDate)
        instance.goals = validated_data.get('goals', instance.goals)

        instance.save()
        return instance




class GoalSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Goal
        fields =('id','title', 'deadline', 'description', 'why', 'image', 'votes', 'viewableBy', 'priority', 'user', 'coaches', 'updates', 'wasAchieved', 'hasMetric', 'plans')

    plans = serializers.PrimaryKeyRelatedField( many=True, queryset=Plan.objects.all())
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



class UpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Update
        fields = ('id','goal', 'measurement', 'hasMetric', 'step', 'author', 'description',)

    goal = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    step = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    author = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    #goal = makeSerializer('Goal',  source='get_goal', many=False, read_only=True)
    #step = makeSerializer('Step', source='get_step', many=True, read_only=True)
    #author = makeSerializer('User', source='get_author', many=True, read_only=True)
    #answers = makeSerializer('Answer', source='get_answers', many=True, read_only=True)





class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session
        fields = ('id','startTime', 'endTime', 'duration', 'coach', 'students', 'mode', 'media', 'isGroup')

    #coach = makeSerializer('Coach',  source='get_coach', many=False, read_only=True)
    #students = makeSerializer('Student', source='get_students', many=False, read_only=True)
    coach = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    students = serializers.PrimaryKeyRelatedField(many=True, read_only=True)




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

