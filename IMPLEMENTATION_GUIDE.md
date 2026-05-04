# Digital Exam Attendance System - Implementation Guide

Welcome to the backend implementation guide for the Digital Exam Attendance System! This document explains exactly what we have built, how each module functions, and highlights the "trick stuff" (advanced logic and clever programming techniques) that make this system robust, secure, and production-ready.

---

## 1. Attendance Module (`src/attendance`)

**What it does:**
This is the core engine for recording when students show up for their exams. It handles single attendance marking, bulk marking, updating records, and generating reports.

**The "Trick Stuff" (Advanced Logic):**
*   **The Two-Scan Logic:** To prevent students from checking in and immediately leaving, we implemented a clever state machine based on scanning. 
    *   **First Scan:** The system checks the current time (`now`) against the exam's `scheduled_start`. If the student is on time, they are marked **`PRESENT`**. If they are late, they are marked **`LATE`**.
    *   **Second Scan:** When the student leaves, they are scanned again, and the status updates to **`COMPLETED`**. If they scan a third time, the system throws a `ConflictException` to prevent tampering.
*   **Immutable Audit Logging:** Every time an attendance record is created or updated, a hidden `AuditLog` entry is generated (`logAudit()`). It records *who* made the change, *when*, and *what* was changed. This ensures full accountability for invigilators and prevents unauthorized tampering with exam records.

---

## 2. Authentication Module (`src/auth`)

**What it does:**
Manages user identity, registration, login, and profile management for the system (e.g., Admins, Invigilators, Lecturers).

**The "Trick Stuff" (Advanced Logic):**
*   **Stateless JWT Authentication:** Instead of storing active sessions in the database (which slows down the system), we sign a JSON Web Token (JWT) containing the user's ID and email. This allows the backend to securely and instantly verify the user on every request without querying the database twice.
*   **Secure Password Hashing:** We never store plain-text passwords. We use `bcrypt` to salt and hash passwords. Even if the database is compromised, the attackers cannot read the passwords.
*   **Dynamic Role Binding:** During user creation, the system automatically looks up the requested role (e.g., "invigilator") and binds it using a mapping table (`UserRole`). This sets us up perfectly for Role-Based Access Control (RBAC) across the app.

---

## 3. Session Module (`src/session`)

**What it does:**
Manages the exam sessions, the courses they belong to, and the enrollment of students into specific exams.

**The "Trick Stuff" (Advanced Logic):**
*   **Automated State Machine (CRON Jobs):** We built a background worker (`SessionSchedulerService`) that runs every single minute using NestJS's `@Cron` decorator. 
    *   It automatically moves sessions from `upcoming` to `active` when the exam time starts.
    *   It automatically moves them to `expired` when the time ends. 
    *   *Why this is cool:* Admins never have to manually "open" or "close" an exam. The system enforces the time window strictly and automatically.
*   **Bulk Enrollment with Deduplication:** When importing hundreds of students into an exam, the system doesn't just blindly insert them. It verifies if they are already enrolled (`findOne`), filters out duplicates, and batches the inserts into a single array before calling `.save()`. This minimizes database load and prevents duplicate key errors.

---

## 4. Offline Sync Module (`src/offline`)

**What it does:**
Exam halls often have terrible internet connections. This module allows the mobile/tablet app to record attendance locally and sync it back to the main database once the internet is restored.

**The "Trick Stuff" (Advanced Logic):**
*   **ACID Database Transactions:** We used TypeORM's `QueryRunner` to execute the sync inside a secure database transaction. If the database crashes mid-sync, the transaction is rolled back, preventing corrupted or half-saved data.
*   **Fault-Tolerant Batch Processing:** Instead of failing the entire batch if one student's record is invalid, we placed a `try-catch` block *inside* the processing loop. If a specific record fails (e.g., the student wasn't registered), the system catches the error, logs the failure reason, and seamlessly continues syncing the remaining valid records. It then returns a detailed report (`successCount`, `failureCount`, and an array of specific `failures`) to the frontend.

---

## 5. Dashboard Module (`src/dashboard`)

**What it does:**
Provides real-time high-level statistics and metrics for the frontend admin dashboard.

**The "Trick Stuff" (Advanced Logic):**
*   **Database-Level Aggregation:** Instead of loading all session entities into the server's memory (`.find()`) and counting them in JavaScript (which would crash the server if there were thousands of records), we use the database's native `.count()` method. The heavy lifting is offloaded to the database engine, resulting in instant dashboard load times and near-zero memory consumption on the Node.js server.

---

### Summary for your friends:
We didn't just build a simple CRUD (Create, Read, Update, Delete) app. We built a system with **background automation (Cron)**, **offline-first capabilities with fault-tolerant syncing**, **immutable audit trails**, and **time-aware two-scan logic** to ensure absolute data integrity during exams.
