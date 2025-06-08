#!/bin/bash




# Check if a message is provided
if [ $# -gt 0 ]; then
    message="$1"
else
    message="change"
fi

# Check for changes before proceeding
if ! git diff --quiet; then
    # Stage changes
    git add . 

    # Commit changes with the message
    if git commit -m "$message"; then
        # Push changes
        if git push; then
            printf "Changes pushed successfully.\n"
        else
            printf "Error: Failed to push changes.\n"
            
        fi
    else
        printf "Error: Failed to commit changes.\n"
       
    fi
else
    printf "No changes to commit.\n"
fi