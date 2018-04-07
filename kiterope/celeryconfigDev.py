from celery.schedules import crontab

broker_url = 'amqp://localhost:5672'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']

timezone = 'North America/Los Angeles'
enable_utc = True
include='kiterope.tasks'




