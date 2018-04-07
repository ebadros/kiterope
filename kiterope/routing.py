from channels.routing import route, route_class
from .consumers import ws_connect, ws_message, ws_disconnect, msg_consumer, notification_consumer

channel_routing = [
    route("websocket.connect", ws_connect),
    route("websocket.receive", ws_message),
    route("websocket.disconnect", ws_disconnect),
    route("chat-messages", msg_consumer),
    route("notifications", notification_consumer)
]





