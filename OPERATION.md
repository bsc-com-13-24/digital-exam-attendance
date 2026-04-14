# ORACLE DATABASE CREATION

## 1. Creating a pragable database in oracle

*    **THOSE THAT HAVE INSTALLED SQL PLUS**

    CREATE PLUGGABLE DATABASE digital_attendance_pdb
    ADMIN USER digital_admin IDENTITFIED BY digitalpassword
    FILE_NAME_CONVERT = (
        'C:\oracle\oradata\XE\pdbseed\',
        'C:\oracle\oradata\XE\digital_attendance_pdb\'
    );

 *   **THOSE USING DOCKER**

    CREATE PLUGGABLE DATABASE digital_attendance_pdb
    ADMIN USER digital_admin IDENTITFIED BY digitalpassword
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



