# Table of contents

* [Setup project](#setup-project)
* [Notes](#setup-env)

1. Setup project:
    * Install modules:
      ```npm install``` or ```yarn```
    * Setup environment variables:
        - ```nano .env```
    * Run command:
        - ## Important:
            - working directory have to be like: /path/to/hn-hotel-fly. Otherwise, an ENOENT error will occur.
            - If you run on local, you can set working directory on your IDE before you run
        - ```pm2 start --name hn-hotel-fly-0 entrypoint-normal.sh -- hn-hotel-fly-0```
        - ```pm2 start --name hotel-fly-important-n entrypoint-important.sh -- hotel-fly-important-n```

2. Notes
    * [Install Node 18 for Ubuntu](https://github.com/nodesource/distributions)
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
3. Setup CloudwatchAgent
    * [Installing the CloudWatch agent on on-premises servers](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)
    ```
   wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
   ```
   or for arm64 linux:
   ```
   wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
   ```
   ```
   sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
   sudo aws configure --profile AmazonCloudWatchAgent
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
   sudo nano /opt/aws/amazon-cloudwatch-agent/bin/config.json
   sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m onPremise -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
   sudo systemctl status amazon-cloudwatch-agent
   ```

    * [Install aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   







   
