# Shakil's Portfolio - Next.js + Redux + Firebase

A modern, Apple-inspired portfolio website for Shakil Khan - Flutter Developer with admin dashboard, dark mode, and 3D animations.

## ✨ Features

- 🎨 **Apple-Style Design**: Minimal, sleek, and modern aesthetic
- 🌙 **Dark Mode**: Full light/dark theme support
- 📱 **Responsive**: Mobile-first design, optimized for all devices
- 🎭 **3D Background**: Interactive Three.js animations that follow cursor
- 📦 **Redux State Management**: Centralized state for portfolio, auth, and UI
- 🔐 **Admin Dashboard**: Manage projects, skills, and messages
- 🔥 **Firebase Integration**: Authentication, Firestore database, Storage
- ⚡ **Fast**: Built with Vite for instant HMR and optimized builds
- 🎯 **TypeScript**: Type-safe development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file with Firebase config
cp .env.example .env
# Then edit .env and add your Firebase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Copy your config credentials
3. Create `.env` file from `.env.example` and update with your Firebase credentials
4. Enable Email/Password authentication
5. Create Firestore database

See [SETUP.md](./SETUP.md) for detailed instructions.

## 📂 Project Structure

```
src/
├── components/              # React components
├── store/                  # Redux store & slices
├── config/                 # Firebase config
├── styles/                 # Global styles
├── App.tsx                 # Main app component
└── main.tsx                # Entry point

public/                     # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Auth, Firestore, Storage)
- **3D Graphics**: Three.js
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📚 Key Components

### Navigation
- Sticky navigation with scroll detection
- Dark mode toggle
- Mobile menu
- Admin access button

### Hero Section
- Profile image
- Animated title and subtitle
- Call-to-action buttons
- Social links

### Skills
- 6 core skill categories
- Icons and descriptions
- Grid layout with hover effects

### Projects
- Featured projects showcase
- App Store & Play Store links
- GitHub links
- Tech stack tags

### Case Studies
- Client testimonials
- Problem-solution-impact format
- Alternating layout
- Image galleries

### Contact
- Contact form with validation
- Message storage in Redux + Firebase
- Success feedback
- Direct contact info

### Admin Dashboard
- Login screen
- Project management (CRUD)
- Message management
- Analytics overview
- Dark mode support

## 🔐 Authentication

The admin dashboard uses Firebase Email/Password authentication. To set up:

1. Enable Email/Password in Firebase Auth
2. Create admin user account
3. Update Firestore security rules to restrict admin access

## 📊 Redux Store Structure

```typescript
store: {
  portfolio: {
    projects: Project[]
    caseStudies: CaseStudy[]
    skills: Skill[]
    loading: boolean
    error: string | null
  },
  auth: {
    isAuthenticated: boolean
    user: { uid: string; email: string } | null
    loading: boolean
    error: string | null
  },
  contact: {
    messages: ContactMessage[]
    loading: boolean
    error: string | null
  },
  ui: {
    isDarkMode: boolean
    isMobileMenuOpen: boolean
    activeSection: string
  }
}
```

## 🎨 Customization

### Update Content
Edit your portfolio data in `src/store/slices/portfolioSlice.ts`

### Change Colors
Modify Tailwind config in `tailwind.config.js`

### Add New Projects
Dispatch `addProject` action from Admin Dashboard

### Update Skills
Edit the skills array in `portfolioSlice.ts`

## 📦 Building & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Firebase Hosting
```bash
firebase deploy
```

### Deploy to Netlify
Drag & drop the `dist` folder to Netlify

## 🔗 Links

- **Portfolio**: [Your deployed URL]
- **GitHub**: [Your GitHub]
- **LinkedIn**: [Your LinkedIn]
- **Email**: shakilkhanhu@gmail.com
- **Phone**: +880 1647-383-443

## 📄 License


## 🙏 Credits

Built with ❤️ using:
- React & Redux Toolkit
- Firebase
- Tailwind CSS
- Three.js
- Vite

---

**Start here**: Read [SETUP.md](./SETUP.md) for complete setup instructions.
