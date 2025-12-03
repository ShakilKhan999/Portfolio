# Firebase Setup & Admin Dashboard Guide 🔥

## Current Status
✅ Firebase configuration file created  
✅ Admin Dashboard UI complete  
✅ Redux state ready (auth, contact, portfolio slices)  
⏳ **TODO: Connect Firebase credentials & enable features**

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Name it: `shakil-portfolio`
4. Accept terms and create
5. When ready, click **Continue**

---

## Step 2: Get Firebase Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **"Your apps"** section, click **"Web"** icon (</> symbol)
3. Register your app as `shakil-portfolio-web`
4. Copy the Firebase config code

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "shakil-portfolio-xxx.firebaseapp.com",
  projectId: "shakil-portfolio-xxx",
  storageBucket: "shakil-portfolio-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

---

## Step 3: Create Environment File

1. In project root, create `.env.local` file (copy from `.env.example`)
2. Fill in the Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=shakil-portfolio-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shakil-portfolio-xxx
VITE_FIREBASE_STORAGE_BUCKET=shakil-portfolio-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
```

3. Save the file (don't commit it - it's in `.gitignore`)

---

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication** (left menu)
2. Click **"Get Started"**
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click Save
4. Go to **Users** tab
5. Click **"Add user"**
6. Create admin account:
   - Email: `admin@shakil-portfolio.com`
   - Password: (strong password - save it!)

---

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Choose **Start in test mode** (for development)
4. Select region: **closest to you**
5. Click **Enable**

### Create Collections

Create these collections (click "Start collection"):

#### 1. **projects** collection
```
Document ID: auto-generated
Fields:
- id: (auto)
- title: string
- description: string
- image: string (URL)
- tech: array
- appStore: string (URL, optional)
- playStore: string (URL, optional)
- githubLink: string (URL, optional)
- featured: boolean
```

#### 2. **caseStudies** collection
```
Document ID: auto-generated
Fields:
- id: (auto)
- title: string
- client: string
- image: string (URL)
- challenge: string
- solution: string
- impact: string
```

#### 3. **messages** collection
```
Document ID: auto-generated
Fields:
- name: string
- email: string
- message: string
- timestamp: timestamp
- read: boolean
```

---

## Step 6: Security Rules

In Firestore, go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for everyone
    match /projects/{document=**} {
      allow read: if true;
    }
    match /caseStudies/{document=**} {
      allow read: if true;
    }
    
    // Only authenticated users can read/write messages
    match /messages/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**

---

## Step 7: Test Firebase Connection

1. Restart dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Check Console - should NOT show Firebase error warning
4. You should see the admin dashboard available

---

## Admin Dashboard Features (After Setup)

Once Firebase is connected, the Admin Dashboard provides:

### 📊 Overview Tab
- Total projects count
- Unread messages count
- Total case studies
- Stats dashboard

### 📁 Projects Tab
- View all projects
- Add new project
- Edit existing projects
- Delete projects
- Direct Firebase sync

### 💬 Messages Tab
- View contact form submissions
- Mark as read/unread
- Delete messages
- Timestamps

### 🔐 Authentication
- Login with email/password
- Session persistence
- Logout functionality

---

## Environment Variables Reference

All variables go in `.env.local`:

```env
# Firebase Credentials
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Troubleshooting

**Q: Firebase console shows error?**
- Check `.env.local` exists in root directory
- Verify all credentials are copied correctly
- Restart dev server: `npm run dev`

**Q: Can't login to admin panel?**
- Go to Firebase Console > Authentication
- Make sure you created the admin user
- Check email/password combination

**Q: Firestore queries not working?**
- Verify Security Rules are published
- Check collection names match exactly (case-sensitive)
- Ensure authenticated user has permissions

**Q: "Firebase not configured" warning?**
- `.env.local` file missing
- Environment variables not loaded
- Restart dev server after creating `.env.local`

---

## Next Steps

1. ✅ Complete Firebase setup above
2. Create test data in Firestore
3. Login to admin dashboard
4. Test CRUD operations
5. Deploy to production (Vercel/Firebase Hosting)

## Production Deployment

For production, enable:
- Email verification
- Stronger security rules
- Custom domain
- SSL certificate
- Analytics

See `SETUP.md` for deployment instructions.
