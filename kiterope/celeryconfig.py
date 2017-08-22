from celery.schedules import crontab

broker_url = 'amqp://localhost'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
timezone = 'Europe/Oslo'
enable_utc = True
include='kiterope.tasks'




