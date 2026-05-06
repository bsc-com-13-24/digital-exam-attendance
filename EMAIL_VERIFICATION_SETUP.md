# Email Verification Enhancement Guide

## Overview

Enhanced email verification system ensures that only users with valid, verified emails can access the system. Users must verify their email before they can login.

## What's New

### 1. **Email Verification Required**

- New users must verify their email before accessing the system
- A verification token is sent to the user's email during registration
- Users have 24 hours to verify their email

### 2. **Database Schema Changes**

The `users` table now includes:

- `email_verified` (BOOLEAN, default: false) - Whether the email has been verified
- `verification_token` (VARCHAR2) - Token for email verification
- `verification_token_expiry` (TIMESTAMP) - Expiration time of the verification token

### 3. **New User Fields in User Entity**

```typescript
@Column({ name: 'email_verified', default: false })
email_verified!: boolean;

@Column({ name: 'verification_token', length: 500, nullable: true })
verification_token!: string | null;

@Column({ name: 'verification_token_expiry', type: 'timestamp', nullable: true })
verification_token_expiry!: Date | null;
```

## API Endpoints

### 1. **Register User** (Public)

**POST** `/api/v1/auth/register`

- Creates a new user account
- Generates verification token
- Sends verification email
- **Response**: Message with verification email sent confirmation

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response**:

```json
{
  "message": "User registered successfully. A verification email has been sent to john@example.com. Please verify your email to access the system.",
  "userId": "uuid-here"
}
```

### 2. **Verify Email** (Public)

**GET** `/api/v1/auth/verify-email?token=TOKEN`

- Verifies user's email using the token from the verification email
- **Query Params**:
  - `token` (required): Verification token received via email

**Response**:

```json
{
  "message": "Email verified successfully! You can now login to the system."
}
```

### 3. **Login** (Public)

**POST** `/api/v1/auth/login`

- User can only login if email is verified
- **Request**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response on Success**:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response if Email Not Verified**:

```json
{
  "statusCode": 401,
  "message": "Email is not verified. Please check your email for the verification link or request a new one."
}
```

### 4. **Resend Verification Email** (Public)

**POST** `/api/v1/auth/resend-verification-email`

- Resends verification email if the previous one expired or was lost
- **Request**:

```json
{
  "email": "john@example.com"
}
```

**Response**:

```json
{
  "message": "A new verification email has been sent to john@example.com"
}
```

## User Flow

```
1. User Registers
   ↓
2. System validates email domain
   ↓
3. User account created with email_verified = false
   ↓
4. Verification token generated (expires in 24 hours)
   ↓
5. Verification email sent to user (logged to console in dev)
   ↓
6. User clicks verification link from email
   ↓
7. Email verified successfully
   ↓
8. User can now login
```

## Testing in Swagger UI

### Step 1: Register User

1. Go to `http://localhost:3000/api/docs`
2. Find **POST /api/v1/auth/register**
3. Click "Try it out"
4. Enter user details:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "test@example.com",
  "password": "Test123456"
}
```

5. Click Execute
6. Copy the `userId` from response

### Step 2: Get Verification Token

1. Open the server console/logs
2. Look for the verification link output:

```
========================================
EMAIL VERIFICATION
========================================
To: test@example.com
Verification Link: http://localhost:3000/api/v1/auth/verify-email?token=abc123...
Token: abc123...
Valid for: 24 hours
========================================
```

3. Copy the token

### Step 3: Verify Email

1. Find **GET /api/v1/auth/verify-email**
2. Click "Try it out"
3. Enter the token in the `token` query parameter
4. Click Execute
5. You should see: "Email verified successfully! You can now login to the system."

### Step 4: Login

1. Find **POST /api/v1/auth/login**
2. Click "Try it out"
3. Enter credentials:

```json
{
  "email": "test@example.com",
  "password": "Test123456"
}
```

4. Click Execute
5. Copy the `access_token` from response
6. Click "Authorize" button at the top and paste the token
7. Now you can test protected endpoints!

### Step 5 (Optional): Resend Verification Email

If verification email is lost:

1. Find **POST /api/v1/auth/resend-verification-email**
2. Click "Try it out"
3. Enter email:

```json
{
  "email": "test@example.com"
}
```

4. Execute and get new verification link from console

## Email Configuration (Production)

Currently, verification emails are logged to console. For production, integrate with an email service:

### Option 1: Nodemailer (Recommended)

```bash
npm install nodemailer
```

Update `sendVerificationEmail` method in [auth.service.ts](src/auth/auth.service.ts#L133):

```typescript
private async sendVerificationEmail(email: string, token: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationLink = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Email Verification Required</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>Link expires in 24 hours.</p>
    `,
  });
}
```

### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

### Option 3: AWS SES

```bash
npm install aws-sdk
```

## Database Migration

For existing databases, run this SQL to add the new columns:

### Oracle Database

```sql
ALTER TABLE users ADD (
  email_verified NUMBER(1) DEFAULT 0,
  verification_token VARCHAR2(500),
  verification_token_expiry TIMESTAMP
);
```

### PostgreSQL

```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(500);
ALTER TABLE users ADD COLUMN verification_token_expiry TIMESTAMP;
```

### MySQL

```sql
ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(500);
ALTER TABLE users ADD COLUMN verification_token_expiry TIMESTAMP;
```

## Error Handling

| Scenario                    | Status | Message                                                                                        |
| --------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| Invalid email format        | 400    | Email must be a valid address                                                                  |
| Email domain not valid      | 400    | Email domain is not valid or cannot be verified                                                |
| Email already registered    | 400    | Email is already registered                                                                    |
| Invalid token               | 400    | Invalid verification token                                                                     |
| Token expired               | 400    | Verification token has expired. Please request a new verification email.                       |
| Email not verified on login | 401    | Email is not verified. Please check your email for the verification link or request a new one. |
| Email already verified      | 400    | Email is already verified                                                                      |

## Security Features

✅ **Email domain validation** - Verifies the email domain has valid MX/A records
✅ **Token expiration** - Verification tokens expire after 24 hours
✅ **Secure tokens** - Uses cryptographic randomBytes for token generation
✅ **Email verification required** - No access without verified email
✅ **One-time use** - Tokens are cleared after successful verification
✅ **Rate limiting ready** - Can be extended with rate limiting guards

## Next Steps

1. **Run database migrations** to add the new columns
2. **Configure email service** (Nodemailer, SendGrid, etc.)
3. **Update environment variables** with email credentials
4. **Test the flow** using Swagger UI
5. **Deploy to production** with email service configured
