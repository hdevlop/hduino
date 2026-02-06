import { ReactNode } from 'react'
import { Header } from '@/components/shared/header'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header showActions />
      {children}
    </div>
  )
}
