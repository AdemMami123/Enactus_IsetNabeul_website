# Absence Management System

## Overview
The absence management system allows admins to track member attendance at meetings and events, with full CRUD capabilities and statistical insights.

## Features

### For All Members
- ✅ View all absences in real-time
- ✅ See personal absence statistics
- ✅ View member attendance rankings
- ✅ Access from sidebar navigation

### For Admins Only
- ✅ Mark members as absent with date and reason
- ✅ Edit existing absence records
- ✅ Delete incorrect absence entries
- ✅ View comprehensive statistics
- ✅ Track absences per member

## Pages & Components

### Dashboard Layout (`components/DashboardLayout.tsx`)
- **Responsive sidebar navigation**
- **Mobile hamburger menu**
- **User profile display with role badge**
- **Auto-filtered navigation (hides admin items for members)**
- **Navigation items:**
  - Dashboard
  - Profile
  - Absence List
  - Admin Panel (admin only)

### Absence Management (`components/AbsenceManagement.tsx`)
- **Main Features:**
  - User list with absence counts
  - Recent absence records
  - Statistical overview cards
  - Mark absence modal
  - Edit absence functionality
  - Delete with confirmation

- **Statistics Displayed:**
  - Total members count
  - Total absences count
  - Absences this month
  - Member rankings by absence count

### Dashboard Pages
1. **Main Dashboard** (`/dashboard`)
   - Welcome message with user name
   - Quick stats cards
   - Quick action links
   - Integrated sidebar

2. **Profile Page** (`/dashboard/profile`)
   - Edit personal information
   - Upload profile photo (Cloudinary)
   - Update position and bio

3. **Absence Page** (`/dashboard/absence`)
   - Full absence management interface
   - Admin controls for marking/editing
   - Real-time statistics

## Database Structure

### Absences Collection (`absences/{absenceId}`)
```typescript
{
  userId: string;          // Reference to users collection
  userName: string;        // Cached for display
  userEmail: string;       // Cached for display
  userPosition: string;    // Cached for display
  meetingDate: Timestamp;  // Date of the meeting
  reason: string;          // Why member was absent
  markedBy: string;        // UID of admin who marked
  markedByName: string;    // Name of admin who marked
  createdAt: Timestamp;    // When record was created
  updatedAt?: Timestamp;   // When record was last updated
  updatedBy?: string;      // UID of admin who updated
}
```

## Firestore Security Rules

```javascript
// Absences collection - attendance tracking
match /absences/{absenceId} {
  // All authenticated users can read absences
  allow read: if request.auth != null;
  
  // Only admins can create, update, or delete absences
  allow create, update, delete: if request.auth != null && 
                                   exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## How to Use

### As a Member
1. Login to your account
2. Click "Absence List" in sidebar
3. View all absence records
4. See your absence count in the member statistics table

### As an Admin
1. Login to admin account
2. Navigate to "Absence List"
3. Click "Mark Absence" button
4. Select member, date, and optional reason
5. Click "Mark Absent" to save

**To Edit an Absence:**
1. Click the edit icon (pencil) on any absence record
2. Modify the date or reason
3. Click "Update" to save changes

**To Delete an Absence:**
1. Click the delete icon (trash) on any absence record
2. Confirm the deletion
3. Record will be permanently removed

## Navigation Structure

```
Dashboard (/)
├── Main Dashboard (/dashboard)
├── Profile (/dashboard/profile)
│   └── ProfileSection component
├── Absence List (/dashboard/absence)
│   └── AbsenceManagement component
└── Admin Panel (/admin) [Admin only]
```

## Color-Coded Stats

### Member Absence Counts
- **Green**: 0 absences (perfect attendance)
- **Yellow**: 1-2 absences (good attendance)
- **Red**: 3+ absences (needs attention)

## API Methods

The `AbsenceManagement` component includes:
- `fetchUsers()` - Get all users with absence counts
- `fetchAbsences()` - Get all absence records
- `handleMarkAbsence()` - Create new absence record
- `handleUpdateAbsence()` - Edit existing absence
- `handleDeleteAbsence()` - Remove absence record

## Real-time Updates
The absence list automatically refetches data after any create, update, or delete operation to ensure all users see the latest information.

## Mobile Responsiveness
- Sidebar collapses to hamburger menu on mobile
- Tables are horizontally scrollable on small screens
- Forms adapt to mobile layout
- Touch-friendly buttons and controls

## Future Enhancements
- [ ] Export absence reports to CSV/PDF
- [ ] Email notifications for marked absences
- [ ] Absence appeal system for members
- [ ] Monthly/yearly attendance reports
- [ ] Attendance trends and charts
- [ ] Bulk absence marking for meetings
- [ ] Excuse submission with file attachments
