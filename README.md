# 🎫 EventFlow - Ultimate NestJS Microservices Platform

> **Complete Implementation Plan for Learning NestJS & Microservices**
>
> A comprehensive Real-time Event Management & Ticketing Platform designed to teach ALL NestJS and microservices concepts in a single project.

---

## 📌 Project Overview

### What is EventFlow?

EventFlow is a **Real-time Event Management & Ticketing Platform** - similar to Eventbrite or BookMyShow, built with enterprise-grade microservices architecture.

### What Users Can Do:

- 📝 **Register/Login** with secure JWT authentication
- 🎉 **Create Events** (concerts, workshops, meetups)
- 🎟️ **Book Tickets** for events
- 💳 **Make Payments** (simulated Stripe/PayPal)
- 🔔 **Get Real-time Notifications** when bookings are confirmed
- 📊 **View Analytics** on event performance

### Why This Project?

This project covers **EVERY major NestJS concept** in a real-world context:

- Dependency Injection
- Controllers & Resolvers
- Pipes, Guards, Interceptors, Filters
- Custom Decorators
- WebSockets
- Microservices Communication
- CQRS & Event Sourcing
- GraphQL Federation
- Job Queues & Scheduling
- Caching & Performance

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                     Next.js 14 App                               │
│              (GraphQL Client + WebSocket)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│                   NestJS + GraphQL Federation                    │
│         (Routing, Rate Limiting, Caching, Logging)              │
└───────┬─────────┬─────────┬─────────┬─────────┬────────────────┘
        │         │         │         │         │
        ▼         ▼         ▼         ▼         ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   USER    │ │   EVENT   │ │  BOOKING  │ │  PAYMENT  │ │NOTIFICATION│
│  SERVICE  │ │  SERVICE  │ │  SERVICE  │ │  SERVICE  │ │  SERVICE  │
│           │ │           │ │   CQRS    │ │           │ │ WebSocket │
│PostgreSQL │ │  MongoDB  │ │PostgreSQL │ │PostgreSQL │ │   Redis   │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │             │             │
      └─────────────┴──────┬──────┴─────────────┴─────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │       RabbitMQ         │
              │    (Message Broker)    │
              └───────────┬────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    ┌───────────────┐          ┌───────────────┐
    │  JOB SERVICE  │          │   ANALYTICS   │
    │    BullMQ     │          │    SERVICE    │
    │  Scheduling   │          │  CQRS Reads   │
    └───────────────┘          └───────────────┘
