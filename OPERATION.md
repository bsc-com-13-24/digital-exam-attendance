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
        "password": "secret123"
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



Inspecting session and auth authorization structure so the guidance is specific.

Read [](file:///home/allan/DEV/WEB-LAB/digital-exam-attendance/digital-exam-attendance/src/session/session.controller.ts)

Searched for regex `createSession|create-session|@Post\(|@UseGuards\(|Role|roles|UserRole|AuthGuard\('jwt'\)|JwtStrategy` (`**/src/**/*.{ts}`), 83 results

Read [](file:///home/allan/DEV/WEB-LAB/digital-exam-attendance/digital-exam-attendance/src/session/session.module.ts)

## What you need to do

Right now, `/session` is completely open:

- `SessionController.create()` has no guard
- it accepts `CreateSessionDto` directly
- anyone can call it if they know the URL

So to ensure only authorized users can create sessions, you need two things:

1. authenticate the request
2. authorize based on user identity/role

---

## Step 1: require JWT auth for session creation

Protect the session creation route with the same JWT guard you already use in auth routes.

In other words:
- add `@UseGuards(AuthGuard('jwt'))` to `SessionController.create()`
- read `req.user` from the validated token

That ensures only requests with a valid bearer token can reach `createSession()`.

---

## Step 2: tie the session to the creator

Then make the session creation logic record who created it:
- add an owner field to the session entity, e.g. `created_by` or `creator_id`
- when creating a session, save `req.user.userId` along with the session data

This gives you a trusted “who created this session” value.

---

## Step 3: enforce authorization for future updates/deletes

If you want “only the creator can modify or delete their session”, then:
- on update/delete routes, also require `AuthGuard('jwt')`
- load the session and compare its owner to `req.user.userId`
- reject the request if they do not match

That makes it “only the user who created it can change it”.

---

## Step 4: optionally restrict creation to certain roles

If you want only specific users to create sessions (for example teachers/admins), use role-based authorization:

- assign roles to users in `auth/entities/roles.entity.ts` and `user_roles`
- add a role guard or simple check in session creation
- allow only users with `role === 'teacher'` or `role === 'admin'` to create sessions

This is the best pattern when not every authenticated user should create sessions.

---

## In plain terms

- Authentication = prove the request is from a logged-in user
- Authorization = prove that logged-in user is allowed to do this action
- For session creation:
  - require JWT auth
  - record who created the session
  - check owner or role before allowing changes

If you want, I can next explain exactly where to add `@UseGuards(AuthGuard('jwt'))` and how to pass `req.user` into your session service.