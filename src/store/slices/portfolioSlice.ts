import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  image: string
  link: string
  featured: boolean
  appStore?: string
  playStore?: string
  githubLink?: string
}

export interface CaseStudy {
  id: string
  title: string
  client: string
  challenge: string
  solution: string
  impact: string
  image: string
  categories?: string[]
}

export interface Skill {
  id: string
  title: string
  description: string
  icon: string
}

export interface ResearchNote {
  id: string
  title: string
  summary: string
  link?: string
  image?: string
  createdAt: number
  status?: 'failed' | 'normal'
}

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Apple-Watch-Health-Monitoring-App',
    description:
      'Wellness app syncing Apple Watch health data with AI-powered health tips and analytics.',
    tech: ['Flutter', 'HealthKit', 'REST APIs', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    link: '#',
    featured: true,
    appStore: 'https://apps.apple.com/app/apple-watch-health',
  },
  {
    id: '2',
    title: 'Baxton – Role Based Communication App',
    description:
      'Real-time communication platform connecting workers, clients, and administrators with seamless messaging.',
    tech: ['Flutter', 'GetX', 'WebSocket', 'REST APIs'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    link: '#',
    featured: true,
    githubLink: 'https://github.com/ShakilKhan999/baxton',
  },
  {
    id: '3',
    title: 'DTRoutes - Route Management System',
    description:
      'Cross-platform application with admin dashboard for managing routes and delivery data efficiently.',
    tech: ['Flutter', 'Firebase', 'Flutter Web', 'cPanel'],
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80',
    link: '#',
    featured: true,
  },
  {
    id: '4',
    title: 'Pagenati – E-commerce with Pagination',
    description:
      'E-commerce app with infinite scroll for large product catalogs and integrated payment processing.',
    tech: ['Flutter', 'GetX', 'REST APIs', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    link: '#',
    featured: false,
    githubLink: 'https://github.com/ShakilKhan999/pagenati',
  },
  {
    id: '5',
    title: 'Clove – AI Food Analysis App',
    description:
      'AI-powered food analysis detecting nutrition info and suggesting personalized recipes using Gemini API.',
    tech: ['Flutter', 'Gemini API', 'Camera', 'Speech-to-Text'],
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80',
    link: '#',
    featured: false,
    githubLink: 'https://github.com/ShakilKhan999/clove',
  },
  {
    id: '6',
    title: 'Temple Webster - AR Furniture Try-On',
    description:
      'E-commerce demo with real-time AR furniture preview, letting users visualize furniture in their space.',
    tech: ['Flutter', 'model_viewer_plus', 'GetX', 'AR'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    link: '#',
    featured: false,
    githubLink: 'https://github.com/ShakilKhan999/temple-webster',
  },
]

const defaultCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Redesigning Mobile Banking Experience',
    client: 'FinTech Startup',
    challenge: 'Simplify complex financial transactions for non-technical users',
    solution: 'Created intuitive UI with biometric auth, reducing transaction time by 60%',
    impact: '150K+ downloads, 4.8★ rating',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    categories: ['FinTech', 'UX']
  },
  {
    id: '2',
    title: 'Real-Time Delivery Tracking',
    client: 'Logistics Company',
    challenge: 'Build reliable offline-first delivery app for drivers in low-connectivity areas',
    solution: 'Implemented local-first architecture with smart sync and live GPS tracking',
    impact: '99.9% uptime, 40% faster deliveries',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80',
    categories: ['Logistics', 'Offline']
  },
]

const defaultSkills: Skill[] = [
  {
    id: '1',
    title: 'Mobile Development',
    description: 'Flutter, Dart, Native iOS/Android, SwiftUI, Kotlin',
    icon: 'smartphone',
  },
  {
    id: '2',
    title: 'UI/UX Design',
    description: 'Figma, Material Design, Custom Animations, Apple HIG',
    icon: 'layers',
  },
  {
    id: '3',
    title: 'Architecture & Patterns',
    description: 'Clean Architecture, BLoC, GetX, Provider, State Management',
    icon: 'code',
  },
  {
    id: '4',
    title: 'Backend Integration',
    description: 'Firebase, REST APIs, WebSocket, GraphQL, Cloud Functions',
    icon: 'database',
  },
  {
    id: '5',
    title: 'AI & ML',
    description: 'Gemini API, Image Recognition, Speech-to-Text, NLP',
    icon: 'brain',
  },
  {
    id: '6',
    title: 'AR & Web',
    description: 'Flutter Web, AR Core, model_viewer_plus, 3D Integration',
    icon: 'box',
  },
]

export interface PortfolioState {
  projects: Project[]
  caseStudies: CaseStudy[]
  skills: Skill[]
  notes: ResearchNote[]
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  projects: defaultProjects,
  caseStudies: defaultCaseStudies,
  skills: defaultSkills,
  notes: [],
  loading: false,
  error: null,
}

export const portfolioSeedData = {
  projects: defaultProjects,
  caseStudies: defaultCaseStudies,
  skills: defaultSkills,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload)
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },
    setCaseStudies: (state, action: PayloadAction<CaseStudy[]>) => {
      state.caseStudies = action.payload
    },
    addCaseStudy: (state, action: PayloadAction<CaseStudy>) => {
      state.caseStudies.unshift(action.payload)
    },
    updateCaseStudy: (state, action: PayloadAction<CaseStudy>) => {
      const index = state.caseStudies.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.caseStudies[index] = action.payload
      }
    },
    deleteCaseStudy: (state, action: PayloadAction<string>) => {
      state.caseStudies = state.caseStudies.filter(c => c.id !== action.payload)
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.unshift(action.payload)
    },
    updateSkill: (state, action: PayloadAction<Skill>) => {
      const index = state.skills.findIndex((skill) => skill.id === action.payload.id)
      if (index !== -1) {
        state.skills[index] = action.payload
      }
    },
    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill.id !== action.payload)
    },
    setNotes: (state, action: PayloadAction<ResearchNote[]>) => {
      state.notes = action.payload
    },
    addNote: (state, action: PayloadAction<ResearchNote>) => {
      state.notes.unshift(action.payload)
    },
    updateNote: (state, action: PayloadAction<ResearchNote>) => {
      const index = state.notes.findIndex((note) => note.id === action.payload.id)
      if (index !== -1) {
        state.notes[index] = action.payload
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCaseStudies,
  addCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  setSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setLoading,
  setError,
} = portfolioSlice.actions

export default portfolioSlice.reducer
