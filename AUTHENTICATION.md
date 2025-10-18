# Authentication System Documentation

## Overview
Complete Firebase authentication system with role-based access control (RBAC) for the Enactus ISET Nabeul website.

## Features

### ✅ Implemented Features
- Email/Password authentication via Firebase
- User registration with automatic role assignment
- Login/Logout functionality
- Role-based access control (Admin & Member roles)
- Protected routes with automatic redirection
- User session persistence
- Real-time authentication state management
- Beautiful, animated login/register modal
- User profile display in navbar
- Firestore integration for user profiles

## User Roles

### 1. **Member Role** (Default)
- Can access: Home page, Dashboard
- Cannot access: Admin panel
- Assigned automatically on registration

### 2. **Admin Role**
- Can access: All pages including Admin panel
- Full administrative privileges
- Must be manually assigned in Firestore

## File Structure

```
app/
├── layout.tsx              # Root layout with AuthProvider
├── page.tsx                # Public home page
├── dashboard/
│   └── page.tsx           # Protected member dashboard
└── admin/
    └── page.tsx           # Protected admin-only page

components/
├── AuthModal.tsx          # Login/Register modal
├── Navbar.tsx             # Navigation with auth status
├── ProtectedRoute.tsx     # Route protection wrapper
└── ui/                    # ShadCN UI components
    ├── button.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── label.tsx

contexts/
└── AuthContext.tsx        # Authentication context & logic

lib/
└── firebase.ts            # Firebase configuration
```

## How to Use

### For Users

#### Registering a New Account
1. Click "Login" button in navbar
2. Click "Don't have an account? Sign up"
3. Enter email and password (min 6 characters)
4. Confirm password
5. Click "Create Account"
6. Default role: **Member**

#### Logging In
1. Click "Login" button in navbar
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected and see your profile in the navbar

#### Logging Out
1. Click the "Logout" button in the navbar
2. You'll be signed out immediately

### For Developers

#### Protecting a Route
```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

#### Admin-Only Routes
```tsx
<ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
  {/* Admin-only content */}
</ProtectedRoute>
```

#### Using Auth in Components
```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, userProfile, isAdmin, isMember, logout } = useAuth();
  
  return (
    <div>
      {isAdmin && <p>You're an admin!</p>}
      {isMember && <p>You're a member!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Firebase Setup

### Firestore Structure

```
users (collection)
  └── {userId} (document)
      ├── email: string
      ├── role: "admin" | "member"
      ├── displayName?: string
      ├── photoURL?: string
      └── createdAt: timestamp
```

### Making a User an Admin

1. Go to Firebase Console → Firestore Database
2. Find the user document in the `users` collection
3. Edit the `role` field from `"member"` to `"admin"`
4. User will have admin access on next login

## API Reference

### AuthContext Methods

#### `login(email, password)`
- Signs in user with email/password
- Fetches user profile from Firestore
- Updates auth state

#### `register(email, password, role?)`
- Creates new user account
- Creates user profile in Firestore
- Default role: "member"

#### `logout()`
- Signs out current user
- Clears auth state

#### `resetPassword(email)`
- Sends password reset email
- Uses Firebase password reset

### AuthContext Properties

- `user`: Firebase User object or null
- `userProfile`: User profile with role info or null
- `loading`: Boolean indicating auth state loading
- `isAdmin`: Boolean - true if user role is "admin"
- `isMember`: Boolean - true if user role is "member"

## Protected Routes

### Available Pages

1. **Home (`/`)** - Public, no authentication required
2. **Dashboard (`/dashboard`)** - Requires authentication (any role)
3. **Admin Panel (`/admin`)** - Requires authentication + admin role

### Automatic Redirection

- Non-authenticated users trying to access protected routes → Redirect to home
- Members trying to access admin routes → Redirect to home
- Shows loading spinner during authentication check

## Security Features

- Password minimum length: 6 characters
- Secure Firebase authentication
- Role verification on every route access
- Session persistence across page reloads
- Automatic token refresh
- Protected Firestore rules (configure in Firebase Console)

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Testing

### Test Accounts (Create These)

1. **Admin Account**
   - Create account via registration
   - Manually set role to "admin" in Firestore
   - Test admin panel access

2. **Member Account**
   - Create account via registration
   - Keep default "member" role
   - Test dashboard access
   - Verify admin panel is blocked

## Troubleshooting

### "Cannot access admin panel"
- Check your role in Firestore database
- Role must be exactly "admin" (lowercase)

### "Authentication not working"
- Verify Firebase credentials in `.env.local`
- Check Firebase Console for enabled auth methods
- Ensure Email/Password auth is enabled in Firebase

### "User profile not loading"
- Check Firestore rules allow read/write for authenticated users
- Verify user document exists in Firestore

## Future Enhancements

- [ ] Email verification
- [ ] Password strength meter
- [ ] Social authentication (Google, Facebook)
- [ ] Profile picture upload
- [ ] Edit profile functionality
- [ ] Two-factor authentication
- [ ] Admin user management interface
- [ ] Role management system
- [ ] Activity logs

## Support

For issues or questions, contact the development team or refer to:
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
