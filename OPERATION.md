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

Create a `.env` file in the `digital-exam-attendance/` project root:

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

#### Get Current User Profile
```
GET /auth/profile
Authorization: Bearer <access_token>
```

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

> **Note:** Only the user who created a course can update or delete it.

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
  "course_codes": ["COM211", "COM212"],
  "room_code": "HL-A",
  "venue": "Great Hall A",
  "scheduled_start": "2026-05-15T09:00:00Z",
  "scheduled_end": "2026-05-15T12:00:00Z",
  "expected_students": 120
}
```

> Sessions accept multiple `course_codes` (an array of strings). The `room_code` must match an existing, active room. The session's status is automatically managed by a scheduler:
> - `upcoming` → `active` when `scheduled_start` is reached
> - `active` / `upcoming` → `expired` when `scheduled_end` is passed

Valid session statuses: `upcoming`, `active`, `expired`, `cancelled`

---

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

> Students are identified by their institutional `student_number` — they do **not** need user accounts in the system. Duplicate enrollment attempts for the same student in the same session are silently ignored.

---

### Attendance — `/attendance`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/attendance/mark` | Admin, Teacher, Invigilator | Mark a single student's attendance |
| `POST` | `/attendance/bulk-mark` | Admin, Teacher, Invigilator | Mark multiple students at once |
| `PUT` | `/attendance/:id` | Admin, Teacher, Invigilator | Update an existing attendance record |
| `GET` | `/attendance` | All | Query attendance records (filterable) |
| `GET` | `/attendance/manual-search/:sessionId` | All | Search enrolled students by name or number |

**Mark Attendance body:**
```json
{
  "session_id": "<session_uuid>",
  "student_number": "BSC/COM/02/24",
  "status": "present",
  "method": "scan"
}
```

> The attendance marking logic supports a two-scan workflow:
> - **First scan:** Sets status to `present` (if on time) or `late` (if after `scheduled_start`).
> - **Second scan:** Updates status to `completed` (student has left the venue).
> - Scanning a student who is already `completed` raises a `409 Conflict`.

**Bulk Mark body:**
```json
{
  "session_id": "<session_uuid>",
  "records": [
    { "session_id": "<session_uuid>", "student_number": "BSC/COM/02/24", "status": "present", "method": "scan" },
    { "session_id": "<session_uuid>", "student_number": "BSC/INF/09/24", "status": "late", "method": "manual" }
  ]
}
```

**Query Attendance (`GET /attendance`) — supported query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_id` | UUID | Filter by session |
| `student_number` | string | Filter by student number |
| `status` | string | Filter by status (`present`, `late`, `absent`, `completed`) |
| `method` | string | Filter by method (`scan`, `manual`) |
| `course_id` | UUID | Filter by course |

**Search Students for Manual Mark:**
```
GET /attendance/manual-search/<sessionId>?search=<name_or_number>
```

Valid statuses: `present`, `absent`, `late`, `completed`
Valid methods: `scan`, `manual`

---

### Reports — `/reports`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/reports/:sessionId` | Admin, Teacher | Get live attendance summary for a session |
| `GET` | `/reports/stats` | Admin | Get overall system-wide session statistics |

**Session Report response shape:**
```json
{
  "sessionId": "<uuid>",
  "registeredStudents": 120,
  "actualAttendees": 98,
  "attendanceRate": 81.67,
  "stats": {
    "present": 85,
    "absent": 22,
    "late": 13,
    "completed": 45
  }
}
```

**Overall Stats response shape:**
```json
{
  "totalSessions": 15,
  "activeSessions": 2,
  "upcomingSessions": 5,
  "expiredSessions": 8
}
```

---

### Offline Sync — `/offline`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/offline/sync` | Admin, Teacher, Invigilator | Sync attendance records captured while offline |

**Sync body:**
```json
{
  "deviceId": "Scanner-Device-001",
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

> The sync operation runs in a single database transaction. Individual record failures (e.g. student not enrolled, duplicate record) are captured and reported without rolling back the entire batch. A critical transaction-level error rolls back all changes.

**Response:**
```json
{
  "success": true,
  "message": "Offline records synced successfully",
  "data": {
    "successCount": 1,
    "failureCount": 0,
    "failures": []
  }
}
```

---

## Testing Workflows

### Workflow 1: Full Session Setup

Follow these steps in order:

1. **Register a teacher**
   ```
   POST /auth/register
   ```
   ```json
   { "first_name": "Alice", "last_name": "Smith", "email": "alice@test.com", "password": "Pass123!", "role": "teacher" }
   ```

2. **Login and copy the `access_token`**
   ```
   POST /auth/login
   ```
   ```json
   { "email": "alice@test.com", "password": "Pass123!" }
   ```

3. **Create a course** — save the returned `id`
   ```
   POST /courses
   ```
   ```json
   { "code": "COM211", "name": "Data Structures and Algorithms" }
   ```

4. **Create a room** — save the returned `id` and `room_code`
   ```
   POST /rooms
   ```
   ```json
   { "room_code": "LT-1", "name": "Lecture Theatre 1", "building": "Science Block", "capacity": 200 }
   ```

5. **Create a session** — save the returned `id`
   ```
   POST /sessions
   ```
   ```json
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

