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
| Postman | Any | API testing |

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
DB_SID=XE

# Authentication
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development
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

Application URL: `http://localhost:3000/api/v1`

---

## Database Seed Data

Before registering users, the `roles` table must be populated. Run the following SQL in Oracle SQL Developer or SQL*Plus:

```sql
INSERT INTO "roles" ("id", "name", "display_name")
  VALUES (SYS_GUID(), 'admin', 'Administrator');

INSERT INTO "roles" ("id", "name", "display_name")
  VALUES (SYS_GUID(), 'teacher', 'Teacher');

INSERT INTO "roles" ("id", "name", "display_name")
  VALUES (SYS_GUID(), 'invigilator', 'Invigilator');

COMMIT;
```

> **Note:** The double quotes are required because TypeORM creates lowercase table and column names in Oracle.

---

## API Reference

**Base URL:** `http://localhost:3000/api/v1`

All protected endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

### Authentication — `/auth`

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

### Courses — `/session/course`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/session/course` | Admin, Teacher | Create a new course |
| `GET` | `/session/course` | All | List all courses |
| `GET` | `/session/course/:id` | All | Get a course by ID |
| `PATCH` | `/session/course/:id` | Admin, Teacher (creator only) | Update a course |
| `DELETE` | `/session/course/:id` | Admin, Teacher (creator only) | Delete a course |

**Create Course body:**
```json
{
  "code": "CS101",
  "name": "Introduction to Computer Science"
}
```

---

### Sessions — `/session`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/session` | Admin, Teacher | Create an exam session |
| `GET` | `/session` | All | List all sessions |
| `GET` | `/session?status=active` | All | Filter sessions by status |
| `GET` | `/session/:id` | All | Get a session by ID |
| `PATCH` | `/session/:id` | Admin, Teacher (creator only) | Update a session |
| `DELETE` | `/session/:id` | Admin, Teacher (creator only) | Delete a session |
| `POST` | `/session/:id/enrollments` | Admin, Teacher | Enroll students into session |
| `GET` | `/session/:id/students` | All | List enrolled students |

**Session statuses:** `upcoming` → `active` → `expired` _(auto-managed by the scheduler)_

**Create Session body:**
```json
{
  "title": "Final Exam — CS101",
  "venue": "Hall A",
  "scheduled_start": "2026-05-15T09:00:00Z",
  "scheduled_end": "2026-05-15T12:00:00Z",
  "course_id": "<course_uuid>"
}
```

**Enroll Students body:**
```json
{
  "students": [
    { "student_number": "BSC/COM/02/24", "full_name": "Jamu Latisha" },
    { "student_number": "BSC/52/24", "full_name": "Kaluluma Jessica Ndense" },
    { "student_number": "BSC/INF/09/24", "full_name": "Mike Kamanga" },
    {"student_number": "BSC/COM/02/24}", "full_name" : "Nick Tsokalida" },
    {"student_number": "BSC/COM/03/24}", "full_name" : "Paul Mongola" },
    {"student_number": "BED/COM/02/24}", "full_name" : "Paul Nangantani" },
    {"student_number": "BSC/COM/NE/02/24}", "full_name" : "Alfred Lonjezo" },
    {"student_number": "BSC/ELE/20/24}", "full_name" : "Lisa Kanyenda" },
    {"student_number": "BSC/INF/40/24}", "full_name" : "Patrick Solomon" },
    {"student_number": "BSC/01/24}", "full_name" : "Christopher Chisamba" },
    {"student_number": "BSC/COM/27/24}", "full_name" : "Mordecai Kalulu" }
  ]
}
```
> Students are identified by their institutional student number — they do **not** need user accounts in the system.

---

### Attendance — `/attendance`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/attendance/mark` | Admin, Teacher | Mark a single student |
| `POST` | `/attendance/bulk-mark` | Admin, Teacher | Mark multiple students at once |
| `PATCH` | `/attendance/:id` | Admin, Teacher | Update an attendance record |
| `GET` | `/attendance` | All | Query attendance records |
| `GET` | `/attendance/report/:sessionId` | All | Get session attendance summary |

**Mark Attendance body:**
```json
{
  "session_id": "<session_uuid>",
  "session_student_id": "<session_student_uuid>",
  "status": "present",
  "method": "scan"
}
```

