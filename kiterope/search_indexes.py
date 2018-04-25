import datetime
from haystack import indexes
from kiterope.models import Program
from django.db.models import Q



class ProgramIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)
    id = indexes.CharField(model_attr="id")
    title = indexes.CharField(model_attr="title")
    description = indexes.CharField(model_attr="description")
    viewableBy = indexes.CharField(model_attr="viewableBy")
    scheduleLength = indexes.CharField(model_attr="scheduleLength", faceted=True)
    cost = indexes.CharField(model_attr="cost")
    timeCommitment = indexes.CharField(model_attr="timeCommitment", faceted=True)
    image = indexes.CharField(model_attr="image")
    costFrequencyMetric = indexes.CharField(model_attr="costFrequencyMetric", faceted=True)
    author = indexes.CharField(model_attr='author')
    author_id = indexes.CharField(model_attr='author')
    author_fullName = indexes.CharField(model_attr='author')
    author_image = indexes.CharField(model_attr='author')
    isActive = indexes.BooleanField(model_attr='isActive')


    category = indexes.CharField(model_attr="category")

    def prepare_timeCommitment(self, obj):
        return obj.get_timeCommitment_display()

    def prepare_scheduleLength(self, obj):
        return obj.get_scheduleLength_display()


    def prepare_costFrequencyMetric(self, obj):
        return obj.get_costFrequencyMetric_display()

    def prepare_author_id(self,obj):
        return obj.get_author_id()

    def prepare_author_fullName(self,obj):
        return obj.get_author_fullName()

    def prepare_author_image(self,obj):
        return obj.get_author_image()



    def get_model(self):
        return Program

    def should_update(self, instance, **kwargs):
        print("should update")
        if instance.isActive:
            return True
        else:
            self.remove_object(instance, **kwargs)
            return False

    def index_queryset(self, using=None):
        print("indexing queryset")

        """Used when the entire index for model is updated."""

        #return self.get_model().objects.filter(pub_date__lte=datetime.datetime.now())
        viewableByAnyoneFilter = Q(viewableBy='ANYONE')
        isActiveFilter = Q(isActive=True)

        return self.get_model().objects.filter(viewableByAnyoneFilter & isActiveFilter)


        #return self.get_model().objects.filter(viewableByAnyoneFilter)

