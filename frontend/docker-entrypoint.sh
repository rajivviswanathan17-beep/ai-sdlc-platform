#!/bin/sh

# Replace environment variables in the built JavaScript files
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_API_URL_PLACEHOLDER|${REACT_APP_API_URL:-http://localhost:3001/api}|g" {} \;
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_WS_URL_PLACEHOLDER|${REACT_APP_WS_URL:-ws://localhost:3001}|g" {} \;

# Start nginx
exec "$@"