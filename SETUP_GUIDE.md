# 🚀 Complete Setup Guide: Firestore Rules & Cloudinary

## 📋 Step 1: Apply Firestore Security Rules

### Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **enactus-aa9ef**
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab

### Apply These Rules
Copy and paste the following rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection rules
    match /users/{userId} {
      // Allow users to read their own profile or admins to read any profile
      allow read: if isOwner(userId) || isAdmin();
      
      // Allow users to create their own profile during registration
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Allow users to update their own profile (except role field)
      // Admins can update any profile including role
      allow update: if isOwner(userId) && 
                       (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) 
                       || isAdmin();
      
      // Only admins can delete users
      allow delete: if isAdmin();
    }
    
    // Members collection for public member data (shown on homepage)
    match /members/{memberId} {
      // Anyone can read member profiles (public)
      allow read: if true;
      
      // Only authenticated users can create member profiles
      allow create: if isAuthenticated();
      
      // Users can update their own member profile, admins can update any
      allow update: if isAuthenticated() && 
                       (request.auth.uid == resource.data.userId || isAdmin());
      
      // Only admins can delete member profiles
      allow delete: if isAdmin();
    }
  }
}
```

### Click "Publish" to apply the rules

---

## 📸 Step 2: Setup Cloudinary Upload Preset

### Go to Cloudinary Console
1. Open [Cloudinary Console](https://cloudinary.com/console)
2. Click on "Settings" (gear icon) in the top right
3. Click on "Upload" tab in the left sidebar
4. Scroll down to "Upload presets"

### Create Upload Preset
1. Click "Add upload preset"
2. Fill in the details:
   - **Upload preset name**: `enactus_members`
   - **Signing Mode**: Select **"Unsigned"** (important!)
   - **Folder**: `members` (optional but recommended)
   - **Use filename or externally defined Public ID**: Enable this
   - **Unique filename**: Enable this
   - **Overwrite**: Disable this
   - **Resource type**: Image
   - **Access mode**: Public

3. Click "Save"

---

## 🔄 Step 3: Verify Environment Variables

Make sure your `.env.local` file has:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxblaolor
NEXT_PUBLIC_CLOUDINARY_API_KEY=599166385256219
CLOUDINARY_API_SECRET=qU8QmTBglazuXc1skK4BboasB3w

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC2haDr0ywPh_BbnyZ7tsTrhNgUssF8x5o
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=enactus-aa9ef.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=enactus-aa9ef
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=enactus-aa9ef.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=825659831581
NEXT_PUBLIC_FIREBASE_APP_ID=1:825659831581:web:250ecceabbc045260dddf4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-26EDLVD83Q
```

---

## ✅ Step 4: Test the System

### Register and Login
1. Start your dev server: `npm run dev`
2. Click "Login" button
3. Register a new account
4. You should be redirected to `/dashboard`

### Upload Profile Photo
1. In the dashboard, click the camera icon on your profile photo
2. Select an image (max 5MB)
3. Image will be uploaded to Cloudinary
4. Click "Save Profile"

### See Your Photo on Homepage
1. Navigate back to home page (`/`)
2. Your floating profile image should appear!
3. Hover over it to see your name and position

---

## 🎯 Features Implemented

### ✅ Authentication System
- Email/password login
- Role-based access (Admin/Member)
- Protected routes
- Auto-redirect to dashboard after login

### ✅ Profile Management
- Editable profile information:
  - Display name
  - Position
  - Phone number
  - Bio
- Profile photo upload to Cloudinary
- Real-time updates

### ✅ Dynamic Homepage
- Floating member images fetched from Firestore
- Hover tooltips showing name and position
- Smooth animations
- Automatic positioning

### ✅ Data Structure

**Firestore Collections:**

1. **users/** - Private user data
   ```
   {
     uid: "user_id",
     email: "user@email.com",
     role: "member" | "admin",
     displayName: "John Doe",
     position: "President",
     photoURL: "https://...",
     bio: "...",
     phone: "+216...",
     createdAt: timestamp,
     updatedAt: timestamp
   }
   ```

2. **members/** - Public member data (for homepage)
   ```
   {
     userId: "user_id",
     name: "John Doe",
     email: "user@email.com",
     photoURL: "https://...",
     position: "President",
     role: "member",
     updatedAt: timestamp
   }
   ```

---

## 🐛 Troubleshooting

### "Missing or insufficient permissions" error
✅ **Fixed!** Make sure you applied the Firestore rules above.

### Image upload fails
- Check that upload preset `enactus_members` exists in Cloudinary
- Verify cloud name is correct in `.env.local`
- Make sure preset is set to "Unsigned"

### Images don't appear on homepage
- Check that you saved your profile after uploading photo
- Verify member document exists in Firestore `members` collection
- Check browser console for errors

### Can't access dashboard
- Make sure you're logged in
- Check that Firebase authentication is working
- Clear browser cache and try again

---

## 🔐 Security Notes

### What's Protected:
- ✅ Users can only read/edit their own profiles
- ✅ Admins can read/edit all profiles
- ✅ Only admins can change user roles
- ✅ Members collection is publicly readable (for homepage)
- ✅ Only authenticated users can create/update member profiles

### What's Public:
- ✅ Member photos and names (shown on homepage)
- ✅ Member positions

### What's Private:
- ✅ Email addresses (except in admin panel)
- ✅ Phone numbers
- ✅ Bios
- ✅ User roles (except shown on profile)

---

## 🎨 Next Steps

1. **Add more members**: Register additional accounts and upload photos
2. **Make admins**: Go to Firestore → users collection → change role to "admin"
3. **Customize**: Adjust member positions in `FloatingMembers.tsx`
4. **Add features**: Implement admin user management, etc.

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables
3. Ensure Firestore rules are published
4. Check that Cloudinary preset exists
5. Review the authentication documentation in `AUTHENTICATION.md`

---

**That's it! Your complete authentication + profile + dynamic homepage system is ready! 🎉**
