# Setup Guide for Shakil's Portfolio

## Project Overview
This is a modern, Apple-style portfolio website for Shakil Khan - Flutter Developer. It features:
- **Redux State Management**: Centralized state for portfolio data, auth, and UI
- **Firebase Integration**: Authentication and Firestore for dynamic content
- **Admin Dashboard**: Manage projects, skills, and contact messages
- **Dark Mode**: Full light/dark theme support
- **3D Background**: Interactive Three.js animations
- **Responsive Design**: Mobile-first, tablet & desktop optimized

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "shakil-portfolio" (or your preference)
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Step 2: Get Firebase Credentials
1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Under **General** tab, find **Your apps** section
3. Click on the web app icon (</> ) or create new web app
4. Copy the configuration object
5. Create `.env.local` file in project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Step 3: Enable Firebase Services
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Go to **Firestore Database** → **Create database**
4. Start in **Production mode**
5. Choose your region (closest to your users)

#### Step 4: Set Firestore Rules
Go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth.uid == "YOUR_ADMIN_UID";
    }
    // Public collections
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == "YOUR_ADMIN_UID";
    }
    match /messages/{document=**} {
      allow create: if true;
      allow read, write: if request.auth.uid == "YOUR_ADMIN_UID";
    }
  }
}
```

### 3. Project Structure
```
src/
├── components/          # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── CaseStudies.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── AdminDashboard.tsx
├── store/              # Redux store
│   ├── index.ts
│   └── slices/
│       ├── portfolioSlice.ts
│       ├── authSlice.ts
│       ├── contactSlice.ts
│       └── uiSlice.ts
├── config/
│   └── firebase.ts     # Firebase configuration
├── styles/
│   └── globals.css     # Tailwind + custom styles
├── App.tsx
└── main.tsx
```

### 4. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 5. Environment Variables
Create `.env.local` with your Firebase credentials:
- Copy `.env.example` to `.env.local`
- Fill in your Firebase project credentials

## Features

### Redux State Management
- **Portfolio State**: Projects, skills, case studies
- **Auth State**: User authentication and authorization
- **Contact State**: Message management
- **UI State**: Dark mode, mobile menu, active sections

### Admin Dashboard
- **Authentication**: Email/password login (Firebase Auth)
- **Project Management**: Add, edit, delete projects
- **Message Management**: View and manage contact messages
- **Analytics**: Quick stats dashboard

### Dark Mode
- Automatic system preference detection
- Manual toggle in navigation
- Smooth transitions between themes
- Persistent preference (optional localStorage)

### Responsive Design
- Mobile-first approach
- Tablet optimizations
- Desktop refinements
- Touch-friendly interactions

## Customization

### Update Personal Info
Edit `src/store/slices/portfolioSlice.ts` to update:
- Your projects data
- Skills and expertise
- Case studies
- Contact information

### Modify Colors
Edit `tailwind.config.js` to customize:
- Primary colors
- Accent colors
- Dark mode colors

### Change Content
Edit `src/components/` files to update:
- Bio and tagline
- Project descriptions
- Case study details
- Social links

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build for production
npm run build

# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
# Update package.json homepage
# Deploy using gh-pages package
```

## Firebase Hosting (Best for this project)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy
```

## Next Steps

1. **Add your projects**: Update `portfolioSlice.ts` with your real projects
2. **Connect Firebase**: Set up authentication and Firestore
3. **Customize colors**: Update Tailwind config with your brand colors
4. **Add analytics**: Connect Google Analytics or Vercel Analytics
5. **SEO optimization**: Update meta tags in `index.html`
6. **Domain setup**: Point your custom domain to deployment

## Support & Issues

- For Redux questions: Check [Redux Toolkit docs](https://redux-toolkit.js.org/)
- For Firebase issues: Check [Firebase docs](https://firebase.google.com/docs)
- For Tailwind help: Check [Tailwind docs](https://tailwindcss.com/docs)

---

**Built with ❤️ using React, Redux, Firebase, Tailwind CSS, and Three.js**
