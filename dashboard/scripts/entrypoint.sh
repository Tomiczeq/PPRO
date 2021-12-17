#!/bin/bash

while true; do
    curl http://localhost:3306 1> /dev/null 2>&1
    if [[ "$?" -ne 7 ]]; then
        echo "mysql server started"
        break
    fi
    echo "mysql server not ready yet. sleeping 1 second"
    sleep 1
done

exec "$@"
