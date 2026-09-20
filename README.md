# 🛠️ AI-Driven Field Work & Task Allocation Engine

An enterprise-grade, microservices-based task allocation platform that dynamically matches field technicians with operational work orders using a machine learning scoring engine. Built using Node.js, Python FastAPI, React, MySQL, and Docker.

---

## 📌 Table of Contents
- [Architecture Diagram](#-architecture-diagram)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Automated Testing](#-automated-testing)
- [Live Cloud Deployment](#-live-cloud-deployment)
- [Author](#-author)

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Client_Layer["Client Layer"]
        A["React.js Dashboard (Vite + Tailwind CSS)\n[Hosted on Vercel]"]
    end

    subgraph Core_Backend["Core Backend Layer"]
        B["Node.js / Express API Service\n[Hosted on Render]"]
        C[("MySQL Database\n[Hosted on Cloud Database]")]
    end

    subgraph ML_Microservice["AI/ML Service Layer"]
        D["Python / FastAPI ML Microservice\n[Hosted on Render]"]
    end

    A -->|"HTTP GET / POST (JSON Payload)"| B
    B -->|"Prisma ORM Queries / Mutations"| C
    B -->|"POST /predict-match\n(Technician & Job Data)"| D
    D -->|"Return Match Probabilities Matrix"| B
    B -->|"Return Ranked Candidate List"| A
```

---

## ✨ Key Features

- **AI Match Scoring Engine**: Python FastAPI microservice leverages candidate skill vectors, location metrics, and experience years against job requirements to generate real-time suitability scores.
- **Decoupled Microservice Architecture**: Separation of concerns across distinct services (Frontend, Node.js Core API, Python ML Engine, and Relational Database).
- **Interactive Admin Dashboard**: Modern React interface built with Vite and Tailwind CSS for viewing jobs, assigning technicians, and browsing AI-ranked candidate recommendations.
- **Fully Containerized Environment**: Standardized local orchestration using `docker-compose` to eliminate environment drift.
- **Automated Integration Testing**: Automated API testing execution using Postman collections driven by Newman CLI.

---

## 🛠️ Tech Stack

| Service | Technology / Framework | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS | Admin dashboard UI for job management & candidate visual match display |
| **Core Backend API** | Node.js, Express.js, Prisma ORM | Business logic, CRUD operations, and microservice orchestration |
| **AI / ML Engine** | Python 3.10+, FastAPI, Scikit-Learn | Match probability scoring engine based on candidate vectors |
| **Database** | MySQL 8.0, Prisma ORM | Transactional data persistence, user profiles, and skill matrices |
| **DevOps & Testing** | Docker, Docker Compose, Newman CLI | Local containerized setup and CLI-driven endpoint testing |

---

## 📁 Project Directory Structure

```text
ai-field-work-engine/
├── docker-compose.yml
├── README.md
├── backend-node/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma7.config.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── prisma/
│       ├── schema.prisma
│       └── seed.js
├── ml-python/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── frontend-react/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
└── tests/
    └── postman_collection.json
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed & running
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Raquib1011/ai-field-work-engine.git
cd ai-field-work-engine
```

### 2. Run with Docker Compose
To spin up the entire application stack locally (Database, Backend, ML Service, Frontend):
```bash
docker-compose up --build -d
```

### 3. Seed the Database
In a new terminal window, navigate to `backend-node` and run the database seed script to populate initial mock users, skills, and work orders:
```bash
cd backend-node
npm install
npx prisma db seed
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend-node/`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/field_work_db"
PORT=5000
ML_SERVICE_URL="http://localhost:8000"
```

---

## 📡 API Reference

### Core Backend API (`backend-node`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/work-orders` | Fetch all open work orders |
| `POST` | `/api/work-orders` | Create a new work order |
| `GET` | `/api/work-orders/:id/match` | Get AI match scores for a specific work order |

### ML Microservice (`ml-python`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` / `HEAD` | `/` or `/health` | Container health check and cold-start wake route |
| `POST` | `/predict-match` | Calculates technician match suitability scores |

---

## 🧪 Automated Testing

To run the automated Postman test collection via Newman CLI:

```bash
cd backend-node
npm run test:api
```

---

## 🌐 Live Cloud Deployment

- **Frontend Dashboard**: [https://ai-field-work-engine.vercel.app](https://ai-field-work-engine.vercel.app)
- **Core Backend API**: [https://ai-field-work-engine.onrender.com](https://ai-field-work-engine.onrender.com/api/health)
- **ML Microservice**: [https://field-work-ml.onrender.com](https://field-work-ml.onrender.com/health)
- **MySQL Database**: Managed Cloud MySQL Instance (Aiven / Render)

Note: If the vercel app does not work properly, please first start the Core Backend API and the ML Microservice then try again after the services wake up.

---

## 👤 Author
- **GitHub**: [@Raquib1011](https://github.com/Raquib1011)
