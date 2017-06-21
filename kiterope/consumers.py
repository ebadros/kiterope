# In consumers.py
from channels import Channel, Group
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
from .models import KRMessage, KChannel, KChannelUser
from django.contrib.auth.models import User
from .auth_token import rest_token_user



from pprint import pprint


def msg_consumer(message):
    #print("msg_consumer")
    #pprint(vars(message))

    # Save to model
    theRoomLabel = message.content['room']
    theChannelInstance = KChannel.objects.get(label=theRoomLabel)
    KRMessage.objects.create(
        channel=theChannelInstance,
        message=message.content['message'],
        #sender_id=message.content['sender']
    )
    # Broadcast to listening sockets
    Group("chat-%s" % theRoomLabel).send({
        "text": message.content['message'],
    })

def notification_consumer(message):

    #print("notificationReceived")
    #pprint(vars(message))

    http_user = True

    # Save to model
    theRoomLabel = message.content['room']
    #pprint(vars(message))
    theChannelInstance = KChannel.objects.get(label=theRoomLabel)
    KRMessage.objects.create(
        channel=theChannelInstance,
        message=message.content['message'],
    )
    # Broadcast to listening sockets
    #print("broadcasting to chat-%s" % theRoomLabel)
    Group("chat-%s" % theRoomLabel).send({
        "text": message.content['message'],
    })

# Connected to websocket.connect
@channel_session
@rest_token_user
def ws_connect(message):



    # Work out room name from path (ignore slashes)
    thePath = message.content['path']
    roomLabel = thePath.split("/")[2]

    try:
        #
        theKChannel = KChannel.objects.get(label=roomLabel)
        #print("theKChannel %s" % theKChannel.permission)
        if theKChannel.permission == "ONLYRECEIVER_ANYSENDER":
            print("message User id is %s" % message.user.id)

            message.content['room'] = roomLabel
            message.channel_session['user'] = message.user.id
            #print("*******************************")


            Group("chat-%s" % roomLabel).add(message.reply_channel)
            #pprint(vars(message))

            # Accept the connection request
            message.reply_channel.send({"accept": True})
            accept_connection(message,"chat-%s" % roomLabel)

        #elif User.objects.filter(pk=message.user.id, channel__label=roomLabel).exists():

        elif KChannelUser.objects.filter(user=message.user.id, channel=theKChannel).exists():

            message.content['room'] = roomLabel
            message.content['user'] = message.user.id
            #pprint(vars(message))

            Group("chat-%s" % roomLabel).add(message.reply_channel)
            # Accept the connection request
            message.reply_channel.send({"accept": True})

        else:

            message.reply_channel.send({"accept": False})



    except:
        message.reply_channel.send({"accept": False})


def get_group(message):
    return message.content['path'].strip('/').replace('ws/', '', 1)


def get_group_category(group):
    partition = group.rpartition('_')

    if partition[0]:
        return partition[0]
    else:
        return group


# here in connect_app we access the user on message
#  that has been set by @rest_token_user

def connect_app(message, group):
    if message.user.has_permission(pk=get_id(group)):
        accept_connection(message, group)


# Connected to websocket.receive
@channel_session
def ws_message(message):
    #print("ws_message")
    #pprint(vars(message))


    thePath = message['path']
    theChannel = thePath.split("/")[1]
    theRoom = thePath.split("/")[2]




    # Stick the message onto the processing queue
    theMessageText = message['text']

    Channel(theChannel).send({
        "room": theRoom,
        "message": message['text'],
    })

# Connected to websocket.disconnect
def ws_disconnect(message):
    #print("ws_disconnect")

    thePath = message['path']
    theChannel = thePath.split("/")[1]
    theRoom = thePath.split("/")[2]

    Group("chat-%s" % theRoom).discard(message.reply_channel)