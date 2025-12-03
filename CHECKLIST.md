# ✅ Portfolio Setup Checklist

Complete these tasks in order. Check off each one as you complete it!

## Phase 1: Initial Setup (20 minutes)

### Local Setup
- [ ] Open terminal in project folder
- [ ] Run `npm install` (wait for completion)
- [ ] Verify no errors in npm output
- [ ] Run `npm run dev` to start dev server
- [ ] Confirm app opens in browser at `http://localhost:3000`

### Project Verification
- [ ] See portfolio landing page
- [ ] Click "Admin" button (should show login form)
- [ ] Test dark mode toggle (moon icon in nav)
- [ ] Check mobile responsiveness (resize browser)
- [ ] Verify all sections are visible (scroll down)

---

## Phase 2: Firebase Setup (15 minutes)

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Create new project named "shakil-portfolio"
- [ ] Wait for project creation to complete
- [ ] Go to Project Settings (⚙️ icon)

### Get Credentials
- [ ] Find "Your apps" section
- [ ] Create web app if needed (click </> icon)
- [ ] Copy the firebaseConfig object completely
- [ ] Create `.env.local` file in project root
- [ ] Paste and fill all 6 environment variables:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`

### Enable Services
- [ ] Go to Authentication → Sign-in method
- [ ] Enable Email/Password
- [ ] Click Save
- [ ] Go to Firestore Database
- [ ] Click "Create database"
- [ ] Select "Production mode"
- [ ] Choose region (default: us-central1)
- [ ] Click "Create"

### Test Firebase Connection
- [ ] Restart dev server: `npm run dev`
- [ ] Check browser console (F12) for errors
- [ ] If no errors: Firebase is connected! ✅

---

## Phase 3: Create Admin Account (5 minutes)

### Setup Admin in Firebase
- [ ] Go to Firebase Console → Authentication
- [ ] Click "Add user"
- [ ] Enter admin email (your email)
- [ ] Enter password (strong password!)
- [ ] Click "Add user"
- [ ] Go back to Project Settings
- [ ] Copy your UID (long random string)

### Save Admin UID
- [ ] Create file: `src/config/admin.ts`
- [ ] Add: `export const ADMIN_UID = "your_uid_here"`
- [ ] Update `AdminDashboard.tsx` to use it

### Test Admin Login
- [ ] Click "Admin" button in navbar
- [ ] Enter your email
- [ ] Enter your password
- [ ] Click "Login"
- [ ] Should see dashboard (if not, check console for errors)

---

## Phase 4: Customize Content (30 minutes)

### Update Your Information
- [ ] Open `src/store/slices/portfolioSlice.ts`
- [ ] Update projects array with your real projects
- [ ] Add App Store/Play Store links if applicable
- [ ] Add GitHub links where applicable
- [ ] Verify data structure matches Project interface

### Update Skills
- [ ] In same file, edit skills array
- [ ] Update skill titles and descriptions
- [ ] Choose appropriate icon names
- [ ] Icon options: `smartphone`, `layers`, `code`, `database`, `brain`, `box`

### Update Case Studies
- [ ] Edit caseStudies array
- [ ] Update client names, challenges, solutions, impacts
- [ ] Add real image URLs (from Unsplash or your server)

### Test Changes
- [ ] Reload dev server (should hot-reload)
- [ ] Verify projects display correctly
- [ ] Check all sections for your content
- [ ] Test on mobile (responsive)

---

## Phase 5: Brand Customization (20 minutes)

### Update Colors
- [ ] Open `tailwind.config.js`
- [ ] Modify color palette if desired
- [ ] Primary colors in `extend.colors`
- [ ] Test dark mode colors

### Update Typography
- [ ] If needed, update font in `styles/globals.css`
- [ ] Adjust heading sizes in components
- [ ] Test readability

### Update Social Links
- [ ] Find CONFIG object in components or store
- [ ] Update GitHub profile URL
- [ ] Update LinkedIn profile URL
- [ ] Update email address
- [ ] Update phone number

---

## Phase 6: Data Integration (Optional - for later)

### Connect Projects to Firestore
- [ ] In Admin Dashboard, click "Add Project"
- [ ] Fill in project details
- [ ] Submit form
- [ ] Check Firestore console for new document
- [ ] (Note: Full integration requires backend functions)

### Store Contact Messages
- [ ] Fill out contact form on site
- [ ] Check admin dashboard "Messages" tab
- [ ] (Note: Firebase sync requires security rules update)

---

## Phase 7: Testing (15 minutes)

### Desktop Testing
- [ ] Test all navigation links
- [ ] Try dark/light mode
- [ ] Verify all animations work
- [ ] Check form validation
- [ ] Test admin panel features

### Mobile Testing
- [ ] Resize to mobile (< 768px)
- [ ] Test hamburger menu
- [ ] Verify touch interactions
- [ ] Check image scaling
- [ ] Test form on mobile

### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Safari
- [ ] Test in Firefox
- [ ] Check console for warnings

---

## Phase 8: Deployment Prep (10 minutes)

### Code Cleanup
- [ ] Remove console.log statements
- [ ] Remove unused imports
- [ ] Run `npm run build` successfully
- [ ] Check build output for errors
- [ ] Verify `dist/` folder created

### Production Build
- [ ] Run `npm run build`
- [ ] Run `npm run preview` to test build
- [ ] Verify portfolio works in preview
- [ ] Test dark mode in preview
- [ ] Test admin login in preview

### Prepare for Deployment
- [ ] Choose hosting platform:
  - [ ] Vercel (easiest for Vite)
  - [ ] Firebase Hosting
  - [ ] Netlify
- [ ] Create account on chosen platform
- [ ] Prepare GitHub repo (git init, add remote)

---

## Phase 9: Deployment (Choose One)

### Option A: Vercel Deployment
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run `vercel` in project folder
- [ ] Connect GitHub repo
- [ ] Add environment variables (.env)
- [ ] Deploy
- [ ] Get your URL
- [ ] Visit URL and test

### Option B: Firebase Hosting
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Run `firebase login`
- [ ] Run `firebase init hosting`
- [ ] Select your Firebase project
- [ ] Run `npm run build`
- [ ] Run `firebase deploy`
- [ ] Get your URL
- [ ] Visit URL and test

### Option C: Netlify
- [ ] Push code to GitHub
- [ ] Connect repo to Netlify
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get your URL
- [ ] Visit URL and test

---

## Phase 10: Post-Deployment (Ongoing)

### Monitor and Maintain
- [ ] Add Google Analytics (optional)
- [ ] Monitor contact messages regularly
- [ ] Update projects as you complete new work
- [ ] Keep dependencies updated: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`

