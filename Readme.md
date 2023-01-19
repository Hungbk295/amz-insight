# Setting up crawler docker image for AWS Batch
### Setup credential for AWS client:
#### On local env:

cat ~/.aws/credentials
[default]
aws_access_key_id = xxx
aws_secret_access_key = xxx

#### Docker Instructions:
References:
* https://cloudsviewer.com/2021/11/29/announcing-aws-graviton2-support-for-aws-fargate-get-up-to-40-better-price-performance-for-your-serverless-containers/ \
* https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html \
  Build with default platform linux/arm64 (with m1 CPU) or x86_64 with intel CPU \
***
Login then Push Commands \
```aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 836881754257.dkr.ecr.ap-northeast-2.amazonaws.com``` \
\
Build with docker buildx, you can declare multiple platforms:
```
docker buildx build . --platform linux/x86_64 --tag hotel-daily-fly-x86 --load   
```
\
```
docker tag hotel-daily-fly-x86:latest 836881754257.dkr.ecr.ap-northeast-2.amazonaws.com/hotel-daily-fly:latest
```
\
```
docker push 836881754257.dkr.ecr.ap-northeast-2.amazonaws.com/hotel-daily-fly:latest
```


We can choose to use:
1. **AWS Batch** it will automatically create ECS with x86_64 CPU architecture.
   (Setup AWS fargate spot with x86_64 architecture => cannot be changed at this moment, arm64 is not available on Fargate spot
   https://aws.amazon.com/blogs/aws/announcing-aws-graviton2-support-for-aws-fargate-get-up-to-40-better-price-performance-for-your-serverless-containers/)

2. **AWS ECS** in this link https://ap-southeast-1.console.aws.amazon.com/ecs/v2/clusters
   Basic steps are:
- Create cluster with linux/arm64 cpu
- Create task definitions

docker run --init --rm -it hotel-daily-fly xvfb-run node crawler/main.js "[{\"id\":\"213796\",\"hotel_name\":\"Radisson Blu Resort Cam Ranh\",\"start_date\":\"2022-01-8\",\"end_date\":\"2022-01-10\",\"results\":[{\"id\":\"213796\",\"target_date\":\"2023-01-07\",\"next_date\":\"2023-01-08\",\"url\":\"https://www.expedia.com/Nha-Trang-Hotels-Radisson-Blu-Resort-Cam-Ranh.h37999130.Hotel-Information?chkin=2023-01-07&chkout=2023-01-08\"}]}]"



```

```