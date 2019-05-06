#!/usr/bin/env sh

set -e

yarn run docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'update docs'

git push -f git@github.com:better-scroll/docs.git master:gh-pages

cd -
