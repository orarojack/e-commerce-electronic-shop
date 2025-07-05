# Authentication Setup Guide

## Issues Found and Fixed

### 1. Function Signature Mismatch ✅ FIXED
- **Problem**: The `signUp` function in `auth-context.tsx` had a different signature than how it was called in the register page
- **Fix**: Updated the function to accept an object parameter matching the call site

### 2. Missing Environment Variables ❌ NEEDS CONFIGURATION
- **Problem**: Supabase environment variables are missing
- **Solution**: Create a `.env.local` file with your Supabase credentials

### 3. Response Handling ✅ FIXED
- **Problem**: Register page wasn't properly handling the signUp response
- **Fix**: Updated to check `result.success` and show appropriate messages

### 4. Login Response Handling ✅ FIXED
- **Problem**: Login page was trying to access non-existent `result.user` property
- **Fix**: Removed the incorrect property access since redirects are handled in auth context

### 5. Admin Login Functionality ✅ FIXED
- **Problem**: No way to specify admin login in the login page
- **Fix**: Added admin login toggle switch and query parameter support

## Setup Instructions

### Step 1: Create Environment Variables
Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 2: Set Up Supabase Database
1. Create a Supabase project at https://supabase.com
2. Run the SQL script from `scripts/setup-database.sql` in your Supabase SQL editor
3. Copy your project URL and anon key from the Supabase dashboard

### Step 3: Test Authentication
1. Start the development server: `npm run dev`
2. Try registering a new user at `/register`
3. Try logging in with the created user at `/login`
4. Test admin login with: `admin@mashelectronics.com` / `admin123`

## Admin Login

### Method 1: Toggle Switch
1. Go to `/login`
2. Toggle the "Admin Login" switch
3. Enter admin credentials: `admin@mashelectronics.com` / `admin123`

### Method 2: Direct Admin Login URL
Use this URL to automatically enable admin login:
```
http://localhost:3000/login?admin=true
```

## Demo Credentials
- **Admin**: `admin@mashelectronics.com` / `admin123`
- **Customer**: `customer@example.com` / `demo123`

## Security Notes
⚠️ **Important**: This implementation stores passwords as plain text for demo purposes. In production:
- Use proper password hashing (bcrypt, Argon2)
- Implement proper session management
- Add rate limiting for login attempts
- Use HTTPS in production

## Troubleshooting
1. **"Invalid email or password"**: Check if the user exists in the database
2. **"Registration failed"**: Check Supabase connection and table permissions
3. **Environment variables not loading**: Restart the development server after adding `.env.local`
4. **Admin login not working**: Make sure the admin user exists in the `admin_users` table
5. **Products not showing on public page**: 
   - Check database connection at `/test-db`
   - Verify environment variables are set correctly
   - Check browser console for errors
   - Ensure products table has data (run setup-database.sql)
   - Check Supabase Row Level Security (RLS) policies 