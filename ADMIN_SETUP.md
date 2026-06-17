# Admin System Setup

This website uses Supabase authentication via the central Hoppy Tech portal for admin access.

## How to log in

1. Go to [hoppytech.com/portal](https://hoppytech.com/portal)
2. Sign in with your Supabase credentials
3. The portal will redirect you to the Sxnctuary admin dashboard with an active session

## Environment Variables

Configure the following in your Vercel deployment:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `IMGBB_API_KEY` | API key for image uploads (see IMAGE_UPLOAD_SETUP.md) |

## User setup (Supabase dashboard)

Admin users must exist in the central Supabase project with the correct `app_metadata`:

- Sxnctuary admins: `{ "tenant": "sxnctuary" }`
- Agency owner (Jeremy): `{ "role": "agency_owner" }`

To set metadata, run in Supabase SQL editor:
```sql
UPDATE auth.users
SET raw_app_meta_data = '{"tenant": "sxnctuary"}'
WHERE email = 'admin@example.com';
```

## File Structure

- `src/contexts/AdminContext.tsx` — Auth context; validates tenant on every session read
- `src/components/AdminLogin.tsx` — Login modal (footer trigger)
- `src/components/AdminDashboard.tsx` — Main admin dashboard
