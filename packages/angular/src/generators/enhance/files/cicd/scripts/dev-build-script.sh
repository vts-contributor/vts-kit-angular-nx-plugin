#!/bin/bash
set -e

echo "Node version"
node -v

echo "NPM version"
npm -v

echo "Build source"   
npm i
npm run build

echo "Build docker"
echo "IMAGE NAME" ${harborProject}/${appName}:latest
newDockerfilePath=$(npx @vts-private/cli@latest template --templateUrl=cicd/configs/Dockerfile | tail -1)
docker build --rm=false -f "$newDockerfilePath" -t ${harborProject}/${appName}:latest .