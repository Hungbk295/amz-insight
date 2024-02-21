#!/bin/bash

# Define the threshold for CPU usage
threshold=$1

# Define threshold for idle check
idle_threshold=$2

# Define the namespaces
namespace=$3
prioritized_namespace=$4

# Function to print current time
print_time() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Get the current CPU usage
cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

# Get the CPU usage of PM2 apps in the specified namespace
pm2_prioritized_namespace_cpu_usage=$(pm2 jlist | jq ".[] | select(.pm2_env.namespace == \"$prioritized_namespace\") | .monit.cpu" | awk '{s+=$1} END {print s}')

# Check conditions and take actions accordingly
if (( $(echo "$cpu_usage < $threshold" | bc -l) )) && (( $(echo "$pm2_prioritized_namespace_cpu_usage < $idle_threshold" | bc -l) )); then
    if ! pm2 list | grep -q "$namespace"; then
        print_time "Starting $namespace"
        pm2 start "$namespace"
    fi
elif (( $(echo "$cpu_usage > $threshold" | bc -l) )) && (( $(echo "$pm2_prioritized_namespace_cpu_usage > $idle_threshold" | bc -l) )); then
    print_time "Stopping $namespace"
    pm2 stop "$namespace"
fi
