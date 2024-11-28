# #!/bin/bash

PREFIX_WORKER_NAME="NO_NAME"
WORKER_COUNT=0
FILE_PATH="ecosystem.json"

# Check the .env file if it exists
if [[ -f .env ]]; then
  source .env
else
  echo ".env file does not exist!"
  exit 1
fi


# Remove the ecosystem.json file if it exists
if [ -e "$FILE_PATH" ]; then
    echo "true"
    rm "$FILE_PATH"
fi

#  Get config

while [[ "$#" -gt 0 ]]; do
      case $1 in
          --name)
              PREFIX_WORKER_NAME="$2"
              shift ;;
          --count)
              if [[ "$2" =~ ^[0-9]+$ ]]; then
              WORKER_COUNT="$2"
              fi
              shift ;;
          *)
      esac
      shift
done

# Get resource
container_ids=$(docker ps -q)


proxy_list_info=()


for container_id in $container_ids; do
  exposed_ports=$(docker port $container_id | awk '{print $3}' | awk -F: '{print $2}')
  proxy_server_port=$(echo $exposed_ports | awk '{print $1}')
  proxy_management_api_url_port=$(echo $exposed_ports | awk '{print $2}')
  proxy_list_info+=("socks5://localhost:$proxy_server_port|http://localhost:$proxy_management_api_url_port")
done


content="{
            \"apps\": [
                {
                    \"name\": \"$PREFIX_WORKER_NAME\",
                    \"script\": \"src/bash/exec_tophotel_normal.sh\",
                    \"append_env_to_name\": true,
                    \"watch\": true,
                "

for ((i = 0; i < WORKER_COUNT; i++)); do

  proxy_list_index=$((i % ${#proxy_list_info[@]}))
  IFS='|' read -r proxy_server proxy_management_api_url <<< "${proxy_list_info[$proxy_list_index]}"
  worker_name="$PREFIX_WORKER_NAME-$i"

  block=$(cat <<EOF
  "env_$i": {
    "WORKER_NAME": "$worker_name",
    "AWS_UID":"$AWS_UID",
    "ENV": "$ENV",
    "QUEUE_TASKS_URL":"$QUEUE_TASKS_URL",
    "QUEUE_IMPORTANT_TASKS_URL":"$QUEUE_IMPORTANT_TASKS_URL",
    "QUEUE_DETAIL_TASKS_URL":"$QUEUE_DETAIL_TASKS_URL",
    "QUEUE_RESULTS_URL":"$QUEUE_RESULTS_URL",
    "PROXY_SERVER":"$proxy_server",
    "PROXY_MANAGEMENT_API_URL":"$proxy_management_api_url",
  }
EOF
  )

  if [[ $i -lt $((WORKER_COUNT - 1)) ]]; then
    block+=","
  fi

  content+="$block"
done


content+="}]}"

echo "$content" | jq
echo "$content" | jq '.' >> "$FILE_PATH"