6. **Enroll students** into the session
   ```
   POST /sessions/<session_id>/enrollments
   ```
   ```json
   {
     "students": [
       { "student_number": "BSC/COM/02/24", "full_name": "Jamu Latisha" },
       { "student_number": "BSC/INF/09/24", "full_name": "Mike Kamanga" },
       { "student_number": "BSC/COM/03/24", "full_name": "Paul Mongola" }
     ]
   }
   ```

7. **Mark attendance** (first scan → present/late)
   ```
   POST /attendance/mark
   ```
   ```json
   { "session_id": "<session_id>", "student_number": "BSC/COM/02/24", "status": "present", "method": "scan" }
   ```

8. **View the session report**
   ```
   GET /reports/<session_id>
   ```

---

### Workflow 2: Offline Sync

1. While online, download the session's enrolled student list:
   ```
   GET /sessions/<session_id>/students
   ```
2. Mark attendance offline on the scanner device.
3. Once reconnected, sync the captured records:
   ```
   POST /offline/sync
   ```
   ```json
   {
     "deviceId": "Scanner-001",
     "offlineRecords": [
       {
         "localId": "local-001",
         "sessionId": "<session_id>",
         "studentNumber": "BSC/COM/02/24",
         "status": "present",
         "method": "scan",
         "markedAt": "2026-05-15T09:10:00Z"
       }
     ]
   }
   ```

---

## Running Tests

### All Tests
```bash
npm run test
```

### Watch Mode (re-runs on file save)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```
Coverage output: `coverage/index.html`

### Run a Specific Spec File
```bash
npm run test -- auth.service.spec.ts
npm run test -- session.service.spec.ts
npm run test -- offline.service.spec.ts
npm run test -- attendance.service.spec.ts
```

### Test Suite Status

| Module | Spec File | Status |
|--------|-----------|--------|
| App | `app.controller.spec.ts` | ✅ Passing |
| Auth | `auth.controller.spec.ts` | ✅ Passing |
| Auth | `auth.service.spec.ts` | ✅ Passing |
| Courses | `courses.controller.spec.ts` | ✅ Passing |
| Courses | `courses.service.spec.ts` | ✅ Passing |
| Rooms | `rooms.controller.spec.ts` | ✅ Passing |
| Rooms | `rooms.service.spec.ts` | ✅ Passing |
| Session | `session.controller.spec.ts` | ✅ Passing |
| Session | `session.service.spec.ts` | ✅ Passing |
| Attendance | `attendance.controller.spec.ts` | ✅ Passing |
| Attendance | `attendance.service.spec.ts` | ✅ Passing |
| Dashboard | `dashboard.controller.spec.ts` | ✅ Passing |
| Dashboard | `dashboard.service.spec.ts` | ✅ Passing |
| Offline | `offline.controller.spec.ts` | ✅ Passing |
| Offline | `offline.service.spec.ts` | ✅ Passing |

---

## Troubleshooting

### Oracle Connection Error
**Error:** `ORA-12514: TNS:listener does not currently know of service`

**Steps:**
1. Check Oracle is running: `lsnrctl status`
2. Open the database: `ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;`
3. Verify credentials and `DB_SERVICE_NAME` in `.env`
4. Restart the listener: `lsnrctl stop && lsnrctl start`

---

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000`

```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or start on a different port
PORT=3001 npm run start:dev
```

---

### 403 Forbidden on Protected Endpoints
**Cause:** User account has no role assigned, or the authenticated user's role does not have permission for the requested action.

**Fix:** Re-register the user with a `role` field (`admin`, `teacher`, or `invigilator`). Roles are seeded automatically on startup.

---

### 401 Unauthorized
**Cause:** Missing, expired, or malformed JWT token.

**Fix:**
1. Re-login to get a fresh token.
2. Ensure the `Authorization` header format is exactly: `Bearer <token>`
3. Verify `JWT_SECRET` in `.env` has not changed since the token was issued.

---

### Email Domain Validation Fails on Registration
**Cause:** DNS lookup for the email domain is failing in your environment.

**Fix:** Add `SKIP_EMAIL_VERIFY=true` to your `.env` file to bypass DNS-based domain validation during development.

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build project | `npm run build` |
| Start (development) | `npm run start:dev` |
| Start (production) | `npm run start:prod` |
| Start (debug) | `npm run start:debug` |
| Run all tests | `npm run test` |
| Watch tests | `npm run test:watch` |
| Coverage report | `npm run test:cov` |
| E2E tests | `npm run test:e2e` |
| Lint code | `npm run lint` |
| Format code | `npm run format` |

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Oracle Database Documentation](https://docs.oracle.com)
- [JWT Reference](https://jwt.io)
- [Jest Testing Framework](https://jestjs.io)
- [Swagger UI](http://localhost:3000/api/docs) *(when app is running)*
