#!/bin/bash

# Production Monitoring Script
# This script monitors the health and performance of the application

set -e

# Configuration
PROJECT_NAME="ahmedurkmez"
WEBHOOK_URL="${WEBHOOK_URL:-}"
CHECK_INTERVAL="${CHECK_INTERVAL:-60}"  # seconds
LOG_FILE="./logs/monitor-$(date +%Y%m%d).log"

# Health check endpoints
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:3001/api}"
NGINX_URL="${NGINX_URL:-http://localhost/health}"

# Thresholds
CPU_THRESHOLD="${CPU_THRESHOLD:-80}"
MEMORY_THRESHOLD="${MEMORY_THRESHOLD:-80}"
DISK_THRESHOLD="${DISK_THRESHOLD:-85}"
RESPONSE_TIME_THRESHOLD="${RESPONSE_TIME_THRESHOLD:-5}"  # seconds

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create logs directory
mkdir -p ./logs

# Functions
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

send_alert() {
    local message="$1"
    local level="${2:-WARNING}"
    
    log_message "$level" "$message"
    
    if [ ! -z "$WEBHOOK_URL" ]; then
        local emoji="⚠️"
        [ "$level" = "CRITICAL" ] && emoji="🚨"
        [ "$level" = "OK" ] && emoji="✅"
        
        curl -s -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"$emoji [$PROJECT_NAME] $message\"}" \
             >/dev/null || true
    fi
}

check_http_service() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    local start_time=$(date +%s.%N)
    local response=$(curl -s -o /dev/null -w "%{http_code},%{time_total}" --max-time 10 "$url" 2>/dev/null || echo "000,10")
    local end_time=$(date +%s.%N)
    
    local status_code=$(echo "$response" | cut -d',' -f1)
    local response_time=$(echo "$response" | cut -d',' -f2)
    
    if [ "$status_code" != "$expected_status" ]; then
        send_alert "$name is DOWN (HTTP $status_code)" "CRITICAL"
        return 1
    fi
    
    if (( $(echo "$response_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
        send_alert "$name is SLOW (${response_time}s response time)" "WARNING"
    fi
    
    log_message "INFO" "$name is OK (${response_time}s response time)"
    return 0
}

check_docker_container() {
    local container_name="$1"
    
    if ! docker ps | grep -q "$container_name"; then
        send_alert "Docker container $container_name is not running" "CRITICAL"
        return 1
    fi
    
    # Check container health if health check is configured
    local health=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "unknown")
    if [ "$health" = "unhealthy" ]; then
        send_alert "Docker container $container_name is unhealthy" "CRITICAL"
        return 1
    fi
    
    log_message "INFO" "Docker container $container_name is running"
    return 0
}

check_system_resources() {
    # CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    cpu_usage=${cpu_usage%.*}  # Remove decimal part
    
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        send_alert "High CPU usage: ${cpu_usage}%" "WARNING"
    fi
    
    # Memory usage
    local memory_info=$(free | grep Mem)
    local total_memory=$(echo $memory_info | awk '{print $2}')
    local used_memory=$(echo $memory_info | awk '{print $3}')
    local memory_percentage=$((used_memory * 100 / total_memory))
    
    if [ "$memory_percentage" -gt "$MEMORY_THRESHOLD" ]; then
        send_alert "High memory usage: ${memory_percentage}%" "WARNING"
    fi
    
    # Disk usage
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        send_alert "High disk usage: ${disk_usage}%" "WARNING"
    fi
    
    log_message "INFO" "System resources - CPU: ${cpu_usage}%, Memory: ${memory_percentage}%, Disk: ${disk_usage}%"
}

check_database() {
    if [ ! -z "$DATABASE_HOST" ]; then
        if ! pg_isready -h "$DATABASE_HOST" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-postgres}" >/dev/null 2>&1; then
            send_alert "Database is not responding" "CRITICAL"
            return 1
        fi
        
        log_message "INFO" "Database is responding"
    fi
}

check_log_errors() {
    local error_count=$(grep -c "ERROR\|CRITICAL" "$LOG_FILE" 2>/dev/null || echo "0")
    local warning_count=$(grep -c "WARNING" "$LOG_FILE" 2>/dev/null || echo "0")
    
    if [ "$error_count" -gt 10 ]; then
        send_alert "High error rate: $error_count errors in current log" "WARNING"
    fi
    
    log_message "INFO" "Log analysis - Errors: $error_count, Warnings: $warning_count"
}

# Main monitoring function
run_health_checks() {
    log_message "INFO" "Starting health checks..."
    
    local all_healthy=true
    
    # Check HTTP services
    check_http_service "Frontend" "$FRONTEND_URL" || all_healthy=false
    check_http_service "Backend API" "$BACKEND_URL/health" || all_healthy=false
    check_http_service "Nginx" "$NGINX_URL" || all_healthy=false
    
    # Check Docker containers (if using docker-compose)
    if command -v docker >/dev/null 2>&1; then
        check_docker_container "${PROJECT_NAME}_frontend_prod" || all_healthy=false
        check_docker_container "${PROJECT_NAME}_backend_prod" || all_healthy=false
        check_docker_container "${PROJECT_NAME}_postgres_prod" || all_healthy=false
        check_docker_container "${PROJECT_NAME}_nginx_prod" || all_healthy=false
    fi
    
    # Check system resources
    check_system_resources
    
    # Check database
    check_database
    
    # Check logs for errors
    check_log_errors
    
    if [ "$all_healthy" = true ]; then
        log_message "INFO" "All health checks passed"
    else
        log_message "WARNING" "Some health checks failed"
    fi
    
    log_message "INFO" "Health checks completed"
}

# Performance metrics collection
collect_metrics() {
    log_message "INFO" "Collecting performance metrics..."
    
    # Application metrics (if available)
    local backend_metrics=$(curl -s "$BACKEND_URL/metrics" 2>/dev/null || echo "{}")
    
    # System metrics
    local load_average=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | sed 's/^ *//')
    local connections=$(netstat -an | grep ESTABLISHED | wc -l)
    local processes=$(ps aux | wc -l)
    
    log_message "INFO" "Metrics - Load: $load_average, Connections: $connections, Processes: $processes"
}

# Cleanup old logs
cleanup_logs() {
    find ./logs -name "monitor-*.log" -type f -mtime +7 -delete 2>/dev/null || true
}

# Main execution
main() {
    if [ "$1" = "--daemon" ]; then
        log_message "INFO" "Starting monitoring daemon (interval: ${CHECK_INTERVAL}s)"
        
        while true; do
            run_health_checks
            collect_metrics
            cleanup_logs
            sleep "$CHECK_INTERVAL"
        done
    else
        log_message "INFO" "Running single health check"
        run_health_checks
        collect_metrics
    fi
}

# Trap signals for graceful shutdown
trap 'log_message "INFO" "Monitoring stopped"; exit 0' TERM INT

# Check dependencies
for cmd in curl bc; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        log_message "ERROR" "Required command not found: $cmd"
        exit 1
    fi
done

# Run main function
main "$@"