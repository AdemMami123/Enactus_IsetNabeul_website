# Posts & News System - Documentation

## Overview
A comprehensive content management system allowing all authenticated users (members and admins) to create, edit, and delete posts about achievements, events, articles, and news. Posts are displayed on the homepage below the floating members section and in the dashboard.

---

## Features

### For All Authenticated Users
✅ Create posts with rich content  
✅ Edit their own posts  
✅ Delete their own posts  
✅ Upload images to Cloudinary  
✅ Add multiple links  
✅ Set event dates  
✅ Choose post type (Achievement, Event, Article, News)  
✅ View all posts on homepage  
✅ Manage posts from dashboard  

### For Admins
✅ All member features  
✅ Edit any user's posts  
✅ Delete any user's posts  
✅ Moderate content  

---

## Post Types

### 1. Achievement 🏆
- Showcase accomplishments
- Awards and recognitions
- Milestones reached
- Badge color: Yellow

### 2. Event 📅
- Upcoming events
- Event announcements
- Meeting schedules
- Badge color: Blue

### 3. Article 📝
- Long-form content
- Educational posts
- Tutorials and guides
- Badge color: Purple

### 4. News 📰
- General updates
- Announcements
- Quick updates
- Badge color: Green

---

## Database Structure

### Posts Collection (`posts/{postId}`)
```typescript
{
  id: string;              // Auto-generated document ID
  title: string;           // Post title (required)
  description: string;     // Post content (required)
  type: PostType;          // "achievement" | "event" | "article" | "news"
  imageUrl?: string;       // Cloudinary URL (optional)
  links?: string[];        // Array of URLs (optional)
  eventDate?: Date;        // Date for events (optional)
  authorId: string;        // User UID
  authorName: string;      // Cached author name
  authorEmail: string;     // Cached author email
  createdAt: Date;         // Creation timestamp
  updatedAt?: Date;        // Last update timestamp
}
```

---

## Components

### 1. PostManager (`components/PostManager.tsx`)
**Purpose**: Full CRUD interface for managing posts

**Features:**
- Create new posts with form
- Edit existing posts (author only)
- Delete posts (author only or admin)
- Upload images to Cloudinary
- Add/remove multiple links
- Set optional event dates
- Real-time post list
- Success/error messages

**Key Functions:**
```typescript
fetchPosts()              // Get all posts from Firestore
uploadToCloudinary(file)  // Upload image, returns URL
handleSubmit()            // Create or update post
handleEdit(post)          // Load post into form
handleDelete(postId)      // Remove post
```

**Form Fields:**
- Title (required)
- Type (required) - dropdown
- Description (required) - textarea
- Event Date (optional) - date picker
- Image (optional) - file upload with preview
- Links (optional) - dynamic array

---

### 2. PostsSection (`components/PostsSection.tsx`)
**Purpose**: Display posts on homepage

**Features:**
- Fetches latest 6 posts
- Grid layout (3 columns on desktop)
- Post cards with images
- Hover effects and animations
- Type badges
- Truncated descriptions
- Click-through to links
- Responsive design

**Card Elements:**
- Image (if available)
- Type badge
- Title
- Description (3 lines max)
- Author name
- Date (event date or created date)
- First link preview

---

## Pages

### 1. Homepage (`app/page.tsx`)
**Updated Features:**
- Posts section below floating members
- Scrollable content
- Gradient background transition
- Latest 6 posts displayed
- Full-width layout

**Layout:**
```
[Navbar]
[Floating Members + Center Logos]
↓ (scroll down)
[Posts Section - Latest Updates]
```

---

### 2. Dashboard Posts Page (`app/dashboard/posts/page.tsx`)
**Features:**
- Full PostManager component
- Create/edit/delete posts
- Protected route (auth required)
- Sidebar navigation
- All user's posts displayed

**Access:** `/dashboard/posts`

---

### 3. Dashboard Navigation
**Updated Menu:**
- Dashboard
- Profile
- **Posts** (NEW)
- Absence List
- Admin Panel (admin only)

---

## Firestore Security Rules

