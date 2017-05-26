from channels_api.bindings import ResourceBinding

from .models import Room, KRMessage
from .serializers import RoomSerializer, KRMessageSerializer

class RoomBinding(ResourceBinding):

    model = Room
    stream = "rooms"
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class KRMessageBinding(ResourceBinding):
    model = KRMessage
    stream = "krmessages"
    serializer_class = KRMessageSerializer
    queryset = KRMessage.objects.all()