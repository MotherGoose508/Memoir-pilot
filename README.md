# memoir pilot

The app is a self-hosted study tool. Its public traffic is intended to flow through Tailscale Funnel while the application itself listens only on the Mac's loopback interface.

## Run locally with Docker

1. Copy `.env.example` to `.env` and replace `POSTGRES_PASSWORD` with a long random password.
2. Build and start the services:

   ```sh
   docker compose up -d --build
   ```

3. Check that both services are running:

   ```sh
   docker compose ps
   ```

4. Open `http://localhost:3000` on the Mac.

The current user interface does not yet read or write to PostgreSQL. The database is intentionally included now so that the production topology is already in place when account and progress persistence are added.

## Operations

```sh
# View recent logs
docker compose logs --tail=100 app

# Update after pulling new source code
docker compose up -d --build

# Stop without deleting data
docker compose down
```

Do not run `docker compose down --volumes` in normal operation: it removes the PostgreSQL data volume.

## Public HTTPS with Tailscale Funnel

After the Docker service is healthy, install and sign in to Tailscale on the Mac. Then use:

```sh
tailscale funnel --bg localhost:3000
tailscale funnel status
```

Tailscale prints the public `https://…ts.net` address. Funnel supplies HTTPS and forwards it to the app's localhost-only port.
