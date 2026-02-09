/* =========================================================
   Database: EmployeeManagementDB
   Purpose : Employee Management System (ADO.NET)
   ========================================================= */

-- Create database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EmployeeManagementDB')
BEGIN
    CREATE DATABASE EmployeeManagementDB;
END
GO

USE EmployeeManagementDB;
GO

/* =========================
   Table: Employee
   ========================= */

IF OBJECT_ID('dbo.Employee', 'U') IS NOT NULL
    DROP TABLE dbo.Employee;
GO

CREATE TABLE dbo.Employee
(
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Salary DECIMAL(18,2) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL
);
GO

/* =========================
   Stored Procedure: Add Employee
   ========================= */

IF OBJECT_ID('dbo.sp_AddEmployee', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_AddEmployee;
GO

CREATE PROCEDURE dbo.sp_AddEmployee
    @Name NVARCHAR(100),
    @Salary DECIMAL(18,2),
    @Department NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Employee (Name, Salary, Department)
    VALUES (@Name, @Salary, @Department);

    SELECT SCOPE_IDENTITY() AS NewId;
END;
GO

/* =========================
   Stored Procedure: Update Employee
   ========================= */

IF OBJECT_ID('dbo.sp_UpdateEmployee', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_UpdateEmployee;
GO

CREATE PROCEDURE dbo.sp_UpdateEmployee
    @Id INT,
    @Name NVARCHAR(100),
    @Salary DECIMAL(18,2),
    @Department NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Employee
    SET Name = @Name,
        Salary = @Salary,
        Department = @Department,
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
END;
GO

/* =========================
   Stored Procedure: Delete Employee
   ========================= */

IF OBJECT_ID('dbo.sp_DeleteEmployee', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_DeleteEmployee;
GO

CREATE PROCEDURE dbo.sp_DeleteEmployee
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.Employee WHERE Id = @Id)
    BEGIN
        DELETE FROM dbo.Employee WHERE Id = @Id;
    END
END;
GO

/* =========================
   Stored Procedure: Get Employees (With Filters)
   ========================= */

IF OBJECT_ID('dbo.sp_GetEmployees', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetEmployees;
GO

CREATE PROCEDURE dbo.sp_GetEmployees
    @Id INT = NULL,
    @Name NVARCHAR(100) = NULL,
    @Department NVARCHAR(100) = NULL,
    @Salary DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        Department,
        Salary,
        CreatedDate,
        UpdatedDate
    FROM dbo.Employee
    WHERE (@Id IS NULL OR Id = @Id)
      AND (@Name IS NULL OR Name LIKE '%' + @Name + '%')
      AND (@Department IS NULL OR Department LIKE '%' + @Department + '%')
      AND (@Salary IS NULL OR Salary = @Salary)
    ORDER BY Id DESC;
END;
GO
