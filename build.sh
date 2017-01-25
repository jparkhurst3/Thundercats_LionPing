#!/bin/sh

rm -r "build"

mkdir "build"

cp "src/index.html" "build"
cp "src/style.css" "build"

echo "Building..."

exec "./node_modules/.bin/webpack"

