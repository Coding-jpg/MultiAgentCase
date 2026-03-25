#!/bin/bash
# Quick script to commit and push changes
if [ -z "$1" ]; then
  echo "Usage: ./finish.sh <commit_message>"
  exit 1
fi
# Update title back to working status when using this
bash /home/lxw/.gemini/skills/workspace_manager/scripts/set_title.sh "mario_demo" "underwater" "Finishing..."
python3 /home/lxw/.gemini/skills/workspace_manager/scripts/clone_commit_push.py "$1"
