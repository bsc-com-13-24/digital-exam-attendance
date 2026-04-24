# ORACLE DATABASE CREATION

## 1. Creating a pragable database in oracle

*    **THOSE THAT HAVE INSTALLED SQL PLUS**

    CREATE PLUGGABLE DATABASE digital_attendance_pdb
    ADMIN USER digital_admin IDENTIFIED BY digitalpassword
    FILE_NAME_CONVERT = (
        'C:\oracle\oradata\XE\pdbseed\',
        'C:\oracle\oradata\XE\digital_attendance_pdb\'
    );

 *   **THOSE USING DOCKER**

    CREATE PLUGGABLE DATABASE digital_attendance_pdb
    ADMIN USER digital_admin IDENTIFIED BY digitalpassword
    FILE_NAME_CONVERT = (
        '/opt/oracle/oradata/XE/pdbseed/',
        '/opt/oracle/oradata/XE/digital_attendance_pdb/'
    );

*   **OPENING THE DATABASE AND SAVING IT'S STATE**
    ALTER PLUGGABLE DATABASE digital_attendance_pdb OPEN;
    ALTER PLUGGABLE DATABASE digital_attendance_pdb SAVE STATE;

*   **INSIDE OUR DATABASE CREATING THE USER**
    ALTER SESSION SET CONTAINER = digital_attendance_pdb;

    CREATE USER digital_user IDENTIFIED BY digitalpassword;
    GRANT CONNECT, RESOURCE, DBA TO digital_user;

*   **CHECKING IF OUR USER IS CREATED**
    SELECT username FROM dba_users WHERE username = 'DIGITAL_USER';

    METHOD: POST 
    URL: http://localhost:3000/auth/register
    BODY:
    {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@example.com",
        "password": "secret123",
        "role": "teacher"
    }

    METHOD: POST
    URL: http://localhost:3000/auth/login
    BODY:
    {
        "email":    "john@test.com",
        "password": "1234"
    }
    copy the access token from it

    METHOD: GET
    URL: http://localhost:3000/auth/profile
    Go to authorization , then on type select Bearer token and paste the copied access token above. then send the request

    ### Create Course
- **Method**: `POST`
- **Endpoint**: `/session/course`
- **Auth**: Required (Admin/Teacher)
- **Body**:
```json
{
  "code": "CS101",
  "name": "Introduction to Computer Science"
}
```

### Create Session
- **Method**: `POST`
- **Endpoint**: `/session`
- **Auth**: Required (Admin/Teacher)
- **Body**:
```json
{
  "title": "Final Exam - CS101",
  "venue": "Hall A",
  "scheduled_start": "2026-05-01T09:00:00Z",
  "scheduled_end": "2026-05-01T12:00:00Z",
  "course_id": "<uuid_of_created_course>"
}
```
 **Method**: `POST`
- **Endpoint**: `/api/v1/session/<session_id>/enrolL`
- **Auth**: Required (Admin/Teacher)
- **Body**:
```json
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

 **Method**: `POST`
- **Endpoint**: `/api/v1/attendance/mark`
- **Auth**: Required (Admin/Teacher)
- **Body**:
```json
{
  "session_id": "<session_id>",
  "session_student_id": "<uuid_from_enroll_response>",
  "status": "present",
  "method": "scan"
}





