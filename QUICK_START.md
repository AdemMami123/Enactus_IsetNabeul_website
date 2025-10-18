# 🎯 Quick Start Guide - 5 Minutes Setup

## ⚡ Step-by-Step Instructions

### 📍 **STEP 1: Apply Firestore Rules** (2 minutes)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: `enactus-aa9ef`
3. Click **Firestore Database** → **Rules** tab
4. **DELETE ALL** existing rules
5. **COPY & PASTE** from `firestore-security-rules.txt`
6. Click **Publish**
7. ✅ Done!

---

### 📸 **STEP 2: Setup Cloudinary** (2 minutes)

1. Open [Cloudinary Console](https://cloudinary.com/console)
2. Click **Settings** (gear icon) → **Upload** tab
3. Scroll to "Upload presets" → Click **Add upload preset**
4. Fill in:
   - **Upload preset name**: `enactus_members` (exactly this!)
   - **Signing Mode**: **Unsigned** ⚠️ Important!
   - **Folder**: `members`
5. Click **Save**
6. ✅ Done!

---

### 🧪 **STEP 3: Test Everything** (1 minute)

```bash
# Start server
npm run dev
```

1. Go to http://localhost:3000
2. Click **Login** → **Sign up**
3. Register: `test@example.com` / `password123`
4. ✅ You're redirected to dashboard!
5. Click camera icon → Upload photo
6. Fill in your name and position
7. Click **Save Profile**
8. Go back to homepage (/)
9. 🎉 See your floating photo!

---

## 🎉 That's It!

### What You Can Do Now:

✅ **Register Users**
- Anyone can create an account
- Default role: Member

✅ **Upload Photos**  
- Go to dashboard → Upload photo
- Saved to Cloudinary automatically
- Shows on homepage

✅ **Edit Profiles**
- Name, position, phone, bio
- Update anytime

✅ **Make Admins**
1. Firebase Console → Firestore
2. Find user in `users` collection  
3. Change `role: "member"` to `role: "admin"`
4. User can now access `/admin`

---

## 🔍 Quick Checks

### ✅ Firestore Rules Applied?
- Go to Firebase → Firestore → Rules
- Should see long rules file
- Not just default rules

### ✅ Cloudinary Preset Created?
- Cloudinary → Settings → Upload
- See `enactus_members` in list
- Shows "Unsigned"

### ✅ Environment Variables Set?
- Check `.env.local` exists
- Has all Firebase variables
- Has Cloudinary cloud name

---

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
→ Firestore rules not applied yet. See Step 1.

### "Failed to upload image"
→ Cloudinary preset missing or not unsigned. See Step 2.

### "Can't log in"
→ Check `.env.local` has correct Firebase credentials.

### Photo doesn't appear on homepage
→ Make sure you clicked "Save Profile" after uploading.

---

## 📚 Full Documentation

- **Complete Setup**: `SETUP_GUIDE.md`
- **Authentication Details**: `AUTHENTICATION.md`  
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Firestore Rules**: `firestore-security-rules.txt`

---

## 🎯 Success Checklist

- [ ] Firestore rules published
- [ ] Cloudinary preset created (unsigned!)
- [ ] Dev server running
- [ ] Can register new account
- [ ] Redirected to dashboard after login
- [ ] Can upload profile photo
- [ ] Photo appears on homepage
- [ ] Hover shows name and position

---

**Need help? Check the full `SETUP_GUIDE.md` for detailed instructions!**
