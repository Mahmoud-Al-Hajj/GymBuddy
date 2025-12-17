#  GymBuddy - Workout Tracking Mobile App

A React Native mobile application designed to help fitness enthusiasts track their workouts, monitor progress, and achieve their fitness goals. Built with Expo and modern React Native technologies. 
GymBuddy is a feature-rich workout tracking application that empowers users to log exercises, track personal records, monitor body metrics, and visualize their fitness journey through progress photos. The app combines intuitive design with powerful functionality to create a seamless workout tracking experience.

## Key Features

### Workout Management
- **Create Custom Workouts**: Build personalized workout routines with multiple exercises
- **Exercise Tracking**: Add sets, reps, and weight for each exercise
- **Workout History**: View all past workouts with detailed exercise breakdowns
- **Edit & Delete**: Modify or remove workouts and exercises as needed
- **Search Functionality**: Quickly find specific workouts using the search bar
- **Completion Tracking**: Mark exercises as completed during workout sessions

### Personal Records (PRs)
- **PR Logging**: Mark and save personal best achievements for any exercise
- **PR History**: View all personal records with date stamps
- **Weight & Rep Tracking**: Track maximum weight lifted and rep combinations

###  Progress Tracking
- **Body Metrics**: Log and monitor weight, age, and gender
- **BMI Calculation**: Automatic BMI calculation with health insights
- **Statistics Dashboard**: View total workouts, PRs, and progress photos at a glance
- **Achievement System**: Unlock badges for reaching workout milestones:
  - First Workout, 10 Workouts, 25 Workouts, 50 Workouts
  - First PR, 10 PRs, 25 PRs
  - Photo Fanatic (10+ progress photos)
  
## Screenshots

###  Authentication

| Landing | Login |
|:-------:|:-----:|
| <img src="https://github.com/user-attachments/assets/1f0271fe-1c99-4c54-878d-434f764a9189" width="200"/> | <img src="https://github.com/user-attachments/assets/7aa8040b-9d45-4b72-8265-69ffaa15a181" width="200"/> |

###  Onboarding
| Gender Selection | Age Selection | Weight Selection |
|:-------:|:-------------:|:-----:|
|  <img src="https://github.com/user-attachments/assets/073464e5-f0b7-4d5a-a706-c80878302df1" width="200"/> | <img src="https://github.com/user-attachments/assets/8f8a55ea-784a-49e0-ae81-e74c8544a38a" width="200"/> | <img src="https://github.com/user-attachments/assets/785cfdc1-532d-4303-95e2-fdeabffa0c3b" width="200"/> |

### Core Features
| Home (Empty) |Home (With Workouts) | Workout Creation | Progress |
|:----:|:-------:|:--------:|:--------:|
| <img src="https://github.com/user-attachments/assets/69e62ab8-be6f-4541-9658-36ddc94dee0d" width="200"/> | <img src="https://github.com/user-attachments/assets/b26bd186-f788-4595-bb15-bd1a8480b418" width="200"/> | <img src="https://github.com/user-attachments/assets/0339f9f2-f900-4685-8dc9-cc7aa7d5701b" width="200"/> | <img src="https://github.com/user-attachments/assets/bcee1630-ee11-429e-821c-8e0d889d39a3" width="200"/> |


### Profile
| Profile | Profile |
|:------------:|:------------:|
| <img src="https://github.com/user-attachments/assets/d7a549c5-854d-4644-9f45-1361f0ae627b" width="200"/> | <img src="https://github.com/user-attachments/assets/83925b2b-0b4d-4e5a-bc48-52ec641fa72d" width="200"/> |

### Settings
| Settings |
|:--------:|
| <img src="https://github.com/user-attachments/assets/9fe5ef31-f6c6-43e5-b553-147bb01fd761" width="200"/> |

###  Progress Photos

- **Photo Library Integration**: Add progress photos directly from device gallery
- **Photo Gallery**: Browse all progress photos within each workout
- **Visual Progress**: Track physical transformation over time

###  Settings & Customization

