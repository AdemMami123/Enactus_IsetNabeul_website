# Enactus ISET Nabeul - Project Setup Instructions

## Tech Stack
- Framework: Next.js (latest version, app router)
- Styling: TailwindCSS v3.3
- UI Library: ShadCN/UI
- Animations: Framer Motion
- Backend/Storage: Firebase (authentication + data storage)
- Image Hosting: Cloudinary

## Setup Progress

- [x] Create copilot-instructions.md file
- [x] Scaffold Next.js project
- [x] Install core dependencies
- [x] Setup ShadCN/UI
- [x] Configure Firebase
- [x] Configure Cloudinary
- [x] Verify installation and compile

## Current Implementation

### Page 1 - Home Screen (COMPLETED)
- ✅ Center-positioned Enactus and ISET Nabeul logos with hover animations
- ✅ Floating animated member profile images (dynamic from Firestore)
- ✅ Minimalist navbar with functional Login/Logout
- ✅ Fully responsive layout
- ✅ Dark gradient background with animated yellow accents
- ✅ Framer Motion animations throughout
- ✅ Hover tooltips showing member name and position

### Authentication System (COMPLETED)
- ✅ Firebase email/password authentication
- ✅ Role-based access control (Admin & Member)
- ✅ Protected routes with automatic redirection
- ✅ User registration with automatic role assignment
- ✅ Login/Logout functionality
- ✅ Beautiful animated login modal
- ✅ User profile display in navbar
- ✅ Dashboard page for all authenticated users
- ✅ Admin panel (admin-only access)
- ✅ Session persistence and real-time auth state
- ✅ Firestore integration for user profiles

### Dashboard with Sidebar (COMPLETED)
- ✅ Responsive sidebar layout with mobile hamburger menu
- ✅ User profile display with role badge
- ✅ Navigation items: Dashboard, Profile, Absence List, Admin Panel
- ✅ Admin-only menu filtering
- ✅ Logout functionality in sidebar
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive with backdrop overlay

### Profile Management (COMPLETED)
- ✅ Profile editing page at /dashboard/profile
- ✅ Cloudinary image upload integration
- ✅ Update displayName, position, bio, phone
- ✅ Profile photo upload with preview
- ✅ Sync with both users and members collections
- ✅ Real-time profile updates

### Absence Management System (COMPLETED)
- ✅ Comprehensive absence tracking at /dashboard/absence
- ✅ Admin can mark members absent with date and reason
- ✅ Edit and delete absence records (admin only)
- ✅ View all absences in real-time
- ✅ Member statistics with absence counts
- ✅ Color-coded absence stats (green/yellow/red)
- ✅ Recent absences list with details
- ✅ Statistical overview cards (total members, absences, monthly)
- ✅ Firestore security rules for absences collection
- ✅ Real-time data fetching and updates

## Design System
- Primary Color: #FFD600 (Enactus Yellow)
- Secondary Color: #000000 (Black)
- Typography: Inter font family
- Border Radius: Medium (0.5rem default)

## Notes
Project is set up for Enactus ISET Nabeul university club. 
Firebase authentication is fully functional with role-based access control.
Users can register and login with email/password.
Two roles: Admin (full access) and Member (limited access).
Dashboard features sidebar navigation with profile and absence management.
Absence tracking system allows admins to mark, edit, and delete absences.
Member images are fetched dynamically from Firestore members collection.
Profile photos uploaded to Cloudinary (cloud: dxblaolor, preset: enactus_members).

## Firestore Collections
- `users/{uid}`: Private user data (email, role, displayName, position, bio, phone, photoURL)
- `members/{uid}`: Public member data for homepage (name, photoURL, position, userId)
- `absences/{absenceId}`: Absence tracking (userId, userName, meetingDate, reason, markedBy)

## Next Features to Implement
- Add real Enactus & ISET Nabeul logos
- Create additional pages (About, Projects, Team, Contact)
- Export absence reports to CSV/PDF
- Email notifications for marked absences
- Attendance trends and charts
- Bulk absence marking for meetings
