<p align="center">
  <img src="./static/favicon.png" alt="Gallerimg Logo" width="200">
</p>

<h1 align="center">Gallerimg</h1>

<p align="center">
  <strong>
  Gallerimg is an image gallery web application that allows users to upload photos and share them with others.
  </strong>
</p>

### Table of Contents
- [Usage](#usage)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites-1)
  - [Setup](#setup-1)
- [Data Paths](#data-paths)
- [Environment Variables](#environment-variables)

# Usage

To upload some images you need to go to the admin page [https://localhost:3000/admin](https://localhost:3000/admin). 

Credentials: `admin` / `admin`

> [!NOTE]
> You can change them by setting the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables. 

Click on the `Upload` entry in the sidebar, then drag and drop the images you want to upload or click to select them from your file system.

# Installation

## Prerequisites
- Docker 

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Padi2312/gallerimg.git
    ```

2. Run docker build to create the image:
    ```bash
    docker build -t gallerimg .
    ```

3. Run the container:
    ```bash
    docker run -d -p 3000:3000 gallerimg -e DATABASE_URL=postgres://user:password@localhost:5432/gallerimg 
    ```
    > [!IMPORTANT]
    > Replace the `DATABASE_URL` value with the connection string for your database server.
    > When running the database via Docker Compose, the connection string should be `postgres://user:password@host.docker.internal:5432/gallerimg`.

# Development Setup 

## Prerequisites

- Node.js (v22 or higher)
- Docker 

## Setup

> [!NOTE]
> The database server must be running before starting the development server or running the application.

1. Start the database server using Docker Compose:
    ```bash
    docker-compose up -d
    ```

2. Install pnpm and the dependencies:
    ```bash
    npm install -g pnpm
    pnpm install
    ```

3. Start the development server:
    ```bash
    pnpm dev
    ```

4. Open the application in your browser at `http://localhost:5173`.

# Data Paths

- `data/images` - Image uploads directory

# Environment Variables

| Env variable     | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`   | URL for the database connection. _(default: none)_  |
| `AUTH_SECRET`    | Secret key for JWT authentication. _(default: secret)_             |
| `ADMIN_USERNAME` | Username for the admin account. _(default: admin)_                 |
| `ADMIN_PASSWORD` | Password for the admin account. _(default: admin)_                 |
| `LOG_LEVEL`      | Logging level for the application. (default: 0)                    |
| `MAIL_HOST`      | SMTP server host for sending emails. (default: none)               |
| `MAIL_PORT`      | SMTP server port for sending emails. (default: none)               |
| `MAIL_USER`      | SMTP server username for sending emails. (default: none)           |
| `MAIL_PASS`      | SMTP server password for sending emails. (default: none)           |
| `MAIL_FROM`      | Email address for the "From" field in sent emails. (default: none) |


