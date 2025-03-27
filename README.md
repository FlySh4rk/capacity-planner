# IT Team Capacity Planning Tool

A complete solution for IT development team capacity planning. This tool helps manage developers, skills, projects, and resource allocations with a modern and user-friendly interface.

## Features

1. **Developer Management**
   - Register developers with their skills and roles
   - Track individual workloads and availability
   - View allocation history for each developer

2. **Project Management**
   - Create and manage projects with start/end dates
   - Track active and completed projects
   - View team allocations for each project

3. **Resource Allocation**
   - Assign developers to projects with specific allocation percentages
   - Set start and end dates for each allocation
   - Track overall developer workload to prevent overallocation

4. **Dynamic Dashboard**
   - View developer workload charts
   - Analyze technology/skill distribution across the team
   - Get alerts for ending allocations (with customizable timeframe)
   - Monitor developer availability for new projects

## Technology Stack

- **Backend**: Python with FastAPI framework
- **Frontend**: Angular with Material Design components
- **Database**: PostgreSQL
- **Charts**: NGX-Charts for interactive visualizations

## Docker Deployment

The easiest way to get started is using Docker:

```bash
# Clone the repository
git clone <repository-url>
cd capacity-planning

# Start the application
docker-compose up -d
```

Access the application at http://localhost and the API documentation at http://localhost:8000/docs.

See the [Docker Deployment Guide](DOCKER.md) for more details.

## Manual Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost/capacity_planning
   ```

5. Start the backend server:
   ```bash
   python -m app.main
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Access the application at http://localhost:4200

## Sample Data

The Docker setup automatically loads sample data. For manual setup, you can run the sample data script:

```bash
cd backend
python -m scripts.seed_data
```
