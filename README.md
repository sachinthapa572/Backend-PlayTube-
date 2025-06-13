[![Codacy Badge](https://app.codacy.com/project/badge/Grade/057bf5d5542a4f0c8b3dacca04c8331c)](https://app.codacy.com/gh/sachinthapa572/Backend-PlayTube-/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## Running with Docker

This project includes a Docker setup for easy deployment and development. The provided Dockerfile uses Node.js version `22.13.1-slim` and installs only production dependencies for optimized builds.

### Requirements

-  Docker and Docker Compose installed on your system.
-  (Optional) `.env` file for environment variables. See `.env.sample` for required variables.

### Build and Run

1. (Optional) Copy `.env.sample` to `.env` and fill in the required environment variables.
2. Build and start the application:

   \```sh
   docker compose up --build
   \```

   This will build the image and start the `js-app` service.

### Configuration

-  The application runs as a non-root user (`appuser`) for security.
-  The service exposes port `8000` (mapped to host `8000`).
-  If you add a database, update `docker-compose.yml` and use the provided `backend` network.

### Ports

-  `js-app`: `8000:8000`

### Notes

-  The Dockerfile uses `npm ci --production` to install only production dependencies.
-  If you need to use a `.env` file, uncomment the `env_file` line in `docker-compose.yml`.