```

---

## 📚 NestJS Concepts Coverage Matrix

| Concept                  | Service                | Implementation Details                            |
| ------------------------ | ---------------------- | ------------------------------------------------- |
| **Dependency Injection** | All Services           | `@Injectable()`, Custom Providers, Module Imports |
| **Controllers**          | All Services           | REST Endpoints + GraphQL Resolvers                |
| **Pipes**                | Event Service          | `ValidationPipe`, Custom Transform Pipes          |
| **Guards**               | Auth Service           | `AuthGuard`, `RolesGuard`, Custom Guards          |
| **Interceptors**         | Gateway                | Logging, Caching, Response Transform              |
| **Exception Filters**    | All Services           | Custom HTTP & RPC Exception Filters               |
| **Middleware**           | Gateway                | Request logging, CORS, Rate limiting              |
| **Custom Decorators**    | Auth Service           | `@CurrentUser()`, `@Roles()`, `@Public()`         |
| **WebSockets**           | Notification           | `@WebSocketGateway()`, Rooms, Broadcasting        |
| **Microservices**        | All Services           | `@MessagePattern()`, `@EventPattern()`            |
| **CQRS**                 | Booking + Analytics    | Commands, Queries, Event Handlers, Sagas          |
| **GraphQL**              | Gateway                | Federation, Resolvers, DataLoader                 |
| **Scheduling**           | Jobs Service           | `@Cron()`, `@Interval()`                          |
| **Queues**               | Jobs Service           | BullMQ Processors, Queue Events                   |
| **Caching**              | Gateway + Events       | Redis Cache Manager                               |
| **TypeORM**              | User, Booking, Payment | PostgreSQL Integration                            |
| **Mongoose**             | Event Service          | MongoDB Integration                               |

---

## 📁 Complete Folder Structure

```
eventflow/
├── docker-compose.yml              # All services orchestration
├── package.json                    # Workspace root
├── turbo.json                      # Monorepo config
│
├── apps/
│   ├── web/                        # ═══════════════════════════════
│   │   │                           # NEXT.JS 14 FRONTEND
│   │   ├── app/                    # ═══════════════════════════════
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── events/page.tsx
│   │   │   │   ├── bookings/page.tsx
│   │   │   │   └── analytics/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── events/
│   │   │   └── bookings/
│   │   ├── lib/
│   │   │   ├── graphql/
│   │   │   │   ├── client.ts
│   │   │   │   └── queries/
│   │   │   └── websocket/
│   │   │       └── socket.ts
│   │   └── package.json
│   │
│   ├── api-gateway/                # ═══════════════════════════════
│   │   │                           # API GATEWAY SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── logging.interceptor.ts
│   │   │   │   │   ├── cache.interceptor.ts
│   │   │   │   │   └── transform.interceptor.ts
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   │   └── request-id.middleware.ts
│   │   │   │   └── filters/
│   │   │   │       └── http-exception.filter.ts
│   │   │   ├── graphql/
│   │   │   │   ├── graphql.module.ts
│   │   │   │   └── federation.config.ts
│   │   │   └── proxy/
│   │   │       └── service-proxy.module.ts
│   │   └── package.json
│   │
│   ├── user-service/               # ═══════════════════════════════
│   │   │                           # USER & AUTH SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   └── local-auth.guard.ts
│   │   │   │   └── decorators/
│   │   │   │       ├── current-user.decorator.ts
│   │   │   │       ├── roles.decorator.ts
│   │   │   │       └── public.decorator.ts
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-user.dto.ts
│   │   │   │       └── update-user.dto.ts
│   │   │   └── messaging/
│   │   │       └── user-events.publisher.ts
│   │   └── package.json
│   │
│   ├── event-service/              # ═══════════════════════════════
│   │   │                           # EVENT MANAGEMENT SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── events/
│   │   │   │   ├── events.module.ts
│   │   │   │   ├── events.controller.ts
│   │   │   │   ├── events.service.ts
│   │   │   │   ├── events.resolver.ts        # GraphQL
│   │   │   │   ├── schemas/
│   │   │   │   │   └── event.schema.ts       # Mongoose
│   │   │   │   ├── dto/
│   │   │   │   │   ├── create-event.dto.ts
│   │   │   │   │   └── update-event.dto.ts
│   │   │   │   └── pipes/
│   │   │   │       ├── event-validation.pipe.ts
│   │   │   │       └── parse-date.pipe.ts
│   │   │   ├── categories/
│   │   │   │   ├── categories.module.ts
│   │   │   │   └── categories.service.ts
│   │   │   └── search/
│   │   │       └── search.service.ts
│   │   └── package.json
│   │
│   ├── booking-service/            # ═══════════════════════════════
│   │   │                           # BOOKING SERVICE (CQRS)
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── bookings/
│   │   │   │   ├── bookings.module.ts
│   │   │   │   ├── commands/
│   │   │   │   │   ├── handlers/
│   │   │   │   │   │   ├── create-booking.handler.ts
│   │   │   │   │   │   ├── cancel-booking.handler.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── impl/
│   │   │   │   │       ├── create-booking.command.ts
│   │   │   │   │       └── cancel-booking.command.ts
│   │   │   │   ├── queries/
│   │   │   │   │   ├── handlers/
│   │   │   │   │   │   ├── get-bookings.handler.ts
│   │   │   │   │   │   ├── get-booking-by-id.handler.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── impl/
│   │   │   │   │       ├── get-bookings.query.ts
│   │   │   │   │       └── get-booking-by-id.query.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── handlers/
│   │   │   │   │   │   ├── booking-created.handler.ts
│   │   │   │   │   │   ├── booking-cancelled.handler.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── impl/
│   │   │   │   │       ├── booking-created.event.ts
│   │   │   │   │       └── booking-cancelled.event.ts
│   │   │   │   ├── sagas/
│   │   │   │   │   └── booking.saga.ts
│   │   │   │   └── models/
│   │   │   │       └── booking.model.ts
│   │   │   └── event-store/
│   │   │       ├── event-store.module.ts
│   │   │       └── event-store.service.ts
│   │   └── package.json
│   │
│   ├── payment-service/            # ═══════════════════════════════
│   │   │                           # PAYMENT SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── payments/
│   │   │   │   ├── payments.module.ts
│   │   │   │   ├── payments.controller.ts
│   │   │   │   ├── payments.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── payment.entity.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── payment-strategy.interface.ts
│   │   │   │   │   ├── stripe.strategy.ts
│   │   │   │   │   └── paypal.strategy.ts
│   │   │   │   └── outbox/
│   │   │   │       ├── outbox.entity.ts
│   │   │   │       └── transactional-outbox.service.ts
│   │   │   └── messaging/
│   │   │       └── payment-events.publisher.ts
│   │   └── package.json
│   │
│   ├── notification-service/       # ═══════════════════════════════
│   │   │                           # NOTIFICATION SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── websocket/
│   │   │   │   ├── notification.gateway.ts
│   │   │   │   ├── rooms.service.ts
│   │   │   │   └── websocket.module.ts
│   │   │   ├── email/
│   │   │   │   ├── email.module.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   └── templates/
│   │   │   │       ├── booking-confirmation.hbs
│   │   │   │       ├── payment-success.hbs
│   │   │   │       └── welcome.hbs
│   │   │   ├── push/
│   │   │   │   └── push.service.ts
│   │   │   └── messaging/
│   │   │       └── notification-consumer.ts
│   │   └── package.json
│   │
│   ├── job-service/                # ═══════════════════════════════
│   │   │                           # JOB QUEUE SERVICE
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── queues/
│   │   │   │   ├── queues.module.ts
│   │   │   │   ├── email.processor.ts
│   │   │   │   ├── report.processor.ts
│   │   │   │   └── cleanup.processor.ts
│   │   │   ├── schedulers/
│   │   │   │   ├── schedulers.module.ts
│   │   │   │   └── cron-jobs.service.ts
│   │   │   └── messaging/
│   │   │       └── job-consumer.ts
│   │   └── package.json
│   │
│   └── analytics-service/          # ═══════════════════════════════
│       │                           # ANALYTICS SERVICE
│       ├── src/                    # ═══════════════════════════════
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── projections/
│       │   │   ├── projections.module.ts
│       │   │   ├── event-stats.projection.ts
│       │   │   └── booking-stats.projection.ts
│       │   ├── dashboards/
│       │   │   ├── dashboards.module.ts
│       │   │   ├── dashboard.controller.ts
│       │   │   └── dashboard.service.ts
│       │   └── messaging/
│       │       └── analytics-consumer.ts
│       └── package.json
│
├── packages/
│   ├── shared-types/               # ═══════════════════════════════
│   │   │                           # SHARED TYPESCRIPT TYPES
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── events/
│   │   │   │   └── event.types.ts
│   │   │   ├── users/
│   │   │   │   └── user.types.ts
│   │   │   ├── bookings/
│   │   │   │   └── booking.types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared-utils/               # ═══════════════════════════════
│   │   │                           # SHARED UTILITIES
│   │   ├── src/                    # ═══════════════════════════════
│   │   │   ├── decorators/
│   │   │   │   └── common.decorators.ts
│   │   │   ├── guards/
│   │   │   │   └── common.guards.ts
│   │   │   ├── filters/
│   │   │   │   └── rpc-exception.filter.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── message-contracts/          # ═══════════════════════════════
│       │                           # RABBITMQ MESSAGE CONTRACTS
│       ├── src/                    # ═══════════════════════════════
│       │   ├── user-events.ts
│       │   ├── booking-events.ts
│       │   ├── payment-events.ts
│       │   └── index.ts
│       └── package.json
│
└── infrastructure/
    ├── docker/
    │   ├── Dockerfile.service      # Generic NestJS service
    │   └── Dockerfile.web          # Next.js app
    ├── nginx/
    │   └── nginx.conf              # Reverse proxy config
    └── scripts/
        ├── setup.sh                # Initial setup script
        └── seed.sh                 # Database seeding
