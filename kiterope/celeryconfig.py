broker = 'amqp://5ebe2294ecd0e0f08eab7690e2a6ee69:eac8d74fae134a9bbedb21ff824605ead6d858ef@localhost:5672'
backend = 'rpc://localhost'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']

timezone = 'North America/Los Angeles'
enable_utc = True
include=['kiterope.tasks']





