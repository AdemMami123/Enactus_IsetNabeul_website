# 🔥 Deploy Firestore Rules - Quick Guide

## ⚠️ IMPORTANT: Manual Step Required

Your code has been pushed to GitHub and Vercel will automatically deploy it, but **Firestore rules must be deployed separately**.

---

## 📋 Steps to Deploy Firestore Rules

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Select project: **enactus-iset-nabeul**

### Step 2: Navigate to Firestore Rules
1. In left sidebar, click **Firestore Database**
2. Click on **Rules** tab at the top

### Step 3: Find the Members Collection Rule
Scroll down to find this section:
```javascript
// Members collection - public data for homepage
match /members/{memberId} {
```

### Step 4: Change This Line
**Find this line:**
```javascript
allow read: if request.auth != null;
```

**Change it to:**
```javascript
allow read: if true;
```

### Step 5: Complete Updated Rule
The full members collection rule should look like this:
```javascript
// Members collection - public data for homepage
match /members/{memberId} {
  // Anyone can read member profiles (for homepage floating members)
  allow read: if true;
  
  // Users can create/update their own member profile
  allow create, update: if request.auth != null && 
                          (request.auth.uid == memberId || 
                           request.auth.uid == request.resource.data.userId);
  
  // Admins can manage all member profiles
  allow write: if request.auth != null && 
                  exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  
  // Users can delete their own member profile
  allow delete: if request.auth != null && 
                   (request.auth.uid == memberId || 
                    request.auth.uid == resource.data.userId);
}
```

### Step 6: Publish Rules
1. Click the **Publish** button (blue button at top right)
2. Confirm the deployment
3. ✅ Rules are now live!

---

## 🧪 Test That It Worked

### Test 1: Floating Members (Not Logged In)
1. Open your site in **incognito/private window**: https://enactus-iset-nabeul.vercel.app
2. **DO NOT** log in
3. ✅ You should see floating member profile images on the homepage
4. Hover over them to see name/position tooltips

### Test 2: External Links
1. Log in to your site
2. Go to Dashboard → Posts
3. Create a test post with link: `www.google.com`
4. Click the link from the post
5. ✅ Should open Google in a new tab (not 404 error)

---

## ❓ Troubleshooting

### Members Still Not Showing When Logged Out?
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Wait 1-2 minutes** for rules to propagate
3. **Check Firebase Console** → Firestore Database → Rules → verify change is published
4. **Try incognito window** to avoid cache issues

### Links Still Not Working?
1. **Clear browser cache**
2. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
3. **Wait for Vercel deployment** to complete (check Vercel dashboard)
4. **Try creating a new post** with fresh link

### How to Know Vercel Deployed?
1. Go to: https://vercel.com/dashboard
2. Click on your project: **enactus-iset-nabeul**
3. Check **Deployments** tab
4. Latest deployment should show **Ready** status
5. Usually takes 1-2 minutes

---

## ✅ Verification Checklist

After deploying rules, verify:

- [ ] Firestore rules published in Firebase Console
- [ ] Vercel deployment shows "Ready" status
- [ ] Open site in incognito (not logged in)
- [ ] Floating members visible on homepage
- [ ] Hover shows member name/position
- [ ] Log in to dashboard
- [ ] Create post with link `www.example.com`
- [ ] Click link opens in new tab
- [ ] Link goes to correct website (not 404)
- [ ] Log out
- [ ] Floating members still visible

---

## 🎯 What Changed?

### Code Changes (Already Deployed to Vercel ✅)
- Links now auto-add `https://` protocol
- Both PostManager and PostsSection components updated

### Firestore Rules (YOU NEED TO DEPLOY ⚠️)
- Members collection now allows public read access
- Homepage floating members will work for everyone

---

## 🚀 Quick Summary

1. ✅ Code pushed to GitHub
2. ✅ Vercel auto-deploying
3. ⚠️ **YOU MUST**: Deploy Firestore rules manually
4. 🧪 Test both fixes after deployment

**Time to complete**: 2-3 minutes
**Difficulty**: Easy - just change one line and click Publish

---

Need help? Check the full documentation in `BUG_FIXES.md`
