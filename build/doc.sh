# !/bin/bash

echo "Enter the git dir of better-scroll.github.io:"
read ioDir
echo "better-scroll.github.io is in $ioDir"
echo "start build docs.."
# npm run docs:build
echo "build docs done"
echo "publish docs?[y/n]"
read answer
if echo "$answer" | grep -iq "^y";then
  cp -r ./vuepress-docs/.vuepress/dist/* $ioDir
  cd $ioDir
  git add .
  git commit -m "update docs"
  git push
fi

exit 0