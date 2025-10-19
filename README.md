# 🌍 Planet API

Planet is a **Task Management Web Application** built using **Node.js**, **Express**, and **MySQL**.  
This repository contains the **backend REST API**, designed to be scalable and fully containerized using **Docker**.

---

## 🚀 Features

- RESTful API architecture  
- MySQL database (via Sequelize ORM)  
- Modular service/controller structure for scalability  
- Dockerized environment for easy deployment  
- Environment-based configuration  
- Supports live reload in development via `nodemon`

---

## 📁 Project Directory Structure

planet-api/
│
├── src/
│ ├── app.js # Express app configuration
│ ├── server.js # Server entry point
│ │
│ ├── config/
│ │ └── db.config.js # Sequelize + database connection
│ │
│ ├── models/
│ │ └── task.model.js # Sequelize Task model
│ │
│ ├── controllers/
│ │ └── task.controller.js # Handles request/response
│ │
│ ├── services/
│ │ └── task.service.js # Business logic for tasks
│ │
│ ├── routes/
│ │ ├── index.js # Main API route entry
│ │ └── task.routes.js # Task endpoints
│ │
│ ├── middleware/
│ │ └── errorHandler.js # Error handling middleware
│ │
│ └── utils/
│ └── logger.js # (Optional) custom logging utility
│
├── .env # Environment variables
├── Dockerfile # Docker image definition
├── docker-compose.yml # Multi-container setup (API + MySQL)
├── package.json # Project metadata & scripts
└── README.md # Project documentation

---

## ⚙️ Requirements

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/)
- [MySQL 8] (installed or via Docker)

---

## 🧩 Environment Variables

Create a `.env` file in the root directory with the following:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_USER=mysql
DB_PASSWORD=mysql
DB_NAME=planetdb
DB_DIALECT=mysql

---

## Docker Setup

Run this from the project root:

docker compose up --build

This will:
Build the planet-api container
Pull and run a mysql:8.0 container
Expose ports 3000 (API) and 3306 (MySQL)