- **Weight Unit Toggle**: Switch between kg and lbs
- **Default Values**: Set default sets and reps for faster workout creation
- **Clear Data**: Option to reset all workout and profile data
- **Profile Management**: Update personal information anytime

###  User Experience

- **Daily Motivational Quotes**: Rotating inspirational messages to keep you motivated
- **Lottie Animations**: Smooth, engaging animations throughout the app
- **Dark Theme**: Eye-friendly dark interface for all lighting conditions
- **Empty State Messages**: Helpful prompts when no workouts exist
- **Confetti Celebrations**: Visual feedback for achievements

###  Security & Data

- **Secure Authentication**: Login system with email validation
- **Onboarding Flow**: One-time setup for new users
- **Persistent Storage**: Data saved securely across app sessions
- **Session Management**: Secure user session handling


### Form Management & Validation
- **Formik** - Form state management and handling
- **Yup** - Schema-based form validation

### Data Storage

- **AsyncStorage**
  - Stores workout data
  - Saves user preferences
  - Caches application settings
- **Expo Secure Store**
  - Securely stores authentication tokens
  - Protects sensitive user credentials
  - Manages session data

### Media & Images

- **Expo Image Picker** - Camera and photo library access
- **Expo Image** - Optimized image component


# GymBuddy Server - Backend API

A production-ready Express.js REST API for the GymBuddy fitness tracking application. Provides secure workout tracking, personal records management, and user profile functionality with comprehensive API documentation.

## Overview

GymBuddy Server is a robust backend service that powers the GymBuddy mobile app. It handles user authentication, workout management, exercise tracking, personal records, progress photos, and user settings through a well-documented REST API.


## Tech Stack

| Category             | Technology                  |
| -------------------- | --------------------------- |
| **Runtime**          | Node.js 22.19.0             |
| **Framework**        | Express.js 5.2.1            |
| **Database**         | PostgreSQL (Supabase)       |
| **ORM**              | Prisma 5.22.0               |
| **Authentication**   | JWT (jsonwebtoken)          |
| **Password Hashing** | bcrypt                      |
| **Validation**       | Joi                         |
| **Logging**          | Winston                     |
| **Security**         | Helmet, CORS, Rate Limiting |
| **File Storage**     | Supabase Storage            |
| **Documentation**    | Swagger/OpenAPI 3.0         |
| **Environment**      | dotenv                      |

## Features

### ✅ Security

- **Helmet** security headers (15+ HTTP headers)
- **CORS** with explicit origin validation
- **Rate Limiting** (100 req/15min general, 5 req/15min auth)
- **JWT Authentication** with 1-day expiration
- **Bcrypt Password** hashing (10 rounds)
- **Request Size Limits** (10kb body/urlencoded)
- **Request Timeout** (30 seconds)
- **Input Validation** with Joi schemas
- **Error Sanitization** (no stack traces to client)

### ✅ API Documentation

- **Swagger UI** at `/api-docs`
- **OpenAPI 3.0** specification
- **30+ Endpoints** fully documented
- **Request/Response** examples
- **Error Codes** documented
- **Authentication** marked on protected endpoints

### ✅ Core Functionality

- User registration and authentication
- Profile management (CRUD)
- Workout creation with nested exercises
- Exercise tracking and completion
- Personal records (PRs) management
- Progress photos with cloud storage
- User settings and preferences
- Health check endpoints

### ✅ Logging & Monitoring

- **Winston** structured logging
- Console and file output
- Request tracking middleware
- Slow query logging (>100ms)
- Error logging with stack traces
- Graceful shutdown handlers

### ✅ Database

- **Prisma ORM** with PostgreSQL
- **Atomic Transactions** for complex operations
- **9 Database Indexes** for performance optimization
- **Cascade Deletes** for data integrity
- **Connection Pooling** configured

## Prerequisites

- **Node.js** 18+ (tested with 22.19.0)
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud like Supabase)
- **Supabase Account** (for file storage - optional, can use local storage)

## Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd GymBuddy-Server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gym_buddy_db

# JWT
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRY=1d

# Supabase (for file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key

# CORS
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:19006

