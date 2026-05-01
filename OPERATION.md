# Digital Exam Attendance System - OPERATION GUIDE

Complete guide for setting up, running, and testing the Digital Exam Attendance System.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Project Setup](#project-setup)
4. [Running the Application](#running-the-application)
5. [Testing Requirements](#testing-requirements)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Testing Workflows](#testing-workflows)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Oracle Database**: XE 21c or higher
- **Git**: For version control
- **Postman**: For manual API testing
- **VS Code**: Recommended IDE with TypeScript support

### Optional Tools
- **Docker**: For Oracle Database (if not installing locally)

---

## Database Setup

### Option 1: Oracle SQL Plus Installation

#### Step 1: Create Pluggable Database
```sql
CREATE PLUGGABLE DATABASE digital_attendance_pdb
ADMIN USER digital_admin IDENTIFIED BY digitalpassword
FILE_NAME_CONVERT = (
    'C:\oracle\oradata\XE\pdbseed\',
    'C:\oracle\oradata\XE\digital_attendance_pdb\'
);
```

#### Step 2: Open Database and Save State
```sql
ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;
ALTER PLUGGABLE DATABASE digital_attendance_pdb SAVE STATE;
```

#### Step 3: Create Application User
```sql
ALTER SESSION SET CONTAINER = digital_attendance_pdb;

CREATE USER digital_user IDENTIFIED BY digitalpassword;
GRANT CONNECT, RESOURCE, DBA TO digital_user;
```

#### Step 4: Verify User Creation
```sql
SELECT username FROM dba_users WHERE username = 'DIGITAL_USER';
```

---

### Option 2: Docker Installation

#### Run Oracle XE in Docker
```bash
docker run -d \
  --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PWD=digitalpassword \
  gvenzl/oracle-xe:21c-slim
```

#### Create Database Inside Container
```bash
docker exec -it oracle-xe sqlplus sys/digitalpassword@localhost:1521/XE as sysdba @/path/to/setup.sql
```

---

## Project Setup

### Step 1: Install Dependencies

Navigate to project root:
```bash
npm install
```

### Step 2: Configure Environment Variables

Create `.env` file in project root:
```env
# Database Configuration
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=digital_user
DB_PASSWORD=digitalpassword
DB_DATABASE=digital_attendance_pdb
DB_SID=XE

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# Application Port
PORT=3000
NODE_ENV=development
```

### Step 3: Build the Project

```bash
npm run build
```

---

## Running the Application

### Development Mode (Recommended for Testing)
```bash
npm run start:dev
```
This runs with hot-reload enabled. Application will be available at `http://localhost:3000`

### Production Mode
```bash
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```
Debugger will be available at `chrome://inspect`

---

## Testing Requirements

### Unit Tests

Run all unit tests:
```bash
npm run test
```

Watch mode (runs on file changes):
```bash
npm run test:watch
```

With coverage report:
```bash
npm run test:cov
```

Debug mode:
```bash
npm run test:debug
```

#### Test Modules

The following modules have test specifications:

| Module | File | Status | Tests |
|--------|------|--------|-------|
| **App** | `src/app.controller.spec.ts` | ✅ Implemented | Controller tests |
| **Auth** | `src/auth/auth.controller.spec.ts` | ✅ Implemented | Login, registration, JWT |
| | `src/auth/auth.service.spec.ts` | ✅ Implemented | User auth logic |
| **Attendance** | `src/attendance/attendance.controller.spec.ts` | ✅ Implemented | Attendance endpoints |
| | `src/attendance/attendance.service.spec.ts` | ✅ Implemented | Attendance business logic |
| **Session** | `src/session/session.controller.spec.ts` | ✅ Implemented | Session management |
| | `src/session/session.service.spec.ts` | ✅ Implemented | Session service logic |
| **Dashboard** | `src/dashboard/dashboard.controller.spec.ts` | ✅ Implemented | Dashboard endpoints |
| | `src/dashboard/dashboard.service.spec.ts` | ✅ Implemented | Dashboard analytics |
| **Offline** | `src/offline/offline.controller.spec.ts` | ✅ Implemented | Offline sync endpoints |
| | `src/offline/offline.service.spec.ts` | ✅ Implemented | Offline sync logic |

---

### Integration Tests

Run E2E tests:
```bash
npm run test:e2e
```

E2E test configuration file: `test/jest-e2e.json`

E2E test specification: `test/app.e2e-spec.ts`

---

### Test Coverage

Generate coverage report:
```bash
npm run test:cov
```

This generates a coverage directory with:
- HTML report: `coverage/index.html`
- Coverage summary showing:
  - Line coverage
  - Branch coverage
  - Function coverage
  - Statement coverage

Target coverage: **80%+ for all modules**

---
## Oracle database inserting roles

INSERT INTO "roles" ("id", "name", "display_name") VALUES 
  (SYS_GUID(), 'admin', 'Administrator');

INSERT INTO "roles" ("id", "name", "display_name") VALUES 
  (SYS_GUID(), 'teacher', 'Teacher');

INSERT INTO "roles" ("id","name","display_name") VALUES (SYS_GUID(),'invigilator','Invigilator');  

COMMIT;

## API Endpoints Reference

### Authentication Module (`/auth`)

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "first_name": "Alice",
  "last_name": "Smith",
  "email": "alice@example.com",
  "password": "secure_password_123",
  "role": "teacher"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "alice@example.com",
  "first_name": "Alice",
  "last_name": "Smith",
  "role": "teacher",
  "created_at": "2026-04-30T10:00:00Z"
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secure_password_123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 604800
}
```

#### Get User Profile
```
GET /auth/profile
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": "uuid",
  "email": "alice@example.com",
  "first_name": "Alice",
  "last_name": "Smith",
  "role": "teacher"
}
```

#### Change Password
```
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "old_password": "secure_password_123",
  "new_password": "new_secure_password_456"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

---

### Session Module (`/session`)

#### Create Course
```
POST /session/course
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "CS101",
  "name": "Introduction to Computer Science"
}

Response: 201 Created
{
  "id": "uuid",
  "code": "CS101",
  "name": "Introduction to Computer Science",
  "created_at": "2026-04-30T10:00:00Z"
}
```

#### List Courses
```
GET /session/course
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": "uuid",
    "code": "CS101",
    "name": "Introduction to Computer Science"
  },
  ...
]
```

#### Update Course
```
PUT /session/course/<course_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "code": "CS101",
  "name": "Intro to CS - Updated"
}

Response: 200 OK
{
  "id": "uuid",
  "code": "CS101",
  "name": "Intro to CS - Updated"
}
```

#### Create Session
```
POST /session
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Final Exam - CS101",
  "venue": "Hall A",
  "scheduled_start": "2026-05-01T09:00:00Z",
  "scheduled_end": "2026-05-01T12:00:00Z",
  "course_id": "<course_uuid>"
}

Response: 201 Created
{
  "id": "uuid",
  "title": "Final Exam - CS101",
  "venue": "Hall A",
  "scheduled_start": "2026-05-01T09:00:00Z",
  "scheduled_end": "2026-05-01T12:00:00Z",
  "status": "upcoming",
  "course_id": "<course_uuid>"
}
```

#### List Sessions
```
GET /session
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Final Exam - CS101",
    "venue": "Hall A",
    "status": "upcoming",
    "scheduled_start": "2026-05-01T09:00:00Z",
    "scheduled_end": "2026-05-01T12:00:00Z"
  },
  ...
]
```

#### Update Session
```
PUT /session/<session_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Final Exam - CS101 - Updated",
  "venue": "Hall B"
}

Response: 200 OK
{
  "id": "uuid",
  "title": "Final Exam - CS101 - Updated",
  "venue": "Hall B"
}
```

#### Enroll Students in Session
```
POST /session/<session_id>/enroll
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "students": [
    {
      "student_number": "BIT/COM/13/24",
      "full_name": "Alice Smith"
    },
    {
      "student_number": "BIT/COM/15/24",
      "full_name": "Bob Johnson"
    }
  ]
}

Response: 201 Created
{
  "enrolled_count": 2,
  "session_id": "uuid",
  "students": [...]
}
```

---

### Attendance Module (`/attendance`)

#### Mark Attendance
```
POST /attendance/mark
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "session_id": "uuid",
  "student_id": "uuid",
  "status": "present",
  "method": "biometric"
}

Response: 201 Created
{
  "id": "uuid",
  "session_id": "uuid",
  "session_student_id": "uuid",
  "status": "present",
  "method": "biometric",
  "timestamp": "2026-05-01T09:15:00Z"
}
```

#### Get Attendance Records
```
GET /attendance/bulk?session_id=<uuid>&status=present
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": "uuid",
    "session_id": "uuid",
    "session_student_id": "uuid",
    "status": "present",
    "method": "biometric",
    "timestamp": "2026-05-01T09:15:00Z"
  },
  ...
]
```

#### Bulk Mark Attendance
```
POST /attendance/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "session_id": "uuid",
  "records": [
    {
      "session_student_id": "uuid1",
      "status": "present"
    },
    {
      "session_student_id": "uuid2",
      "status": "absent"
    }
  ]
}

Response: 201 Created
{
  "marked_count": 2,
  "records": [...]
}
```

#### Update Attendance Record
```
PUT /attendance/<attendance_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "late"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "late",
  "updated_at": "2026-05-01T10:00:00Z"
}
```

#### Get Attendance Report
```
GET /attendance/report/<session_id>
Authorization: Bearer <access_token>

Response: 200 OK
{
  "session_id": "uuid",
  "total_enrolled": 50,
  "present": 45,
  "absent": 3,
  "late": 2,
  "attendance_rate": "90%"
}
```

---

### Dashboard Module (`/dashboard`)

#### Get Active Session Stats
```
GET /dashboard/active-session
Authorization: Bearer <access_token>

Response: 200 OK
{
  "session_id": "uuid",
  "session_title": "Final Exam - CS101",
  "total_enrolled": 50,
  "present_count": 35,
  "absent_count": 10,
  "late_count": 5,
  "in_progress": true
}
```

#### Get Session Statistics
```
GET /dashboard/session/<session_id>/stats
Authorization: Bearer <access_token>

Response: 200 OK
{
  "session_id": "uuid",
  "session_title": "Final Exam - CS101",
  "venue": "Hall A",
  "status": "completed",
  "total_enrolled": 50,
  "present": 45,
  "absent": 3,
  "late": 2,
  "attendance_rate": "90%",
  "duration": "3 hours"
}
```

#### Get Overall Statistics
```
GET /dashboard/statistics
Authorization: Bearer <access_token>

Response: 200 OK
{
  "total_sessions": 10,
  "completed_sessions": 8,
  "active_sessions": 1,
  "upcoming_sessions": 1,
  "total_students": 150,
  "average_attendance_rate": "87.5%"
}
```

---

### Offline Module (`/offline`)

#### Sync Offline Data
```
POST /offline/sync
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "attendance_records": [
    {
      "session_id": "uuid",
      "session_student_id": "uuid",
      "status": "present",
      "timestamp": "2026-05-01T09:15:00Z"
    }
  ],
  "last_sync": "2026-04-30T18:00:00Z"
}

Response: 200 OK
{
  "synced": true,
  "records_processed": 1,
  "sync_timestamp": "2026-05-01T10:00:00Z"
}
```

---

## Testing Workflows

### Workflow 1: Complete Authentication & Session Setup

1. **Register a Teacher**
   ```bash
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "John",
       "last_name": "Doe",
       "email": "john@example.com",
       "password": "teacher123",
       "role": "teacher"
     }'
   ```

2. **Login and Get Token**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "teacher123"
     }'
   ```
   Save the `access_token` from response.

3. **Create a Course**
   ```bash
   curl -X POST http://localhost:3000/session/course \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "code": "CS101",
       "name": "Introduction to Computer Science"
     }'
   ```
   Save the course `id`.

4. **Create a Session**
   ```bash
   curl -X POST http://localhost:3000/session \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Midterm Exam",
       "venue": "Hall A",
       "scheduled_start": "2026-05-01T09:00:00Z",
       "scheduled_end": "2026-05-01T12:00:00Z",
       "course_id": "<COURSE_ID>"
     }'
   ```
   Save the session `id`.

5. **Enroll Students**
   ```bash
   curl -X POST http://localhost:3000/session/<SESSION_ID>/enroll \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "students": [
         {"student_number": "BIT001", "full_name": "Alice"},
         {"student_number": "BIT002", "full_name": "Bob"},
         {"student_number": "BIT003", "full_name": "Charlie"}
       ]
     }'
   ```

---

### Workflow 2: Attendance Marking & Reporting

1. **Mark Individual Attendance**
   ```bash
   curl -X POST http://localhost:3000/attendance \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "<SESSION_ID>",
       "student_id": "<STUDENT_ID>",
       "status": "present",
       "method": "biometric"
     }'
   ```

2. **Bulk Mark Attendance**
   ```bash
   curl -X POST http://localhost:3000/attendance/bulk \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "<SESSION_ID>",
       "records": [
         {"student_id": "<ID1>", "status": "present"},
         {"student_id": "<ID2>", "status": "absent"},
         {"student_id": "<ID3>", "status": "late"}
       ]
     }'
   ```

3. **Get Attendance Report**
   ```bash
   curl -X GET http://localhost:3000/attendance/report/<SESSION_ID> \
     -H "Authorization: Bearer <TOKEN>"
   ```

---

### Workflow 3: Dashboard Analytics

1. **View Active Session Stats**
   ```bash
   curl -X GET http://localhost:3000/dashboard/active-session \
     -H "Authorization: Bearer <TOKEN>"
   ```

2. **View Session-Specific Stats**
   ```bash
   curl -X GET http://localhost:3000/dashboard/session/<SESSION_ID>/stats \
     -H "Authorization: Bearer <TOKEN>"
   ```

3. **View Overall Statistics**
   ```bash
   curl -X GET http://localhost:3000/dashboard/statistics \
     -H "Authorization: Bearer <TOKEN>"
   ```

---

### Workflow 4: Offline Sync

1. **Collect Offline Records Locally** (Mobile device or offline instance)

2. **Sync When Connected**
   ```bash
   curl -X POST http://localhost:3000/offline/sync \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "attendance_records": [
         {
           "session_id": "<SESSION_ID>",
           "student_id": "<STUDENT_ID>",
           "status": "present",
           "timestamp": "2026-05-01T09:15:00Z"
         }
       ],
       "last_sync": "2026-04-30T18:00:00Z"
     }'
   ```

---

## Running Specific Module Tests

### Auth Module Tests
```bash
npm run test -- auth.controller.spec.ts
npm run test -- auth.service.spec.ts
```

### Attendance Module Tests
```bash
npm run test -- attendance.controller.spec.ts
npm run test -- attendance.service.spec.ts
```

### Session Module Tests
```bash
npm run test -- session.controller.spec.ts
npm run test -- session.service.spec.ts
```

### Dashboard Module Tests
```bash
npm run test -- dashboard.controller.spec.ts
npm run test -- dashboard.service.spec.ts
```

### Offline Module Tests
```bash
npm run test -- offline.controller.spec.ts
npm run test -- offline.service.spec.ts
```

---

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Oracle Database
```
Error: ORA-12514: TNS:listener does not currently know of service requested in connect descriptor
```

**Solution**:
1. Verify Oracle is running: `lsnrctl status`
2. Check database is open: `ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;`
3. Verify credentials in `.env`
4. Restart listener: `lsnrctl stop` then `lsnrctl start`

---

### Port Already in Use

**Problem**: Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run start:dev
```

---

### Test Failures

**Problem**: Tests fail with database connection error

**Solution**:
1. Ensure database is running
2. Check credentials in `.env` match database setup
3. Run migrations if needed
4. Clear test database: `npm run test -- --clearCache`

---

### JWT Authentication Issues

**Problem**: 401 Unauthorized on protected endpoints

**Solution**:
1. Verify token is valid: Check expiration time
2. Ensure token format: `Authorization: Bearer <token>`
3. Check JWT_SECRET in `.env` matches
4. Re-login to get a new token

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Build project | `npm run build` |
| Start dev server | `npm run start:dev` |
| Start production | `npm run start:prod` |
| Run all tests | `npm run test` |
| Run tests (watch) | `npm run test:watch` |
| Coverage report | `npm run test:cov` |
| Debug mode | `npm run start:debug` |
| Lint code | `npm run lint` |
| Format code | `npm run format` |
| E2E tests | `npm run test:e2e` |

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Oracle Database Documentation](https://docs.oracle.com)
- [JWT Authentication](https://jwt.io)
- [Jest Testing](https://jestjs.io)

---





