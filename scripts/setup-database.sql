-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create users table for customer authentication
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for admin authentication
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  order_status VARCHAR(20) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo admin user (update existing or insert new)
INSERT INTO admin_users (email, password_hash, full_name, phone, role) VALUES
('admin@mashelectronics.com', 'admin123', 'System Administrator', '+254700123456', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'admin123',
  full_name = 'System Administrator',
  phone = '+254700123456',
  role = 'admin';

-- Insert demo customer user (update existing or insert new)
INSERT INTO users (email, password_hash, full_name, phone, address, role) VALUES
('customer@example.com', 'demo123', 'John Doe', '+254700987654', 'Nairobi, Kenya', 'customer')
ON CONFLICT (email) DO UPDATE SET
  password_hash = 'demo123',
  full_name = 'John Doe',
  phone = '+254700987654',
  address = 'Nairobi, Kenya',
  role = 'customer';

-- Insert sample products with better data
INSERT INTO products (name, description, price, image_url, category, stock_quantity, featured) VALUES
('iPhone 15 Pro Max', 'Latest Apple iPhone with titanium design, A17 Pro chip, and advanced camera system. Features 6.7-inch Super Retina XDR display.', 1299.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 'Smartphones', 25, true),
('Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen, AI features, 200MP camera, and stunning 6.8-inch Dynamic AMOLED display.', 1199.99, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 'Smartphones', 30, true),
('MacBook Pro 16" M3', 'Powerful laptop for professionals with M3 Max chip, 18-hour battery life, and stunning Liquid Retina XDR display.', 2499.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 'Laptops', 15, true),
('Dell XPS 13 Plus', 'Ultra-portable laptop with 12th Gen Intel processors, premium build quality, and edge-to-edge keyboard.', 1399.99, 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg', 'Laptops', 20, false),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones with 30-hour battery life and crystal-clear call quality.', 399.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'Audio', 40, true),
('iPad Air 5th Gen', 'Versatile tablet with M1 chip, perfect for work and entertainment. Features 10.9-inch Liquid Retina display.', 599.99, 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg', 'Tablets', 35, false),
('Apple Watch Series 9', 'Advanced smartwatch with health monitoring, fitness tracking, and the new Double Tap gesture.', 399.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 'Wearables', 50, true),
('Samsung 65" Neo QLED', '4K Smart TV with quantum dot technology, vibrant colors, and smart features powered by Tizen OS.', 1299.99, 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg', 'TVs', 12, false),
('AirPods Pro 2nd Gen', 'Premium wireless earbuds with active noise cancellation, spatial audio, and up to 6 hours of listening time.', 249.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'Audio', 60, true),
('Nintendo Switch OLED', 'Portable gaming console with vibrant 7-inch OLED screen, enhanced audio, and 64GB internal storage.', 349.99, 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', 'Gaming', 25, false);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_admin_users_email ON admin_users(email);
