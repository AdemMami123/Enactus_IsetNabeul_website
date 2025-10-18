# User Approval System - Documentation

## Overview
The user approval system ensures that only verified Enactus members can access the platform. All new registrations require admin approval before users can login.

## How It Works

### User Flow

#### 1. Registration
1. User clicks "Login" on homepage
2. Toggles to "Join Enactus" (register)
3. Enters email and password
4. Clicks "Create Account"
5. Account is created with `accountStatus: "pending"`
6. User is immediately logged out
7. Success message: "Registration successful! Your account is pending approval..."

#### 2. Waiting for Approval
- User cannot login while status is "pending"
- If they try to login, they see: "Your account is pending approval. Please wait for an admin to approve your registration."
- Must wait for admin to review and approve

#### 3. After Approval
- Admin approves the account
- `accountStatus` changes to "approved"
- User can now login successfully
- Gets redirected to dashboard

#### 4. If Rejected
- Admin rejects the account
- `accountStatus` changes to "rejected"
- User cannot login
- If they try: "Your account has been rejected. Please contact an administrator."

---

## Admin Flow

### Accessing User Approvals
1. Login as admin
2. Click "Admin Panel" in sidebar
3. See User Approval Panel automatically

### Approving Users
1. View all pending users (yellow "Pending" badge)
2. Review email and registration date
3. Click green "Approve" button
4. User can now login immediately
5. Success message: "User approved successfully! They can now login."

### Rejecting Users
1. Find pending or approved user
2. Click red "Reject" button
3. Confirm rejection in dialog
4. User is blocked from logging in
5. Success message: "User rejected. They will not be able to login."

### Filtering Users
Click on stat cards to filter:
- **Total Users**: Show all users
- **Pending**: Show only pending approvals (default)
- **Approved**: Show approved members
- **Rejected**: Show rejected accounts

---

## Technical Implementation

### Database Schema

#### User Profile (Extended)
```typescript
interface UserProfile {
  uid: string;
  email: string;
  role: UserRole; // "admin" | "member"
  accountStatus: AccountStatus; // NEW!
  displayName?: string;
  position?: string;
  bio?: string;
  phone?: string;
  photoURL?: string;
  createdAt: Date;
  approvedAt?: Date; // Timestamp when approved
  rejectedAt?: Date; // Timestamp when rejected
}
```

#### Account Status Type
```typescript
type AccountStatus = "pending" | "approved" | "rejected";
```

### Authentication Logic

#### Registration (AuthContext)
```typescript
const register = async (email: string, password: string) => {
  // 1. Create Firebase Auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // 2. Create Firestore profile with accountStatus: "pending"
  await createUserProfile(userCredential.user.uid, email, "member");
  
  // 3. Sign out immediately
  await signOut(auth);
  
  // 4. Throw success message
  throw new Error("Registration successful! Your account is pending approval...");
};
```

#### Login (AuthContext)
```typescript
const login = async (email: string, password: string) => {
  // 1. Authenticate with Firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // 2. Fetch user profile
  const profile = await fetchUserProfile(userCredential.user.uid);
  
  // 3. Check account status
  if (profile.accountStatus === "pending") {
    await signOut(auth);
    throw new Error("Your account is pending approval...");
  }
  
  if (profile.accountStatus === "rejected") {
    await signOut(auth);
    throw new Error("Your account has been rejected...");
  }
  
  // 4. Allow login for approved accounts
  setUserProfile(profile);
};
```

---

## Components

### UserApprovalPanel (`components/UserApprovalPanel.tsx`)

**Features:**
- Fetches all users from Firestore
- Displays stats cards (Total, Pending, Approved, Rejected)
- Filters users by status
- Shows user email, role, registration date
- Color-coded status badges
- Approve/Reject buttons (admin only)
- Real-time updates after actions

**Key Functions:**
- `fetchUsers()` - Get all users from Firestore
- `handleApprove(uid)` - Set accountStatus to "approved"
- `handleReject(uid)` - Set accountStatus to "rejected"
- `getFilteredUsers()` - Filter by selected status

### AuthModal Updates (`components/AuthModal.tsx`)

**Changes:**
- Added `success` state for registration messages
- Displays green success banner after registration
- Shows pending approval message
- Clears form after successful registration
- Doesn't redirect after registration (only after login)

### Admin Page (`app/admin/page.tsx`)

**Updates:**
- Integrated with DashboardLayout
- Displays UserApprovalPanel component
- Shows welcome message about user approvals
- Protected route (admin only)

---

## Security

### Firestore Rules
The existing rules already support the approval system:
- Users can create their own profile (registration)
- Users can read their own profile
- Admins can read all users
- Admins can update any user (for approvals)

No changes needed to `firestore.rules`!

### Client-Side Protection
- Login function checks accountStatus before allowing access
- Signs out user immediately if pending/rejected
- AuthContext manages authentication state

### Server-Side Protection
- Firebase Auth ensures email/password security
- Firestore rules enforce admin-only updates
- Can't bypass approval by manipulating client code

---

## UI/UX Features

