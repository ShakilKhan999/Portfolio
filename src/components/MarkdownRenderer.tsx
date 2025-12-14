import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type MarkdownStyleOverrides = {
  paragraph?: string
  heading?: (level: number) => string
  list?: string
  listItem?: string
  inlineCode?: string
  codeBlock?: string
  blockquote?: string
  hr?: string
}

const createMarkdownComponents = (isDarkMode: boolean, overrides: MarkdownStyleOverrides = {}) => {
  const paragraphClass = overrides.paragraph ?? `leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  const headingClass = (level: number) => {
    const baseSize =
      level === 1
        ? 'text-3xl mb-6 mt-8'
        : level === 2
          ? 'text-2xl mb-4 mt-6'
          : level === 3
            ? 'text-xl mb-3 mt-4'
            : 'text-lg mb-2 mt-3'
    const overrideHeadingClass = overrides.heading?.(level)
    return `${baseSize} ${isDarkMode ? 'text-white' : 'text-gray-900'} ${overrideHeadingClass ?? 'font-bold'}`
  }
  const inlineCodeClass = overrides.inlineCode ?? `px-2 py-1 rounded text-sm font-mono ${isDarkMode ? 'bg-gray-800 text-yellow-400 border border-gray-700' : 'bg-gray-100 text-red-600 border border-gray-200'}`
  const codeBlockClass = overrides.codeBlock ?? `p-4 rounded-lg overflow-x-auto text-sm font-mono ${isDarkMode ? 'bg-gray-800 text-green-400 border border-gray-700' : 'bg-gray-100 text-gray-800 border border-gray-200'}`
  const listClass = overrides.list ?? `${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  const listItemClass = overrides.listItem ?? `${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`
  const blockquoteClass = overrides.blockquote ?? `border-l-4 pl-4 italic ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-700'}`
  const hrClass = overrides.hr ?? `border-t my-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`

  return {
    p: ({ node, className, ...props }: any) => (
      <p className={`${paragraphClass} ${className ?? ''}`} {...props} />
    ),
    h1: ({ node, className, ...props }: any) => (
      <h1 className={`${headingClass(1)} ${className ?? ''}`} {...props} />
    ),
    h2: ({ node, className, ...props }: any) => (
      <h2 className={`${headingClass(2)} ${className ?? ''}`} {...props} />
    ),
    h3: ({ node, className, ...props }: any) => (
      <h3 className={`${headingClass(3)} ${className ?? ''}`} {...props} />
    ),
    h4: ({ node, className, ...props }: any) => (
      <h4 className={`${headingClass(4)} ${className ?? ''}`} {...props} />
    ),
    h5: ({ node, className, ...props }: any) => (
      <h5 className={`${headingClass(5)} ${className ?? ''}`} {...props} />
    ),
    h6: ({ node, className, ...props }: any) => (
      <h6 className={`${headingClass(6)} ${className ?? ''}`} {...props} />
    ),
    ul: ({ node, className, ...props }: any) => (
      <ul className={`space-y-2 pl-5 list-disc ${listClass} ${className ?? ''}`} {...props} />
    ),
    ol: ({ node, className, ...props }: any) => (
      <ol className={`space-y-2 pl-5 list-decimal ${listClass} ${className ?? ''}`} {...props} />
    ),
    li: ({ node, className, ...props }: any) => (
      <li className={`leading-relaxed ${listItemClass} ${className ?? ''}`} {...props} />
    ),
    blockquote: ({ node, className, ...props }: any) => (
      <blockquote className={`${blockquoteClass} ${className ?? ''}`} {...props} />
    ),
    hr: ({ node, className, ...props }: any) => (
      <hr className={`${hrClass} ${className ?? ''}`} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const value = String(children).replace(/\n$/, '')
      if (inline) {
        return (
          <code className={`${inlineCodeClass} ${className ?? ''}`} {...props}>
            {value}
          </code>
        )
      }
      return (
        <pre className={`${codeBlockClass} ${className ?? ''}`}>
          <code {...props}>{value}</code>
        </pre>
      )
    },
  }
}

export type MarkdownRendererProps = {
  content?: string
  isDarkMode?: boolean
  wrapperClassName?: string
  overrides?: MarkdownStyleOverrides
}

export default function MarkdownRenderer({
  content = '',
  isDarkMode = false,
  wrapperClassName = '',
  overrides,
}: MarkdownRendererProps) {
  const trimmedContent = content.trim()
  if (!trimmedContent) return null

  return (
    <div className={wrapperClassName}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents(isDarkMode, overrides)}>
        {trimmedContent}
      </ReactMarkdown>
    </div>
  )
}
