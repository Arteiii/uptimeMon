<p align="center">
  <img src="https://raw.githubusercontent.com/Arteiii/uptimeMon/main/frontend/public/logo.svg" alt="uptimeMon">
</p>
<p align="center">
    <em>UptimeMon is a web application that monitors the availability of specified hosts using ping requests.</em>
</p>
<p align="center">
<a href="https://github.com/arteiii/uptimemon/actions/workflows/python_cov.yml" target="_blank">
    <img src="https://github.com/arteiii/uptimemon/actions/workflows/python_cov.yml/badge.svg" alt="Test">
</a>
<a href="https://codecov.io/gh/Arteiii/uptimeMon" target="_blank">
    <img src="https://codecov.io/gh/Arteiii/uptimeMon/graph/badge.svg?token=BQCJEON4D4" alt="Coverage">
</a>
<a href="https://www.codefactor.io/repository/github/arteiii/uptimemon" target="_blank">
    <img src="https://www.codefactor.io/repository/github/arteiii/uptimemon/badge" alt="Package version">
</a>
</p>

## Getting Started

### Prerequisites

Make sure you have Docker installed on your machine.  
Follow the official Docker installation guide: [Install Docker](https://docs.docker.com/engine/install/)

### Clone Repository

```bash
git clone https://github.com/Arteiii/uptimeMon.git
cd uptimeMon
```

**Note**: Docker Compose is required to run this project. If you don't have Docker Compose installed, you can download it [here](https://docs.docker.com/compose/install/).


Before beginning, ensure to configure the address of the API endpoint (the backend application) within the Nextjs config of the frontend (``/frontend/next.config.js``). Set the environment variable ``API_URL`` to match your backend URL.


Run Docker Compose

```bash
sudo docker-compose up --build
```

For more information about Docker usage, check the [Docker Documentation](https://docs.docker.com/).

This command sets up a MongoDB container and containers for the frontend and backend. The application will be available at <http://localhost:5000>.

## Components

### Frontend (Next.js)

The frontend is built with Next.js, a fast web development build tool. It provides a user interface to view the ping status of specified hosts.

### Backend (FastAPI)

The backend of UptimeMon is powered by [FastAPI](https://fastapi.tiangolo.com/), which comes with automatic API documentation.  
You can explore and interact with the API directly from your browser.

#### Access API Documentation

Once the application is running, you can access the automatic API documentation at:

- **Swagger UI:** <http://localhost:5000/docs>
- **ReDoc:** <http://localhost:5000/redoc>

These interfaces provide a detailed overview of the available API endpoints, request parameters, and response structures.

## Usage

Once the application is running, you can access the frontend at <http://localhost:5000>.  
The user interface allows you to specify hosts and view their ping status.


<img src="https://i.imgur.com/Vr3OS4n.gif" alt="Test">

## License

This project is licensed under the [Apache License 2.0](https://opensource.org/license/apache-2-0/) - see the [LICENSE](LICENSE) file for details.
