#!/bin/sh

if [[ "$TRAVIS_BRANCH" != "master" ]]; then
  echo "We're not on the master branch."
  exit 0
fi

yarn run deploy