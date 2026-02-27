# Database Configuration

## Overview
This folder contains all database-related files for the Expense Tracker application.

## Folders

### seeds/
Contains seed scripts to populate the database with initial data:
- Default categories
- Sample transactions (for testing)
- Sample users

### migrations/
Contains database migration scripts for:
- Schema changes
- Table modifications
- Data transformations

## Database Details

- **Type**: MySQL
- **Database Name**: expense_tracker
- **Connection**: localhost:3306
- **User**: root
- **Tables**:
  - Users
  - Categories
  - Transactions
  - Budgets

## Useful Commands

### View Database
```bash
mysql -u root -e "USE expense_tracker; SHOW TABLES;"
```

### Backup Database
```bash
mysqldump -u root expense_tracker > expense_tracker_backup.sql
```

### Restore Database
```bash
mysql -u root expense_tracker < expense_tracker_backup.sql
```

### Check Database Status
```bash
mysql -u root -e "SELECT DATABASE(); SHOW TABLES;" -D expense_tracker
```
