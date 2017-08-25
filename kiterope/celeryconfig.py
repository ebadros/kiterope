from celery.schedules import crontab

celery_broker_url = 'amqp://5ebe2294ecd0e0f08eab7690e2a6ee69:eac8d74fae134a9bbedb21ff824605ead6d858ef@localhost:5672'
celery_result_backend = 'rpc://localhost'

celery_task_serializer = 'json'
celery_result_serializer = 'json'
celery_accept_content = ['json']

timezone = 'North America/Los Angeles'
enable_utc = True
include='kiterope.tasks'




