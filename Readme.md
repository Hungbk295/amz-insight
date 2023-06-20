# Setting with expressvpn 
1. Install nodejs 18
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

2. Install expressvpn
Download expressvpn locally, and upload to worker server, then activate
```
sudo wget https://www.expressvpn.works/clients/linux/expressvpn_3.48.0.4-1_amd64.deb
sudo dpkg -i expressvpn_3.48.0.4-1_amd64.deb
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

## Deprecated: Setting up crawler docker image for AWS Batch
### Setup credential for AWS client:
#### On local env:

cat ~/.aws/credentials
[default]
aws_access_key_id = xxx
aws_secret_access_key = xxx


4. Run command
```
sudo apt install xvfb
xvfb-run node crawlerNormal.js 
xvfb-run node crawlerImportant.js 
```

5. SSH connection
- ssh: error connect port 22: 
```
 sudo nano ~/.ssh/config
 
 Host github.com
 Hostname ssh.github.com
 Port 443
```

- install yarn:
```sudo npm install --global yarn```







   
