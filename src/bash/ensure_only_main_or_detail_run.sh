#!/bin/bash

# AWS CLI command to get the number of messages in the SQS queue
queue_url="https://sqs.ap-northeast-2.amazonaws.com/836881754257/prod-hotel-international-crawling-tasks"
message_count=$(/usr/local/bin/aws sqs get-queue-attributes --queue-url $queue_url --attribute-names ApproximateNumberOfMessages --query 'Attributes.ApproximateNumberOfMessages' --output text)

# Read the PM2 processes from the environment file (assuming processes are defined as a comma-separated list)
processes_array=($(pm2 ls | awk '/hotel-detail/ {print $2}'))

for process in "${processes_array[@]}"; do
    # Check the current status of the process
    pm2_status=$(pm2 info "$process" | grep -i "status" | awk '{print $4}')
    if [ "$message_count" -gt 0 ] && [ "$pm2_status" == "online" ]; then
        # If the number of messages is greater than 0 and the process is online, stop it
        pm2 stop "$process"
        echo "Stopped PM2 process: $process"
    elif [ "$message_count" -eq 0 ] && [ "$pm2_status" == "stopped" ]; then
        # If the number of messages is equal to 0 and the process is stopped, start it
        pm2 start "$process"
        echo "Started PM2 process: $process"
    fi
done