# 🌍 **Planet API**

> A **Task Management Backend** built with **Node.js**, **Express**, and **MySQL**, powered by **Sequelize ORM** and fully **Dockerized** for effortless deployment.

---

## 🚀 **Features**

- 🧩 RESTful API architecture  
- 🗄️ MySQL database integration via Sequelize  
- 🧠 Modular controller–service–model structure  
- ⚙️ Auto-run migrations on container startup  
- 🔒 Environment-driven configuration (`.env`)  
- 🧱 Custom migration creation with auto numbering  
- 🧯 Safeguarded Docker setup (skips recreation if existing)  

---

## 🗂️ **Project Structure**

```
planet-api/
│
├── src/
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   │
│   ├── config/
│   │   └── db.config.cjs        # Sequelize + environment config
│   │
│   ├── models/
│   │   └── task.model.cjs       # Sequelize Task model
│   │
│   ├── controllers/
│   │   └── task.controller.cjs  # Request/response logic
│   │
│   ├── services/
│   │   └── task.service.cjs     # Business logic
│   │
│   ├── routes/
│   │   ├── index.cjs            # Main route entry
│   │   └── task.routes.cjs      # Task endpoints
│   │
│   ├── migrations/
│   │   └── 000-init-tasks.cjs   # Example migration
│   │
│   ├── middleware/
│   │   └── errorHandler.cjs     # Central error handler
│   │
│   └── utils/
│       └── logger.cjs           # Optional custom logger
│
├── .env                         # Environment variables
├── Dockerfile                   # Docker image definition
├── docker-compose.yml            # Multi-container setup
├── docker-entrypoint.sh          # Handles migrations + startup
├── create-migration.cjs          # Custom migration script
├── package.json
└── README.md
```

---

## ⚙️ **Prerequisites**

Before starting, ensure you have installed:

- [🟢 Node.js 18+](https://nodejs.org/)
- [🐳 Docker Desktop](https://www.docker.com/)
- [💻 Git](https://git-scm.com/)

---

## 🔐 **Environment Variables**

Create a `.env` file in the project root with:

```env
# development
NODE_ENV=development
PORT=3000

DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=planetdb
DB_DIALECT=mysql

# JWT
JWT_SECRET=confidential
```

All containers automatically use these values during build and runtime.

---

## 🐳 **Docker Setup (Automated)**

### 🧠 What Happens Automatically
When you run the setup:
1. Checks if Docker configuration files exist.  
2. If missing — auto-generates:
   - `Dockerfile`
   - `docker-compose.yml`
   - `docker-entrypoint.sh`
3. Builds containers.  
4. Runs migrations automatically.  
5. Starts your API server.

### ▶️ Quick Start

```bash
npm run docker:setup
```

This will:
- Build the Docker environment  
- Run containers (`planet-api`, `planet-db`)  
- Apply all migrations  
- Start the API at **http://localhost:3000**

### ⛔ Safeguard Logic
If any of the following already exist, the setup **skips creation** and goes straight to `docker compose up`:
```
Dockerfile
docker-compose.yml
docker-entrypoint.sh
```

---

## 🧱 **Docker Containers Overview**

| Container     | Description              | Port |
|----------------|--------------------------|------|
| **planet-api** | Node.js Express server   | 3000 |
| **planet-db**  | MySQL database container | 3306 |

---

## 🧩 **Custom Migration Creation**

No need for the default `sequelize-cli`.  
Use the custom Node script that ensures:
- CommonJS (`.cjs`) file format  
- Incremental numbering (e.g. `000`, `001`, `002`, …)

### 🪄 Command

```bash
npm run make:migration <migration-name>
```

### 📘 Example

```bash
npm run make:migration add-priority-to-tasks
```

Produces:
```
src/migrations/001-add-priority-to-tasks.cjs
```

*(If the latest file is `000-init-tasks.cjs`)*

---

## 🔧 **Custom Scripts**

| Command | Description |
|----------|-------------|
| `npm run setup:docker` | Initializes docker containers, builds and run |
| `npm run docker:up` | Builds and run containers |
| `npm run docker:down` | Stops and remove containers |
| `npm run docker:reset`| Resets docker containers |
| `npm run make:migration {migration-name}` | Creates migration files |

---

## 🧪 **Testing the API**

After containers start, test with any REST client (VSCode REST Client, Postman, or cURL):

```http
GET http://localhost:3000/api/tasks
```

---

## 🧰 **Development Notes**

- `.env` drives all database and runtime configuration.  
- Sequelize uses `.cjs` to ensure compatibility inside Docker.  
- Migrations auto-run when the container starts.  
- `.env`, Docker configs, and generated scripts are ignored from version control.

---

## 🚫 **.gitignore Additions**

```
# Docker-related
Dockerfile
docker-compose.yml
docker-entrypoint.sh

# Environment
.env
```

---

## 🧠 **Troubleshooting**

**❗ socket hang up**  
→ Usually means MySQL isn’t ready yet. Try:
```bash
docker compose down && docker compose up --build
```

**⚠️ Migration errors**  
→ Ensure migration files are `.cjs` and restart Docker after adding new ones.

---

## 📜 **License**

MIT License © 2025 — Planet Project  
Crafted with ❤️ for scalable development.

---
