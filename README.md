# CRM System

A modern CRM application built with Next.js, featuring role-based access control for managing expense entries and users.

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Database**: MongoDB 7
- **Styling**: Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- npm or yarn

## Setup Instructions

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crm
   ```

2. **Set environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://mongo:27017/crm
   JWT_SECRET=your-secret-key-change-in-production
   ```
   
   **Note**: Both `MONGO_URI` and `JWT_SECRET` are read from the `.env` file. If not provided, Docker will use default values.

3. **Start the application**
   ```bash
   docker compose up --build
   ```

4. **Seed the database** (in a new terminal)
   ```bash
   docker compose --profile seed up seed
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/crm
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Start MongoDB** (if not using Docker)
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:7
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Login Credentials

The database is pre-seeded with the following test accounts:

### Manager Accounts
- **Email**: `manager@test.com`
- **Password**: `123456`

- **Email**: `manager2@test.com`
- **Password**: `123456`

### User Accounts
- **Email**: `user@test.com`
- **Password**: `123456`

- **Email**: `user1@test.com`
- **Password**: `123456`

- **Email**: `user2@test.com`
- **Password**: `123456`

- **Email**: `user3@test.com`
- **Password**: `123456`

## Features

- **User Role**: Create, view, edit, and delete your own expense entries
- **Manager Role**: View all entries, filter by status, update entry status, and manage users

## Docker Commands

- **Start services**: `docker compose up`
- **Start in background**: `docker compose up -d`
- **Stop services**: `docker compose down`
- **View logs**: `docker compose logs -f app`
- **Rebuild containers**: `docker compose up --build`
- **Seed database**: `docker compose --profile seed up seed`
