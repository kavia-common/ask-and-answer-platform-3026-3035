#!/bin/bash
cd /home/kavia/workspace/code-generation/ask-and-answer-platform-3026-3035/qna_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

