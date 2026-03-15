#!/bin/bash
# ── DealZoda VPS Deployment Script ────────────────────────────────────────────
# Run on your VPS: bash scripts/deploy.sh
# Or for first-time setup: bash scripts/deploy.sh --first-time

set -e  # Exit on any error

FIRST_TIME=false
[[ "$1" == "--first-time" ]] && FIRST_TIME=true

echo "⚡ DealZoda Deploy Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── First-time setup ──────────────────────────────────────────────────────────
if [ "$FIRST_TIME" = true ]; then
    echo "► Running first-time VPS setup..."

    # Install Docker
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker

    # Install Docker Compose v2
    apt-get update && apt-get install -y docker-compose-plugin

    # Create app directory
    mkdir -p /opt/dealzoda
    cd /opt/dealzoda

    # Clone repo
    git clone https://github.com/BratAIExplorer/DealZoda.git .

    echo "✓ Docker installed"
    echo "✓ Repo cloned to /opt/dealzoda"
    echo ""
    echo "► Next: copy your .env file to /opt/dealzoda/.env"
    echo "  Then run: bash scripts/deploy.sh"
    exit 0
fi

# ── Standard deploy ───────────────────────────────────────────────────────────
APP_DIR="/opt/dealzoda"
cd "$APP_DIR"

echo "► Pulling latest code..."
git pull origin main

echo "► Checking .env file..."
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found in $APP_DIR"
    echo "Copy your .env file: scp .env root@76.13.179.32:/opt/dealzoda/.env"
    exit 1
fi

echo "► Building and starting containers..."
docker compose down --remove-orphans
docker compose build --no-cache web
docker compose up -d

echo "► Waiting for services to be healthy..."
sleep 10

echo "► Health check..."
if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✓ Web app is running"
else
    echo "⚠ Health check failed — checking logs:"
    docker compose logs web --tail=20
fi

echo ""
echo "✓ Deploy complete!"
echo "  Web:     http://76.13.179.32:3000"
echo "  Uptime:  http://76.13.179.32:3001"
echo ""
echo "  View logs:   docker compose logs -f web"
echo "  Stop:        docker compose down"
