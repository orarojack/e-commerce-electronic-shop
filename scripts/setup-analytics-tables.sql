-- Analytics and Settings Tables Setup
-- Run this script in your Supabase SQL editor

-- Create settings table for store configuration
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default store settings
INSERT INTO store_settings (setting_key, setting_value, setting_type, description) VALUES
  ('store_name', 'Mash Electronics', 'string', 'Store name'),
  ('store_description', 'Your trusted source for quality electronics in Kenya', 'string', 'Store description'),
  ('contact_email', 'info@mashelectronics.co.ke', 'string', 'Contact email'),
  ('contact_phone', '+254700123456', 'string', 'Contact phone'),
  ('address', 'Nairobi, Kenya', 'string', 'Store address'),
  ('website', 'https://mashelectronics.co.ke', 'string', 'Website URL'),
  ('currency', 'KSH', 'string', 'Store currency'),
  ('tax_rate', '16', 'number', 'Tax rate percentage'),
  ('shipping_cost', '0', 'number', 'Default shipping cost'),
  ('free_shipping_threshold', '5000', 'number', 'Free shipping threshold'),
  ('maintenance_mode', 'false', 'boolean', 'Maintenance mode'),
  ('email_notifications', 'true', 'boolean', 'Email notifications enabled'),
  ('sms_notifications', 'true', 'boolean', 'SMS notifications enabled'),
  ('whatsapp_notifications', 'true', 'boolean', 'WhatsApp notifications enabled'),
  ('order_confirmation_email', 'true', 'boolean', 'Order confirmation emails'),
  ('low_stock_alerts', 'true', 'boolean', 'Low stock alerts'),
  ('new_order_alerts', 'true', 'boolean', 'New order alerts')
ON CONFLICT (setting_key) DO NOTHING;

-- Create analytics tracking table (optional - for more detailed analytics)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for store_settings table
CREATE TRIGGER update_store_settings_updated_at 
  BEFORE UPDATE ON store_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
GRANT SELECT, INSERT, UPDATE ON store_settings TO authenticated;
GRANT SELECT, INSERT ON analytics_events TO authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for store_settings
CREATE POLICY "Allow admin users to manage settings" ON store_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policies for analytics_events
CREATE POLICY "Allow authenticated users to insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin users to view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  ); 