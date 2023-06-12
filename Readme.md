# Setting with expressvpn 
1. Install nodejs 18
```
curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt install nodejs
```

2. Install expressvpn
Download expressvpn locally, and upload to worker server, then activate
```
expressvpn activate
```

3. Setup env
```
AWS_QUEUE_NAME = "hotel-crawling-links-prod"
AWS_UID = "836881754257"
HOTELFLY_API_HOST = https://api.hotelfly.tidesquarevn.com
AWS_SQS_HOTELFLY_LINK_URL=https://sqs.ap-northeast-2.amazonaws.com/836881754257/hotel-crawling-links-prod
AWS_SQS_HOTELFLY_HOTEL_DETAILS_LINK_URL=https://sqs.ap-northeast-2.amazonaws.com/836881754257/hotel-details-link-prod
AWS_S3_BUCKET_NAME=hn-hotel-fly
```

4. Run command
```
xvfb-run node main.js 
```

## Deprecated: Setting up crawler docker image for AWS Batch
### Setup credential for AWS client:
#### On local env:

cat ~/.aws/credentials
[default]
aws_access_key_id = xxx
aws_secret_access_key = xxx





   
