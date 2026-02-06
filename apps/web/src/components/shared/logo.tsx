import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  href?: string
  size?: number
}

export function Logo({ className, showText = true, href = '/projects', size = 124 }: LogoProps) {
  const content = (
    <>
      <div className="flex items-center justify-center shrink-0">
        <Image
          src="/icons/logo/logo.png"
          alt="Hduino Logo"
          width={size}
          height={size}
          className="object-contain"
          priority
          unoptimized={false}
        />
      </div>

    </>
  )

  return (
    <Link
      href={href}
      className={cn('flex items-center gap-3 transition-all hover:opacity-80 hover:scale-105', className)}
    >
      {content}
    </Link>
  )
}