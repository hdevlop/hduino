import { ReactNode } from 'react'
import { Header } from '@/components/shared/header'
import { TitleBar } from '@/components/editor/TitleBar'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Custom Title Bar (only visible in Tauri desktop app) */}
      <TitleBar />
      <Header showActions />
      {children}
    </div>
  )
}
