#!/bin/bash

cd "$(dirname "$0")" || exit 1

while true; do
    sleep 5

    if [ -n "$(git status --porcelain)" ]; then
        sleep 5

        if [ -n "$(git status --porcelain)" ]; then
            git add .

            FILES=$(git diff --cached --name-only)

            if [ $(echo "$FILES" | wc -l) -eq 1 ]; then
                FILENAME=$(basename "$FILES")
                COMMIT_MESSAGE="Update $FILENAME"
            else
                COMMIT_MESSAGE="Update multiple files"
            fi

            git commit -m "$COMMIT_MESSAGE"
            git push
        fi
    fi
done