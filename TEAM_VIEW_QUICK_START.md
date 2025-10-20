# Team View - Quick Start

## What's New? 🎉

A brand new **Team View** page displaying all Enactus ISET Nabeul members with full profile details, search, and filtering capabilities.

## Access the Team Page

### Option 1: From Dashboard
1. Go to `/dashboard`
2. Click the **"View Team"** quick link card

### Option 2: From Sidebar
1. Open any dashboard page
2. Click **"Team"** in the sidebar navigation

### Option 3: Direct URL
- Navigate to `/team`

## Features

### 🔍 Search Members
- Type in the search bar to filter by:
  - Name
  - Position
  - Email address
- Real-time results
- Click X to clear search

### 🎯 Filter by Role
- **All**: Show everyone (default)
- **Admins**: Show only administrators
- **Members**: Show only regular members

### 👤 Member Cards
Each card displays:
- Profile photo
- Name
- Position
- Bio preview (2 lines)
- Email address
- Phone number
- Role badge (Admin/Member)

### 📋 Full Profile Modal
Click any member card to see:
- Large profile photo
- Complete bio
- Full contact information
- Clickable email (mailto:) and phone (tel:) links

## Member Data Source

The team view fetches data from the Firestore `users` collection:
- Only shows **approved** members
- Admins appear first, then alphabetically by name
- Real-time updates from Firestore

## Design Features

### Responsive Layout
- **Mobile**: 1 column
- **Tablet**: 2 columns  
- **Desktop**: 3 columns

### Animations
- Smooth card hover effects
- Cards lift on hover
- Yellow border glow effect
- Modal fade in/out
- Photo zoom on hover

### Color Scheme
- Background: Dark gradient (gray-900 to black)
- Primary: Enactus Yellow (#FFD600)
- Cards: Gray-800 with yellow accents
- Text: White with gray secondary

## What Data Is Displayed?

From each user's profile:
```
✅ Display Name
✅ Position (e.g., "Project Manager", "Member")
✅ Role (Admin or Member badge)
✅ Profile Photo (or placeholder)
✅ Bio/About text
✅ Email address
✅ Phone number
```

## Empty States

### No Results
When search/filter returns no members:
- Shows "No members found" message
- Suggests adjusting filters
- Displays Users icon

### Loading
While fetching data:
- Shows spinning loader
- "Loading team members..." text

## Navigation Added

### Dashboard Sidebar
New menu item:
- **Icon**: Users
- **Label**: Team
- **Route**: `/team`
- **Access**: All users (not admin-only)

### Dashboard Quick Links
Updated card:
- **Title**: View Team
- **Description**: See all Enactus members
- **Route**: `/team` (was `/`)
- **Icon**: Users

## Technical Details

### Files Created
1. `components/TeamView.tsx` - Main component (540 lines)
2. `app/team/page.tsx` - Page route

### Files Modified
1. `components/DashboardLayout.tsx` - Added sidebar item
2. `app/dashboard/page.tsx` - Updated quick link

### Dependencies Used
- Framer Motion (animations)
- Lucide React (icons)
- Next.js Image (photos)
- Firebase/Firestore (data)
- Tailwind CSS (styling)

## Performance Notes

- ✅ Single Firestore query on mount
- ✅ Client-side filtering (no repeated queries)
- ✅ Image optimization with Next.js
- ✅ GPU-accelerated animations
- ✅ Lazy loading for images

## Security

- Only approved users shown (`accountStatus === "approved"`)
- Uses existing Firestore security rules
- No sensitive data exposed
- Email/phone require modal interaction

## Testing the Feature

1. ✅ Navigate to `/team`
2. ✅ Verify all members load
3. ✅ Test search functionality
4. ✅ Try role filters (All/Admin/Member)
5. ✅ Click a member card
6. ✅ Verify modal shows full details
7. ✅ Test email/phone links
8. ✅ Close modal with X or backdrop
9. ✅ Check responsive layout on mobile
10. ✅ Verify sidebar and dashboard links work

## Next Steps (Optional Enhancements)

Future features you could add:
- Export team list to CSV
- Sort by name/position/join date
- Social media links (LinkedIn, etc.)
- Team statistics and charts
- Print-friendly view
- Direct messaging between members
- Achievement badges
- QR codes for contact sharing

---

**Status**: ✅ Ready to use
**Access**: All authenticated users
**Route**: `/team`
