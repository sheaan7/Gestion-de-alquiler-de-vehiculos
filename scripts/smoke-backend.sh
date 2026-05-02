#!/usr/bin/env bash
set -euo pipefail

docker compose up -d --build
curl -fsS http://localhost:8761 > /dev/null
curl -fsS http://localhost:8080/api/vehiculos > /dev/null
curl -fsS http://localhost:8080/api/operaciones > /dev/null
