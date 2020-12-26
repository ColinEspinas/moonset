#! /bin/sh

case $1 in
'start') deno run --unstable --allow-net --allow-read --import-map=../import_map.json ./server.ts ;;
*) echo "No script with name \"$1\" registered." ;;
esac