### Posts Collection Rules
```javascript
match /posts/{postId} {
  // Anyone can read posts (including unauthenticated for homepage)
  allow read: if true;
  
  // Authenticated users can create posts
  allow create: if request.auth != null &&
                   request.resource.data.authorId == request.auth.uid;
  
  // Users can update/delete their own posts
  allow update, delete: if request.auth != null &&
                           resource.data.authorId == request.auth.uid;
  
  // Admins can update/delete any post
  allow update, delete: if request.auth != null && 
                           exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Security Features:**
- ✅ Public read (for homepage display)
- ✅ Auth required to create
- ✅ Only author or admin can edit/delete
- ✅ Author ID verified on creation
- ✅ Server-side enforcement

---

## Image Upload (Cloudinary)

### Configuration
- **Cloud Name**: dxblaolor
- **Upload Preset**: enactus_members (unsigned)
- **Max Size**: 5MB
- **Allowed Formats**: Any image type

### Upload Process
1. User selects image file
2. Validate size (< 5MB)
3. Show preview
4. On submit: Upload to Cloudinary
5. Get secure URL
6. Save URL in Firestore

### Image Display
- Homepage: 200px height, full width
- Dashboard cards: 256px height
- Responsive sizing
- Object-fit: cover
- Hover zoom effect

---

## UI/UX Features

### Post Creation Form
- **Layout**: Single column, stacked fields
- **Validation**: Title and description required
- **Image Preview**: Shows selected image
- **Links**: Dynamic add/remove
- **Loading State**: "Saving..." button text
- **Success Message**: Green banner
- **Error Message**: Red banner

### Post Cards (Homepage)
- **Grid**: 3 columns (desktop), 2 (tablet), 1 (mobile)
- **Hover Effects**: 
  - Border color change
  - Image zoom
  - Title color change
- **Type Badges**: Color-coded, with icons
- **Truncation**: 
  - Title: 2 lines max
  - Description: 3 lines max
- **Animations**: Stagger on scroll

### Post Cards (Dashboard)
- **Full Content**: No truncation
- **Edit/Delete Buttons**: Visible for author
- **Image**: Full width, 256px height
- **Links**: Full list displayed
- **Timestamps**: Created and updated dates

---

## User Flow

### Creating a Post
```
1. Login to account
2. Go to Dashboard → Posts
3. Click "Create Post" button
4. Fill in form:
   - Enter title
   - Choose type
   - Write description
   - (Optional) Upload image
   - (Optional) Add event date
   - (Optional) Add links
5. Click "Create Post"
6. See success message
7. Post appears in list
8. Post visible on homepage
```

### Editing a Post
```
1. Go to Dashboard → Posts
2. Find your post
3. Click edit icon (pencil)
4. Form pre-fills with data
5. Make changes
6. Click "Update Post"
7. See success message
8. Changes reflected everywhere
```

### Deleting a Post
```
1. Go to Dashboard → Posts
2. Find your post
3. Click delete icon (trash)
4. Confirm deletion
5. Post removed from all views
```

---

## Padding & Spacing Updates

### Dashboard Adjustments
**Before → After:**
- Header margin: `mb-12` → `mb-8`
- Header title: `text-4xl md:text-5xl` → `text-3xl md:text-4xl`
- Header subtitle: `text-lg` → `text-base`
- Stats grid gap: `gap-6 mb-12` → `gap-4 mb-8`
- Stats card padding: `p-6` → `p-5`
- Stats icon: `w-8 h-8` → `w-7 h-7`
- Stats value: `text-2xl` → `text-xl`
- Quick links title: `text-2xl mb-6` → `text-xl mb-4`
- Quick links icon: `w-10 h-10` → `w-8 h-8`
- Quick links card padding: `p-6` → `p-5`
- Quick links title: `text-xl` → `text-lg`
- Quick links grid: 4 cols → 5 cols (xl screens)

**Benefits:**
- More compact layout
- Better use of space
- Improved readability
- Consistent spacing
- Fits more content on screen

---

## Homepage Layout

### Structure
```
[Section 1: Hero]
- Navbar (fixed top)
- Floating members
- Center logos
- Height: 100vh

