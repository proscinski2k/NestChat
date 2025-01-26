# NestChat

**Real-time chat application using Next.js and Nest.js**

## 🚀 Quick Start

1. Build containers:

```bash
docker compose build
```

2. Run application:
```bash
docker compose up -d
```

> [!NOTE]
> * Frontend: http://localhost:3000
> * Backend: http://localhost:3001

## 🔄 Development Commands

# Watch logs
```bash
docker compose logs -f
```

# Restart services
```bash
docker compose restart
```

# Stop application
```bash
docker compose down
```

# Rebuild and restart
```bash
docker compose down
docker compose up -d --build
```

# Clear cache
```bash
docker system prune -a
```

## 🛠️ Tech Stack

### Frontend
* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Socket.IO Client

### Backend
* Nest.js
* TypeScript
* Socket.IO

## ✨ Features
* Real-time communication via Socket.IO
* Global chat room
* Private messaging between users 
* Modern UI with shadcn/ui components
* Docker containerization

## 📦 Docker Configuration

```bash
services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 🔍 Requirements
* Docker
* Docker Compose

## 👥 Authors
* Adrian Prościński
* Adam Rosołowski
