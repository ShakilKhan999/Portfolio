import React, { useMemo, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
// Firebase Storage upload removed: replaced by external-link flow
import { X, LogOut, Plus, Edit2, Trash2, Check, XCircle } from 'lucide-react'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import type { RootState } from '../store'
import { auth, db } from '../config/firebase'
import { loginSuccess, loginError, logout as logoutAction, setLoading as setAuthLoading } from '../store/slices/authSlice'
import { ContactMessage } from '../store/slices/contactSlice'
import { AboutMe, CaseStudy, Experience, Project, ResearchNote, Skill } from '../store/slices/portfolioSlice'

interface AdminDashboardProps {
  onClose: () => void
}

interface ProjectFormState {
  id: string
  title: string
  description: string
  image: string
  link: string
  tech: string
  appStore: string
  playStore: string
  githubLink: string
  featured: boolean
}

interface CaseStudyFormState {
  id: string
  title: string
  client: string
  challenge: string
  solution: string
  impact: string
  image: string
}

interface SkillFormState {
  id: string
  title: string
  description: string
  icon: string
}

interface NoteFormState {
  id: string
  title: string
  summary: string
  link: string
  image: string
  createdAt?: number
  status?: 'failed' | 'normal'
}

interface AboutMeFormState {
  id: string
  title: string
  bio: string
  image: string
  highlights: string
}

const emptyProjectForm: ProjectFormState = {
  id: '',
  title: '',
  description: '',
  image: '',
  link: '',
  tech: '',
  appStore: '',
  playStore: '',
  githubLink: '',
  featured: false,
}

const emptyCaseStudyForm: CaseStudyFormState = {
  id: '',
  title: '',
  client: '',
  challenge: '',
  solution: '',
  impact: '',
  image: '',
}

const emptySkillForm: SkillFormState = {
  id: '',
  title: '',
  description: '',
  icon: 'code',
}

const emptyNoteForm: NoteFormState = {
  id: '',
  title: '',
  summary: '',
  link: '',
  image: '',
  createdAt: Date.now(),
  status: 'normal',
}

const emptyAboutMeForm: AboutMeFormState = {
  id: '',
  title: 'About Me',
  bio: '',
  image: '',
  highlights: '',
}

interface ExperienceFormState {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
  technologies: string
  logo: string
  current: boolean
}

const emptyExperienceForm: ExperienceFormState = {
  id: '',
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  technologies: '',
  logo: '',
  current: false,
}

// Note: Firebase Storage upload helpers removed because the project was not using a provisioned bucket.
// Admins should paste external image/asset URLs into the image fields instead.

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((state: RootState) => state.ui.isDarkMode)
  const authState = useAppSelector((state: RootState) => state.auth)
  const projects = useAppSelector((state: RootState) => state.portfolio.projects)
  const skills = useAppSelector((state: RootState) => state.portfolio.skills)
  const notes = useAppSelector((state: RootState) => state.portfolio.notes)
  const aboutMe = useAppSelector((state: RootState) => state.portfolio.aboutMe)
  const experiences = useAppSelector((state: RootState) => state.portfolio.experiences)
  const contactMessages = useAppSelector((state: RootState) => state.contact.messages)

  const unreadMessagesCount = useMemo(
    () => contactMessages.filter((message: ContactMessage) => !message.read).length,
    [contactMessages]
  )

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'experience' | 'notes' | 'aboutme' | 'messages'>('overview')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [projectFormState, setProjectFormState] = useState<'hidden' | 'create' | 'edit'>('hidden')
  const [projectForm, setProjectForm] = useState<ProjectFormState>(emptyProjectForm)
  const [projectSaving, setProjectSaving] = useState(false)
  

  const [caseStudyFormState, setCaseStudyFormState] = useState<'hidden' | 'create' | 'edit'>('hidden')
  const [caseStudyForm, setCaseStudyForm] = useState<CaseStudyFormState>(emptyCaseStudyForm)
  const [caseStudySaving, setCaseStudySaving] = useState(false)
  

  const [skillFormState, setSkillFormState] = useState<'hidden' | 'create' | 'edit'>('hidden')
  const [skillForm, setSkillForm] = useState<SkillFormState>(emptySkillForm)
  const [skillSaving, setSkillSaving] = useState(false)

  const [noteFormState, setNoteFormState] = useState<'hidden' | 'create' | 'edit'>('hidden')
  const [noteForm, setNoteForm] = useState<NoteFormState>(emptyNoteForm)
  const [noteSaving, setNoteSaving] = useState(false)

  const [aboutMeForm, setAboutMeForm] = useState<AboutMeFormState>(emptyAboutMeForm)
  const [aboutMeSaving, setAboutMeSaving] = useState(false)

  const [experienceFormState, setExperienceFormState] = useState<'hidden' | 'create' | 'edit'>('hidden')
  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(emptyExperienceForm)
  const [experienceSaving, setExperienceSaving] = useState(false)
  
  // CV (Drive link) management
  const [cvLink, setCvLink] = useState('')
  const [cvSaving, setCvSaving] = useState(false)
  // Profile image management
  const [profileImage, setProfileImage] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  
  // Analytics
  const [totalVisits, setTotalVisits] = useState<number>(0)

  const inputClasses = isDarkMode
    ? 'w-full px-4 py-2 rounded-lg border border-gray-800 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-white'
    : 'w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black'

  const cardClasses = isDarkMode ? 'border border-gray-800 bg-gray-900/40' : 'border border-gray-200 bg-gray-50'

  // File upload handlers removed. Admins should paste external image URLs into the image fields.

  // Normalize common shared links into direct image URLs that browsers can load (Google Drive, Dropbox)
  const normalizeExternalUrl = (raw: string) => {
    const url = (raw || '').trim()
    if (!url) return ''

    try {
      // Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      const driveFileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
      if (driveFileMatch) {
        return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`
      }

      // Google Drive share with id param: https://drive.google.com/open?id=FILE_ID
      const driveIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
      if (driveIdMatch) {
        return `https://drive.google.com/uc?export=view&id=${driveIdMatch[1]}`
      }

      // Dropbox shared links: change dl=0 to raw=1 to embed
      if (url.includes('dropbox.com')) {
        return url.replace('?dl=0', '?raw=1').replace('?dl=1', '?raw=1')
      }

      // Otherwise return as-is
      return url
    } catch (err) {
      return url
    }
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    dispatch(setAuthLoading(true))
    try {
      const credentials = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      dispatch(loginSuccess({ uid: credentials.user.uid, email: credentials.user.email ?? loginEmail }))
      setLoginEmail('')
      setLoginPassword('')
    } catch (error: any) {
      console.error(error)
      dispatch(loginError(error.message))
      alert('Login failed. Double-check your credentials and try again.')
    }
  }

  // Load current CV link and profileImage from Firestore (site metadata)
  React.useEffect(() => {
    let mounted = true
    const fetchMeta = async () => {
      try {
        const docRef = doc(db, 'siteMeta', 'global')
        const snap = await getDoc(docRef)
        if (!mounted) return
        if (snap.exists()) {
          const data = snap.data() as any
          setCvLink(data.cvLink ?? '')
          setProfileImage(data.profileImage ?? '')
        }
      } catch (err) {
        console.error('Failed to load site metadata:', err)
      }
    }
    fetchMeta()
    return () => {
      mounted = false
    }
  }, [])

  // Fetch analytics data
  React.useEffect(() => {
    let mounted = true
    const fetchAnalytics = async () => {
      try {
        const analyticsRef = doc(db, 'analytics', 'siteStats')
        const analyticsSnap = await getDoc(analyticsRef)
        if (!mounted) return
        if (analyticsSnap.exists()) {
          const data = analyticsSnap.data()
          setTotalVisits(data.totalVisits ?? 0)
        }
      } catch (err) {
        console.error('Failed to load analytics:', err)
      }
    }
    fetchAnalytics()
    return () => {
      mounted = false
    }
  }, [])

  const saveCvLink = async () => {
    setCvSaving(true)
    try {
      await setDoc(doc(db, 'siteMeta', 'global'), { cvLink: normalizeExternalUrl(cvLink.trim() || '') }, { merge: true })
      alert('CV link saved')
    } catch (err) {
      console.error(err)
      alert('Failed to save CV link')
    } finally {
      setCvSaving(false)
    }
  }

  const saveProfileImage = async () => {
    setProfileSaving(true)
    try {
      await setDoc(doc(db, 'siteMeta', 'global'), { profileImage: normalizeExternalUrl(profileImage.trim() || '') }, { merge: true })
      alert('Profile image saved')
    } catch (err) {
      console.error(err)
      alert('Failed to save profile image')
    } finally {
      setProfileSaving(false)
    }
  }

  const deleteProfileImage = async () => {
    if (!window.confirm('Delete the current profile image?')) return
    setProfileSaving(true)
    try {
      await setDoc(doc(db, 'siteMeta', 'global'), { profileImage: '' }, { merge: true })
      setProfileImage('')
      alert('Profile image deleted')
    } catch (err) {
      console.error(err)
      alert('Failed to delete profile image')
    } finally {
      setProfileSaving(false)
    }
  }

  const deleteCvLink = async () => {
    if (!window.confirm('Delete the current CV link?')) return
    setCvSaving(true)
    try {
      await setDoc(doc(db, 'siteMeta', 'global'), { cvLink: '' }, { merge: true })
      setCvLink('')
      alert('CV link deleted')
    } catch (err) {
      console.error(err)
      alert('Failed to delete CV link')
    } finally {
      setCvSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
      alert('Unable to log out right now. Please try again in a moment.')
    } finally {
      dispatch(logoutAction())
    }
  }

  const resetProjectForm = () => {
    setProjectForm({ ...emptyProjectForm })
    setProjectFormState('hidden')
  }

  const openProjectForm = (mode: 'create' | 'edit', project?: Project) => {
    if (mode === 'edit' && project) {
      setProjectForm({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        link: project.link,
        tech: project.tech.join(', '),
        appStore: project.appStore ?? '',
        playStore: project.playStore ?? '',
        githubLink: project.githubLink ?? '',
        featured: project.featured,
      })
    } else {
      setProjectForm({ ...emptyProjectForm })
    }
    setProjectFormState(mode)
  }

  const upsertProject = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!projectForm.title.trim()) {
      alert('Title is required')
      return
    }
    setProjectSaving(true)
    try {
      const payload: Record<string, unknown> = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        image: normalizeExternalUrl(projectForm.image.trim()),
        link: projectForm.link.trim(),
        tech: projectForm.tech
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        featured: projectForm.featured,
      }

      const optionalLinks = {
        appStore: projectForm.appStore.trim(),
        playStore: projectForm.playStore.trim(),
        githubLink: projectForm.githubLink.trim(),
      }

      Object.entries(optionalLinks).forEach(([key, value]) => {
        if (value) {
          payload[key] = value
        }
      })
      if (projectFormState === 'edit' && projectForm.id) {
        await updateDoc(doc(db, 'projects', projectForm.id), payload)
      } else {
        await addDoc(collection(db, 'projects'), payload)
      }
      resetProjectForm()
    } catch (error) {
      console.error(error)
      alert('Unable to save the project right now.')
    } finally {
      setProjectSaving(false)
    }
  }

  const removeProject = async (id: string) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await deleteDoc(doc(db, 'projects', id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete project')
    }
  }

  const resetCaseStudyForm = () => {
    setCaseStudyForm({ ...emptyCaseStudyForm })
    setCaseStudyFormState('hidden')
  }

  const openCaseStudyForm = (mode: 'create' | 'edit', study?: CaseStudy) => {
    if (mode === 'edit' && study) {
      setCaseStudyForm({
        id: study.id,
        title: study.title,
        client: study.client,
        challenge: study.challenge,
        solution: study.solution,
        impact: study.impact,
        image: study.image,
      })
    } else {
      setCaseStudyForm({ ...emptyCaseStudyForm })
    }
    setCaseStudyFormState(mode)
  }

  const upsertCaseStudy = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!caseStudyForm.title.trim()) {
      alert('Title is required')
      return
    }
    setCaseStudySaving(true)
    try {
      const payload = {
        title: caseStudyForm.title.trim(),
        client: caseStudyForm.client.trim(),
        challenge: caseStudyForm.challenge.trim(),
        solution: caseStudyForm.solution.trim(),
        impact: caseStudyForm.impact.trim(),
        image: normalizeExternalUrl(caseStudyForm.image.trim()),
      }
      if (caseStudyFormState === 'edit' && caseStudyForm.id) {
        await updateDoc(doc(db, 'caseStudies', caseStudyForm.id), payload)
      } else {
        await addDoc(collection(db, 'caseStudies'), payload)
      }
      resetCaseStudyForm()
    } catch (error) {
      console.error(error)
      alert('Unable to save the case study.')
    } finally {
      setCaseStudySaving(false)
    }
  }

  const removeCaseStudy = async (id: string) => {
    if (!window.confirm('Delete this case study?')) return
    try {
      await deleteDoc(doc(db, 'caseStudies', id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete case study')
    }
  }

  const resetSkillForm = () => {
    setSkillForm({ ...emptySkillForm })
    setSkillFormState('hidden')
  }

  const openSkillForm = (mode: 'create' | 'edit', skill?: Skill) => {
    if (mode === 'edit' && skill) {
      setSkillForm({ id: skill.id, title: skill.title, description: skill.description, icon: skill.icon })
    } else {
      setSkillForm({ ...emptySkillForm })
    }
    setSkillFormState(mode)
  }

  const upsertSkill = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!skillForm.title.trim()) {
      alert('Skill title is required')
      return
    }
    setSkillSaving(true)
    try {
      const payload = {
        title: skillForm.title.trim(),
        description: skillForm.description.trim(),
        icon: skillForm.icon.trim() || 'code',
      }
      if (skillFormState === 'edit' && skillForm.id) {
        await updateDoc(doc(db, 'skills', skillForm.id), payload)
      } else {
        await addDoc(collection(db, 'skills'), payload)
      }
      resetSkillForm()
    } catch (error) {
      console.error(error)
      alert('Unable to save the skill')
    } finally {
      setSkillSaving(false)
    }
  }

  const removeSkill = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return
    try {
      await deleteDoc(doc(db, 'skills', id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete skill')
    }
  }

  const resetNoteForm = () => {
    setNoteForm({ ...emptyNoteForm, createdAt: Date.now() })
    setNoteFormState('hidden')
  }

  const openNoteForm = (mode: 'create' | 'edit', note?: ResearchNote) => {
    if (mode === 'edit' && note) {
      setNoteForm({
        id: note.id,
        title: note.title,
        summary: note.summary,
        link: note.link ?? '',
        image: note.image ?? '',
        createdAt: note.createdAt,
        status: (note as any).status ?? 'normal',
      })
    } else {
      setNoteForm({ ...emptyNoteForm, createdAt: Date.now() })
    }
    setNoteFormState(mode)
  }

  const upsertNote = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!noteForm.title.trim()) {
      alert('Note title is required')
      return
    }
    setNoteSaving(true)
    try {
      const payload = {
        title: noteForm.title.trim(),
        summary: noteForm.summary.trim(),
        link: noteForm.link.trim() || undefined,
        image: normalizeExternalUrl(noteForm.image.trim()) || undefined,
        createdAt: noteFormState === 'edit' ? noteForm.createdAt ?? Date.now() : Date.now(),
        status: noteForm.status || 'normal',
      }
      if (noteFormState === 'edit' && noteForm.id) {
        await updateDoc(doc(db, 'notes', noteForm.id), payload)
      } else {
        await addDoc(collection(db, 'notes'), payload)
      }
      resetNoteForm()
    } catch (error) {
      console.error(error)
      alert('Unable to save the note')
    } finally {
      setNoteSaving(false)
    }
  }

  const removeNote = async (id: string) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await deleteDoc(doc(db, 'notes', id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete note')
    }
  }

  const updateMessageStatus = async (messageId: string, read: boolean) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), { read })
    } catch (error) {
      console.error(error)
      alert('Failed to update message state')
    }
  }

  const removeMessage = async (messageId: string) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteDoc(doc(db, 'messages', messageId))
    } catch (error) {
      console.error(error)
      alert('Failed to delete message')
    }
  }

  // AboutMe handlers
  React.useEffect(() => {
    if (aboutMe) {
      setAboutMeForm({
        id: aboutMe.id,
        title: aboutMe.title,
        bio: aboutMe.bio,
        image: aboutMe.image || '',
        highlights: aboutMe.highlights.join('\n'),
      })
    }
  }, [aboutMe])

  const upsertAboutMe = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!aboutMeForm.title.trim() || !aboutMeForm.bio.trim()) {
      alert('Title and bio are required')
      return
    }
    setAboutMeSaving(true)
    try {
      const normalizedImage = normalizeExternalUrl(aboutMeForm.image.trim())
      const payload: any = {
        title: aboutMeForm.title.trim(),
        bio: aboutMeForm.bio.trim(),
        image: normalizedImage || '',
        highlights: aboutMeForm.highlights
          .split('\n')
          .map(h => h.trim())
          .filter(h => h.length > 0),
        createdAt: aboutMe?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      }
      
      if (aboutMe?.id) {
        await updateDoc(doc(db, 'aboutMe', aboutMe.id), payload)
      } else {
        await addDoc(collection(db, 'aboutMe'), payload)
      }
      alert('About Me saved successfully!')
    } catch (error) {
      console.error(error)
      alert('Unable to save About Me')
    } finally {
      setAboutMeSaving(false)
    }
  }

  // Experience handlers
  const resetExperienceForm = () => {
    setExperienceForm({ ...emptyExperienceForm })
    setExperienceFormState('hidden')
  }

  const openExperienceForm = (mode: 'create' | 'edit', experience?: Experience) => {
    if (mode === 'edit' && experience) {
      setExperienceForm({
        id: experience.id,
        company: experience.company,
        position: experience.position,
        location: experience.location || '',
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        description: experience.description,
        technologies: experience.technologies.join(', '),
        logo: experience.logo || '',
        current: experience.current,
      })
    } else {
      setExperienceForm({ ...emptyExperienceForm })
    }
    setExperienceFormState(mode)
  }

  const upsertExperience = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!experienceForm.company.trim() || !experienceForm.position.trim() || !experienceForm.startDate) {
      alert('Company, position, and start date are required')
      return
    }
    setExperienceSaving(true)
    try {
      const payload: any = {
        company: experienceForm.company.trim(),
        position: experienceForm.position.trim(),
        startDate: experienceForm.startDate,
        description: experienceForm.description.trim(),
        technologies: experienceForm.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0),
        current: experienceForm.current,
      }

      // Only add optional fields if they have values
      if (experienceForm.location.trim()) {
        payload.location = experienceForm.location.trim()
      }
      
      if (!experienceForm.current && experienceForm.endDate) {
        payload.endDate = experienceForm.endDate
      }
      
      const normalizedLogo = normalizeExternalUrl(experienceForm.logo.trim())
      if (normalizedLogo) {
        payload.logo = normalizedLogo
      }

      if (experienceFormState === 'create') {
        payload.createdAt = Date.now()
      }

      if (experienceFormState === 'edit' && experienceForm.id) {
        await updateDoc(doc(db, 'experiences', experienceForm.id), payload)
      } else {
        await addDoc(collection(db, 'experiences'), payload)
      }
      resetExperienceForm()
    } catch (error) {
      console.error(error)
      alert('Unable to save experience')
    } finally {
      setExperienceSaving(false)
    }
  }

  const removeExperience = async (id: string) => {
    if (!window.confirm('Delete this experience?')) return
    try {
      await deleteDoc(doc(db, 'experiences', id))
    } catch (error) {
      console.error(error)
      alert('Failed to delete experience')
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`w-full max-w-md rounded-2xl p-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                className={inputClasses}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                className={inputClasses}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg transition-all ${
                isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {authState.loading ? 'Signing in…' : 'Login'}
            </button>
            {authState.error && <p className="text-sm text-red-500">{authState.error}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`border-b px-6 py-4 flex justify-between items-center ${isDarkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <LogOut size={16} /> Logout
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {['overview', 'projects', 'skills', 'experience', 'aboutme', 'notes', 'messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-all capitalize border-b-2 ${
                activeTab === tab
                  ? isDarkMode
                    ? 'border-white text-white bg-gray-800/50'
                    : 'border-black text-black bg-gray-100'
                  : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:border-gray-700' : 'text-gray-600 hover:text-gray-900 hover:border-gray-300'}`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl ${cardClasses}`}>
              <p className="text-xs uppercase tracking-wide text-gray-500">Total Visits</p>
              <p className="text-3xl font-semibold mt-1">{totalVisits.toLocaleString()}</p>
            </div>
            
            <div className={`p-5 rounded-2xl ${cardClasses}`}>
              <p className="text-xs uppercase tracking-wide text-gray-500">Projects</p>
              <p className="text-3xl font-semibold mt-1">{projects.length}</p>
            </div>

            <div className={`p-5 rounded-2xl ${cardClasses}`}>
              <p className="text-xs uppercase tracking-wide text-gray-500">Skills</p>
              <p className="text-3xl font-semibold mt-1">{skills.length}</p>
            </div>
            <div className={`p-5 rounded-2xl ${cardClasses}`}>
              <p className="text-xs uppercase tracking-wide text-gray-500">Unread Messages</p>
              <p className="text-3xl font-semibold mt-1">{unreadMessagesCount}</p>
            </div>
          </div>
        )}
        {/* CV management card shown under overview */}
        {activeTab === 'overview' && (
          <div className="mt-6">
            <div className={`p-5 rounded-2xl ${cardClasses}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Site CV</p>
                  <h3 className="text-lg font-semibold">Hire me (CV link)</h3>
                </div>
                <div className="text-sm text-gray-500">Manage the Drive link shown on the public site</div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <input className={`${inputClasses} md:col-span-2`} placeholder="Paste Google Drive link or file URL" value={cvLink} onChange={(e) => setCvLink(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={saveCvLink} className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                    {cvSaving ? 'Saving…' : 'Save CV'}
                  </button>
                  <button onClick={deleteCvLink} className="px-4 py-2 rounded-lg border bg-transparent text-red-500 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
              {cvLink && (
                <p className="text-xs text-gray-500 mt-3">Current link: <a href={cvLink} target="_blank" rel="noreferrer" className="underline">Open CV</a></p>
              )}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Profile Image</p>
                  <div className="text-sm text-gray-500">Shown in hero</div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <input className={`${inputClasses} md:col-span-2`} placeholder="Paste image URL (Drive/Dropbox/etc.)" value={profileImage} onChange={(e) => setProfileImage(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={saveProfileImage} className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                      {profileSaving ? 'Saving…' : 'Save Image'}
                    </button>
                    <button onClick={deleteProfileImage} className="px-4 py-2 rounded-lg border bg-transparent text-red-500 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
                {profileImage && (
                  <p className="text-xs text-gray-500 mt-3">Current image: <a href={profileImage} target="_blank" rel="noreferrer" className="underline">Open image</a></p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <button
                onClick={() => openProjectForm('create')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <Plus size={16} /> Add Project
              </button>
            </div>

            {projectFormState !== 'hidden' && (
              <form onSubmit={upsertProject} className={`p-5 rounded-2xl ${cardClasses} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{projectFormState === 'edit' ? 'Edit Project' : 'New Project'}</h3>
                  <button type="button" onClick={resetProjectForm} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    Cancel
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className={inputClasses} placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
                  <div className="space-y-2">
                    <input className={`${inputClasses}`} placeholder="Cover image URL (paste external URL)" value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} />
                    {projectForm.image && (
                      <p className="text-xs text-gray-500 truncate">Image set · {projectForm.image}</p>
                    )}
                    <p className="text-xs text-gray-400">Note: direct in-browser uploads are disabled. Use external links (Drive, Cloudinary, etc.).</p>
                  </div>
                  <input className={inputClasses} placeholder="Primary link" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} />
                  <input className={inputClasses} placeholder="Tech stack (comma separated)" value={projectForm.tech} onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })} />
                  <input className={inputClasses} placeholder="App Store URL" value={projectForm.appStore} onChange={(e) => setProjectForm({ ...projectForm, appStore: e.target.value })} />
                  <input className={inputClasses} placeholder="Play Store URL" value={projectForm.playStore} onChange={(e) => setProjectForm({ ...projectForm, playStore: e.target.value })} />
                  <input className={inputClasses} placeholder="GitHub URL" value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })} />
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                    Featured project
                  </label>
                </div>
                <textarea
                  className={`${inputClasses} min-h-[120px]`}
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}
                >
                  {projectSaving ? 'Saving…' : 'Save Project'}
                </button>
              </form>
            )}

            <div className={`rounded-2xl overflow-hidden ${cardClasses}`}>
              <table className="w-full">
                <thead className={isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}>
                  <tr>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide px-6 py-3">Title</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide px-6 py-3">Tech</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide px-6 py-3">Featured</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wide px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className={isDarkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}>
                      <td className="px-6 py-3 text-sm">{project.title}</td>
                      <td className="px-6 py-3 text-sm text-gray-500">{project.tech.slice(0, 3).join(', ')}</td>
                      <td className="px-6 py-3 text-sm">{project.featured ? '✓' : '-'}</td>
                      <td className="px-6 py-3 text-sm flex gap-2">
                        <button onClick={() => openProjectForm('edit', project)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => removeProject(project.id)} className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Skills</h2>
              <button
                onClick={() => openSkillForm('create')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>

            {skillFormState !== 'hidden' && (
              <form onSubmit={upsertSkill} className={`p-5 rounded-2xl ${cardClasses} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{skillFormState === 'edit' ? 'Edit Skill' : 'New Skill'}</h3>
                  <button type="button" onClick={resetSkillForm} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    Cancel
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className={inputClasses} placeholder="Title" value={skillForm.title} onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })} required />
                  <input className={inputClasses} placeholder="Icon key (e.g. smartphone, code)" value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} />
                </div>
                <textarea className={`${inputClasses} min-h-[100px]`} placeholder="Description" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} />
                <button type="submit" className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                  {skillSaving ? 'Saving…' : 'Save Skill'}
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className={`p-4 rounded-2xl ${cardClasses}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{skill.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => openSkillForm('edit', skill)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => removeSkill(skill.id)} className="p-2 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{skill.description}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mt-3">Icon: {skill.icon}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Research Notes</h2>
              <button
                onClick={() => openNoteForm('create')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <Plus size={16} /> New Note
              </button>
            </div>

            {noteFormState !== 'hidden' && (
              <form onSubmit={upsertNote} className={`p-5 rounded-2xl ${cardClasses} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{noteFormState === 'edit' ? 'Edit Note' : 'New Note'}</h3>
                  <button type="button" onClick={resetNoteForm} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    Cancel
                  </button>
                </div>
                <input className={inputClasses} placeholder="Title" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} required />
                <textarea className={`${inputClasses} min-h-[120px]`} placeholder="Summary / learnings" value={noteForm.summary} onChange={(e) => setNoteForm({ ...noteForm, summary: e.target.value })} required />
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Image URL</label>
                    <input className={inputClasses} placeholder="Paste image URL" value={noteForm.image} onChange={(e) => setNoteForm({ ...noteForm, image: e.target.value })} />
                    {noteForm.image && (
                      <p className="text-xs text-green-600 dark:text-green-400">✓ Image set</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Reference Link</label>
                    <input className={inputClasses} placeholder="Optional reference" value={noteForm.link} onChange={(e) => setNoteForm({ ...noteForm, link: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium">Status</label>
                    <select value={noteForm.status || 'normal'} onChange={(e) => setNoteForm({ ...noteForm, status: e.target.value as 'normal' | 'failed' })} className={inputClasses}>
                      <option value="normal">Normal</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Note: Use external links (Google Drive, Dropbox, etc.)</p>
                <button type="submit" className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                  {noteSaving ? 'Saving…' : 'Save Note'}
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note.id} className={`p-4 rounded-xl border transition ${isDarkMode ? 'border-gray-700 bg-gray-900/30 hover:bg-gray-900/50' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                  {note.image && <img src={note.image} alt={note.title} className="rounded-lg h-40 w-full object-cover mb-3" />}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2">{note.title}</h3>
                        <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                      {(note as any).status === 'failed' && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'}`}>
                          Failed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{note.summary}</p>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => openNoteForm('edit', note)} className={`flex-1 p-2 rounded-lg text-sm transition ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        <Edit2 size={14} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const next = (note as any).status === 'failed' ? 'normal' : 'failed'
                            await updateDoc(doc(db, 'notes', note.id), { status: next })
                          } catch (err) {
                            console.error(err)
                            alert('Failed to toggle note status')
                          }
                        }}
                        className={`flex-1 p-2 rounded-lg text-sm transition ${(note as any).status === 'failed' ? isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200' : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        {(note as any).status === 'failed' ? 'Unfail' : 'Mark Failed'}
                      </button>
                      <button onClick={() => removeNote(note.id)} className={`p-2 rounded-lg transition ${isDarkMode ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40' : 'text-red-600 bg-red-100 hover:bg-red-200'}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Experience</h2>
              <button
                onClick={() => openExperienceForm('create')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>

            {experienceFormState !== 'hidden' && (
              <form onSubmit={upsertExperience} className={`p-5 rounded-2xl ${cardClasses} space-y-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{experienceFormState === 'edit' ? 'Edit Experience' : 'New Experience'}</h3>
                  <button type="button" onClick={resetExperienceForm} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">
                    Cancel
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className={inputClasses} placeholder="Company" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} required />
                  <input className={inputClasses} placeholder="Position" value={experienceForm.position} onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })} required />
                  <input className={inputClasses} placeholder="Location (optional)" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="current" checked={experienceForm.current} onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })} className="w-4 h-4" />
                    <label htmlFor="current" className="text-sm">Currently working here</label>
                  </div>
                  <input type="date" className={inputClasses} placeholder="Start Date" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} required />
                  {!experienceForm.current && (
                    <input type="date" className={inputClasses} placeholder="End Date" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} />
                  )}
                </div>
                <textarea className={`${inputClasses} min-h-[100px]`} placeholder="Description" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} required />
                <input className={inputClasses} placeholder="Technologies (comma separated)" value={experienceForm.technologies} onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })} />
                <input className={inputClasses} placeholder="Company logo URL (optional)" value={experienceForm.logo} onChange={(e) => setExperienceForm({ ...experienceForm, logo: e.target.value })} />
                <button type="submit" className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                  {experienceSaving ? 'Saving…' : 'Save Experience'}
                </button>
              </form>
            )}

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className={`p-5 rounded-xl border transition ${isDarkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{exp.position}</h3>
                        {exp.current && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2">{exp.company}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.description}</p>
                      {exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech, idx) => (
                            <span key={idx} className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openExperienceForm('edit', exp)} className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => removeExperience(exp.id)} className={`p-2 rounded-lg transition ${isDarkMode ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40' : 'text-red-600 bg-red-100 hover:bg-red-200'}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'aboutme' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage About Me</h2>
            </div>

            <form onSubmit={upsertAboutMe} className={`p-5 rounded-2xl ${cardClasses} space-y-4`}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Section Title</label>
                  <input
                    className={inputClasses}
                    placeholder="About Me"
                    value={aboutMeForm.title}
                    onChange={(e) => setAboutMeForm({ ...aboutMeForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    className={`${inputClasses} min-h-[150px]`}
                    placeholder="Write your professional bio..."
                    value={aboutMeForm.bio}
                    onChange={(e) => setAboutMeForm({ ...aboutMeForm, bio: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Profile Image URL (optional)</label>
                  <input
                    className={inputClasses}
                    placeholder="Paste image URL"
                    value={aboutMeForm.image}
                    onChange={(e) => setAboutMeForm({ ...aboutMeForm, image: e.target.value })}
                  />
                  {aboutMeForm.image && (
                    <div className="mt-3">
                      <img src={normalizeExternalUrl(aboutMeForm.image)} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Highlights (one per line)</label>
                  <textarea
                    className={`${inputClasses} min-h-[120px]`}
                    placeholder="5+ years of Flutter development&#10;Published apps with 100K+ downloads&#10;Expert in Firebase and REST APIs"
                    value={aboutMeForm.highlights}
                    onChange={(e) => setAboutMeForm({ ...aboutMeForm, highlights: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Each line will become a separate highlight point</p>
                </div>

                <button
                  type="submit"
                  disabled={aboutMeSaving}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'
                  } disabled:opacity-50`}
                >
                  {aboutMeSaving ? 'Saving...' : 'Save About Me'}
                </button>
              </div>
            </form>

            {aboutMe && (
              <div className={`p-5 rounded-2xl ${cardClasses}`}>
                <h3 className="text-lg font-semibold mb-4">Current About Me Content</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Title</p>
                    <p className="font-medium">{aboutMe.title}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">Bio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{aboutMe.bio}</p>
                  </div>
                  {aboutMe.highlights.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-gray-500 mb-2">Highlights</p>
                      <ul className="space-y-1">
                        {aboutMe.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Contact Messages</h2>
              <span className="text-sm text-gray-500">{contactMessages.length} total</span>
            </div>
            {contactMessages.length === 0 ? (
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No messages yet</p>
            ) : (
              contactMessages.map((msg: ContactMessage) => (
                <div key={msg.id} className={`p-4 rounded-2xl ${cardClasses}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{msg.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{msg.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        msg.read
                          ? isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-200 text-gray-800'
                          : isDarkMode
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                      }`}
                    >
                      {msg.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{msg.message}</p>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <p>{new Date(msg.timestamp).toLocaleString()}</p>
                    <div className="flex gap-3">
                      {!msg.read && (
                        <button onClick={() => updateMessageStatus(msg.id, true)} className="flex items-center gap-1 text-green-500">
                          <Check size={14} /> Mark read
                        </button>
                      )}
                      {msg.read && (
                        <button onClick={() => updateMessageStatus(msg.id, false)} className="flex items-center gap-1 text-amber-500">
                          <XCircle size={14} /> Mark unread
                        </button>
                      )}
                      <button onClick={() => removeMessage(msg.id)} className="flex items-center gap-1 text-red-500">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
