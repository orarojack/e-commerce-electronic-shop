# Environment Setup Guide

## Required Environment Variables

To fix the analytics visualization issue, you need to set up your Supabase environment variables.

### 1. Create `.env.local` file

Create a file named `.env.local` in your project root directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Example `.env.local` file

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM5NzQ5NjAwLCJleHAiOjE5NTUzMjU2MDB9.your_key_here
```

### 4. Restart Your Development Server

After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Test the Connection

Once you've set up the environment variables, you can test the database connection:

```bash
node scripts/test-analytics-helper.js
```

### 6. Add Sample Data

If the connection works but you have no data, add sample data:

```bash
node scripts/add-sample-data.js
```

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` file exists in the project root
- Check that the variable names are exactly as shown above
- Restart your development server after creating the file

### "Connection failed" error
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure your database tables exist (run the setup scripts)

### Analytics still not showing
- Check the browser console for errors
- Visit `/test-analytics` page to debug database connectivity
- Ensure you have sample data in your database

## Next Steps

1. Set up your environment variables
2. Test the database connection
3. Add sample data if needed
4. Check the analytics dashboard at `/admin/analytics` 