### Continuous Improvement
- [ ] Collect user feedback
- [ ] Track which projects get most views
- [ ] Optimize images for faster loading
- [ ] Add new features based on needs
- [ ] Keep portfolio content fresh

---

## 📝 Notes & Reminders

### Troubleshooting
- If Firebase keys not working:
  - [ ] Double-check `.env.local` has all 6 variables
  - [ ] Verify exact spelling (copy-paste from Firebase)
  - [ ] Restart dev server after updating .env
  - [ ] Clear browser cache (Ctrl+Shift+Delete)

- If components not rendering:
  - [ ] Check browser console for errors (F12)
  - [ ] Verify Redux slices have correct data
  - [ ] Test with mock data first

- If admin dashboard blank:
  - [ ] Confirm you created Firestore database
  - [ ] Check admin UID is correct
  - [ ] Look for errors in console (F12)

### Security Checklist
- [ ] Never commit `.env.local` to GitHub
- [ ] Use `.env.example` as template
- [ ] Keep admin password strong
- [ ] Don't share Firebase keys publicly
- [ ] Enable 2FA on Firebase account

---

## 🎉 You're Done When:

- [ ] Portfolio loads and displays all content
- [ ] Dark mode works
- [ ] Admin dashboard shows login
- [ ] Can log in with your admin account
- [ ] Contact form accepts messages
- [ ] Mobile view looks good
- [ ] Everything deployed and live
- [ ] You've shared the URL with friends!

---

## 📞 Quick References

**Start Dev Server:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
npm run preview
```

**Firebase Console:**
https://console.firebase.google.com

**Environment Variables Template:**
See `.env.example` in project root

---

**Happy building! 🚀 Check off tasks as you complete them. You've got this! 💪**
