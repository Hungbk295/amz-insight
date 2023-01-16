import os
import subprocess
from time import sleep
from dotenv import load_dotenv
import boto3

load_dotenv()

sqs = boto3.resource('sqs')
batchClient = boto3.client('batch', region_name='ap-northeast-2')
queue_name = os.getenv('AWS_QUEUE_NAME')
queueSqs = sqs.get_queue_by_name(
    QueueName=queue_name,
    QueueOwnerAWSAccountId=os.getenv('AWS_UID')
)

while True:
    responses = queueSqs.receive_messages(
        QueueUrl=queue_name,
        MaxNumberOfMessages=1
    )
    tasks = list(map(lambda response: response.body, responses))
    if len(tasks) > 0:
        infoTasks = f'[{",".join(tasks)}]'
        cwd = os.getcwd()
        output = subprocess.run(["node", cwd + "/crawler/crawler.js", infoTasks], capture_output=True, text=True)
        print(f'output: {output.stdout}')

        # batchClient.submit_job(
        #     jobDefinition='hotel-daily-fly',
        #     jobName='hotel-daily-fly-2',
        #     jobQueue='hotel-daily-fly',
        #     parameters={'ids': infoTasks}
        # )
        queueSqs.delete_messages(
            Entries=list(
                map(lambda response: {'Id': response.message_id, 'ReceiptHandle': response.receipt_handle}, responses))
        )
    else:
        sleep(1800)
