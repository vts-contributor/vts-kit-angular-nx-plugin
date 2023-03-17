#!/bin/bash
set -e

forderHarbor=$1
nameProject=$2

echo "Node version"
node -v

echo "NPM version"
npm -v

echo "Build source"   
npm i
npm run build

echo "Build docker"
echo "IMAGE NAME" ${forderHarbor}/${nameProject}:latest
newDockerfilePath=$(npx @vts-private/cli@latest template --templateUrl=cicd/configs/Dockerfile | tail -1)
docker build -f "$newDockerfilePath" -t ${forderHarbor}/${nameProject}:latest .

echo "Push image to registry server"
docker push "$imageName"

echo "Remove local image"
docker rmi "$imageName"

echo "Finish push image to registry server"