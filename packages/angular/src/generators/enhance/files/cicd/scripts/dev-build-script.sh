#!/bin/bash
set -e

echo "Node version"
node -v

echo "NPM version"
npm -v

echo "Start build source"   
npm i
npm run build

echo "Start build docker"
docker build -f cicd/configs/Dockerfile -t "$imageName" .
echo "Finish build docker"

echo "Push image to registry server"
docker push "$imageName"
docker rmi "$imageName"
echo "Finish push image to registry server"

