import datetime
from haystack import indexes
from kiterope.models import Program

class ProgramIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    id = indexes.CharField(model_attr="id")
    title = indexes.CharField(model_attr="title")
    description = indexes.CharField(model_attr="description")
    scheduleLength = indexes.CharField(model_attr="scheduleLength", faceted=True)
    cost = indexes.CharField(model_attr="cost")
    timeCommitment = indexes.CharField(model_attr="timeCommitment", faceted=True)
    image = indexes.CharField(model_attr="image")
    costFrequencyMetric = indexes.CharField(model_attr="costFrequencyMetric", faceted=True)
    author = indexes.CharField(model_attr='author')
    author_id = indexes.CharField(model_attr='author')

    def prepare_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def prepare_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()


    def prepare_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    def prepare_author_id(self,obj):
        return obj.get_author_id()

    def get_model(self):
        return Program

    def index_queryset(self, using=None):
        """Used when the entire index for model is updated."""

        #return self.get_model().objects.filter(pub_date__lte=datetime.datetime.now())

        return self.get_model().objects.all()

