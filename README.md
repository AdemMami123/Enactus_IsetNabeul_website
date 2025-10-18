# Enactus ISET Nabeul - Official Website

A modern, animated website for the Enactus club at ISET Nabeul, built with Next.js and featuring beautiful animations and dynamic content.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v3.3
- **UI Library**: ShadCN/UI
- **Animations**: Framer Motion
- **Backend/Storage**: Firebase (authentication + data storage)
- **Image Hosting**: Cloudinary

## 🎨 Design Features

- Modern, elegant design with Enactus brand colors (#FFD600 yellow and black)
- Smooth animations using Framer Motion
- Floating member profile images
- Responsive design for all devices
- Dark gradient background with animated accents

## 📋 Current Implementation

### Page 1 - Home Screen ✅
- Center-positioned Enactus and ISET Nabeul logos
- Floating animated member profile images
- Minimalist navbar with Login button (styled, non-functional)
- Fully responsive layout
- Beautiful gradient background with animated effects

### Authentication System ✅
- **Email/Password Authentication** via Firebase
- **Role-Based Access Control** (Admin & Member roles)
- **Protected Routes** with automatic redirection
- **User Registration & Login** with validation
- **Session Persistence** across page reloads
- **Beautiful Login Modal** with animations
- **User Profile Display** in navbar
- **Dashboard** for authenticated users
- **Admin Panel** for admin-only access

See [AUTHENTICATION.md](./AUTHENTICATION.md) for complete documentation.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Cloudinary account (for image hosting)
- Firebase project (for authentication and data storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd enactus2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Update the `.env.local` file with your credentials:
   
   ```env
   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=599166385256219
   CLOUDINARY_API_SECRET=qU8QmTBglazuXc1skK4BboasB3w
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
enactus2/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # ShadCN UI components
│   │   └── button.tsx
│   ├── Navbar.tsx           # Navigation bar
│   ├── CenterLogos.tsx      # Center logo display
│   └── FloatingMembers.tsx  # Animated member images
├── lib/                     # Utility functions
│   ├── utils.ts            # General utilities
│   ├── cloudinary.ts       # Cloudinary config
│   └── firebase.ts         # Firebase config
├── public/                  # Static assets
└── .env.local              # Environment variables
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Next Steps

- [x] Add real member images from Cloudinary
- [x] Implement Firebase authentication for login
- [ ] Create additional pages (About, Projects, Team, Contact)
- [ ] Add admin dashboard for content management
- [ ] Connect Firebase to fetch real member data dynamically
- [ ] Add actual Enactus and ISET Nabeul logos
- [ ] Implement user management for admins
- [ ] Add profile editing functionality

## 📦 Key Dependencies

- `next`: ^15.5.6
- `react`: ^19.2.0
- `framer-motion`: ^12.23.24
- `firebase`: ^12.4.0
- `cloudinary`: ^2.7.0
- `tailwindcss`: ^3.3.0

## 🎨 Color Palette

- **Primary Yellow**: #FFD600
- **Primary Black**: #000000
- **Background**: Dark gradient (gray-900 to black)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

This is a project for Enactus ISET Nabeul. For any changes or contributions, please contact the club administrators.

## 📄 License

ISC

---

**Built with ❤️ by Enactus ISET Nabeul**