```

---

## 🔧 Service Details

### 1. API Gateway Service

**Purpose**: Single entry point, request routing, cross-cutting concerns

**Key Files & What You'll Learn**:

```typescript
// logging.interceptor.ts - Interceptors
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Request took ${Date.now() - now}ms`)));
  }
}

// rate-limit.middleware.ts - Middleware
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Rate limiting logic
    next();
  }
}

// http-exception.filter.ts - Exception Filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // Custom error response
  }
}
```

---

### 2. User/Auth Service

**Purpose**: Authentication, authorization, user management

**Key Files & What You'll Learn**:

```typescript
// jwt.strategy.ts - Passport Strategies
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "secret",
    });
  }
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}

// jwt-auth.guard.ts - Guards
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

// roles.guard.ts - Role-based Guards
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// current-user.decorator.ts - Custom Decorators
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

---

### 3. Event Service

**Purpose**: Event CRUD, MongoDB, validation

**Key Files & What You'll Learn**:

```typescript
// event.schema.ts - Mongoose Schema
@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Category" }] })
  categories: Category[];
}

// event-validation.pipe.ts - Custom Pipes
@Injectable()
export class EventValidationPipe implements PipeTransform {
  transform(value: CreateEventDto, metadata: ArgumentMetadata) {
    if (new Date(value.date) < new Date()) {
      throw new BadRequestException("Event date must be in the future");
    }
    return value;
  }
}

