# Bureau Role System - Quick Reference Guide

## 🎯 Overview
The bureau role system adds organizational positions to members while keeping the existing admin/member authentication system intact.

## 🏢 Available Bureau Roles

1. **Team Leader** - Highest leadership position
2. **Co-Leader** - Second in command
3. **Partnerships Manager** - Manages external partnerships
4. **Finance Manager** - Handles financial operations
5. **R&D Manager** - Research and development lead
6. **HR Manager** - Human resources management
7. **Operations Manager** - Day-to-day operations
8. **Marketing & Media Manager** - Marketing and communications
9. **Project Manager** - Project coordination
10. **Basic Member** - Default role for all members

## 👤 User Perspective

### Profile Page View
```
┌─────────────────────────────────────────┐
│  📧 Email: member@enactus.com           │
│  🛡️  Role: member                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🛡️  Bureau Role                        │
│  ┌───────────────────────────────────┐  │
│  │  Co-Leader  🔒                    │  │
│  └───────────────────────────────────┘  │
│  (Contact admin to update)              │
│                                         │
│  Your organizational position within    │
│  Enactus ISET Nabeul. Only admins can  │
│  modify this field.                     │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Clearly visible in highlighted section
- ✅ Read-only (locked) for members
- ✅ Helpful explanation text
- ✅ Professional visual design

## 👨‍💼 Admin Perspective

### Admin Panel View
```
┌───────────────────────────────────────────────────────────┐
│  Filter by Bureau Role: [All Bureau Roles ▼]              │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  📧 member@enactus.com  ⏰ Pending                        │
│  Auth Role: member | Registered: 10/22/2025               │
│  ─────────────────────────────────────────────────────    │
│  🛡️  Bureau Position:  [Co-Leader]  [Edit]               │
│                                                            │
│  [✓ Approve]  [✗ Reject]                                  │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│  📧 admin@enactus.com  ✓ Approved                         │
│  Auth Role: admin | Registered: 10/20/2025                │
│  ─────────────────────────────────────────────────────    │
│  🛡️  Bureau Position:  [Team Leader ▼]  [💾]  [✗]        │
│        ↑ Edit mode active                                 │
└───────────────────────────────────────────────────────────┘
```

**Admin Capabilities:**
- ✅ View all users with their bureau roles
- ✅ Edit any user's bureau role inline
- ✅ Filter users by specific bureau positions
- ✅ Color-coded role badges
- ✅ Save/Cancel edit actions
- ✅ Immediate visual feedback

## 🔄 Workflow Examples

### Scenario 1: New Member Registration
```
1. User registers → bureauRole = "Basic Member" (automatic)
2. Admin approves account
3. User logs in and sees "Basic Member" on profile
4. Admin later promotes to "Finance Manager"
5. User sees updated role on next profile visit
```

### Scenario 2: Admin Assigns Bureau Role
```
1. Admin opens Admin Panel
2. Clicks "Edit" button next to user's bureau role
3. Dropdown menu appears with all 10 roles
4. Admin selects "Marketing & Media Manager"
5. Clicks save button (💾)
6. Success message appears
7. User sees new role immediately in profile
```

### Scenario 3: Filtering Users
```
1. Admin wants to see all managers
2. Opens bureau role filter dropdown
3. Selects "Finance Manager"
4. Only finance managers are shown
5. Can combine with status filter (pending/approved)
6. View specific subset of users quickly
```

## 🎨 Color Coding

**Role Badge Colors:**
- 🟣 Purple: Team Leader (highest authority)
- 🟣 Indigo: Co-Leader (second in command)
- 🔵 Blue: All Manager positions (6 roles)
- ⚪ Gray: Basic Member (default)

## 📊 Data Structure

### Before Update
```typescript
{
  uid: "user123",
  email: "member@enactus.com",
  role: "member",           // Only auth role
  accountStatus: "approved"
}
```

### After Update
```typescript
{
  uid: "user123",
  email: "member@enactus.com",
  role: "member",                    // Auth role (unchanged)
  bureauRole: "Co-Leader",           // NEW: Organization role
  accountStatus: "approved",
  bureauRoleUpdatedAt: Timestamp     // Tracking field
}
```

## 🔐 Security Model

### Two-Layer System

**Layer 1: Authentication (Unchanged)**
```
admin → Full system access
member → Limited access
```

**Layer 2: Organization (New)**
```
Team Leader → Highest organizational position
Co-Leader → Second-highest position
[Managers] → Department leads
Basic Member → Standard member
```

**Important:** Bureau roles are currently for display only. They don't affect Firestore security rules.

## 💡 Key Benefits

1. **Clear Hierarchy** - Visual representation of team structure
2. **Admin Control** - Only admins can assign/modify roles
3. **User Transparency** - Members see their position clearly
4. **Easy Management** - Inline editing, no complex forms
5. **Flexible Filtering** - Find specific roles quickly
6. **Backward Compatible** - Existing users work seamlessly
7. **Future Ready** - Foundation for role-based features

## 🚀 Quick Actions

### For Admins
```bash
1. Open /admin page
2. Find user in list
3. Click "Edit" next to bureau role
4. Select new role from dropdown
5. Click save icon
6. Done! ✓
```

### For Members
```bash
1. Open /dashboard/profile
2. View your bureau role (read-only section)
3. Contact admin if role needs updating
```

## 📱 Responsive Design

All bureau role features are fully responsive:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Large screens (1440px+)

## 🐛 Troubleshooting

**Q: User doesn't see their bureau role**
- A: They need to log out and log back in

**Q: Admin can't edit bureau roles**
- A: Verify they have `role: "admin"` in Firestore

**Q: Old users show "undefined"**
- A: System auto-assigns "Basic Member" on login

**Q: Changes don't save**
- A: Check Firestore rules and network connectivity

## 📖 Documentation

For complete technical details, see:
- `BUREAU_ROLE_SYSTEM.md` - Full implementation guide
- `contexts/AuthContext.tsx` - Type definitions
- `components/BureauRoleManager.tsx` - Role editor component
- `components/UserApprovalPanel.tsx` - Admin interface

---

**Last Updated:** October 22, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
