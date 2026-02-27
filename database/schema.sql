-- Expense Tracker Database Schema
-- Created: February 27, 2026
-- Database: expense_tracker

-- =====================================================
-- TABLE: Users
-- =====================================================
CREATE TABLE IF NOT EXISTS `Users` (
  `id` CHAR(36) BINARY PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `monthlyBudget` DECIMAL(10,2) DEFAULT 0,
  `currency` VARCHAR(255) DEFAULT 'USD',
  `theme` ENUM('light', 'dark') DEFAULT 'light',
  `notificationsEnabled` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: Categories
-- =====================================================
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` CHAR(36) BINARY PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(200),
  `icon` VARCHAR(255) DEFAULT '📁',
  `color` VARCHAR(255) DEFAULT '#3B82F6',
  `type` ENUM('income', 'expense', 'both') DEFAULT 'both',
  `userId` CHAR(36) BINARY,
  `isDefault` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_type` (`type`),
  INDEX `categories_user_id_name` (`userId`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: Transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS `Transactions` (
  `id` CHAR(36) BINARY PRIMARY KEY,
  `userId` CHAR(36) BINARY NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `categoryId` CHAR(36) BINARY NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `date` DATETIME NOT NULL,
  `paymentMethod` ENUM('cash', 'card', 'bank_transfer', 'other') DEFAULT 'cash',
  `tags` JSON,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `idx_category_id` (`categoryId`),
  INDEX `transactions_user_id_date` (`userId`, `date`),
  INDEX `transactions_user_id_category_id` (`userId`, `categoryId`),
  INDEX `transactions_user_id_type` (`userId`, `type`),
  INDEX `transactions_user_id_date_type` (`userId`, `date`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: Budgets
-- =====================================================
CREATE TABLE IF NOT EXISTS `Budgets` (
  `id` CHAR(36) BINARY PRIMARY KEY,
  `userId` CHAR(36) BINARY NOT NULL,
  `categoryId` CHAR(36) BINARY,
  `amount` DECIMAL(10,2) NOT NULL,
  `month` DATETIME NOT NULL,
  `spent` DECIMAL(10,2) DEFAULT 0,
  `isMonthly` TINYINT(1) DEFAULT 1,
  `alertThreshold` INTEGER DEFAULT 80,
  `notified` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_user_id` (`userId`),
  INDEX `budgets_user_id_month_category_id` (`userId`, `month`, `categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES SUMMARY
-- =====================================================
-- Users:
--   - idx_email: For quick email lookups during login
--
-- Categories:
--   - idx_user_id: For fetching user's categories
--   - idx_type: For filtering by income/expense
--   - categories_user_id_name: For user-specific category lookups
--
-- Transactions:
--   - idx_user_id: For fetching user's transactions
--   - idx_category_id: For category-based filtering
--   - transactions_user_id_date: For date range queries
--   - transactions_user_id_type: For income/expense filtering
--   - transactions_user_id_date_type: For combined date and type filtering
--
-- Budgets:
--   - idx_user_id: For fetching user's budgets
--   - budgets_user_id_month_category_id: For monthly budget tracking

-- =====================================================
-- CHARACTER SET
-- =====================================================
-- All tables use UTF8MB4 for full Unicode support including emojis
-- All fields use COLLATE utf8mb4_unicode_ci for consistent sorting
