#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/soypengu/mictlan.git}"
DOMAIN="${DOMAIN:-mictlanarena.site}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
APP_DIR="${APP_DIR:-/var/www/mictlanarena}"
PORT="${PORT:-3000}"

if [ "$(id -u)" != "0" ]; then
  echo "Ejecuta como root."
  exit 1
fi

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Falta ADMIN_TOKEN. Ejecuta así:"
  echo "ADMIN_TOKEN='token-largo' bash scripts/vps-bootstrap.sh"
  exit 1
fi

ENV_FILE="/etc/mictlanarena.env"
SERVICE_FILE="/etc/systemd/system/mictlanarena.service"
NGINX_SITE="/etc/nginx/sites-available/mictlanarena.site"

apt update && apt upgrade -y
apt install -y git nginx ufw ca-certificates curl build-essential

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

mkdir -p "$APP_DIR"
if [ ! -d "$APP_DIR/.git" ]; then
  rm -rf "$APP_DIR"/*
  git clone "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch --all
  DEFAULT_BRANCH="$(git remote show origin | awk '/HEAD branch/ {print $NF}')"
  git reset --hard "origin/$DEFAULT_BRANCH"
fi

cd "$APP_DIR"
mkdir -p "$APP_DIR/data"

npm ci
npm run build

cat > "$ENV_FILE" <<EOF
NODE_ENV=production
ADMIN_TOKEN=$ADMIN_TOKEN
NEXT_TELEMETRY_DISABLED=1
EOF
chmod 600 "$ENV_FILE"

chown -R www-data:www-data "$APP_DIR"
chmod -R u+rwX,g+rX "$APP_DIR"
chmod -R u+rwX,g+rwX "$APP_DIR/data"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=MICTLAN ARENA (Next.js)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
ExecStart=/usr/bin/node $APP_DIR/node_modules/next/dist/bin/next start -p $PORT
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now mictlanarena

cat > "$NGINX_SITE" <<EOF
server {
  server_name $DOMAIN www.$DOMAIN;

  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;

    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF

ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/mictlanarena.site
nginx -t
systemctl reload nginx

apt install -y certbot python3-certbot-nginx

SERVER_IP="$(curl -fsSL https://api.ipify.org || true)"
DNS_IP="$(getent ahostsv4 "$DOMAIN" | awk '{print $1}' | head -n 1 || true)"

if [ -n "$DNS_IP" ] && [ -n "$SERVER_IP" ] && [ "$DNS_IP" = "$SERVER_IP" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" --redirect
else
  echo "SSL pendiente. Ejecuta cuando el DNS apunte al servidor:"
  echo "certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

systemctl status mictlanarena --no-pager
