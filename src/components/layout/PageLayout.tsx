import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  className?: string
  header?: ReactNode
  footer?: ReactNode
}

export function PageLayout({
  children,
  className,
  header,
  footer,
}: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {header && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      {footer && <footer className="border-t">{footer}</footer>}
    </div>
  )
} 