[Section 2: Posts]
- Background: Gradient from transparent to black
- Padding: py-20 (80px top/bottom)
- Max width: 1280px (max-w-7xl)
- Content: Latest 6 posts grid
```

### Scrolling Behavior
- Smooth scroll enabled
- Sticky navbar stays on top
- Posts section reveals on scroll
- Gradient provides visual transition
- Background effects remain throughout

---

## Responsive Design

### Breakpoints
- **Mobile** (< 768px): 1 column
- **Tablet** (768px - 1024px): 2 columns
- **Desktop** (1024px - 1280px): 3 columns
- **Large** (> 1280px): 3 columns

### Mobile Optimizations
- Full-width post cards
- Stacked layout
- Touch-friendly buttons
- Larger tap targets
- Readable text sizes
- Image scaling

---

## Performance Optimizations

### Image Loading
- Next.js Image component
- Lazy loading by default
- Responsive srcset
- Blur placeholder
- WebP format (automatic)

### Firestore Queries
- Indexed queries (orderBy createdAt)
- Limit to 6 on homepage
- No limit in dashboard (scrollable)
- Cached data
- Real-time updates optional

### Code Splitting
- Dynamic imports for PostManager
- Lazy load on route change
- Separate bundles per page

---

## Testing Checklist

### Post Creation
- [ ] Create post without image
- [ ] Create post with image (< 5MB)
- [ ] Create post with multiple links
- [ ] Create post with event date
- [ ] Try each post type
- [ ] Verify validation errors
- [ ] Check success message
- [ ] Post appears immediately

### Post Editing
- [ ] Edit own post
- [ ] Update image
- [ ] Add/remove links
- [ ] Change type
- [ ] Verify can't edit others' posts (member)
- [ ] Verify admin can edit any post
- [ ] Check updated timestamp

### Post Deletion
- [ ] Delete own post
- [ ] Confirmation dialog appears
- [ ] Post removed from all views
- [ ] Verify can't delete others' posts (member)
- [ ] Verify admin can delete any post

### Homepage Display
- [ ] Posts appear below floating members
- [ ] Grid layout correct
- [ ] Images load properly
- [ ] Type badges show correctly
- [ ] Links work
- [ ] Responsive on mobile
- [ ] Scroll behavior smooth

### Dashboard Display
- [ ] All posts visible
- [ ] Create button works
- [ ] Edit/delete buttons for own posts
- [ ] Form validation works
- [ ] Image preview shows
- [ ] Links array dynamic

---

## Troubleshooting

### Post Not Appearing
**Problem**: Created post doesn't show  
**Solutions**:
1. Check Firestore rules deployed
2. Verify internet connection
3. Refresh page
4. Check browser console for errors
5. Verify authorId matches user UID

### Image Upload Fails
**Problem**: Image won't upload  
**Solutions**:
1. Check file size (< 5MB)
2. Verify file is image type
3. Check Cloudinary preset: enactus_members
4. Test internet connection
5. Check browser console

### Can't Edit Post
**Problem**: Edit button not showing  
**Solutions**:
1. Verify you're the author
2. Check you're logged in
3. Admin can edit any post
4. Refresh page
5. Check authorId in Firestore

### Posts Not on Homepage
**Problem**: Homepage doesn't show posts  
**Solutions**:
1. Create at least one post
2. Check Firestore rules allow public read
3. Hard refresh (Ctrl+Shift+R)
4. Check browser console
5. Verify PostsSection imported

---

## Future Enhancements

### Immediate
- [ ] Comment system on posts
- [ ] Like/reaction system
- [ ] Post categories/tags
- [ ] Search and filter posts
- [ ] Pagination for many posts

### Advanced
- [ ] Rich text editor (Markdown)
- [ ] Video embeds
- [ ] Post scheduling
- [ ] Draft system
- [ ] Post analytics (views, clicks)
- [ ] Share to social media
- [ ] Email notifications for new posts
- [ ] RSS feed

---

## Quick Reference

### Post Type Colors
| Type | Color | Icon |
|------|-------|------|
| Achievement | Yellow | Trophy |
| Event | Blue | Calendar |
| Article | Purple | Document |
| News | Green | Newspaper |

### File Limits
- Image: 5MB max
- Links: Unlimited
- Description: No limit (text area)
- Title: No limit (but keep reasonable)

### Access Control
| Action | Member | Admin |
|--------|--------|-------|
| View posts | ✅ | ✅ |
| Create post | ✅ | ✅ |
| Edit own post | ✅ | ✅ |
| Edit any post | ❌ | ✅ |
| Delete own post | ✅ | ✅ |
| Delete any post | ❌ | ✅ |

---

## API Reference

### Create Post
```typescript
await addDoc(collection(db, "posts"), {
  title: string,
  description: string,
  type: "achievement" | "event" | "article" | "news",
  imageUrl?: string,
  links?: string[],
  eventDate?: Timestamp,
  authorId: string,
  authorName: string,
  authorEmail: string,
  createdAt: Timestamp.now(),
});
```

### Update Post
```typescript
await updateDoc(doc(db, "posts", postId), {
  title: string,
  description: string,
  // ... other fields
  updatedAt: Timestamp.now(),
});
```

### Delete Post
```typescript
await deleteDoc(doc(db, "posts", postId));
```

### Fetch Posts
```typescript
const postsQuery = query(
  collection(db, "posts"),
  orderBy("createdAt", "desc"),
  limit(6)
);
const postsSnapshot = await getDocs(postsQuery);
```

---

**The Posts & News system is fully implemented and ready for production! 🎉**

Users can now share achievements, events, articles, and news with rich content including images and links. All posts display beautifully on the homepage and in the dashboard.
