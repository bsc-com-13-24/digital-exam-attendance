# Digital Exam Attendance System — Operations Guide

> A comprehensive reference for setting up, running, and testing the Digital Exam Attendance System.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [Database Seed Data](#database-seed-data)
6. [API Reference](#api-reference)
   - [Authentication — `/auth`](#authentication---auth)
   - [Courses — `/courses`](#courses---courses)
   - [Rooms — `/rooms`](#rooms---rooms)
   - [Sessions — `/sessions`](#sessions---sessions)
   - [Attendance — `/attendance`](#attendance---attendance)
   - [Reports — `/reports`](#reports---reports)
   - [Offline Sync — `/offline`](#offline-sync---offline)
7. [Testing Workflows](#testing-workflows)
8. [Running Tests](#running-tests)
9. [Troubleshooting](#troubleshooting)
10. [Quick Command Reference](#quick-command-reference)

---

## Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | v18.x or higher | Runtime environment |
| npm | v9.x or higher | Package manager |
| Oracle Database | XE 21c or higher | Primary database |
| Git | Any | Version control |
| Postman / Swagger UI | Any | API testing |

### Optional Tools

- **Docker** — For running Oracle Database without a local installation

---

## Database Setup

### Option 1: Oracle SQL*Plus (Local Install)

**Step 1 — Create a Pluggable Database**
```sql
CREATE PLUGGABLE DATABASE digital_attendance_pdb
  ADMIN USER digital_admin IDENTIFIED BY digitalpassword
  FILE_NAME_CONVERT = (
    'C:\oracle\oradata\XE\pdbseed\',
    'C:\oracle\oradata\XE\digital_attendance_pdb\'
  );
```

**Step 2 — Open and Persist the Database**
```sql
ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;
ALTER PLUGGABLE DATABASE digital_attendance_pdb SAVE STATE;
```

**Step 3 — Create the Application User**
```sql
ALTER SESSION SET CONTAINER = digital_attendance_pdb;

CREATE USER digital_user IDENTIFIED BY digitalpassword;
GRANT CONNECT, RESOURCE, DBA TO digital_user;
```

**Step 4 — Verify**
```sql
SELECT username FROM dba_users WHERE username = 'DIGITAL_USER';
```

---

### Option 2: Docker

**Run Oracle XE in a container**
```bash
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PWD=digitalpassword \
  gvenzl/oracle-xe:21c-slim
```

**Connect and run your setup script**
```bash
docker exec -it oracle-xe sqlplus sys/digitalpassword@localhost:1521/XE as sysdba
```

---

## Project Setup

### Step 1 — Install Dependencies

```bash
cd digital-exam-attendance
npm install
```

### Step 2 — Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=digital_user
DB_PASSWORD=digitalpassword
DB_DATABASE=digital_attendance_pdb
DB_SERVICE_NAME=digital_attendance_pdb

# Authentication
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development

# Email Verification (set to 'true' to skip DNS verification in dev)
SKIP_EMAIL_VERIFY=true
```

### Step 3 — Build the Project

```bash
npm run build
```

---

## Running the Application

| Mode | Command | Notes |
|------|---------|-------|
| Development | `npm run start:dev` | Hot-reload enabled. Recommended for testing. |
| Production | `npm run start:prod` | Optimised build. |
| Debug | `npm run start:debug` | Attaches debugger at `chrome://inspect`. |

- **Application URL:** `http://localhost:3000/api/v1`
- **Swagger UI:** `http://localhost:3000/api/docs`

---

## Database Seed Data

Roles are **automatically seeded** on application startup via `AuthService.onModuleInit()`. The system creates `admin`, `teacher`, and `invigilator` roles if they do not already exist — no manual SQL is required.

To seed a room manually, run the following SQL:

### Seed Rooms (Optional)
```sql
INSERT INTO "rooms" ("id", "room_code", "name", "building", "capacity", "is_active", "created_by")
  VALUES (SYS_GUID(), 'HL-A', 'Great Hall A', 'Main Building', 500, 1, 'system');

COMMIT;
```

> **Note:** Double quotes are required because TypeORM creates lowercase table and column names in Oracle.

---

## API Reference

**Base URL:** `http://localhost:3000/api/v1`

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

The interactive Swagger documentation is available at `http://localhost:3000/api/docs`.

---

### Authentication — `/auth`

| Method | Endpoint | Auth Required | Role | Description |
|--------|----------|---------------|------|-------------|
| `POST` | `/auth/register` | No | — | Register a new user |
| `POST` | `/auth/login` | No | — | Login and receive a JWT token |
| `GET` | `/auth/profile` | Yes | Any | Get the current user's profile |
| `GET` | `/auth/:id` | Yes | Admin | Get any user by ID |
| `PUT` | `/auth/:id` | Yes | Self | Update own user profile |
| `DELETE` | `/auth/:id` | Yes | Admin | Delete a user |

#### Register a User
```
POST /auth/register
```
```json
{
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "alice@example.com",
  "password": "SecurePass123",
  "role": "teacher"
}
```
Valid roles: `admin`, `teacher`, `invigilator`

**Response:** Returns `access_token`, `userId`, `verification_token`, and `verification_link`.

> **Note:** Email is marked as verified by default. The verification link is returned in the response for testing purposes; no actual email is sent.

---

#### Login
```
POST /auth/login
```
```json
{
  "email": "alice@example.com",
  "password": "SecurePass123"
}
```
**Response:** Returns `access_token` — copy this for all subsequent requests.

---

### Courses — `/courses`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/courses` | Admin, Teacher | Create a new course |
| `GET` | `/courses` | All | List all courses |
| `GET` | `/courses/:courseId` | All | Get a course by ID |
| `PATCH` | `/courses/:courseId` | Admin, Teacher (creator only) | Update a course |
| `DELETE` | `/courses/:courseId` | Admin, Teacher (creator only) | Delete a course |

**Create Course body:**
```json
{
  "code": "COM211",
  "name": "Data Structures and Algorithms"
}
```

---

### Rooms — `/rooms`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/rooms` | Admin, Teacher | Create a new room |
| `GET` | `/rooms` | All | List all rooms (optional `?activeOnly=true`) |
| `GET` | `/rooms/:roomId` | All | Get a room by ID |
| `GET` | `/rooms/code/:roomCode` | All | Get a room by its code |
| `GET` | `/rooms/:roomId/sessions` | All | Get sessions assigned to this room |
| `PATCH` | `/rooms/:roomId` | Admin | Update a room |
| `DELETE` | `/rooms/:roomId` | Admin | Delete a room |

**Create Room body:**
```json
{
  "room_code": "HL-A",
  "name": "Great Hall A",
  "building": "Main Building",
  "capacity": 500
}
```

> **Note:** When a room is deleted, any sessions linked to it will remain but their `room_id` will be set to `NULL` (Set Null Cascade).

---

### Sessions — `/sessions`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/sessions` | Admin, Teacher | Create a new exam session |
| `GET` | `/sessions` | All | List all sessions (optional `?status=active`) |
| `GET` | `/sessions/:sessionId` | All | Get a session by ID |
| `GET` | `/sessions/:sessionId/students` | All | List students enrolled in a session |
| `POST` | `/sessions/:sessionId/enrollments` | Admin, Teacher | Enroll students into a session |
| `PATCH` | `/sessions/:sessionId` | Admin, Teacher (creator only) | Update a session |
| `DELETE` | `/sessions/:sessionId` | Admin, Teacher (creator only) | Delete a session |

**Create Session body:**
```json
{
  "title": "Final Exam — COM211",
  "course_codes": ["COM211"],
  "room_code": "HL-A",
  "venue": "Great Hall A",
  "scheduled_start": "2026-05-15T09:00:00Z",
  "scheduled_end": "2026-05-15T12:00:00Z",
  "expected_students": 120
}
```

> Sessions accept multiple `course_codes`. The `room_code` must match an existing, active room. The session status is automatically managed:
> - `upcoming` → `active` when `scheduled_start` is reached
> - `active` / `upcoming` → `expired` when `scheduled_end` is passed

**Enroll Students body:**
```json
{
  "students": [
    { "student_number": "BSC/COM/02/24", "full_name": "Jamu Latisha" },
    { "student_number": "BSC/INF/09/24", "full_name": "Mike Kamanga" },
    { "student_number": "BSC/COM/03/24", "full_name": "Paul Mongola" }
  ]
}
```

---

### Attendance — `/attendance`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/attendance/mark` | Admin, Teacher, Invigilator | Mark a student's attendance |
| `POST` | `/attendance/bulk-mark` | Admin, Teacher, Invigilator | Mark multiple students at once |
| `PUT` | `/attendance/:id` | Admin, Teacher, Invigilator | Update an attendance record |
| `GET` | `/attendance` | All | Query attendance records (filterable) |
| `GET` | `/attendance/manual-search/:sessionId` | All | Search enrolled students |

**Mark Attendance body:**
```json
{
  "session_id": "<session_uuid>",
  "student_number": "BSC/COM/02/24",
  "status": "present",
  "method": "scan"
}
```
> **Note:** The `marked_by` field is automatically set to the authenticated user's ID.

**Bulk Mark body:**
```json
{
  "session_id": "<session_uuid>",
  "records": [
    { "student_number": "BSC/COM/02/24", "status": "present", "method": "scan" },
    { "student_number": "BSC/INF/09/24", "status": "late", "method": "manual" }
  ]
}
```
> The `session_id` is provided once at the top level and applies to all records in the batch.

---

### Reports — `/reports`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/reports/:sessionId` | Admin, Teacher | Get live attendance summary |
| `GET` | `/reports/stats` | Admin | Get system-wide session statistics |

---

### Offline Sync — `/offline`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/offline/sync` | Admin, Teacher, Invigilator | Sync records captured while offline |

**Sync body:**
```json
{
  "deviceId": "Scanner-Device-001",
  "lastSyncTimestamp": "2026-05-14T18:00:00Z",
  "offlineRecords": [
    {
      "localId": "local-uuid-001",
      "sessionId": "<session_uuid>",
      "studentNumber": "BSC/COM/02/24",
      "status": "present",
      "method": "scan",
      "markedAt": "2026-05-15T09:15:00Z",
      "remarks": "Scanned at entrance"
    }
  ]
}
```

---

## Testing Workflows

### Workflow 1: Full Session Setup

1. **Register a teacher**
   ```json
   POST /auth/register
   { "first_name": "Alice", "last_name": "Smith", "email": "alice@test.com", "password": "Pass123!", "role": "teacher" }
   ```

2. **Login and copy the `access_token`**
   ```json
   POST /auth/login
   { "email": "alice@test.com", "password": "Pass123!" }
   ```

3. **Create a course**
   ```json
   POST /courses
   { "code": "COM211", "name": "Data Structures and Algorithms" }
   ```

4. **Create a room**
   ```json
   POST /rooms
   { "room_code": "LT-1", "name": "Lecture Theatre 1", "building": "Science Block", "capacity": 200 }
   ```

5. **Create a session**
   ```json
   POST /sessions
   {
     "title": "COM211 Final Exam",
     "course_codes": ["COM211"],
     "room_code": "LT-1",
     "venue": "Lecture Theatre 1",
     "scheduled_start": "2026-05-15T09:00:00Z",
     "scheduled_end": "2026-05-15T12:00:00Z",
     "expected_students": 50
   }
   ```

6. **Enroll students**
   ```json
   POST /sessions/<session_id>/enrollments
   {
     "students": [
       { "student_number": "BSC/COM/02/24", "full_name": "Jamu Latisha" },
       { "student_number": "BSC/INF/09/24", "full_name": "Mike Kamanga" }
     ]
   }
   ```

7. **Mark attendance**
   ```json
   POST /attendance/mark
   { "session_id": "<session_id>", "student_number": "BSC/COM/02/24", "status": "present", "method": "scan" }
   ```

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm run test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate coverage report |

---

## Troubleshooting

### Oracle Connection Error
**Error:** `ORA-12514: TNS:listener does not currently know of service`
1. Check Oracle status: `lsnrctl status`
2. Open the database: `ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;`
3. Verify `DB_SERVICE_NAME` in `.env`

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000`
```bash
fuser -k 3000/tcp
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build project | `npm run build` |
| Start (development) | `npm run start:dev` |
| Start (production) | `npm run start:prod` |

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Swagger UI](http://localhost:3000/api/docs) *(when app is running)*
