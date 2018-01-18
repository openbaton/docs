#!/bin/bash

# check that local changes are committed
while true; do
    read -p "Did you commit your local changes?" yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) echo "please commit and execute it again"; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

commit_id=`git log --format="%H" -n 1`
branch_id=doc-$(date "+%Y-%m-%d")

# build the documentation
mkdocs build --clean

# create a temporary folder for cloning the website repository
tmp=`mktemp -d`
git clone git@github.com:openbaton/openbaton.github.io.git $tmp/web

# copying the updated documentation on the documentation folder of the website
cp -r site/ $tmp/web/documentation

pushd $tmp/web

# create a new branch for adding the new documentation content
git checkout -b $branch_id

# commit changes with latest commit id
git add -A 
git commit -m "Updated documentation folder with content from $commit_id of docs master branch"
 
# push changes on master branch
git push origin $branch_id

popd