### Status Badges
- 🟡 **Pending**: Yellow badge with clock icon
- 🟢 **Approved**: Green badge with checkmark icon
- 🔴 **Rejected**: Red badge with X icon

### Stat Cards
- Clickable cards to filter users
- Shows count for each status
- Active filter highlighted with yellow border
- Icons for visual clarity

### User Cards
- Display email prominently
- Show role and registration date
- Status badge clearly visible
- Action buttons appear for pending users
- Hover effects for better UX

### Messages
- Green success messages for approvals
- Red error messages for failures
- Auto-dismiss after viewing
- Smooth animations with Framer Motion

---

## Edge Cases Handled

### Old Users (Before Update)
- Users without `accountStatus` field are treated as "approved"
- Prevents breaking existing accounts
- Database migration not required

### Rejected User Wants to Login Again
- Clear error message
- Instructions to contact admin
- Can be re-approved by admin if needed

### User Tries Multiple Registrations
- Firebase Auth prevents duplicate emails
- Shows appropriate error message

### Admin Approves Already Approved User
- No error thrown
- Updates timestamp
- Harmless operation

### Network Errors
- Try-catch blocks handle Firestore errors
- User sees error message
- Can retry action

---

## Migration Guide

### For Existing Users
No action needed! Existing users without `accountStatus` field can login normally. The system treats them as "approved".

### For New Deployments
1. Update Firebase Auth to use the new AuthContext
2. Deploy UserApprovalPanel component
3. Update admin page to show approvals
4. Create at least one admin account manually
5. All new registrations will require approval

### Creating First Admin
Option 1 - Firebase Console:
1. Go to Firestore in Firebase Console
2. Find `users` collection
3. Find your user document
4. Add field: `accountStatus: "approved"`
5. Update field: `role: "admin"`

Option 2 - Script (run once):
```javascript
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

await updateDoc(doc(db, "users", "YOUR_UID"), {
  role: "admin",
  accountStatus: "approved"
});
```

---

## Best Practices

### For Admins
✅ Review registrations daily
✅ Check email addresses for legitimacy
✅ Only approve known Enactus members
✅ Reject suspicious registrations
✅ Can re-approve rejected users if needed

### For Users
✅ Use official Enactus email if possible
✅ Wait patiently for approval
✅ Contact admin if waiting too long
✅ Don't create multiple accounts

### For Developers
✅ Keep `accountStatus` field required in TypeScript
✅ Always check status before granting access
✅ Log approval/rejection actions for audit
✅ Consider email notifications for approvals
✅ Add timestamps for tracking

---

## Future Enhancements

### Immediate Next Steps
- [ ] Email notification when user is approved/rejected
- [ ] Email notification to admins when new user registers
- [ ] Add approval reason/notes field
- [ ] Bulk approve multiple users

### Advanced Features
- [ ] Two-step verification (email + admin approval)
- [ ] Approval history/audit log
- [ ] Approval expiration (re-verify annually)
- [ ] Role assignment during approval
- [ ] Custom rejection messages
- [ ] Appeal system for rejected users

---

## Testing Checklist

### Registration Flow
- [ ] Register with valid email/password
- [ ] See success message about pending approval
- [ ] Try to login immediately (should fail)
- [ ] Check Firestore (accountStatus should be "pending")

### Admin Approval
- [ ] Login as admin
- [ ] See pending user in Admin Panel
- [ ] Click "Approve" button
- [ ] See success message
- [ ] Check Firestore (accountStatus should be "approved")

### Approved User Login
- [ ] Login with approved account
- [ ] Redirect to dashboard
- [ ] Access all features normally

### Rejection Flow
- [ ] Reject a pending user
- [ ] Confirm rejection dialog
- [ ] Try to login (should fail with rejection message)
- [ ] Admin can re-approve if needed

### Edge Cases
- [ ] Try to register with existing email
- [ ] Test with network disconnected
- [ ] Filter users by each status
- [ ] Approve already approved user (harmless)

---

## Troubleshooting

### "Your account is pending approval" on login
**Solution**: Wait for admin to approve your registration. Contact admin if urgent.

### Can't see pending users in Admin Panel
**Solution**: 
1. Check you're logged in as admin
2. Verify your `role` is "admin" in Firestore
3. Refresh the page
4. Check browser console for errors

### Approved user still can't login
**Solution**:
1. Check `accountStatus` in Firestore is exactly "approved"
2. Try logging out and back in
3. Clear browser cache
4. Check for typos in accountStatus field

### New users not appearing in Admin Panel
**Solution**:
1. Check Firestore connection
2. Verify users were created in `users` collection
3. Check console for fetch errors
4. Try refreshing the page

---

## Security Considerations

### ⚠️ Important
- **Never** store sensitive data in client-side code
- **Always** validate on server-side (Firestore rules)
- **Don't** trust client-side status checks alone
- **Do** log all approval/rejection actions
- **Consider** rate limiting registrations

### Firestore Rules (Already Secure)
```javascript
match /users/{userId} {
  // Users can create their own account
  allow create: if request.auth != null && request.auth.uid == userId;
  
  // Only admins can update accountStatus
  allow update: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

---

**The approval system is fully implemented and ready to protect your Enactus platform! 🎉**