// parse-date.pipe.ts - Transform Pipes
@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException("Invalid date format");
    }
    return date;
  }
}
```

---

### 4. Booking Service (CQRS)

**Purpose**: Ticket booking with full CQRS pattern

**Key Files & What You'll Learn**:

```typescript
// create-booking.command.ts - Commands
export class CreateBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly eventId: string,
    public readonly quantity: number,
  ) {}
}

// create-booking.handler.ts - Command Handlers
@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
  async execute(command: CreateBookingCommand) {
    const booking = await this.bookingRepo.create(command);
    this.eventBus.publish(new BookingCreatedEvent(booking.id));
    return booking;
  }
}

// get-bookings.query.ts - Queries
export class GetBookingsQuery {
  constructor(public readonly userId: string) {}
}

// booking-created.event.ts - Domain Events
export class BookingCreatedEvent {
  constructor(public readonly bookingId: string) {}
}

// booking.saga.ts - Sagas (Distributed Transactions)
@Injectable()
export class BookingSaga {
  @Saga()
  bookingCreated = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(BookingCreatedEvent),
      map((event) => new ProcessPaymentCommand(event.bookingId)),
    );
  };
}
```

---

### 5. Payment Service

**Purpose**: Payment processing with strategy pattern

**Key Files & What You'll Learn**:

```typescript
// payment-strategy.interface.ts - Strategy Pattern
export interface PaymentStrategy {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
}

// stripe.strategy.ts
@Injectable()
export class StripeStrategy implements PaymentStrategy {
  async processPayment(amount: number, currency: string) {
    // Stripe API integration
  }
}

// transactional-outbox.service.ts - Outbox Pattern
@Injectable()
export class TransactionalOutboxService {
  async saveWithOutbox(payment: Payment, event: PaymentEvent) {
    await this.dataSource.transaction(async (manager) => {
      await manager.save(payment);
      await manager.save(OutboxMessage, { event, status: "pending" });
    });
  }
}
```

---

### 6. Notification Service

**Purpose**: Real-time notifications via WebSockets

**Key Files & What You'll Learn**:

```typescript
// notification.gateway.ts - WebSocket Gateway
@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("join-room")
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage("send-notification")
  handleNotification(client: Socket, payload: any) {
    this.server.to(payload.room).emit("notification", payload.data);
  }

  // Broadcast to specific user
  sendToUser(userId: string, notification: any) {
    this.server.to(`user-${userId}`).emit("notification", notification);
  }
}

