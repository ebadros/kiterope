from celery.schedules import crontab

broker_url = 'amqp://5ebe2294ecd0e0f08eab7690d2a6ee69:eac8d74fae134a9bbedb21ff824605eab6d858ef@localhost:5672'
result_backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
timezone = 'Europe/Oslo'
enable_utc = True
include='kiterope.tasks'




