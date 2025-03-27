# Docker Deployment Guide - IT Team Capacity Planning Tool

This guide explains how to deploy the Capacity Planning Tool using Docker. The docker setup provides a fully containerized environment including the backend API (Python/FastAPI), frontend application (Angular), and PostgreSQL database.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository) or download the project files

## Directory Structure

Make sure your project directory structure looks like this:

```
capacity-planning/
├── backend/            # Backend code 
├── frontend/           # Frontend code
├── docker/
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── entrypoint.sh
│   └── frontend/
│       ├── Dockerfile
│       └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Quick Start

1. **Clone or download the project files**

2. **Deploy the application using Docker Compose**:

   ```bash
   cd capacity-planning
   docker-compose up -d
   ```

   This command builds the images and starts the containers in detached mode.

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Configuration Options

### Sample Data

By default, the application will initialize with sample data. To start with an empty database, change the `LOAD_SAMPLE_DATA` environment variable in the `docker-compose.yml` file:

```yaml
backend:
  environment:
    - LOAD_SAMPLE_DATA=false
```

### Database Credentials

You can modify the PostgreSQL credentials in the `docker-compose.yml` file:

```yaml
db:
  environment:
    POSTGRES_USER: your_user
    POSTGRES_PASSWORD: your_password
    POSTGRES_DB: your_database
```

Remember to update the `DATABASE_URL` in the backend service accordingly:

```yaml
backend:
  environment:
    - DATABASE_URL=postgresql://your_user:your_password@db/your_database
```

### Ports

You can change the exposed ports in the `docker-compose.yml` file:

```yaml
frontend:
  ports:
    - "8080:80"  # Change from port 80 to 8080

backend:
  ports:
    - "9000:8000"  # Change from port 8000 to 9000
```

## Managing Containers

- **View running containers**:
  ```bash
  docker-compose ps
  ```

- **View logs**:
  ```bash
  # All containers
  docker-compose logs

  # Specific container
  docker-compose logs backend
  ```

- **Stop all containers**:
  ```bash
  docker-compose down
  ```

- **Stop and remove volumes** (will delete the database):
  ```bash
  docker-compose down -v
  ```

- **Rebuild after changes**:
  ```bash
  docker-compose build
  docker-compose up -d
  ```

## Persistent Data

The PostgreSQL database data is stored in a named volume (`postgres_data`), which persists even when the containers are removed. To start fresh, you need to remove this volume explicitly with:

```bash
docker-compose down -v
```

## Production Deployment Considerations

For a production environment, consider the following additional steps:

1. **Use environment variables for sensitive information**:
   - Create a `.env` file for your Docker Compose environment
   - Never commit credentials to your repository

2. **Enable HTTPS**:
   - Modify the Nginx configuration to use SSL certificates
   - Use Let's Encrypt for free certificates or your organization's certificates
   - Consider using a reverse proxy like Traefik for easier SSL management

3. **Configure a proper backup strategy**:
   - Set up regular database backups
   - Consider using volume snapshots if your infrastructure supports it

4. **Implement monitoring and logging**:
   - Add log aggregation (e.g., ELK stack, Graylog)
   - Set up container monitoring (e.g., Prometheus, Grafana)

5. **Set up CI/CD pipelines**:
   - Automate testing and deployment
   - Use image versioning for better rollback capability

## Troubleshooting

### Container fails to start

Check the logs using:
```bash
docker-compose logs backend
```

Common issues include:
- Database connection problems
- Permission issues with mounted volumes
- Port conflicts (if ports are already in use)

### Database connection issues

1. Ensure PostgreSQL container is running:
   ```bash
   docker-compose ps db
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify connection settings in `docker-compose.yml`

### Application errors

1. Check application logs:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. Access the backend container to investigate:
   ```bash
   docker-compose exec backend /bin/bash
   ```

## Support and Maintenance

For ongoing maintenance:

1. **Update the applications**:
   ```bash
   git pull  # Get the latest code
   docker-compose build  # Rebuild images
   docker-compose up -d  # Restart containers
   ```

2. **Database migrations**:
   If database schema changes, the application will handle migrations automatically on startup.

3. **Backup the database**:
   ```bash
   docker-compose exec db pg_dump -U postgres capacity_planning > backup.sql
   ```
