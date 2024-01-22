# uptimeMon

## Overview

UptimeMon is a web application that monitors the availability of specified hosts using ping requests.  
It consists of a frontend built with Vite and a backend powered by FastAPI.  
The monitoring results are stored in a MongoDB database.  

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

Run Docker Compose

```bash
sudo docker-compose up --build
```

For more information about Docker usage, check the [Docker Documentation](https://docs.docker.com/).

This command sets up a MongoDB container and containers for the frontend and backend. The application will be available at <http://localhost:5000>.

## Components

### Frontend (Vite)

The frontend is built with Vite, a fast web development build tool. It provides a user interface to view the ping status of specified hosts.

### Backend (FastAPI)

The backend, powered by FastAPI, handles ping requests to monitor the availability of specified hosts. The results are stored in a MongoDB database.

### MongoDB

MongoDB is used as the database to store monitoring results. The database is initialized and accessed through the FastAPI backend.

## Usage

Once the application is running, you can access the frontend at <http://localhost:5000>.  
The user interface allows you to specify hosts and view their ping status.

## License

This project is licensed under the [Apache License 2.0](https://opensource.org/license/apache-2-0/) - see the [LICENSE](LICENSE) file for details.