**Bulk Mark body:**
```json
{
  "session_id": "<session_uuid>",
  "records": [
    { "session_id": "<session_uuid>", "session_student_id": "<id1>", "status": "present", "method": "scan" },
    { "session_id": "<session_uuid>", "session_student_id": "<id2>", "status": "late", "method": "manual" }
  ]
}
```

Valid statuses: `present`, `absent`, `late`
Valid methods: `scan`, `manual`

---

### Offline Sync — `/offline`

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/offline/sync` | Admin, Teacher | Sync records captured offline |

**Sync body:**
```json
{
  "deviceId": "Scanner-Device-001",
  "offlineRecords": [
    {
      "localId": "local-uuid-001",
      "sessionId": "<session_uuid>",
      "studentNumber": "BIT/COM/001/24",
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

Follow these steps in order:

1. **Register a teacher**
   ```json
   POST /auth/register
   { "first_name": "Damianoh", "last_name": "Jester", "email": "dami@test.com", "password": "Pass123", "role": "teacher" }
   ```

2. **Login and copy the `access_token`**
   ```json
   POST /auth/login
   { "email": "dami@test.com", "password": "Pass123" }
   ```

3. **Create a course** — save the returned `id`
   ```json
   POST /session/course
   { "code": "CS101", "name": "Introduction to Computer Science" }
   ```

4. **Create a session** — save the returned `id`
   ```json
   POST /session
   { "title": "Final Exam", "venue": "Hall A", "scheduled_start": "2026-05-15T09:00:00Z", "scheduled_end": "2026-05-15T12:00:00Z", "course_id": "<course_id>" }
   ```

5. **Enroll students** — save the returned `session_student` IDs
   ```json
   POST /session/<session_id>/enrollments
   {  "students": [
    { "student_number": "BSC/COM/02/24", "full_name": "Jamu Latisha" },
    { "student_number": "BSC/52/24", "full_name": "Kaluluma Jessica Ndense" },
    { "student_number": "BSC/INF/09/24", "full_name": "Mike Kamanga" },
    {"student_number": "BSC/COM/02/24}", "full_name" : "Nick Tsokalida" },
    {"student_number": "BSC/COM/03/24}", "full_name" : "Paul Mongola" },
    {"student_number": "BED/COM/02/24}", "full_name" : "Paul Nangantani" },
    {"student_number": "BSC/COM/NE/02/24}", "full_name" : "Alfred Lonjezo" },
    {"student_number": "BSC/ELE/20/24}", "full_name" : "Lisa Kanyenda" },
    {"student_number": "BSC/INF/40/24}", "full_name" : "Patrick Solomon" },
    {"student_number": "BSC/01/24}", "full_name" : "Christopher Chisamba" },
    {"student_number": "BSC/COM/27/24}", "full_name" : "Mordecai Kalulu" } ]}
   ```

6. **Mark attendance**
   ```json
   POST /attendance/mark
   { "session_id": "<session_id>", "session_student_id": "<session_student_id>", "status": "present", "method": "scan" }
   ```

7. **View the report**
   ```
   GET /attendance/report/<session_id>
   ```

---

### Workflow 2: Offline Sync

1. Download the session's student list while online:
   ```
   GET /session/<session_id>/students
   ```
2. Mark attendance offline using the scanner device.
3. Once reconnected, sync the captured records:
   ```json
   POST /offline/sync
   { "deviceId": "Scanner-001", "offlineRecords": [...] }
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

### Run a Specific Module
```bash
npm run test -- auth.service.spec.ts
npm run test -- session.controller.spec.ts
npm run test -- attendance.service.spec.ts
```

### Test Suite Status

| Module | Spec File | Status |
|--------|-----------|--------|
| App | `app.controller.spec.ts` | ✅ Passing |
| Auth | `auth.controller.spec.ts` | ✅ Passing |
| Auth | `auth.service.spec.ts` | ✅ Passing |
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
3. Verify credentials in `.env`
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
**Cause:** User account has no role assigned.

**Fix:** Ensure the `roles` table is seeded (see [Database Seed Data](#database-seed-data)), then re-register the user with a `role` field in the request body.

---

### 401 Unauthorized
**Cause:** Missing, expired, or malformed JWT token.

**Fix:**
1. Re-login to get a fresh token.
2. Ensure the `Authorization` header format is exactly: `Bearer <token>`
3. Verify `JWT_SECRET` in `.env` has not changed since the token was issued.

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
