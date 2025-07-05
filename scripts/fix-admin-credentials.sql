-- Fix admin credentials - ensure admin user exists with correct password
-- This script can be run multiple times safely

-- First, let's make sure the admin_users table exists
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delete existing admin user if exists
DELETE FROM admin_users WHERE email = 'admin@mashelectronics.com';

-- Insert fresh admin user with correct credentials
INSERT INTO admin_users (email, password_hash, full_name, phone, role) VALUES
('admin@mashelectronics.com', 'admin123', 'System Administrator', '+254700123456', 'admin');

-- Also ensure customer demo user exists
DELETE FROM users WHERE email = 'customer@example.com';

INSERT INTO users (email, password_hash, full_name, phone, address, role) VALUES
('customer@example.com', 'demo123', 'John Doe', '+254700987654', 'Nairobi, Kenya', 'customer');

-- Verify the admin user was created
SELECT email, full_name, role FROM admin_users WHERE email = 'admin@mashelectronics.com';
SELECT email, full_name, role FROM users WHERE email = 'customer@example.com';
