import { useEffect } from 'react'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { db } from '../config/firebase'
import {
  Project,
  CaseStudy,
  Skill,
  ResearchNote,
  setProjects,
  setCaseStudies,
  setSkills,
  setNotes,
  setLoading,
  setError,
} from '../store/slices/portfolioSlice'
import { ContactMessage, setMessages } from '../store/slices/contactSlice'
import type { AppDispatch } from '../store'

const toMillis = (value: unknown): number => {
  if (typeof value === 'number') {
    return value
  }
  if (
    value &&
    typeof value === 'object' &&
    'toMillis' in value &&
    typeof (value as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (value as { toMillis: () => number }).toMillis()
  }
  return Date.now()
}

const mapProject = (doc: QueryDocumentSnapshot<DocumentData>): Project => {
  const data = doc.data() as Partial<Project>
  return {
    id: doc.id,
    title: data.title ?? 'Untitled Project',
    description: data.description ?? '',
    tech: Array.isArray(data.tech) ? data.tech : [],
    image: data.image ?? '',
    link: data.link ?? '#',
    featured: Boolean(data.featured),
    appStore: data.appStore,
    playStore: data.playStore,
    githubLink: data.githubLink,
  }
}

const mapCaseStudy = (doc: QueryDocumentSnapshot<DocumentData>): CaseStudy => {
  const data = doc.data() as Partial<CaseStudy>
  return {
    id: doc.id,
    title: data.title ?? 'Untitled Case Study',
    client: data.client ?? 'Client',
    challenge: data.challenge ?? '',
    solution: data.solution ?? '',
    impact: data.impact ?? '',
    image: data.image ?? '',
  }
}

const mapSkill = (doc: QueryDocumentSnapshot<DocumentData>): Skill => {
  const data = doc.data() as Partial<Skill>
  return {
    id: doc.id,
    title: data.title ?? 'Skill',
    description: data.description ?? '',
    icon: data.icon ?? 'code',
  }
}

const mapNote = (doc: QueryDocumentSnapshot<DocumentData>): ResearchNote => {
  const data = doc.data() as Partial<ResearchNote>
  return {
    id: doc.id,
    title: data.title ?? 'New Note',
    summary: data.summary ?? '',
    link: data.link,
    image: data.image,
    createdAt: toMillis(data.createdAt),
  }
}

const mapMessage = (doc: QueryDocumentSnapshot<DocumentData>): ContactMessage => {
  const data = doc.data() as Partial<ContactMessage>
  return {
    id: doc.id,
    name: data.name ?? 'Unknown',
    email: data.email ?? 'unknown@example.com',
    message: data.message ?? '',
    timestamp: toMillis(data.timestamp),
    read: Boolean(data.read),
  }
}

export const useFirestoreSync = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn('⏭️ Skipping Firestore sync because Firebase credentials are missing.')
      return
    }

    dispatch(setLoading(true))

    const cleanups: Unsubscribe[] = [
      onSnapshot(
        query(collection(db, 'projects'), orderBy('title')),
        (snapshot) => {
          dispatch(setProjects(snapshot.docs.map(mapProject)))
          dispatch(setLoading(false))
        },
        (error) => dispatch(setError(error.message))
      ),
      onSnapshot(
        query(collection(db, 'caseStudies'), orderBy('title')),
        (snapshot) => dispatch(setCaseStudies(snapshot.docs.map(mapCaseStudy))),
        (error) => dispatch(setError(error.message))
      ),
      onSnapshot(
        query(collection(db, 'skills'), orderBy('title')),
        (snapshot) => dispatch(setSkills(snapshot.docs.map(mapSkill))),
        (error) => dispatch(setError(error.message))
      ),
      onSnapshot(
        query(collection(db, 'notes'), orderBy('createdAt', 'desc')),
        (snapshot) => dispatch(setNotes(snapshot.docs.map(mapNote))),
        (error) => dispatch(setError(error.message))
      ),
      onSnapshot(
        query(collection(db, 'messages'), orderBy('timestamp', 'desc')),
        (snapshot) => dispatch(setMessages(snapshot.docs.map(mapMessage))),
        (error) => console.error('Failed to sync messages', error)
      ),
    ]

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [dispatch, isFirebaseConfigured])
}
