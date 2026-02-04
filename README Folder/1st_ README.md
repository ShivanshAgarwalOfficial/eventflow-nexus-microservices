# 🎫 EventFlow - NestJS Microservices Platform

![Architecture](./system_architecture.png)

A comprehensive **Real-time Event Management & Ticketing Platform** built with NestJS microservices architecture, covering all major NestJS concepts.

## 🏗️ Architecture

EventFlow consists of **8 microservices**:

1. **API Gateway** - GraphQL Federation, Request routing, Rate limiting
2. **User Service** - JWT Auth, Guards, Decorators, PostgreSQL
3. **Event Service** - MongoDB, Pipes, Exception Filters
4. **Booking Service** - CQRS, Event Sourcing, Sagas
5. **Payment Service** - Strategy Pattern, Transactional Outbox
6. **Notification Service** - WebSockets, Real-time, Email
7. **Job Queue Service** - BullMQ, Scheduled Jobs
8. **Analytics Service** - CQRS Read Models

## 🛠️ Tech Stack

| Category             | Technologies              |
| -------------------- | ------------------------- |
| **Backend**          | NestJS, TypeScript        |
| **Frontend**         | Next.js 14, Apollo Client |
| **Databases**        | PostgreSQL, MongoDB       |
| **Message Broker**   | RabbitMQ                  |
| **Cache**            | Redis                     |
| **Job Queue**        | BullMQ                    |
| **Auth**             | Passport.js, JWT          |
| **Containerization** | Docker, Docker Compose    |
| **Monorepo**         | Turborepo                 |

## 📁 Project Structure

```
eventflow/
├── apps/                    # Microservices & Frontend
│   ├── api-gateway/
│   ├── user-service/
│   ├── event-service/
│   ├── booking-service/
│   ├── payment-service/
│   ├── notification-service/
│   ├── job-service/
│   ├── analytics-service/
│   └── web/                # Next.js Frontend
├── packages/
│   ├── shared-types/       # Shared TypeScript types
│   ├── shared-utils/       # Shared utilities
│   └── message-contracts/  # RabbitMQ event contracts
├── infrastructure/
│   ├── docker/
│   └── scripts/
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd micro-services_with_next_and_nest
```

2. **Install dependencies**

```bash
npm install
```

3. **Start infrastructure services**

```bash
npm run docker:up
```

This will start:

- PostgreSQL (port 5432)
- MongoDB (port 27017)
- RabbitMQ (ports 5672, 15672 - management UI)
- Redis (port 6379)

4. **Access RabbitMQ Management UI**

- URL: http://localhost:15672
- Username: `eventflow`
- Password: `eventflow123`

### Development

```bash
# Run all services in development mode
npm run dev

# Build all services
npm run build

# Run tests
npm run test

# View Docker logs
npm run docker:logs
```

## 📚 NestJS Concepts Covered

- ✅ **Dependency Injection** - `@Injectable()`, Custom Providers
- ✅ **Controllers** - REST & GraphQL
- ✅ **Pipes** - Validation & Transformation
- ✅ **Guards** - `AuthGuard`, `RolesGuard`
- ✅ **Interceptors** - Logging, Caching
- ✅ **Exception Filters** - Custom Error Handling
- ✅ **Middleware** - Request Processing
- ✅ **Custom Decorators** - `@CurrentUser()`, `@Roles()`
- ✅ **WebSockets** - Real-time Communication
- ✅ **Microservices** - RabbitMQ Integration
- ✅ **CQRS** - Command Query Responsibility Segregation
- ✅ **Event Sourcing** - Event Store
- ✅ **GraphQL** - Federation
- ✅ **Scheduling** - `@Cron()`, `@Interval()`
- ✅ **Job Queues** - BullMQ

## 📖 Implementation Plan

For detailed implementation steps, see [EVENTFLOW_IMPLEMENTATION_PLAN.md](./EVENTFLOW_IMPLEMENTATION_PLAN.md)

## 🎯 Milestones

- [x] **Phase 1**: Foundation Setup (Monorepo, Docker, Shared Packages)
- [ ] **Phase 2**: User & Auth Service
- [ ] **Phase 3**: Event Service
- [ ] **Phase 4**: Booking Service (CQRS)
- [ ] **Phase 5**: Payment & Notification Services
- [ ] **Phase 6**: Job Queue & Analytics
- [ ] **Phase 7**: Next.js Frontend
- [ ] **Phase 8**: Deployment

## 📝 License

This is an educational project for learning NestJS microservices architecture.

## 👨‍💻 Author

Built as a learning journey to master NestJS and microservices!

---

**Star this repo if you find it helpful!** ⭐
