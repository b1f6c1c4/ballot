#!/usr/bin/env bash
set -e

if [[ -z "$NETLIFYKEY" ]]; then
  echo "Ignore deploying to Netlify"
else
  echo "Start deploying to Netlify..."

  echo "/* /app.html 200" > build/_redirects

  zip -r website.zip build

  curl -H "Content-Type: application/zip" \
       -H "Authorization: Bearer $NETLIFYKEY" \
       --data-binary "@website.zip" \
       https://api.netlify.com/api/v1/sites/a9ee2384-e39a-4ffc-83b6-e658e183fa60/deploys
fi
