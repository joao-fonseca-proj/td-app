#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull origin main

echo "Cleaning and building project..."
./mvnw clean package -DskipTests

echo  "Build finished. JAR is in target/."