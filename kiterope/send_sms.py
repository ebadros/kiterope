# /usr/bin/env python
# Download the twilio-python library from http://twilio.com/docs/libraries
from twilio.rest import Client
from django.conf import settings


# Find these values at https://twilio.com/user/account

account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', '')
auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', '')
twilio_phone_number = getattr(settings, 'TWILIO_PHONE_NUMBER', '')

client = Client(account_sid, auth_token)


def sendMessage(toPhoneNumber, theBody):
    message = client.api.account.messages.create(to=toPhoneNumber, messaging_service_sid="MG4e498e6f5301ba8e60ff05c05de5b288", body=theBody)