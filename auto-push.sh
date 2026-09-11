#!/bin/bash

cd "$(dirname "$0")" || exit 1

while true; do
    sleep 5

    if [ -n "$(git status --porcelain)" ]; then
        echo "Changes detected. Waiting for changes to settle..."

        sleep 10

        if [ -n "$(git status --porcelain)" ]; then
            git add .
            git commit -m "Update"
            git push
            echo "✅ Changes committed and pushed."
        fi
    fi
done
