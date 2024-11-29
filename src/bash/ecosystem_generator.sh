#!/bin/bash

readonly FILE_PATH="ecosystem.json"
readonly MODE=("top" "detail")
readonly EXEC=("top|exec_tophotel_normal" "detail|exec_hotel_detail")
PREFIX_WORKER_NAME="NO_NAME"
WORKER_COUNT=1
mode=""
exec_script=""

# Check the .env file if it exists
if [[ -f .env ]]; then
  source .env
else
  echo ".env file does not exist!"
  exit 1
fi

# Validate required environment variables
required_vars=(AWS_UID ENV QUEUE_TASKS_URL QUEUE_IMPORTANT_TASKS_URL QUEUE_DETAIL_TASKS_URL QUEUE_RESULTS_URL SENTRY_DSN)
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "Error: Environment variable $var is not set."
        exit 1
    fi
done

# Remove the ecosystem.json file if it exists
if [ -e "$FILE_PATH" ]; then
    rm "$FILE_PATH"
fi

# Parse CLI options
while [[ "$#" -gt 0 ]]; do
    case $1 in

        --mode)
            for var in "${EXEC[@]}"; do 
              IFS='|' read -r cur_mode exec_mode<<< "$var"
              if [ "$cur_mode" = "$2" ]; then
                mode=$2
                exec_script=$exec_mode
              fi
            done
            shift ;;

        --name)
            PREFIX_WORKER_NAME="$2"
            shift ;;
            
        --count)
            if [[ "$2" =~ ^[0-9]+$ ]]; then
                WORKER_COUNT="$2"
            fi
            shift ;;
        *)
            ;;
    esac
    shift
done

required_config=(mode exec_script)

# Validate required config variables
for var in "${required_config[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "Error: option  variable $var is not set."
        exit 1
    fi
done




# Get resource
container_ids=$(docker ps -q)
proxy_list_info=()

for container_id in $container_ids; do
  exposed_ports=$(docker port $container_id | awk '{print $3}' | awk -F: '{print $2}')
  proxy_server_port=$(echo $exposed_ports | awk '{print $1}')
  proxy_management_api_url_port=$(echo $exposed_ports | awk '{print $2}')
  if [[ -z "$proxy_server_port" || -z "$proxy_management_api_url_port" ]]; then
      echo "Warning: Container $container_id does not have the required ports."
      continue
  fi
  proxy_list_info+=("socks5://localhost:$proxy_server_port|http://localhost:$proxy_management_api_url_port")



done

if [[ ${#proxy_list_info[@]} -eq 0 ]]; then
    echo "Error: No proxy information found. Ensure Docker containers are running."
    exit 1
fi

# Generate JSON content
content="{\"apps\": ["
for ((i = 0; i < WORKER_COUNT; i++)); do
    proxy_list_index=$((i % ${#proxy_list_info[@]}))
    IFS='|' read -r proxy_server proxy_management_api_url<<< "${proxy_list_info[$proxy_list_index]}"
    worker_name="$PREFIX_WORKER_NAME-$i"

    block=$(cat <<EOF
    {
        "name": "$worker_name",
        "script": "src/bash/$exec_script.sh",
        "append_env_to_name": true,
        "watch": true,
        "namespace":"work_space_$PREFIX_WORKER_NAME",
        "env": {
            "WORKER_NAME": "$worker_name",
            "AWS_UID": "$AWS_UID",
            "ENV": "$ENV",
            "QUEUE_TASKS_URL": "$QUEUE_TASKS_URL",
            "QUEUE_IMPORTANT_TASKS_URL": "$QUEUE_IMPORTANT_TASKS_URL",
            "QUEUE_DETAIL_TASKS_URL": "$QUEUE_DETAIL_TASKS_URL",
            "QUEUE_RESULTS_URL": "$QUEUE_RESULTS_URL",
            "SENTRY_DSN":"$SENTRY_DSN",
            "PROXY_SERVER": "$proxy_server",
            "PROXY_MANAGEMENT_API_URL": "$proxy_management_api_url"
        }
    }
EOF
    )

    if [[ $i -lt $((WORKER_COUNT - 1)) ]]; then
        block+=","
    fi

    content+="$block"
done
content+="]}"

echo "$content" | jq '.' > "$FILE_PATH"

echo -e "\033[32mecosystem generator mode \033[31m$mode\033[0m"


