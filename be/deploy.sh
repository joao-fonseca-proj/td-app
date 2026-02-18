#!/bin/bash
set -e

echo "Deploying with Docker Compose (no cache)..."

docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Deployment complete."
