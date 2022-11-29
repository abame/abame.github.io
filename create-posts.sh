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

contentType=$3
directory=$contentType
if [ $directory == "blogPost" ]; then
   directory="posts"
fi
urlPrefix='cdn'
if [ "$4" == "preview" ]; then
   urlPrefix=$4
fi

# shellcheck disable=SC2006
RESPONSE=`curl -s --request GET https://$urlPrefix.contentful.com/spaces/$1/entries?access_token=$2\&content_type=$contentType`

items=$(echo "$RESPONSE" | jq -c -r '.[]')

for k in $(jq '.items | keys | .[]' <<< "$RESPONSE"); do
   item=$(jq -r ".items[$k]" <<< "$RESPONSE");
   title=$(jq '.fields.title' <<< "$item")
   slug=$(jq '.fields.slug' <<< "$item")
   imageIdQuotes=$(jq '.fields.headerBackgroundImage.sys.id' <<< "$item")

   createdAt=$(jq '.sys.createdAt' <<< "$item")
   # shellcheck disable=SC2206
   createdAtArray=(${createdAt//T/ })
   description=$(jq '.fields.description' <<< "$item")

   image='/img/bg-post.jpeg'
   if [ $imageIdQuotes != null ]; then
      imageId=$(sed -e 's/^"//' -e 's/"$//' <<<"$imageIdQuotes")
      IMAGE=`curl -s --request GET https://$urlPrefix.contentful.com/spaces/$1/environments/master/assets/$imageId?access_token=$2`
      imageUrl=$(jq '.fields.file.url' <<< "$IMAGE")
      if [ ${#imageUrl} != 0 ]; then
         image="https:$(eval echo $imageUrl)"
      fi
   fi

   # shellcheck disable=SC2006
   filename=`echo "_$(eval echo $directory)/${createdAtArray[0]}-$slug.html" | sed 's/"//g'`
   echo "Creating post $title"
   content=$(jq -r @json <<< "$description")
   echo "---
title: $title
date: $createdAt
background: $image
---
<div class='single-post' data-content='$(echo "${content//\'/&apos;}")'></div>" > "$filename"
done
