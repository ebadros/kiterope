from django.contrib import admin
from django import forms
from tinymce.widgets import TinyMCE

from kiterope.models import Profile, User,  Goal, Notification, Domain, Visualization, ContactGroup, SettingsSet, Rate, Session, Review, Update, Post, Program, Step, Question, Answer, Interest, Participant
from kiterope.models import StepOccurrence, ProgramRequest, CroppableImage, PlanOccurrence, BlogPost, MessageThread, UpdateOccurrence, Metric, Message, Label, KChannel, KChannelUser, KRMessage, Contact





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
admin.site.register(Metric)
admin.site.register(Participant)
admin.site.register(ProgramRequest)
admin.site.register(Domain)

admin.site.register(Notification)
admin.site.register(Message)
admin.site.register(ContactGroup)

admin.site.register(Label)
admin.site.register(Visualization)

admin.site.register(MessageThread)
admin.site.register(SettingsSet)

admin.site.register(CroppableImage)

class UpdateOccurrenceAdmin(admin.ModelAdmin):
    list_display = ('update', 'stepOccurrence','author','pictures_unpacked', 'time', 'integer', 'decimal', 'audio', 'video', 'url', 'text', 'longText', 'boolean', 'datetime')



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






admin.site.register(BlogPost)

admin.site.register(UpdateOccurrence)

