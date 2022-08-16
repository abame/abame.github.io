#!/bin/bash

helpFunction()
{
   echo ""
   echo "Usage: $0 SPACE_ID TOKEN"
   exit 1 # Exit script after printing help
}

if [ -z "$1" ] || [ -z "$2" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

# Check cURL command if available (required), abort if does not exists
type curl >/dev/null 2>&1 || { echo >&2 "Required curl but it's not installed. Aborting."; exit 1; }

# shellcheck disable=SC2006
RESPONSE=`curl -s --request GET https://cdn.contentful.com/spaces/"$1"/entries?access_token="$2" | jq -r '.items'`

items=$(echo "$RESPONSE" | jq -c -r '.[]')

for item in "${items[@]}"; do
  title=$(jq '.fields.title' <<< "$item")
  slug=$(jq '.fields.slug' <<< "$item")

  createdAt=$(jq '.sys.createdAt' <<< "$item")
  # shellcheck disable=SC2206
  createdAtArray=(${createdAt//T/ })
  description=$(jq '.fields.description' <<< "$item")

  # shellcheck disable=SC2006
  filename=`echo "_posts/${createdAtArray[0]}-$slug.html" | sed 's/"//g'`
  echo "Creating post $title"
  content=$(jq -r @json <<< "$description")
  echo "---
layout: post
title: $title
date: $createdAt
background: '/img/bg-post.jpeg'
---
<div class='single-post' data-content='$(echo "${content//\'/&apos;}")'></div>" > "$filename"
done
