# Table of contents

* [Setup project](#setup-project)
* [Notes](#setup-env)

1. Setup project:
    * Install modules:
      ```npm install``` or ```yarn```
    * Setup environment variables:
        - ```nano .env```
        - ```
          AWS_UID=
          HOTELFLY_API_HOST=
          AWS_SQS_HOTELFLY_LINK_URL=
          AWS_SQS_HOTELFLY_HOTEL_DETAILS_LINK_URL=
          AWS_S3_BUCKET_NAME=
          ```
    * Run command:
        - ```pm2 start --name hn-hotel-fly-0 entrypoint-normal.sh -- hn-hotel-fly-0```
        - ```pm2 start --name hotel-fly-important-n entrypoint-important.sh -- hotel-fly-important-n```

2. Notes
    * Install [Node 18 for Ubuntu](https://github.com/nodesource/distributions)
    * AWS configuration:
        * Using aws cli: ```aws configure```
        * Using credential files:
            * ```nano ~/.aws/credentials```
            * ```
              [default]
              aws_access_key_id=
              aws_secret_access_key= 
              ```
            * ```nano ~/.aws/config```
            * ```
              [default]
              region = ap-northeast-2
              ```
    * [Pm2 startup config](https://pm2.keymetrics.io/docs/usage/startup/)
    * Fix problem with git pull:
        * ```nano ~/.ssh/config```
        *
        ```
        Host github.com
          Hostname ssh.github.com
          Port 443
        Host bitbucket.org
          Hostname altssh.bitbucket.org
          Port 443
        ```








   
