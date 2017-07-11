from django.contrib import admin
from kiterope.models import Profile, User, Goal, Notification, Rate, Session, Review, Update, Post, Program, Step, Question, Answer, Interest, Participant
from kiterope.models import StepOccurrence, PlanOccurrence, MessageThread, UpdateOccurrence, Metric, Message, Label, KChannel, KChannelUser, KRMessage, Contact

admin.site.register(Goal)
admin.site.register(Rate)
admin.site.register(Session)
admin.site.register(Review)
admin.site.register(Update)
admin.site.register(Post)
admin.site.register(Step)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(Interest)
admin.site.register(StepOccurrence)
admin.site.register(PlanOccurrence)
admin.site.register(UpdateOccurrence)
admin.site.register(Metric)
admin.site.register(Participant)
admin.site.register(Notification)
admin.site.register(Message)
admin.site.register(Label)
admin.site.register(MessageThread)


class KChannelUserInline(admin.TabularInline):
    model = KChannelUser
    extra = 1


class KChannelAdmin(admin.ModelAdmin):
    inlines = (KChannelUserInline,)




admin.site.register(Profile)
admin.site.register(KChannel, KChannelAdmin)
admin.site.register(KChannelUser)

admin.site.register(KRMessage)
admin.site.register(Contact)
admin.site.register(Program)








