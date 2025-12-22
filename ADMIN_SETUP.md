# ADMIN SDK SETUP GUIDE

## Step 1: Set Your Admin UID

Add this to your `.env.local` file in the root directory:

```
NEXT_PUBLIC_ADMIN_UIDS=YOUR_UID_HERE
```

### How to find your UID:

1. Sign up/login to your app
2. Open browser DevTools → Console
3. Run this code:

```javascript
import { auth } from "@/lib/firebase";
console.log(auth.currentUser?.uid);
```

4. Copy the UID and paste it in `.env.local`

### For multiple admins:

```
NEXT_PUBLIC_ADMIN_UIDS=uid1,uid2,uid3
```

## Step 2: Deploy Firebase Functions

```bash
cd functions
npm run deploy
```

## Step 3: Access Admin Panel

Go to: `http://localhost:3000/admin` (development)

## Features:

✅ View all users
✅ Ban users (with optional reason)
✅ Unban users
✅ See user creation date & last sign-in
✅ Admin-only access verification

## Security Notes:

- Only users in NEXT_PUBLIC_ADMIN_UIDS can access
- ID token verification on backend
- All actions logged to Firestore
