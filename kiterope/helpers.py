import datetime, time
from time import mktime
from datetime import datetime
from datetime import timedelta
import pytz
from django.utils import timezone


def formattime(time):
    # format to workweeks, workdays, hours and minutes
    # a workweek is 5 days, a workday is 8 hours
    hours, minutes = divmod(time, 60)
    days, hours = divmod(hours, 8)  # work days
    weeks, days = divmod(days, 5)   # work weeks
    components = [str(v) + l for l, v in zip('wdhm', (weeks, days, hours, minutes)) if v]
    return ''.join(components) or '0m'

#tz = timezone('US/Pacific')

def toUTC(d, tz):
    return tz.normalize(tz.localize(d)).astimezone(pytz.utc)