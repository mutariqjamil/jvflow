#!/bin/sh

# Health check script for JV-Flow application
# This script checks if the application is responding correctly

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "Nginx is not running"
    exit 1
fi

# Check if the application responds with 200 status code
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)

if [ "$HTTP_STATUS" = "200" ]; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is unhealthy. HTTP status: $HTTP_STATUS"
    exit 1
fi