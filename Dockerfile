# Use Caddy as a lightweight web server with HTTPS support
FROM caddy:2-alpine

# Copy your static site files (HTML + PDF) into Caddy's default web root
COPY index.html /usr/share/caddy/index.html
COPY rahullore_OP.pdf /usr/share/caddy/rahullore_OP.pdf
COPY rahullore_CL.pdf /usr/share/caddy/rahullore_CL.pdf
COPY rahul.heif /usr/share/caddy/rahul.heif

# Copy your Caddy configuration
# (this file will define your domain and enable HTTPS)
COPY Caddyfile /etc/caddy/Caddyfile

# Expose HTTP and HTTPS (Caddy image already does this, but explicit doesn't hurt)
EXPOSE 80
EXPOSE 443