# Logging
LOG_LEVEL=debug
```

**Environment Variables Reference:**

| Variable               | Description                  | Example                          |
| ---------------------- | ---------------------------- | -------------------------------- |
| `PORT`                 | Server port                  | `3000`                           |
| `NODE_ENV`             | Environment mode             | `development` / `production`     |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://...`               |
| `JWT_SECRET`           | Secret key for JWT signing   | Min 32 characters                |
| `JWT_EXPIRY`           | Token expiration time        | `1d`, `24h`, `86400s`            |
| `SUPABASE_URL`         | Supabase project URL         | `https://xxx.supabase.co`        |
| `SUPABASE_KEY`         | Supabase anon key            | From Supabase dashboard          |
| `SUPABASE_SERVICE_KEY` | Supabase service role        | For server-side operations       |
| `ALLOWED_ORIGIN`       | CORS allowed origins         | Comma-separated URLs             |
| `LOG_LEVEL`            | Logging verbosity            | `error`, `warn`, `info`, `debug` |

### 4. Setup Database

#### Using Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Copy the PostgreSQL connection string to `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma db push
   ```

#### Using Local PostgreSQL

1. Create a database:
   ```bash
   createdb gym_buddy_db
   ```
2. Update `DATABASE_URL` in `.env`
3. Run migrations:
   ```bash
   npx prisma db push
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

- Starts with nodemon (auto-reload on file changes)
- Runs on `http://localhost:3000`
- Logs to console and `logs/` directory

### Production Mode

```bash
npm start
```

- Runs with Node.js (no auto-reload)
- Optimized for performance
- Use with process manager like PM2

### Verify Server is Running

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2025-12-17T10:30:00Z"
}
```

## API Documentation

### Access Swagger UI

Start the server and visit:

```
http://localhost:3000/api-docs
```

Interactive API documentation with:

- All endpoints listed by category
- Request/response examples
- Try-it-out functionality
- Error code documentation
- Authentication requirements

### Main Endpoints

| Method     | Endpoint                                       | Description           |
| ---------- | ---------------------------------------------- | --------------------- |
| **POST**   | `/api/auth/register`                           | Register new user     |
| **POST**   | `/api/auth/login`                              | Login user            |
| **GET**    | `/api/users/profile`                           | Get user profile      |
| **POST**   | `/api/users/profile`                           | Update user profile   |
| **DELETE** | `/api/users/profile`                           | Delete user account   |
| **POST**   | `/api/workouts`                                | Create workout        |
| **GET**    | `/api/workouts`                                | Get all workouts      |
| **GET**    | `/api/workouts/:id`                            | Get workout details   |
| **PUT**    | `/api/workouts/:id`                            | Update workout        |
| **DELETE** | `/api/workouts/:id`                            | Delete workout        |
| **POST**   | `/api/workouts/:workoutId/exercises`           | Add exercise          |
| **PUT**    | `/api/workouts/exercises/:exerciseId`          | Update exercise       |
| **DELETE** | `/api/workouts/exercises/:exerciseId`          | Delete exercise       |
| **POST**   | `/api/workouts/exercises/:exerciseId/complete` | Mark complete         |
| **POST**   | `/api/personal-bests`                          | Record personal best  |
| **GET**    | `/api/personal-bests`                          | Get all PRs           |
| **GET**    | `/api/personal-bests/exercise/:exerciseName`   | Get PR for exercise   |
| **DELETE** | `/api/personal-bests/:id`                      | Delete PR             |
| **POST**   | `/api/progress-photos`                         | Upload progress photo |
| **GET**    | `/api/progress-photos`                         | Get all photos        |
| **DELETE** | `/api/progress-photos/:id`                     | Delete photo          |
| **GET**    | `/api/settings`                                | Get user settings     |
| **PUT**    | `/api/settings`                                | Update settings       |
| **POST**   | `/api/settings/reset`                          | Reset to defaults     |

See full documentation at `/api-docs` when server is running.

## Project Structure

```
GymBuddy-Server/
├── src/
│   ├── server.js                 # Express app setup & middleware
│   ├── config/
│   │   └── swagger.js           # Swagger/OpenAPI config
│   ├── controllers/
│   │   ├── UserController.js    # Auth, profile, settings
│   │   ├── WorkoutController.js # Workouts & exercises
│   │   ├── PersonalBestController.js
│   │   └── ProgressPhotoController.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── WorkoutService.js
│   │   ├── PersonalBestService.js
│   │   ├── ProgressPhotoService.js
│   │   └── SettingsService.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── validation.js
│   │   ├── RateLimitter.js
│   │   ├── Upload.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── workout.js
│   │   ├── personalBest.js
│   │   ├── progressPhoto.js
│   │   └── settings.js
│   ├── utils/
│   │   └── schemas.js           # Joi validation schemas
│   └── lib/
│       └── prisma.js            # Prisma client instance
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.js                  # Sample data seeding
├── logs/                        # Application logs
├── .env                         # Environment variables
├── .env.example                 # Template for env vars
├── package.json
└── README.md
```

## Database Schema

### Users Table

```
- id: Int (PK)
- email: String (unique)
- username: String (unique)
- password: String (hashed)
- age: Int
- weight: Float
- height: Float
- gender: String
- weight_unit: String (kg/lbs, default: kg)
- default_sets: Int (default: 3)
- default_reps: Int (default: 12)
- rest_timer: Int (default: 60)
- createdAt: DateTime
- updatedAt: DateTime
```

### Workouts Table

```
- id: Int (PK)
- userId: Int (FK → users)
- name: String
- date: DateTime
- notes: String
- createdAt: DateTime
- updatedAt: DateTime
- exercises: Exercise[] (relation)
```

### Exercises Table

```
- id: Int (PK)
- workoutId: Int (FK → workouts)
- name: String
- sets: Int
- reps: Int
- weight: Float
- completed: Boolean (default: false)
- createdAt: DateTime
- updatedAt: DateTime
```

### Personal Bests Table

```
- id: Int (PK)
- workoutId: Int (FK → workouts)
- exerciseName: String
- weight: Float
- reps: Int
- date: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

