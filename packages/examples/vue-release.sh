#!/usr/bin/env sh

set -e

yarn run vue:build

cd dist/vue

git init
git add -A
git commit -m 'update examples'

git push -f git@github.com:better-scroll/examples.git master:gh-pages

cd -
