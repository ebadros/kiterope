import functools
from json import loads, dumps


from channels.handler import AsgiRequest
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.settings import api_settings
from pprint import pprint



authenticators = [auth() for auth in api_settings.DEFAULT_AUTHENTICATION_CLASSES]

def _close_reply_channel(message):
    message.reply_channel.send({'close': True})

def jwt_request_parameter(func):
    """
    Checks the presence of a "token" request parameter and tries to
    authenticate the user based on its content.
    """
    @functools.wraps(func)
    def inner(message, *args, **kwargs):
        # Taken from channels.session.http_session
        try:
            if "method" not in message.content:
                message.content['method'] = "FAKE"
            request = AsgiRequest(message)
        except Exception as e:
            raise ValueError("Cannot parse HTTP message - are you sure this is a HTTP consumer? %s" % e)

        auth_token = request.GET.get("token", None)
        if auth_token is None:
            _close_reply_channel(message)
            raise ValueError("Missing token request parameter. Closing channel.")

        if auth_token:
            # comptatibility with rest framework
            request._request = {}
            #request.META["HTTP_AUTHORIZATION"] = "token {}".format(token)
            for authenticator in authenticators:
                try:
                    user_auth_tuple = authenticator.authenticate(request)
                except AuthenticationFailed:
                    pass

                if user_auth_tuple is not None:
                    message._authenticator = authenticator
                    user, auth = user_auth_tuple
                    break
        message.user, message.auth = user, auth

        message.token = auth_token

        return func(message, *args, **kwargs)
    return inner

def jwt_message_text_field(func):
    """
    Checks the presence of a "token" field on the message's text field and
    tries to authenticate the user based on its content.
    """
    @functools.wraps(func)
    def inner(message, *args, **kwargs):
        pprint(vars(message))

        message_text = message.get('text', None)
        if message_text is None:
            _close_reply_channel(message)
            raise ValueError("Missing text field. Closing channel.")

        try:
            message_text_json = loads(message_text)
        except ValueError:
            _close_reply_channel(message)
            raise

        token = message_text_json.pop('token', None)
        if token is None:
            _close_reply_channel(message)
            raise ValueError("Missing token field. Closing channel.")

        if token:

            for authenticator in authenticators:
                try:
                    user_auth_tuple = authenticator.authenticate(request)
                except AuthenticationFailed:
                    pass

                if user_auth_tuple is not None:
                    message._authenticator = authenticator
                    user, auth = user_auth_tuple
                    break
        message.user, message.auth = user, auth

        message.token = token
        message.text = dumps(message_text_json)

        return func(message, *args, **kwargs)
    return inner