### Progress Photos Table

```
- id: Int (PK)
- workoutId: Int (FK → workouts)
- image_url: String
- date: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

## Authentication

### Login Flow

1. **Register**

   ```bash
   POST /api/auth/register
   {
     "username": "johndoe",
     "email": "john@example.com",
     "password": "SecurePass123"
   }
   ```

2. **Login**

   ```bash
   POST /api/auth/login
   {
     "email": "john@example.com",
     "password": "SecurePass123"
   }
   ```

3. **Receive JWT Token**

   ```json
   {
     "user": { "id": 1, "email": "john@example.com", "username": "johndoe" },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

4. **Use Token in Requests**
   ```bash
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Password Requirements

- Minimum 8 characters
- Should include uppercase, lowercase, numbers, and special characters
- Examples: `MyPass123!`, `Secure@Pass2025`

## Error Handling

All errors return standardized JSON responses:

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **204 No Content** - Deleted successfully
- **400 Bad Request** - Invalid input or validation error
- **401 Unauthorized** - Missing or invalid authentication
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation failed
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

### Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- Returns 429 status when exceeded


## Logging

Logs are saved to the `logs/` directory:

- **combined.log** - All logs
- **error.log** - Error logs only

View real-time logs:

```bash
tail -f logs/combined.log
```

## Health Checks

### Basic Health

```bash
GET /health
```

### Readiness Check

```bash
GET /health/ready
```

Both endpoints return 200 with status information.

## Development

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
3. Apply changes:
   ```bash
   npx prisma db push
   ```

### View Database (Prisma Studio)

```bash
npx prisma studio
```


## Troubleshooting

### Database Connection Error

- Verify `DATABASE_URL` is correct
- Check PostgreSQL service is running
- Confirm credentials and network access
- For Supabase, verify IP is whitelisted

### JWT Token Invalid

- Ensure `JWT_SECRET` is consistent across server restarts
- Token may be expired (check `JWT_EXPIRY`)
- Verify token is sent in `Authorization: Bearer <token>` header

### File Upload Issues

- Verify Supabase credentials in `.env`
- Check file size doesn't exceed 5MB
- Ensure bucket exists in Supabase Storage