// notification-consumer.ts - RabbitMQ Consumer
@Injectable()
export class NotificationConsumer {
  @EventPattern("booking.created")
  async handleBookingCreated(data: BookingCreatedEvent) {
    await this.notificationGateway.sendToUser(data.userId, {
      type: "BOOKING_CONFIRMED",
      bookingId: data.bookingId,
    });
    await this.emailService.sendBookingConfirmation(data);
  }
}
```

---

### 7. Job Queue Service

**Purpose**: Background jobs & scheduling

**Key Files & What You'll Learn**:

```typescript
// email.processor.ts - BullMQ Processor
@Processor("email-queue")
export class EmailProcessor {
  @Process("send-email")
  async handleSendEmail(job: Job<EmailJobData>) {
    const { to, subject, template, data } = job.data;
    await this.emailService.send(to, subject, template, data);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed:`, error);
  }
}

// cron-jobs.service.ts - Scheduled Jobs
@Injectable()
export class CronJobsService {
  @Cron("0 0 * * *") // Every day at midnight
  async handleDailyReport() {
    await this.reportService.generateDailyReport();
  }

  @Cron("*/5 * * * *") // Every 5 minutes
  async processOutboxMessages() {
    await this.outboxService.publishPendingMessages();
  }

  @Interval(60000) // Every minute
  async healthCheck() {
    await this.monitoringService.checkServicesHealth();
  }
}
```

---

### 8. Analytics Service

**Purpose**: CQRS read models & dashboards

**Key Files & What You'll Learn**:

```typescript
// event-stats.projection.ts - CQRS Projections
@Injectable()
export class EventStatsProjection {
  @EventPattern("booking.created")
  async onBookingCreated(data: BookingCreatedEvent) {
    await this.statsRepo.incrementEventBookings(data.eventId);
    await this.statsRepo.updateRevenue(data.eventId, data.amount);
  }

  @EventPattern("event.created")
  async onEventCreated(data: EventCreatedEvent) {
    await this.statsRepo.createEventStats(data.eventId);
  }
}

// dashboard.service.ts - Aggregated Data
@Injectable()
export class DashboardService {
  async getOverview(): Promise<DashboardOverview> {
    const [totalEvents, totalBookings, revenue, topEvents] = await Promise.all([
      this.eventStatsRepo.count(),
      this.bookingStatsRepo.sum("quantity"),
      this.bookingStatsRepo.sum("revenue"),
      this.eventStatsRepo.findTopByBookings(10),
    ]);
    return { totalEvents, totalBookings, revenue, topEvents };
  }
}
```

---

## 🐳 Docker Compose Configuration

```yaml
version: "3.8"

services:
  # ══════════════════════════════════════════════════════════
  # DATABASES
  # ══════════════════════════════════════════════════════════
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: eventflow
      POSTGRES_PASSWORD: eventflow123
      POSTGRES_DB: eventflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  # ══════════════════════════════════════════════════════════
  # MESSAGE BROKER & CACHE
  # ══════════════════════════════════════════════════════════
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672" # AMQP
      - "15672:15672" # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: eventflow
      RABBITMQ_DEFAULT_PASS: eventflow123

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ══════════════════════════════════════════════════════════
  # MICROSERVICES
  # ══════════════════════════════════════════════════════════
  api-gateway:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - user-service
      - event-service

  user-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: user-service
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - rabbitmq

  event-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: event-service
    ports:
      - "3002:3002"
    depends_on:
      - mongodb
      - rabbitmq

  booking-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: booking-service
    ports:
      - "3003:3003"
    depends_on:
      - postgres
      - rabbitmq

  payment-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: payment-service
    ports:
      - "3004:3004"
    depends_on:
      - postgres
      - rabbitmq

  notification-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: notification-service
    ports:
      - "3005:3005"
    depends_on:
      - redis
      - rabbitmq

  job-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: job-service
    ports:
      - "3006:3006"
    depends_on:
      - redis
      - rabbitmq

  analytics-service:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.service
      args:
        SERVICE_NAME: analytics-service
    ports:
      - "3007:3007"
    depends_on:
      - postgres
      - rabbitmq

  # ══════════════════════════════════════════════════════════
  # FRONTEND
  # ══════════════════════════════════════════════════════════
  web:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile.web
    ports:
      - "8080:3000"
    depends_on:
      - api-gateway

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

---

## 📅 Implementation Timeline

### Week 1: Foundation

- [ ] Set up Turborepo monorepo structure
- [ ] Configure Docker Compose for all infrastructure
- [ ] Create shared packages (types, utils, contracts)
- [ ] Basic API Gateway skeleton with interceptors

### Week 2: Authentication (User Service)

- [ ] JWT authentication with refresh tokens
- [ ] Passport.js strategies (Local, JWT)
- [ ] Guards: `AuthGuard`, `RolesGuard`
- [ ] Decorators: `@CurrentUser()`, `@Roles()`, `@Public()`
- [ ] PostgreSQL with TypeORM
- [ ] User event publishing to RabbitMQ

### Week 3: Event Management

- [ ] MongoDB setup with Mongoose
- [ ] Event CRUD operations
- [ ] Custom validation pipes
- [ ] Category management
- [ ] Search functionality
- [ ] GraphQL resolver

### Week 4: Booking Service (CQRS)

- [ ] CQRS module setup
- [ ] Commands & Command Handlers
- [ ] Queries & Query Handlers
- [ ] Domain Events & Event Handlers
- [ ] Saga for distributed transactions
- [ ] Event sourcing foundation

### Week 5: Payment & Notifications

- [ ] Payment service with strategy pattern
- [ ] Transactional outbox pattern
- [ ] WebSocket gateway setup
- [ ] Real-time notification broadcasting
- [ ] Email service with templates
- [ ] RabbitMQ consumers

### Week 6: Jobs & Analytics

- [ ] BullMQ queue setup
- [ ] Scheduled jobs with `@Cron()`
- [ ] Analytics projections (CQRS read side)
- [ ] Dashboard data aggregation
- [ ] Health checks

### Week 7-8: Frontend & Polish

- [ ] Next.js 14 App Router setup
- [ ] GraphQL client integration
- [ ] WebSocket real-time updates
- [ ] Authentication flow UI
- [ ] Event browsing & booking UI
- [ ] Analytics dashboard
- [ ] Testing & documentation

---

## 💡 LinkedIn Content Strategy

| Week | Post Title                                                     | Content Type                            |
| ---- | -------------------------------------------------------------- | --------------------------------------- |
| 1    | "Setting up a NestJS microservices monorepo with Turborepo"    | Architecture diagram + folder structure |
| 2    | "Deep dive into NestJS Guards, Strategies & Custom Decorators" | Code snippets + explanations            |
| 3    | "Working with MongoDB in NestJS + Custom Pipes"                | Schema design + validation examples     |
| 4    | "Implementing CQRS in NestJS - A complete guide"               | CQRS flow diagram + code walkthrough    |
| 5    | "Building real-time features with WebSockets in NestJS"        | Demo video of notifications             |
| 6    | "Background job processing with BullMQ & scheduling"           | BullMQ dashboard screenshot             |
| 7    | "The complete EventFlow reveal - 8 microservices in action"    | Full demo video + GitHub link           |

---

## 🛠️ Technologies Summary

| Category             | Technologies                                             |
| -------------------- | -------------------------------------------------------- |
| **Frontend**         | Next.js 14, Apollo Client, Socket.io-client, TailwindCSS |
| **API Gateway**      | NestJS, GraphQL Federation, Apollo Gateway               |
| **Backend Services** | NestJS (8 microservices)                                 |
| **Databases**        | PostgreSQL (TypeORM), MongoDB (Mongoose)                 |
| **Message Broker**   | RabbitMQ                                                 |
| **Cache**            | Redis                                                    |
| **Job Queue**        | BullMQ                                                   |
| **Authentication**   | Passport.js, JWT, bcrypt                                 |
| **Containerization** | Docker, Docker Compose                                   |
| **Monorepo**         | Turborepo                                                |
| **Testing**          | Jest, Supertest                                          |

---

## ✅ Getting Started Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Docker & Docker Compose installed
- [ ] Git configured
- [ ] VS Code with NestJS extensions
- [ ] Postman/Insomnia for API testing

---

> **Note**: This document is your complete reference guide. Each week, we'll build upon the previous work, and by the end, you'll have a production-grade microservices application showcasing every major NestJS concept!

---

**Created**: February 2026
**Author**: Your Learning Journey with AI
**Project**: EventFlow - Ultimate NestJS Microservices Platform
